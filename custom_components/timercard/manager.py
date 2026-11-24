"""Timer storage and execution for Timercard."""

from __future__ import annotations

import asyncio
from collections.abc import Callable
from datetime import datetime
import logging
from typing import Any
import uuid

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import CALLBACK_TYPE, Context, HomeAssistant, callback
from homeassistant.helpers.dispatcher import async_dispatcher_send
from homeassistant.helpers.event import async_track_point_in_utc_time
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import (
    DOMAIN,
    DOMAIN_ACTIONS,
    EVENT_OFF,
    EVENT_ON,
    SIGNAL_TIMER_ADDED,
    SIGNAL_TIMERS_UPDATED,
    STORAGE_KEY,
    STORAGE_VERSION,
)
from .schedule import describe_next, next_moment

_LOGGER = logging.getLogger(__name__)

EVENT_TIMER_EXECUTED = f"{DOMAIN}_executed"


def build_service_calls(
    timer: dict[str, Any], event: str
) -> list[tuple[str, str, dict[str, Any]]]:
    """Return the (domain, service, data) calls needed for an on/off event."""
    options = timer.get("options") or {}
    by_domain: dict[str, list[str]] = {}
    for entity_id in timer.get("entities", []):
        by_domain.setdefault(entity_id.split(".", 1)[0], []).append(entity_id)

    calls: list[tuple[str, str, dict[str, Any]]] = []
    for domain, entity_ids in by_domain.items():
        on_service, off_service = DOMAIN_ACTIONS.get(domain, ("turn_on", "turn_off"))
        data: dict[str, Any] = {ATTR_ENTITY_ID: entity_ids}

        if event == EVENT_OFF:
            if off_service is not None:
                calls.append((domain, off_service, data))
            continue

        if domain == "light" and options.get("brightness") is not None:
            data["brightness_pct"] = int(options["brightness"])
        if domain == "cover" and options.get("position") is not None:
            calls.append(
                (domain, "set_cover_position", {**data, "position": int(options["position"])})
            )
            continue
        if domain == "climate" and options.get("temperature") is not None:
            calls.append((domain, on_service, dict(data)))
            calls.append(
                (domain, "set_temperature", {**data, "temperature": float(options["temperature"])})
            )
            continue
        calls.append((domain, on_service, data))
    return calls


