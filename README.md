# Timercard for Home Assistant

An easy timer card for Home Assistant. Every timer shows **one "on" moment
and one "off" moment together**, so you can see at a glance what turns a
device on and what turns it off again.

<p>
  <img src="docs/docs-list.png" width="380" alt="Timer list">
  <img src="docs/docs-editor.png" width="380" alt="Timer editor">
</p>

- 🟢 **On** and 🔴 **Off** in the same timer: "Garden lights: on at 19:00, off at 23:00"
- 🔀 Or a timer that **only turns on** or **only turns off** (e.g. "all lights off at 23:30")
- ⏰ Turn on at a **set time**, at **sunrise** or at **sunset** (with an offset, e.g. "15 min after sunrise")
- ⌛ Turn off at a set time, at sunrise/sunset, or **after a while** (e.g. "after 15 min")
- 🌙 Off time earlier than on time (e.g. 22:00 → 06:30) means **the next day**
- 📅 Pick days with one tap: *Every day*, *Weekdays*, *Weekend*, or single days
- 🗓️ Optional **different times on some days** (e.g. later in the weekend). It stays hidden until you switch it on
- 💡 Optional extras: brightness for lights, temperature for thermostats, position for covers
- 📝 A plain-language **"In short"** sentence that shows exactly what the timer will do
- 📊 A 24-hour bar per timer showing when the device is on, plus "Next: turn on today at 19:00"
- ⏸️ Pause a timer with its toggle. Each timer is also a `switch.timercard_…` entity, so automations can pause timers too (e.g. on holiday)
- ▶️ "Try it now" buttons to test a timer straight away
- 🌍 12 languages, following your Home Assistant language: English, Mandarin Chinese, Hindi, Spanish, Arabic, French, Bengali, Portuguese, Russian, Urdu, Indonesian and Dutch (Arabic and Urdu right-to-left)

The timers are stored and run by Home Assistant itself, so they keep working
when no dashboard is open and after a restart.

## Installation

### HACS (recommended)

1. HACS → ⋮ → **Custom repositories** → add `https://github.com/just2701/timercard-ha`, type **Integration**.
2. Install **Timercard** and restart Home Assistant.
3. **Settings → Devices & services → Add integration → Timercard**.
4. Refresh your browser, edit a dashboard, **Add card** and choose **Timercard**.

### Manual

Copy `custom_components/timercard` into the `custom_components` folder of your
Home Assistant config, restart, then follow steps 3 and 4 above.

You don't need to add a dashboard resource: the integration loads the card for you.

### The card is not in the "Add card" list?

1. **Did you add the integration?** Downloading it in HACS is not enough.
   Restart Home Assistant, then go to **Settings → Devices & services →
   Add integration → Timercard**. You should see *Timercard* in your list of
   integrations.
2. **Refresh the page** after adding the integration. The card is only
   loaded when the page loads.
   - Browser: press **Ctrl+F5** (Mac: **Cmd+Shift+R**).
   - Home Assistant app: **Settings → Companion app → Debugging → Reset
     frontend cache**, then close and reopen the app.
3. **Search for it**: in **Add card**, type `timercard` in the search box.
   Custom cards are listed at the bottom, below the built-in cards.
4. Still nothing? Choose **Manual** in the card list and paste:

   ```yaml
   type: custom:timercard-card
   ```

   If that shows *"Custom element doesn't exist: timercard-card"*, the card
   file is not being loaded. Open
   `http://<your-home-assistant>:8123/timercard_static/timercard-card.js`.
   If you get an error instead of code, the integration is not set up (step 1).

## Different times on some days

At the bottom of **On which days?** there is a switch **Different times on
some days**. It is off by default, so a normal timer stays simple.

Switch it on and an **Other times** block appears, already set to Saturday and
Sunday, with its own *turn on* and *turn off* moments (copied from the main
times, so you only change what is different). Use **Add other days** for more
blocks, e.g. a late Friday. Every day can belong to one set of times only:
tapping a day in one block moves it there from the other block. Switching the
option off again gives all days the main times.

<img src="docs/docs-per-day.png" width="380" alt="Different times on some days">

## Card options

```yaml
type: custom:timercard-card
title: Garden            # optional, default "Timers"
entities:                # optional: only these devices can be picked,
  - light.garden_lights  #   and only timers that use them are shown
  - switch.pond_pump
```

Leave `entities` out to choose from every supported device. All options can
also be set in the visual card editor.

Supported device types: lights, switches, fans, input booleans, automations,
media players, climate, humidifiers, sirens, water heaters, remotes, covers
(open/close), valves (open/close), locks (unlock/lock), vacuums and lawn
mowers (start/dock), scripts (run/stop), and scenes and buttons (on only).

## Using timers in automations

Each timer has a switch entity, for example `switch.timercard_garden_lights`:

- turning the switch **off** pauses the timer, **on** resumes it;
- its attributes contain `next_on`, `next_off`, `active`, `entities`, `days`
  and `overrides` (the "other times", if any).

Every time a timer runs, Home Assistant fires the event `timercard_executed`
with `timer_id`, `name`, `event` (`on`/`off`) and `entities`.

## Good to know

- The days you select are the days the timer **starts**. A Friday timer
  from 22:00 to 06:00 turns off on Saturday morning.
- If Home Assistant is not running at the moment a timer should fire,
  that moment is skipped (it is not caught up after a restart).
- Times are in your Home Assistant time zone.

## Translations

All texts live in `tools/translations.py`. After changing them run
`python3 tools/translations.py`, which updates the card and the integration's
`translations/` files and checks that no text or placeholder is missing.
Improvements by native speakers are very welcome.

## Development

```bash
pip install -r requirements_test.txt
pytest
```
