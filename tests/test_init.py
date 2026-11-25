"""Integration tests for Timercard."""

from datetime import datetime, timedelta

from freezegun.api import FrozenDateTimeFactory
from pytest_homeassistant_custom_component.common import (
    MockConfigEntry,
    async_fire_time_changed,
    async_mock_service,
)

from homeassistant.core import HomeAssistant
from homeassistant.helpers import entity_registry as er
from homeassistant.util import dt as dt_util

from custom_components.timercard.const import DOMAIN


def _local(*args: int) -> datetime:
    return dt_util.as_utc(datetime(*args, tzinfo=dt_util.get_default_time_zone()))


async def _setup(hass: HomeAssistant) -> MockConfigEntry:
    entry = MockConfigEntry(domain=DOMAIN, data={})
    entry.add_to_hass(hass)
    assert await hass.config_entries.async_setup(entry.entry_id)
    await hass.async_block_till_done()
    return entry


async def test_timer_turns_on_and_off(
    hass: HomeAssistant, hass_ws_client, freezer: FrozenDateTimeFactory
) -> None:
    """A timer created over websocket fires its on and off actions."""
    client = await hass_ws_client(hass)
    freezer.move_to(_local(2026, 11, 23, 18, 0))
    await _setup(hass)
    on_calls = async_mock_service(hass, "light", "turn_on")
    off_calls = async_mock_service(hass, "light", "turn_off")
    switch_on = async_mock_service(hass, "switch", "turn_on")

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "name": "Garden",
            "entities": ["light.garden", "switch.pump"],
            "on": {"type": "time", "time": "19:00"},
            "off": {"mode": "time", "time": "19:30"},
            "options": {"brightness": 40},
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    timer = msg["result"]
    assert timer["next_on"] == _local(2026, 11, 23, 19, 0).isoformat()
    assert timer["next_off"] == _local(2026, 11, 23, 19, 30).isoformat()

    # Switch entity created
    state = hass.states.get("switch.timercard_garden")
    assert state is not None and state.state == "on"

    freezer.move_to(_local(2026, 11, 23, 19, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 1
    assert on_calls[0].data == {"entity_id": ["light.garden"], "brightness_pct": 40}
    assert len(switch_on) == 1
    assert len(off_calls) == 0

    freezer.move_to(_local(2026, 11, 23, 19, 30, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(off_calls) == 1

    # Next day it repeats
    freezer.move_to(_local(2026, 11, 24, 19, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 2

    # Disable through the switch: nothing fires any more
    await hass.services.async_call(
        "switch", "turn_off", {"entity_id": "switch.timercard_garden"}, blocking=True
    )
    # (switch.turn_off is the real service: only switch.turn_on is mocked.)
    assert hass.states.get("switch.timercard_garden").state == "off"
    assert hass.data[DOMAIN].timers[timer["id"]]["enabled"] is False

    freezer.move_to(_local(2026, 11, 25, 19, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 2


async def test_update_delete_and_subscribe(
    hass: HomeAssistant, hass_ws_client, freezer: FrozenDateTimeFactory
) -> None:
    """Updating and deleting work and subscribers are told."""
    client = await hass_ws_client(hass)
    freezer.move_to(_local(2026, 11, 23, 8, 0))
    await _setup(hass)

    await client.send_json_auto_id({"type": "timercard/subscribe"})
    msg = await client.receive_json()
    assert msg["success"]
    msg = await client.receive_json()
    assert msg["event"] == {"timers": []}

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "name": "Heater",
            "entities": ["climate.living"],
            "days": [0, 2, 4],
            "on": {"time": "6:30"},
            "off": {"mode": "duration", "duration": 90},
        }
    )
    event = await client.receive_json()
    assert len(event["event"]["timers"]) == 1
    result = await client.receive_json()
    assert result["success"]
    timer_id = result["result"]["id"]
    assert result["result"]["on"]["time"] == "06:30"

    await client.send_json_auto_id(
        {"type": "timercard/update", "timer_id": timer_id, "name": "Heating"}
    )
    event = await client.receive_json()
    assert event["event"]["timers"][0]["name"] == "Heating"
    result = await client.receive_json()
    assert result["success"]

    await client.send_json_auto_id({"type": "timercard/delete", "timer_id": timer_id})
    event = await client.receive_json()
    assert event["event"]["timers"] == []
    result = await client.receive_json()
    assert result["success"]
    await hass.async_block_till_done()
    assert er.async_get(hass).async_get_entity_id("switch", DOMAIN, timer_id) is None


async def test_invalid_input_rejected(hass: HomeAssistant, hass_ws_client) -> None:
    """Bad times and empty day lists are refused."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    await client.send_json_auto_id(
        {"type": "timercard/create", "entities": ["light.a"], "on": {"time": "25:00"}}
    )
    assert not (await client.receive_json())["success"]
    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "entities": ["light.a"],
            "on": {"time": "07:00"},
            "days": [],
        }
    )
    assert not (await client.receive_json())["success"]


async def test_timers_survive_restart(
    hass: HomeAssistant, hass_ws_client, hass_storage, freezer: FrozenDateTimeFactory
) -> None:
    """Timers are loaded from storage."""
    freezer.move_to(_local(2026, 11, 23, 8, 0))
    hass_storage[DOMAIN] = {
        "version": 1,
        "key": DOMAIN,
        "data": {
            "timers": [
                {
                    "id": "abc",
                    "name": "Pump",
                    "enabled": True,
                    "entities": ["switch.pump"],
                    "days": [0, 1, 2, 3, 4, 5, 6],
                    "on": {"type": "time", "time": "09:00", "offset": 0},
                    "off": {"mode": "duration", "duration": 10},
                    "options": {},
                }
            ]
        },
    }
    await _setup(hass)
    on_calls = async_mock_service(hass, "switch", "turn_on")
    off_calls = async_mock_service(hass, "switch", "turn_off")
    freezer.move_to(_local(2026, 11, 23, 9, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    freezer.tick(timedelta(minutes=10))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 1
    assert len(off_calls) == 1


async def test_per_day_times_over_websocket(
    hass: HomeAssistant, hass_ws_client, freezer: FrozenDateTimeFactory
) -> None:
    """Different weekend times run at their own moments; overlap is refused."""
    client = await hass_ws_client(hass)
    freezer.move_to(_local(2026, 11, 27, 12, 0))  # Friday
    await _setup(hass)
    on_calls = async_mock_service(hass, "light", "turn_on")

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "entities": ["light.hall"],
            "days": [0, 1, 2, 3, 4, 5],
            "on": {"time": "07:00"},
            "overrides": [{"days": [5, 6], "on": {"time": "09:00"}}],
        }
    )
    msg = await client.receive_json()
    assert not msg["success"]
    assert msg["error"]["code"] == "invalid_format"

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "name": "Hall",
            "entities": ["light.hall"],
            "days": [0, 1, 2, 3, 4],
            "on": {"time": "07:00"},
            "off": {"mode": "duration", "duration": 30},
            "overrides": [
                {"days": [5, 6], "on": {"time": "09:00"}, "off": {"mode": "duration", "duration": 60}}
            ],
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    timer = msg["result"]
    assert timer["next_on"] == _local(2026, 11, 28, 9, 0).isoformat()
    assert timer["groups"][0]["next_on"] == _local(2026, 11, 30, 7, 0).isoformat()
    assert timer["groups"][1]["next_off"] == _local(2026, 11, 28, 10, 0).isoformat()

    # Updating the main days so they overlap the weekend is refused too
    await client.send_json_auto_id(
        {"type": "timercard/update", "timer_id": timer["id"], "days": [0, 6]}
    )
    msg = await client.receive_json()
    assert not msg["success"]

    # Saturday 07:00: nothing (weekend starts later)
    freezer.move_to(_local(2026, 11, 28, 7, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 0
    freezer.move_to(_local(2026, 11, 28, 9, 0, 1))
    async_fire_time_changed(hass)
    await hass.async_block_till_done()
    assert len(on_calls) == 1



async def test_only_off_timer(
    hass: HomeAssistant, hass_ws_client, freezer: FrozenDateTimeFactory
) -> None:
    """An "only turn off" timer calls only the off service."""
    client = await hass_ws_client(hass)
    freezer.move_to(_local(2026, 11, 23, 12, 0))
    await _setup(hass)
    on_calls = async_mock_service(hass, "light", "turn_on")
    off_calls = async_mock_service(hass, "light", "turn_off")

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "action": "off",
            "entities": ["light.hall"],
            "on": {"time": "07:00"},
            "off": {"mode": "duration", "duration": 10},
        }
    )
    assert not (await client.receive_json())["success"]

    await client.send_json_auto_id(
        {
            "type": "timercard/create",
            "name": "Lights out",
            "action": "off",
            "entities": ["light.hall"],
            "on": {"time": "07:00"},
            "off": {"mode": "time", "time": "23:30"},
        }
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["next_on"] is None
    assert msg["result"]["next_off"] == _local(2026, 11, 23, 23, 30).isoformat()
    assert hass.states.get("switch.timercard_lights_out").attributes["action"] == "off"

    for moment in (_local(2026, 11, 24, 7, 0, 1), _local(2026, 11, 24, 23, 30, 1)):
        freezer.move_to(moment)
        async_fire_time_changed(hass)
        await hass.async_block_till_done()
    assert len(on_calls) == 0
    assert len(off_calls) == 2


async def test_restore_from_backup(
    hass: HomeAssistant, hass_storage, freezer: FrozenDateTimeFactory
) -> None:
    """When the main file is gone the timers come back from the backup."""
    freezer.move_to(_local(2026, 11, 23, 8, 0))
    hass_storage[f"{DOMAIN}.backup"] = {
        "version": 1,
        "key": f"{DOMAIN}.backup",
        "data": {
            "timers": [
                {
                    "id": "abc",
                    "name": "Pump",
                    "enabled": True,
                    "entities": ["switch.pump"],
                    "days": [0, 1, 2, 3, 4, 5, 6],
                    "on": {"type": "time", "time": "09:00", "offset": 0},
                    "off": {"mode": "duration", "duration": 10},
                    "options": {},
                }
            ]
        },
    }
    await _setup(hass)
    assert list(hass.data[DOMAIN].timers) == ["abc"]
    assert hass.states.get("switch.timercard_pump") is not None


async def test_cover_positions_over_websocket(hass: HomeAssistant, hass_ws_client) -> None:
    """Per-cover positions are accepted and stored; bad values are refused."""
    await _setup(hass)
    client = await hass_ws_client(hass)
    base = {
        "type": "timercard/create",
        "entities": ["cover.living", "cover.kitchen"],
        "on": {"time": "08:00"},
        "off": {"mode": "time", "time": "21:00"},
    }
    await client.send_json_auto_id(
        {**base, "options": {"positions": {"on": {"cover.living": 150}}}}
    )
    assert not (await client.receive_json())["success"]
    await client.send_json_auto_id(
        {**base, "options": {"positions": {"on": {"cover.living": 70}, "off": {"cover.kitchen": 15}}}}
    )
    msg = await client.receive_json()
    assert msg["success"], msg
    assert msg["result"]["options"]["positions"] == {
        "on": {"cover.living": 70},
        "off": {"cover.kitchen": 15},
    }
