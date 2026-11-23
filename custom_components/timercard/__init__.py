"""Timercard: easy on/off timers for Home Assistant."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant
import homeassistant.helpers.config_validation as cv
from homeassistant.helpers.typing import ConfigType

from . import websocket
from .const import CARD_FILENAME, DOMAIN, FRONTEND_URL_BASE, VERSION
from .manager import TimerManager

PLATFORMS: list[Platform] = [Platform.SWITCH]
CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)

_FRONTEND_REGISTERED = f"{DOMAIN}_frontend_registered"


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Register the websocket API (once)."""
    websocket.async_register(hass)
    return True


async def _async_register_frontend(hass: HomeAssistant) -> None:
    """Serve the card and load it on every dashboard automatically."""
    if hass.data.get(_FRONTEND_REGISTERED):
        return
    hass.data[_FRONTEND_REGISTERED] = True
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(
                FRONTEND_URL_BASE,
                str(Path(__file__).parent / "frontend"),
                cache_headers=False,
            )
        ]
    )
    add_extra_js_url(hass, f"{FRONTEND_URL_BASE}/{CARD_FILENAME}?v={VERSION}")


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Timercard from a config entry."""
    manager = TimerManager(hass)
    await manager.async_load()
    hass.data[DOMAIN] = manager
    entry.async_on_unload(manager.async_shutdown)

    await _async_register_frontend(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data.pop(DOMAIN, None)
    return unloaded
