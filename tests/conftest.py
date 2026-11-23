"""Fixtures for Timercard tests."""

from unittest.mock import patch

import pytest


@pytest.fixture(autouse=True)
def auto_enable_custom_integrations(enable_custom_integrations):
    """Enable loading custom_components/ in every test."""
    yield


@pytest.fixture(autouse=True)
def mock_frontend(hass):
    """The HA frontend package is not installed in tests: pretend it is loaded."""
    hass.config.components.add("frontend")
    with patch("custom_components.timercard._async_register_frontend") as mock:
        yield mock


@pytest.fixture(autouse=True)
async def amsterdam_time_zone(hass):
    """Run every test in a fixed time zone."""
    await hass.config.async_set_time_zone("Europe/Amsterdam")
