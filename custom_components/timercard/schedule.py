"""Pure time calculations for Timercard timers.

A timer has one "on" moment and (optionally) one "off" moment.  The "off"
moment always belongs to the "on" moment of the same day, which makes things
like "on at 22:00, off at 06:00" (over midnight) or "on at sunset, off after
90 minutes" behave the way people expect: the selected weekdays are the days
the timer *starts*.
"""

from __future__ import annotations

from datetime import date, datetime, time, timedelta
from typing import Any

from homeassistant.const import SUN_EVENT_SUNRISE, SUN_EVENT_SUNSET
from homeassistant.core import HomeAssistant
from homeassistant.helpers.sun import get_astral_event_date
from homeassistant.util import dt as dt_util

from .const import (
    ALL_DAYS,
    EVENT_OFF,
    EVENT_ON,
    OFF_MODE_DURATION,
    OFF_MODE_NONE,
    TIME_SUNRISE,
    TIME_SUNSET,
)

# Look this many days back/forward when searching for the next moment.
_SEARCH_BACK = 2
_SEARCH_AHEAD = 9


def parse_hhmm(value: str) -> time:
    """Parse a 'HH:MM' string."""
    hours, minutes = value.split(":")[:2]
    return time(int(hours), int(minutes))


def resolve_moment(
    hass: HomeAssistant, spec: dict[str, Any], day: date
) -> datetime | None:
    """Return the moment described by ``spec`` on ``day`` (UTC), or None.

    None is returned when the sun does not rise/set on that day (polar regions).
    """
    kind = spec.get("type", "time")
    if kind in (TIME_SUNRISE, TIME_SUNSET):
        event = SUN_EVENT_SUNRISE if kind == TIME_SUNRISE else SUN_EVENT_SUNSET
        sun_moment = get_astral_event_date(hass, event, day)
        if sun_moment is None:
            return None
        return dt_util.as_utc(sun_moment) + timedelta(minutes=spec.get("offset", 0))

    local = datetime.combine(
        day, parse_hhmm(spec.get("time", "00:00")), tzinfo=dt_util.get_default_time_zone()
    )
    return dt_util.as_utc(local)


def specs_for_weekday(
    timer: dict[str, Any], weekday: int
) -> tuple[dict[str, Any], dict[str, Any] | None] | None:
    """Return the (on, off) settings used on ``weekday``, or None if it is off.

    A timer has main times for its ``days`` and optionally ``overrides``: other
    times for other days (for example later in the weekend).
    """
    for override in timer.get("overrides") or []:
        if weekday in (override.get("days") or []):
            return override["on"], override.get("off")
    if weekday in (timer.get("days") or ALL_DAYS):
        return timer["on"], timer.get("off")
    return None


def period_for_day(
    hass: HomeAssistant, timer: dict[str, Any], day: date
) -> tuple[datetime, datetime | None] | None:
    """Return (on, off) moments for the timer started on ``day``.

    Returns None when the timer does not run on that day.
    """
    specs = specs_for_weekday(timer, day.weekday())
    if specs is None:
        return None
    on_spec, off = specs

    on_moment = resolve_moment(hass, on_spec, day)
    if on_moment is None:
        return None

    off = off or {"mode": OFF_MODE_NONE}
    mode = off.get("mode", OFF_MODE_NONE)
    if mode == OFF_MODE_NONE:
        return on_moment, None
    if mode == OFF_MODE_DURATION:
        return on_moment, on_moment + timedelta(minutes=max(1, int(off.get("duration", 1))))

    off_moment = resolve_moment(hass, off, day)
    if off_moment is not None and off_moment <= on_moment:
        # Off time is earlier than on time: it means the next day (over midnight).
        off_moment = resolve_moment(hass, off, day + timedelta(days=1))
    return on_moment, off_moment


def next_moment(
    hass: HomeAssistant, timer: dict[str, Any], event: str, now: datetime
) -> datetime | None:
    """Return the next moment (UTC, strictly after ``now``) for ``event``."""
    today = dt_util.as_local(now).date()
    best: datetime | None = None
    for delta in range(-_SEARCH_BACK, _SEARCH_AHEAD):
        period = period_for_day(hass, timer, today + timedelta(days=delta))
        if period is None:
            continue
        moment = period[0] if event == EVENT_ON else period[1]
        if moment is not None and moment > now and (best is None or moment < best):
            best = moment
    return best


def is_active(hass: HomeAssistant, timer: dict[str, Any], now: datetime) -> bool:
    """Return True when ``now`` lies between an on and its matching off moment."""
    today = dt_util.as_local(now).date()
    for delta in range(-_SEARCH_BACK, 1):
        period = period_for_day(hass, timer, today + timedelta(days=delta))
        if period is None or period[1] is None:
            continue
        if period[0] <= now < period[1]:
            return True
    return False


def describe_next(
    hass: HomeAssistant, timer: dict[str, Any], now: datetime
) -> dict[str, Any]:
    """Return a dict with next on/off moments (ISO strings) and active state."""
    def _iso(moment: datetime | None) -> str | None:
        return moment.isoformat() if moment else None

    # Next moments per group of days (main times first, then each override),
    # so the card can show e.g. the sunset time for the weekend group.
    groups = []
    for group in [
        {"on": timer["on"], "off": timer.get("off"), "days": timer.get("days")},
        *(timer.get("overrides") or []),
    ]:
        sub = {"on": group["on"], "off": group.get("off"), "days": group.get("days")}
        groups.append(
            {
                "next_on": _iso(next_moment(hass, sub, EVENT_ON, now)),
                "next_off": _iso(next_moment(hass, sub, EVENT_OFF, now)),
            }
        )

    return {
        "next_on": _iso(next_moment(hass, timer, EVENT_ON, now)),
        "next_off": _iso(next_moment(hass, timer, EVENT_OFF, now)),
        "active": is_active(hass, timer, now),
        "groups": groups,
    }