class TimerManager:
    """Keep track of all timers, persist them and run them on time."""

    def __init__(self, hass: HomeAssistant) -> None:
        """Initialize the manager."""
        self.hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
        # A second copy, used if the main file is ever missing or damaged.
        self._backup: Store[dict[str, Any]] = Store(
            hass, STORAGE_VERSION, f"{STORAGE_KEY}.backup"
        )
        self.timers: dict[str, dict[str, Any]] = {}
        self._unsubs: dict[str, dict[str, CALLBACK_TYPE]] = {}
        self._listeners: list[Callable[[], None]] = []

    # ------------------------------------------------------------------ setup
    async def async_load(self) -> None:
        """Load timers from storage and schedule them."""
        try:
            data = await self._store.async_load()
        except Exception:  # noqa: BLE001 - damaged file: fall back to the backup
            _LOGGER.exception("Could not read the Timercard timers, trying the backup")
            data = None
        if data is None:
            backup = await self._backup.async_load()
            if backup and backup.get("timers"):
                _LOGGER.warning(
                    "Restored %s Timercard timer(s) from the backup", len(backup["timers"])
                )
                data = backup
                await self._store.async_save(backup)
        data = data or {}
        if data.get("timers"):
            await self._backup.async_save(data)
        self.timers = {timer["id"]: timer for timer in data.get("timers", [])}
        for timer_id in self.timers:
            self._schedule(timer_id)

    @callback
    def async_shutdown(self) -> None:
        """Cancel every scheduled callback."""
        for timer_id in list(self._unsubs):
            self._cancel(timer_id)

    async def _async_save(self) -> None:
        data = {"timers": list(self.timers.values())}
        await self._store.async_save(data)
        await self._backup.async_save(data)

    # -------------------------------------------------------------- listeners
    @callback
    def async_add_listener(self, listener: Callable[[], None]) -> CALLBACK_TYPE:
        """Listen for any change to the timer list. Returns an unsubscribe."""
        self._listeners.append(listener)

        @callback
        def _remove() -> None:
            if listener in self._listeners:
                self._listeners.remove(listener)

        return _remove

    @callback
    def _notify(self, timer_id: str | None = None) -> None:
        for listener in list(self._listeners):
            listener()
        async_dispatcher_send(self.hass, SIGNAL_TIMERS_UPDATED, timer_id)

    # ------------------------------------------------------------------ reads
    @callback
    def as_dict(self, timer_id: str) -> dict[str, Any]:
        """Return a timer including its computed next moments."""
        timer = self.timers[timer_id]
        return {**timer, **describe_next(self.hass, timer, dt_util.utcnow())}

    @callback
    def as_list(self) -> list[dict[str, Any]]:
        """Return all timers (oldest first) with computed next moments."""
        return [self.as_dict(timer_id) for timer_id in self.timers]

    # ----------------------------------------------------------------- writes
    async def async_create(self, data: dict[str, Any]) -> dict[str, Any]:
        """Create a new timer."""
        timer_id = uuid.uuid4().hex[:12]
        timer = {**data, "id": timer_id, "created": dt_util.utcnow().isoformat()}
        self.timers[timer_id] = timer
        await self._async_save()
        self._schedule(timer_id)
        async_dispatcher_send(self.hass, SIGNAL_TIMER_ADDED, timer_id)
        self._notify(timer_id)
        return self.as_dict(timer_id)

    async def async_update(self, timer_id: str, changes: dict[str, Any]) -> dict[str, Any]:
        """Update an existing timer."""
        timer = self.timers[timer_id]
        timer.update({key: value for key, value in changes.items() if key != "id"})
        await self._async_save()
        self._schedule(timer_id)
        self._notify(timer_id)
        return self.as_dict(timer_id)

    async def async_delete(self, timer_id: str) -> None:
        """Delete a timer."""
        self._cancel(timer_id)
        self.timers.pop(timer_id)
        await self._async_save()
        self._notify(timer_id)

    async def async_run(self, timer_id: str, event: str) -> None:
        """Run the on or off action of a timer right now."""
        await self._async_execute(self.timers[timer_id], event)

    # ------------------------------------------------------------- scheduling
    @callback
    def _cancel(self, timer_id: str) -> None:
        for unsub in self._unsubs.pop(timer_id, {}).values():
            unsub()

    @callback
    def _schedule(self, timer_id: str) -> None:
        """(Re)schedule both the on and the off moment of a timer."""
        self._cancel(timer_id)
        timer = self.timers.get(timer_id)
        if timer is None or not timer.get("enabled", True):
            return
        self._unsubs[timer_id] = {}
        now = dt_util.utcnow()
        for event in (EVENT_ON, EVENT_OFF):
            self._schedule_event(timer_id, event, now)

    def _make_action(
        self, timer_id: str, event: str, moment: datetime
    ) -> Callable[[datetime], Any]:
        async def _fire(_now: datetime) -> None:
            timer = self.timers.get(timer_id)
            if timer is None:
                return
            # Schedule the next occurrence of *this* event first so a failing
            # service call can never stop the timer from repeating.
            self._schedule_event(timer_id, event, max(moment, dt_util.utcnow()))
            await self._async_execute(timer, event)
            self._notify(timer_id)

        return _fire

    @callback
    def _schedule_event(self, timer_id: str, event: str, after: datetime) -> None:
        """Schedule the first ``event`` moment of a timer after ``after``."""
        unsubs = self._unsubs.setdefault(timer_id, {})
        if (old := unsubs.pop(event, None)) is not None:
            old()
        moment = next_moment(self.hass, self.timers[timer_id], event, after)
        if moment is not None:
            unsubs[event] = async_track_point_in_utc_time(
                self.hass, self._make_action(timer_id, event, moment), moment
            )

    async def _async_execute(self, timer: dict[str, Any], event: str) -> None:
        """Call the services for an on/off event."""
        context = Context()
        calls = build_service_calls(timer, event)
        _LOGGER.debug("Timer %s (%s): %s -> %s", timer.get("name"), timer["id"], event, calls)

        async def _call(domain: str, service: str, data: dict[str, Any]) -> None:
            try:
                await self.hass.services.async_call(
                    domain, service, data, blocking=True, context=context
                )
            except Exception:  # noqa: BLE001 - one broken device must not stop the rest
                _LOGGER.exception(
                    "Timer '%s' could not call %s.%s for %s",
                    timer.get("name"),
                    domain,
                    service,
                    data.get(ATTR_ENTITY_ID),
                )

        # Calls for one domain run in order (e.g. climate on -> set temperature).
        by_domain: dict[str, list[tuple[str, str, dict[str, Any]]]] = {}
        for call in calls:
            by_domain.setdefault(call[0], []).append(call)

        async def _run_domain(domain_calls: list[tuple[str, str, dict[str, Any]]]) -> None:
            for domain, service, data in domain_calls:
                await _call(domain, service, data)

        await asyncio.gather(*(_run_domain(c) for c in by_domain.values()))
        self.hass.bus.async_fire(
            EVENT_TIMER_EXECUTED,
            {
                "timer_id": timer["id"],
                "name": timer.get("name"),
                "event": event,
                "entities": timer.get("entities", []),
            },
            context=context,
        )
