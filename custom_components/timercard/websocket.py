"""Websocket API used by the Timercard Lovelace card."""

from __future__ import annotations

import re
from typing import Any

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.core import HomeAssistant, callback
import homeassistant.helpers.config_validation as cv

from .const import (
    DOMAIN,
    EVENT_OFF,
    EVENT_ON,
    OFF_MODE_NONE,
    OFF_MODE_TIME,
    OFF_MODES,
    TIME_FIXED,
    TIME_TYPES,
)
from .manager import TimerManager

_HHMM = re.compile(r"^([01]?\d|2[0-3]):[0-5]\d(:[0-5]\d)?$")


def _hhmm(value: Any) -> str:
    value = str(value)
    if not _HHMM.match(value):
        raise vol.Invalid("time must look like HH:MM")
    hours, minutes = value.split(":")[:2]
    return f"{int(hours):02d}:{minutes}"


_OFFSET = vol.All(vol.Coerce(int), vol.Range(min=-720, max=720))

ON_SCHEMA = vol.Schema(
    {
        vol.Optional("type", default=TIME_FIXED): vol.In(TIME_TYPES),
        vol.Optional("time", default="00:00"): _hhmm,
        vol.Optional("offset", default=0): _OFFSET,
    }
)

OFF_SCHEMA = vol.Schema(
    {
        vol.Optional("mode", default=OFF_MODE_TIME): vol.In(OFF_MODES),
        vol.Optional("type", default=TIME_FIXED): vol.In(TIME_TYPES),
        vol.Optional("time", default="00:00"): _hhmm,
        vol.Optional("offset", default=0): _OFFSET,
        vol.Optional("duration", default=60): vol.All(
            vol.Coerce(int), vol.Range(min=1, max=24 * 60)
        ),
    }
)

OPTIONS_SCHEMA = vol.Schema(
    {
        vol.Optional("brightness"): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=1, max=100))
        ),
        vol.Optional("temperature"): vol.Any(None, vol.Coerce(float)),
        vol.Optional("position"): vol.Any(
            None, vol.All(vol.Coerce(int), vol.Range(min=0, max=100))
        ),
    }
)

DAYS_SCHEMA = vol.All(
    [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))],
    vol.Length(min=1),
    lambda days: sorted(set(days)),
)

TIMER_FIELDS = {
    vol.Optional("name"): vol.All(str, vol.Length(max=100)),
    vol.Optional("enabled"): bool,
    vol.Optional("entities"): vol.All(cv.entity_ids, vol.Length(min=1)),
    vol.Optional("days"): DAYS_SCHEMA,
    vol.Optional("on"): ON_SCHEMA,
    vol.Optional("off"): OFF_SCHEMA,
    vol.Optional("options"): OPTIONS_SCHEMA,
}


def _manager(hass: HomeAssistant) -> TimerManager:
    return hass.data[DOMAIN]


@callback
def async_register(hass: HomeAssistant) -> None:
    """Register all websocket commands."""
    for command in (
        ws_list,
        ws_subscribe,
        ws_create,
        ws_update,
        ws_delete,
        ws_run,
    ):
        websocket_api.async_register_command(hass, command)


def _not_loaded(connection: websocket_api.ActiveConnection, msg: dict[str, Any]) -> bool:
    if DOMAIN in connection.hass.data:
        return False
    connection.send_error(
        msg["id"], "not_loaded", "The Timercard integration is not set up"
    )
    return True


@websocket_api.websocket_command({vol.Required("type"): "timercard/list"})
@callback
def ws_list(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Return all timers."""
    if _not_loaded(connection, msg):
        return
    connection.send_result(msg["id"], {"timers": _manager(hass).as_list()})


@websocket_api.websocket_command({vol.Required("type"): "timercard/subscribe"})
@callback
def ws_subscribe(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Send the full timer list now and every time something changes."""
    if _not_loaded(connection, msg):
        return
    manager = _manager(hass)

    @callback
    def _send() -> None:
        connection.send_message(
            websocket_api.event_message(msg["id"], {"timers": manager.as_list()})
        )

    connection.subscriptions[msg["id"]] = manager.async_add_listener(_send)
    connection.send_result(msg["id"])
    _send()


@websocket_api.websocket_command(
    {
        vol.Required("type"): "timercard/create",
        vol.Required("entities"): vol.All(cv.entity_ids, vol.Length(min=1)),
        vol.Required("on"): ON_SCHEMA,
        vol.Optional("name", default=""): vol.All(str, vol.Length(max=100)),
        vol.Optional("enabled", default=True): bool,
        vol.Optional("days", default=[0, 1, 2, 3, 4, 5, 6]): DAYS_SCHEMA,
        vol.Optional("off", default={"mode": OFF_MODE_NONE}): OFF_SCHEMA,
        vol.Optional("options", default={}): OPTIONS_SCHEMA,
    }
)
@websocket_api.async_response
async def ws_create(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Create a timer."""
    if _not_loaded(connection, msg):
        return
    data = {key: value for key, value in msg.items() if key not in ("id", "type")}
    timer = await _manager(hass).async_create(data)
    connection.send_result(msg["id"], timer)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "timercard/update",
        vol.Required("timer_id"): str,
        **TIMER_FIELDS,
    }
)
@websocket_api.async_response
async def ws_update(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Update a timer."""
    if _not_loaded(connection, msg):
        return
    manager = _manager(hass)
    if msg["timer_id"] not in manager.timers:
        connection.send_error(msg["id"], "not_found", "Timer not found")
        return
    changes = {
        key: value
        for key, value in msg.items()
        if key not in ("id", "type", "timer_id")
    }
    timer = await manager.async_update(msg["timer_id"], changes)
    connection.send_result(msg["id"], timer)


@websocket_api.websocket_command(
    {vol.Required("type"): "timercard/delete", vol.Required("timer_id"): str}
)
@websocket_api.async_response
async def ws_delete(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Delete a timer."""
    if _not_loaded(connection, msg):
        return
    manager = _manager(hass)
    if msg["timer_id"] not in manager.timers:
        connection.send_error(msg["id"], "not_found", "Timer not found")
        return
    await manager.async_delete(msg["timer_id"])
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {
        vol.Required("type"): "timercard/run",
        vol.Required("timer_id"): str,
        vol.Required("event"): vol.In([EVENT_ON, EVENT_OFF]),
    }
)
@websocket_api.async_response
async def ws_run(
    hass: HomeAssistant, connection: websocket_api.ActiveConnection, msg: dict[str, Any]
) -> None:
    """Run the on/off part of a timer right now (handy for testing)."""
    if _not_loaded(connection, msg):
        return
    manager = _manager(hass)
    if msg["timer_id"] not in manager.timers:
        connection.send_error(msg["id"], "not_found", "Timer not found")
        return
    await manager.async_run(msg["timer_id"], msg["event"])
    connection.send_result(msg["id"])
