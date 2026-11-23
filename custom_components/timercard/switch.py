"""One switch per timer, so automations can turn timers on and off."""

from __future__ import annotations

from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import entity_registry as er
from homeassistant.helpers.dispatcher import async_dispatcher_connect
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import slugify

from .const import DOMAIN, SIGNAL_TIMER_ADDED, SIGNAL_TIMERS_UPDATED
from .manager import TimerManager


async def async_setup_entry(
    hass: HomeAssistant, entry: ConfigEntry, async_add_entities: AddEntitiesCallback
) -> None:
    """Create a switch for every timer, now and when new ones are added."""
    manager: TimerManager = hass.data[DOMAIN]
    async_add_entities(TimerSwitch(manager, timer_id) for timer_id in manager.timers)

    @callback
    def _added(timer_id: str) -> None:
        async_add_entities([TimerSwitch(manager, timer_id)])

    entry.async_on_unload(async_dispatcher_connect(hass, SIGNAL_TIMER_ADDED, _added))


class TimerSwitch(SwitchEntity):
    """Switch that enables / disables a timer."""

    _attr_should_poll = False
    _attr_icon = "mdi:timer-outline"

    def __init__(self, manager: TimerManager, timer_id: str) -> None:
        """Initialize the switch."""
        self._manager = manager
        self._timer_id = timer_id
        self._attr_unique_id = timer_id
        timer = manager.timers[timer_id]
        self.entity_id = f"switch.timercard_{slugify(timer.get('name') or timer_id)}"

    @property
    def _timer(self) -> dict[str, Any]:
        return self._manager.timers[self._timer_id]

    @property
    def name(self) -> str:
        """Return the timer name."""
        return self._timer.get("name") or "Timer"

    @property
    def is_on(self) -> bool:
        """Return True when the timer is enabled."""
        return bool(self._timer.get("enabled", True))

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Expose the schedule for use in automations / templates."""
        info = self._manager.as_dict(self._timer_id)
        return {
            "timer_id": self._timer_id,
            "entities": info.get("entities", []),
            "days": info.get("days", []),
            "on": info.get("on"),
            "off": info.get("off"),
            "overrides": info.get("overrides", []),
            "next_on": info.get("next_on"),
            "next_off": info.get("next_off"),
            "active": info.get("active"),
        }

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Enable the timer."""
        await self._manager.async_update(self._timer_id, {"enabled": True})

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Disable the timer."""
        await self._manager.async_update(self._timer_id, {"enabled": False})

    async def async_added_to_hass(self) -> None:
        """Follow changes made from the card."""
        self.async_on_remove(
            async_dispatcher_connect(self.hass, SIGNAL_TIMERS_UPDATED, self._updated)
        )

    @callback
    def _updated(self, timer_id: str | None) -> None:
        if timer_id not in (None, self._timer_id):
            return
        if self._timer_id not in self._manager.timers:
            # Timer was deleted: remove the switch completely.
            registry = er.async_get(self.hass)
            if self.registry_entry is not None:
                registry.async_remove(self.entity_id)
            else:
                self.hass.async_create_task(self.async_remove())
            return
        self.async_write_ha_state()
