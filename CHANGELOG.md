# Changelog

## 1.5.0

- Blinds and other covers: choose **how far they open** and **how far they
  close**, with its own position for every blind in the timer. Tick
  "Choose how far it opens" under *Open* and/or "Choose how far it closes"
  under *Close* and set a slider per blind (0% = fully closed, 100% = fully
  open).
- The timer shows the positions under the times (e.g. "40–70%").
- Blinds that can only open or close fully get no slider and a short note.
- Timers that used the old single "Set position" keep working and are
  converted when you edit them.

## 1.4.0

- Fixed: after an update or restart the card could show "Custom element
  doesn't exist: timercard-card" and was missing from the "Add card" list.
  The card is now also installed as a dashboard resource (in
  `www/timercard/`), so it loads even when the dashboard opens while Home
  Assistant is still starting.
- The card now waits for Timercard to start and fills in by itself; no
  reload, reinstall or second restart needed.
- Timers are now also kept in a backup copy (`.storage/timercard.backup`)
  and restored automatically if the main file is ever missing or damaged.
- Removing the integration keeps your timers; adding it again brings them
  back.
- Updates now show up in HACS with a version number and these notes.

## 1.3.0

- Timers are shown side by side when the card is wide (wider section or
  panel view).

## 1.2.0

- New choice "What should the timer do?": turn on and off, only turn on,
  or only turn off.
- 12 languages: English, Mandarin Chinese, Hindi, Spanish, Arabic, French,
  Bengali, Portuguese, Russian, Urdu, Indonesian and Dutch.

## 1.1.0

- Own time picker instead of the system one (fixes the crash in the Home
  Assistant Mac app).

## 1.0.0

- First version: timers with an on and an off moment, sunrise/sunset,
  "after a while", days, different times on some days, multiple devices.
