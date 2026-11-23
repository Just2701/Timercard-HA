"""Constants for Timercard."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "timercard"
VERSION: Final = "1.0.0"

STORAGE_KEY: Final = DOMAIN
STORAGE_VERSION: Final = 1

FRONTEND_URL_BASE: Final = "/timercard_static"
CARD_FILENAME: Final = "timercard-card.js"

SIGNAL_TIMERS_UPDATED: Final = f"{DOMAIN}_timers_updated"
SIGNAL_TIMER_ADDED: Final = f"{DOMAIN}_timer_added"

# Time types for an event
TIME_FIXED: Final = "time"
TIME_SUNRISE: Final = "sunrise"
TIME_SUNSET: Final = "sunset"
TIME_TYPES: Final = (TIME_FIXED, TIME_SUNRISE, TIME_SUNSET)

# How the "off" moment is defined
OFF_MODE_NONE: Final = "none"
OFF_MODE_TIME: Final = "time"
OFF_MODE_DURATION: Final = "duration"
OFF_MODES: Final = (OFF_MODE_NONE, OFF_MODE_TIME, OFF_MODE_DURATION)

EVENT_ON: Final = "on"
EVENT_OFF: Final = "off"

ALL_DAYS: Final = [0, 1, 2, 3, 4, 5, 6]  # Monday = 0

# Domains the card can schedule, with the service used to turn them "on" / "off".
# A value of None means that domain has no "off" action.
DOMAIN_ACTIONS: Final[dict[str, tuple[str, str | None]]] = {
    "light": ("turn_on", "turn_off"),
    "switch": ("turn_on", "turn_off"),
    "fan": ("turn_on", "turn_off"),
    "input_boolean": ("turn_on", "turn_off"),
    "automation": ("turn_on", "turn_off"),
    "media_player": ("turn_on", "turn_off"),
    "climate": ("turn_on", "turn_off"),
    "humidifier": ("turn_on", "turn_off"),
    "siren": ("turn_on", "turn_off"),
    "water_heater": ("turn_on", "turn_off"),
    "remote": ("turn_on", "turn_off"),
    "cover": ("open_cover", "close_cover"),
    "valve": ("open_valve", "close_valve"),
    "lock": ("unlock", "lock"),
    "vacuum": ("start", "return_to_base"),
    "lawn_mower": ("start_mowing", "dock"),
    "script": ("turn_on", "turn_off"),
    "scene": ("turn_on", None),
    "button": ("press", None),
    "input_button": ("press", None),
}
