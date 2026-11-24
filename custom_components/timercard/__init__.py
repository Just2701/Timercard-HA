"""Timercard: easy on/off timers for Home Assistant."""

from __future__ import annotations

import logging
from pathlib import Path
import shutil
from typing import Any

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

_LOGGER = logging.getLogger(__name__)

_FRONTEND_REGISTERED = f"{DOMAIN}_frontend_registered"

# A copy of the card in <config>/www/timercard/, loaded as a dashboard resource.
# Home Assistant serves /local/ from the very start, so dashboards opened while
# Home Assistant is still starting (e.g. the app reconnecting after a restart)
# get the card too. Without it they show "Custom element doesn't exist".
LOCAL_DIR = "timercard"
LOCAL_URL_BASE = f"/local/{LOCAL_DIR}/"


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
    # Also loaded this way, for YAML dashboards and right after the first install.
    add_extra_js_url(hass, f"{FRONTEND_URL_BASE}/{CARD_FILENAME}?v={VERSION}")
    try:
        await _async_install_local_card(hass)
    except Exception:  # noqa: BLE001 - the card still loads the other way
        _LOGGER.warning("Could not register the Timercard dashboard resource", exc_info=True)


def _lovelace_resources(hass: HomeAssistant) -> Any | None:
    """Return the dashboard resource collection when it can be edited (storage mode)."""
    lovelace = hass.data.get("lovelace")
    resources = getattr(lovelace, "resources", None)
    if resources is None and isinstance(lovelace, dict):
        resources = lovelace.get("resources")
    if resources is None or not hasattr(resources, "async_create_item"):
        return None
    return resources


async def _async_install_local_card(hass: HomeAssistant) -> None:
    """Copy the card to www/ and keep one dashboard resource pointing to it."""
    source = Path(__file__).parent / "frontend" / CARD_FILENAME
    target_dir = Path(hass.config.path("www", LOCAL_DIR))

    def _copy() -> None:
        target_dir.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target_dir / CARD_FILENAME)

    await hass.async_add_executor_job(_copy)

    resources = _lovelace_resources(hass)
    if resources is None:
        return  # YAML dashboards: the card is loaded through add_extra_js_url
    if not resources.loaded:
        await resources.async_load()
        resources.loaded = True

    url = f"{LOCAL_URL_BASE}{CARD_FILENAME}?v={VERSION}"
    ours = [item for item in resources.async_items() if item["url"].startswith(LOCAL_URL_BASE)]
    if ours:
        if ours[0]["url"] != url:
            await resources.async_update_item(ours[0]["id"], {"res_type": "module", "url": url})
        for extra in ours[1:]:
            await resources.async_delete_item(extra["id"])
    else:
        await resources.async_create_item({"res_type": "module", "url": url})


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Timercard from a config entry."""
    manager = TimerManager(hass)
    await manager.async_load()
    hass.data[DOMAIN] = manager
    entry.async_on_unload(manager.async_shutdown)

    await _async_register_frontend(hass)
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def async_remove_entry(hass: HomeAssistant, entry: ConfigEntry) -> None:
    """Removing the integration: tidy up the card, but keep the timers.

    The timers stay in .storage/timercard, so adding Timercard again brings
    them back.
    """
    resources = _lovelace_resources(hass)
    if resources is not None:
        try:
            if not resources.loaded:
                await resources.async_load()
                resources.loaded = True
            for item in resources.async_items():
                if item["url"].startswith(LOCAL_URL_BASE):
                    await resources.async_delete_item(item["id"])
        except Exception:  # noqa: BLE001
            _LOGGER.warning("Could not remove the Timercard dashboard resource", exc_info=True)
    target_dir = Path(hass.config.path("www", LOCAL_DIR))
    await hass.async_add_executor_job(shutil.rmtree, target_dir, True)


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data.pop(DOMAIN, None)
    return unloaded
