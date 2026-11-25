"""Tests for cover (blind) positions."""

from custom_components.timercard.manager import build_service_calls


def _timer(options):
    return {
        "id": "t",
        "entities": ["cover.living", "cover.kitchen", "cover.bedroom", "light.hall"],
        "options": options,
    }


def test_plain_open_close() -> None:
    """Without positions the covers simply open and close."""
    assert build_service_calls(_timer({}), "on") == [
        ("cover", "open_cover", {"entity_id": ["cover.living", "cover.kitchen", "cover.bedroom"]}),
        ("light", "turn_on", {"entity_id": ["light.hall"]}),
    ]
    assert build_service_calls(_timer({}), "off")[0] == (
        "cover", "close_cover", {"entity_id": ["cover.living", "cover.kitchen", "cover.bedroom"]},
    )


def test_own_position_per_cover_and_moment() -> None:
    """Each blind gets its own position, separately for opening and closing."""
    options = {
        "positions": {
            "on": {"cover.living": 80, "cover.kitchen": 80, "cover.bedroom": 40},
            "off": {"cover.living": 20},
        }
    }
    assert build_service_calls(_timer(options), "on")[:2] == [
        ("cover", "set_cover_position", {"entity_id": ["cover.bedroom"], "position": 40}),
        ("cover", "set_cover_position", {"entity_id": ["cover.living", "cover.kitchen"], "position": 80}),
    ]
    # Closing: the living room only goes down to 20 %, the others close fully.
    assert build_service_calls(_timer(options), "off")[:2] == [
        ("cover", "close_cover", {"entity_id": ["cover.kitchen", "cover.bedroom"]}),
        ("cover", "set_cover_position", {"entity_id": ["cover.living"], "position": 20}),
    ]


def test_old_single_position_still_works() -> None:
    """Timers made before 1.5 used one position for all covers when opening."""
    calls = build_service_calls(_timer({"position": 50}), "on")
    assert calls[0] == (
        "cover", "set_cover_position",
        {"entity_id": ["cover.living", "cover.kitchen", "cover.bedroom"], "position": 50},
    )
    assert build_service_calls(_timer({"position": 50}), "off")[0][1] == "close_cover"
