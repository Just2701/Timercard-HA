"""Tests for the schedule calculations."""

from datetime import datetime

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from custom_components.timercard.schedule import is_active, next_moment


def _local(hass: HomeAssistant, *args: int) -> datetime:
    return dt_util.as_utc(datetime(*args, tzinfo=dt_util.get_default_time_zone()))


def _timer(**kwargs):
    base = {
        "id": "t1",
        "entities": ["light.test"],
        "days": [0, 1, 2, 3, 4, 5, 6],
        "on": {"type": "time", "time": "19:00", "offset": 0},
        "off": {"mode": "time", "type": "time", "time": "23:00", "offset": 0},
    }
    base.update(kwargs)
    return base


async def test_simple_on_off(hass: HomeAssistant) -> None:
    """On at 19:00, off at 23:00."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    now = _local(hass, 2026, 11, 23, 12, 0)  # Monday noon
    timer = _timer()
    assert next_moment(hass, timer, "on", now) == _local(hass, 2026, 11, 23, 19, 0)
    assert next_moment(hass, timer, "off", now) == _local(hass, 2026, 11, 23, 23, 0)
    assert not is_active(hass, timer, now)
    assert is_active(hass, timer, _local(hass, 2026, 11, 23, 20, 0))


async def test_over_midnight_uses_start_day(hass: HomeAssistant) -> None:
    """On 22:00 off 06:00 only on Friday: the off moment is Saturday 06:00."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    timer = _timer(
        days=[4],
        on={"type": "time", "time": "22:00"},
        off={"mode": "time", "type": "time", "time": "06:00"},
    )
    monday = _local(hass, 2026, 11, 23, 12, 0)
    assert next_moment(hass, timer, "on", monday) == _local(hass, 2026, 11, 27, 22, 0)
    assert next_moment(hass, timer, "off", monday) == _local(hass, 2026, 11, 28, 6, 0)
    assert is_active(hass, timer, _local(hass, 2026, 11, 28, 2, 0))
    assert not is_active(hass, timer, _local(hass, 2026, 11, 28, 7, 0))


async def test_duration(hass: HomeAssistant) -> None:
    """On 07:00 for 15 minutes on weekdays."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    timer = _timer(
        days=[0, 1, 2, 3, 4],
        on={"type": "time", "time": "07:00"},
        off={"mode": "duration", "duration": 15},
    )
    saturday = _local(hass, 2026, 11, 28, 12, 0)
    assert next_moment(hass, timer, "on", saturday) == _local(hass, 2026, 11, 30, 7, 0)
    assert next_moment(hass, timer, "off", saturday) == _local(hass, 2026, 11, 30, 7, 15)


async def test_no_off(hass: HomeAssistant) -> None:
    """Only an on moment."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    timer = _timer(off={"mode": "none"})
    now = _local(hass, 2026, 11, 23, 20, 0)
    assert next_moment(hass, timer, "on", now) == _local(hass, 2026, 11, 24, 19, 0)
    assert next_moment(hass, timer, "off", now) is None
    assert not is_active(hass, timer, now)


async def test_sunset_with_offset(hass: HomeAssistant) -> None:
    """Sunset - 30 minutes lands in the evening."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
    hass.config.latitude = 52.37
    hass.config.longitude = 4.89
    timer = _timer(on={"type": "sunset", "offset": -30})
    now = _local(hass, 2026, 11, 23, 8, 0)
    moment = dt_util.as_local(next_moment(hass, timer, "on", now))
    assert moment.date() == now.date()
    assert 15 <= moment.hour <= 17


async def test_weekend_override(hass: HomeAssistant) -> None:
    """Weekdays 07:00-08:00, weekend 09:30-11:00."""
    timer = _timer(
        days=[0, 1, 2, 3, 4],
        on={"type": "time", "time": "07:00"},
        off={"mode": "time", "type": "time", "time": "08:00"},
        overrides=[
            {
                "days": [5, 6],
                "on": {"type": "time", "time": "09:30"},
                "off": {"mode": "time", "type": "time", "time": "11:00"},
            }
        ],
    )
    friday_noon = _local(hass, 2026, 11, 27, 12, 0)
    assert next_moment(hass, timer, "on", friday_noon) == _local(hass, 2026, 11, 28, 9, 30)
    assert next_moment(hass, timer, "off", friday_noon) == _local(hass, 2026, 11, 28, 11, 0)
    sunday_noon = _local(hass, 2026, 11, 29, 12, 0)
    assert next_moment(hass, timer, "on", sunday_noon) == _local(hass, 2026, 11, 30, 7, 0)
    assert is_active(hass, timer, _local(hass, 2026, 11, 29, 10, 0))
    assert not is_active(hass, timer, _local(hass, 2026, 11, 29, 7, 30))


async def test_override_over_midnight(hass: HomeAssistant) -> None:
    """Friday night has its own late off time, which ends on Saturday."""
    timer = _timer(
        days=[0, 1, 2, 3, 6],
        on={"type": "time", "time": "20:00"},
        off={"mode": "time", "type": "time", "time": "23:00"},
        overrides=[
            {
                "days": [4, 5],
                "on": {"type": "time", "time": "20:00"},
                "off": {"mode": "time", "type": "time", "time": "01:00"},
            }
        ],
    )
    friday_21 = _local(hass, 2026, 11, 27, 21, 0)
    assert next_moment(hass, timer, "off", friday_21) == _local(hass, 2026, 11, 28, 1, 0)
    assert is_active(hass, timer, _local(hass, 2026, 11, 28, 0, 30))


async def test_only_off(hass: HomeAssistant) -> None:
    """A timer that only turns off at 23:30 (nothing turns on)."""
    timer = _timer(
        action="off",
        off={"mode": "time", "type": "time", "time": "23:30"},
    )
    now = _local(hass, 2026, 11, 23, 12, 0)
    assert next_moment(hass, timer, "on", now) is None
    assert next_moment(hass, timer, "off", now) == _local(hass, 2026, 11, 23, 23, 30)
    # Even when the off time is "earlier" than the stored on time, it is the same day.
    timer["off"]["time"] = "06:00"
    assert next_moment(hass, timer, "off", now) == _local(hass, 2026, 11, 24, 6, 0)
    assert not is_active(hass, timer, now)


async def test_only_on_ignores_off(hass: HomeAssistant) -> None:
    """With action "on" the stored off time is not used."""
    timer = _timer(action="on")
    now = _local(hass, 2026, 11, 23, 12, 0)
    assert next_moment(hass, timer, "on", now) == _local(hass, 2026, 11, 23, 19, 0)
    assert next_moment(hass, timer, "off", now) is None
