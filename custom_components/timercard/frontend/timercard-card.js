/*
 * Timercard – an easy timer card for Home Assistant.
 *
 * Every timer has one "on" moment and (optionally) one "off" moment, so you
 * always see in one place what switches a device on and what switches it off.
 *
 * Needs the Timercard integration (custom_components/timercard), which stores
 * and runs the timers.
 */

const TC_VERSION = "1.0.0";

/* Which domains can be scheduled and which words fit their on/off actions. */
const TC_DOMAINS = {
  light: ["turn_on", "turn_off"],
  switch: ["turn_on", "turn_off"],
  fan: ["turn_on", "turn_off"],
  input_boolean: ["turn_on", "turn_off"],
  automation: ["turn_on", "turn_off"],
  media_player: ["turn_on", "turn_off"],
  climate: ["turn_on", "turn_off"],
  humidifier: ["turn_on", "turn_off"],
  siren: ["turn_on", "turn_off"],
  water_heater: ["turn_on", "turn_off"],
  remote: ["turn_on", "turn_off"],
  cover: ["open", "close"],
  valve: ["open", "close"],
  lock: ["unlock", "lock"],
  vacuum: ["start", "dock"],
  lawn_mower: ["start", "dock"],
  script: ["run", "stop"],
  scene: ["activate", null],
  button: ["press", null],
  input_button: ["press", null],
};

const TC_DOMAIN_ICONS = {
  light: "mdi:lightbulb",
  switch: "mdi:toggle-switch",
  fan: "mdi:fan",
  input_boolean: "mdi:toggle-switch-outline",
  automation: "mdi:robot",
  media_player: "mdi:cast",
  climate: "mdi:thermostat",
  humidifier: "mdi:air-humidifier",
  siren: "mdi:bullhorn",
  water_heater: "mdi:water-boiler",
  remote: "mdi:remote",
  cover: "mdi:window-shutter",
  valve: "mdi:valve",
  lock: "mdi:lock",
  vacuum: "mdi:robot-vacuum",
  lawn_mower: "mdi:robot-mower",
  script: "mdi:script-text",
  scene: "mdi:palette",
  button: "mdi:gesture-tap-button",
  input_button: "mdi:gesture-tap-button",
};

const TC_I18N = {
  en: {
    title: "Timers",
    new_timer: "New timer",
    edit_timer: "Edit timer",
    empty: "No timers yet. Tap “New timer” to make your first one.",
    not_loaded:
      "The Timercard integration is not set up yet. Go to Settings → Devices & services → Add integration and choose “Timercard”.",
    loading: "Loading timers…",
    step_devices: "What should the timer control?",
    search: "Search for a device…",
    no_results: "Nothing found",
    step_days: "On which days?",
    step_name: "Name",
    name_optional: "optional",
    every_day: "Every day",
    weekdays: "Weekdays",
    weekend: "Weekend",
    at_time: "Time",
    sunrise: "Sunrise",
    sunset: "Sunset",
    exactly: "exactly at",
    before: "before",
    after: "after",
    min: "min",
    hour: "h",
    off_at_time: "At a time",
    off_after: "After a while",
    off_none: "Don't {verb}",
    for_how_long: "How long should it stay on?",
    custom: "Other",
    next_day: "next day",
    only_on: "These devices can only be switched one way, so there is nothing to undo.",
    set_brightness: "Set brightness",
    set_temperature: "Set temperature",
    set_position: "Set position",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    confirm_delete: "Tap again to delete",
    try_now: "Try it now:",
    need_device: "Choose at least one device.",
    need_day: "Choose at least one day.",
    need_day_group: "Choose at least one day for each set of other times.",
    per_day: "Different times on some days",
    per_day_hint: "For example later in the weekend",
    main_days: "The times above are used on:",
    other_times: "Other times",
    other_days: "On these days:",
    add_other: "Add other days",
    remove: "Remove",
    summary_title: "In short",
    when_time: "at {time}",
    when_sun: "at {sun}",
    when_sun_offset: "{min} min {dir} {sun}",
    sun_sunrise: "sunrise",
    sun_sunset: "sunset",
    when_duration: "after {duration}",
    on_days: "On {days}.",
    every_day_s: "Every day.",
    weekdays_s: "On weekdays.",
    weekend_s: "In the weekend.",
    active_now: "Running now · {verb} {when}",
    next: "Next: {verb} {day} at {time}",
    today: "today",
    tomorrow: "tomorrow",
    paused: "Paused – this timer will not run",
    and_more: "+{n}",
    saved: "Timer saved",
    deleted: "Timer deleted",
    error: "Something went wrong: {msg}",
    verbs: {
      turn_on: "Turn on", turn_off: "Turn off", open: "Open", close: "Close",
      unlock: "Unlock", lock: "Lock", start: "Start", dock: "Send to dock",
      activate: "Activate", run: "Run", stop: "Stop", press: "Press",
    },
    shorts: {
      turn_on: "On", turn_off: "Off", open: "Open", close: "Close",
      unlock: "Unlock", lock: "Lock", start: "Start", dock: "Dock",
      activate: "Activate", run: "Run", stop: "Stop", press: "Press",
    },
  },
  nl: {
    title: "Timers",
    new_timer: "Nieuwe timer",
    edit_timer: "Timer bewerken",
    empty: "Nog geen timers. Tik op “Nieuwe timer” om je eerste te maken.",
    not_loaded:
      "De Timercard-integratie is nog niet ingesteld. Ga naar Instellingen → Apparaten & diensten → Integratie toevoegen en kies “Timercard”.",
    loading: "Timers laden…",
    step_devices: "Wat moet de timer bedienen?",
    search: "Zoek een apparaat…",
    no_results: "Niets gevonden",
    step_days: "Op welke dagen?",
    step_name: "Naam",
    name_optional: "optioneel",
    every_day: "Elke dag",
    weekdays: "Werkdagen",
    weekend: "Weekend",
    at_time: "Tijd",
    sunrise: "Zonsopkomst",
    sunset: "Zonsondergang",
    exactly: "precies bij",
    before: "voor",
    after: "na",
    min: "min",
    hour: "u",
    off_at_time: "Op een tijd",
    off_after: "Na een tijdje",
    off_none: "Niet {verb}",
    for_how_long: "Hoe lang moet het aan blijven?",
    custom: "Anders",
    next_day: "volgende dag",
    only_on: "Deze apparaten kunnen maar één kant op, dus er valt niets terug te zetten.",
    set_brightness: "Helderheid instellen",
    set_temperature: "Temperatuur instellen",
    set_position: "Positie instellen",
    save: "Opslaan",
    cancel: "Annuleren",
    delete: "Verwijderen",
    confirm_delete: "Tik nogmaals om te verwijderen",
    try_now: "Nu testen:",
    need_device: "Kies minstens één apparaat.",
    need_day: "Kies minstens één dag.",
    need_day_group: "Kies minstens één dag voor elke set andere tijden.",
    per_day: "Andere tijden op sommige dagen",
    per_day_hint: "Bijvoorbeeld later in het weekend",
    main_days: "De tijden hierboven gelden op:",
    other_times: "Andere tijden",
    other_days: "Op deze dagen:",
    add_other: "Andere dagen toevoegen",
    remove: "Verwijderen",
    summary_title: "Kort gezegd",
    when_time: "om {time}",
    when_sun: "bij {sun}",
    when_sun_offset: "{min} min {dir} {sun}",
    sun_sunrise: "zonsopkomst",
    sun_sunset: "zonsondergang",
    when_duration: "na {duration}",
    on_days: "Op {days}.",
    every_day_s: "Elke dag.",
    weekdays_s: "Op werkdagen.",
    weekend_s: "In het weekend.",
    active_now: "Nu actief · {verb} {when}",
    next: "Volgende: {verb} {day} om {time}",
    today: "vandaag",
    tomorrow: "morgen",
    paused: "Gepauzeerd – deze timer gaat niet af",
    and_more: "+{n}",
    saved: "Timer opgeslagen",
    deleted: "Timer verwijderd",
    error: "Er ging iets mis: {msg}",
    verbs: {
      turn_on: "Aanzetten", turn_off: "Uitzetten", open: "Openen", close: "Sluiten",
      unlock: "Ontgrendelen", lock: "Vergrendelen", start: "Starten", dock: "Terug naar dock",
      activate: "Activeren", run: "Uitvoeren", stop: "Stoppen", press: "Indrukken",
    },
    shorts: {
      turn_on: "Aan", turn_off: "Uit", open: "Open", close: "Dicht",
      unlock: "Open", lock: "Op slot", start: "Start", dock: "Dock",
      activate: "Activeer", run: "Start", stop: "Stop", press: "Druk",
    },
  },
};

const TC_DURATION_PRESETS = [5, 10, 15, 30, 60, 120, 240];

const tcEsc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[c]);

const tcDomain = (entityId) => entityId.split(".")[0];

const tcMinutes = (hhmm) => {
  const [h, m] = String(hhmm || "0:0").split(":").map((x) => parseInt(x, 10) || 0);
  return h * 60 + m;
};

const tcHHMM = (minutes) => {
  const m = ((Math.round(minutes) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
};

const tcClone = (obj) => JSON.parse(JSON.stringify(obj));

class TimercardCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._timers = null;
    this._error = null;
    this._view = "list";
    this._draft = null;
    this._search = "";
    this._confirmDelete = false;
    this._saving = false;
    this._showErrors = false;
    this.shadowRoot.addEventListener("click", (ev) => this._onClick(ev));
    this.shadowRoot.addEventListener("input", (ev) => this._onInput(ev));
    this.shadowRoot.addEventListener("change", (ev) => this._onChange(ev));
    this.shadowRoot.addEventListener("keydown", (ev) => this._onKeyDown(ev));
  }

  /* ------------------------------------------------------------ HA API */
  static getConfigElement() {
    return document.createElement("timercard-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  set hass(hass) {
    const first = !this._hass;
    this._hass = hass;
    if (first) {
      this._subscribe();
      this._render();
      return;
    }
    if (this._view === "list") {
      const sig = this._stateSignature();
      if (sig !== this._lastSig) this._render();
    }
  }

  get hass() {
    return this._hass;
  }

  connectedCallback() {
    if (this._hass) this._subscribe();
    this._tick = setInterval(() => {
      if (this._view === "list") this._render();
    }, 30000);
  }

  disconnectedCallback() {
    clearInterval(this._tick);
    this._unsubscribe();
  }

  getCardSize() {
    return 2 + 3 * (this._visibleTimers().length || 1);
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  /* ---------------------------------------------------------- data */
  async _subscribe() {
    if (this._subPromise || !this._hass) return;
    this._subPromise = this._hass.connection.subscribeMessage(
      (msg) => {
        this._timers = msg.timers || [];
        this._error = null;
        if (this._view === "list") this._render();
      },
      { type: "timercard/subscribe" }
    );
    try {
      this._unsub = await this._subPromise;
    } catch (err) {
      this._subPromise = null;
      this._error = err;
      this._render();
    }
  }

  _unsubscribe() {
    if (this._subPromise) {
      const promise = this._subPromise;
      this._subPromise = null;
      this._unsub = null;
      promise.then((unsub) => unsub && unsub()).catch(() => {});
    }
  }

  _visibleTimers() {
    const timers = this._timers || [];
    const filter = this._config.entities;
    if (!Array.isArray(filter) || !filter.length) return timers;
    return timers.filter((t) => (t.entities || []).some((e) => filter.includes(e)));
  }

  _stateSignature() {
    if (!this._hass) return "";
    const ids = new Set();
    this._visibleTimers().forEach((t) => (t.entities || []).forEach((e) => ids.add(e)));
    let sig = this._hass.locale?.language || this._hass.language || "";
    ids.forEach((id) => {
      const s = this._hass.states[id];
      sig += `|${id}:${s ? s.state : "?"}:${s?.attributes?.friendly_name || ""}`;
    });
    return sig;
  }

  /* ------------------------------------------------------- language */
  get _lang() {
    return (this._hass?.locale?.language || this._hass?.language || "en");
  }

  get _strings() {
    const base = this._lang.split("-")[0].toLowerCase();
    return TC_I18N[base] || TC_I18N.en;
  }

  _t(key, vars = {}) {
    let text = this._strings[key] ?? TC_I18N.en[key] ?? key;
    Object.entries(vars).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  }

  _verb(verbKey, short = false) {
    const table = short ? this._strings.shorts : this._strings.verbs;
    return table[verbKey] || TC_I18N.en[short ? "shorts" : "verbs"][verbKey] || verbKey;
  }

  /** The two verbs that fit the chosen devices, e.g. ["open", "close"]. */
  _verbsFor(entities) {
    const pairs = (entities || []).map((e) => TC_DOMAINS[tcDomain(e)] || ["turn_on", "turn_off"]);
    if (!pairs.length) return { on: "turn_on", off: "turn_off", hasOff: true };
    const first = pairs[0];
    const same = pairs.every((p) => p[0] === first[0] && p[1] === first[1]);
    const hasOff = pairs.some((p) => p[1] !== null);
    if (same) return { on: first[0], off: first[1] || "turn_off", hasOff };
    return { on: "turn_on", off: "turn_off", hasOff };
  }

  get _tz() {
    return this._hass?.config?.time_zone || undefined;
  }

  get _hour12() {
    const fmt = this._hass?.locale?.time_format;
    if (fmt === "12") return true;
    if (fmt === "24") return false;
    try {
      const opts = new Intl.DateTimeFormat(fmt === "system" ? undefined : this._lang, {
        hour: "numeric",
      }).resolvedOptions();
      return opts.hour12 ?? (opts.hourCycle === "h12" || opts.hourCycle === "h11");
    } catch (e) {
      return false;
    }
  }

  /** Format "HH:MM" for display. */
  _fmtHHMM(hhmm) {
    const mins = tcMinutes(hhmm);
    if (!this._hour12) return tcHHMM(mins);
    const h = Math.floor(mins / 60);
    const m = String(mins % 60).padStart(2, "0");
    return `${((h + 11) % 12) + 1}:${m} ${h < 12 ? "AM" : "PM"}`;
  }

  /** Parts of an ISO moment in the Home Assistant time zone. */
  _parts(iso) {
    const date = new Date(iso);
    const fmt = new Intl.DateTimeFormat("en-CA", {
      timeZone: this._tz, year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    });
    const p = {};
    fmt.formatToParts(date).forEach((x) => { p[x.type] = x.value; });
    return {
      date: `${p.year}-${p.month}-${p.day}`,
      minutes: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10),
    };
  }

  _dayWord(iso) {
    const target = this._parts(iso).date;
    const now = Date.now();
    if (target === this._parts(new Date(now).toISOString()).date) return this._t("today");
    if (target === this._parts(new Date(now + 86400000).toISOString()).date) return this._t("tomorrow");
    return new Intl.DateTimeFormat(this._lang, { weekday: "long", timeZone: this._tz }).format(new Date(iso));
  }

  _dayNames(style = "short") {
    // 2024-01-01 was a Monday.
    const fmt = new Intl.DateTimeFormat(this._lang, { weekday: style, timeZone: "UTC" });
    return [0, 1, 2, 3, 4, 5, 6].map((i) => fmt.format(new Date(Date.UTC(2024, 0, 1 + i))));
  }

  _fmtDuration(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (!h) return `${m} ${this._t("min")}`;
    if (!m) return `${h} ${this._t("hour")}`;
    return `${h} ${this._t("hour")} ${m} ${this._t("min")}`;
  }

  /* --------------------------------------------------------- entities */
  _stateObj(entityId) {
    return this._hass?.states?.[entityId];
  }

  _entityName(entityId) {
    const s = this._stateObj(entityId);
    return s?.attributes?.friendly_name || entityId;
  }

  _entityIcon(entityId) {
    const s = this._stateObj(entityId);
    return s?.attributes?.icon || TC_DOMAIN_ICONS[tcDomain(entityId)] || "mdi:help-circle-outline";
  }

  _isEntityOn(entityId) {
    const s = this._stateObj(entityId);
    if (!s) return false;
    return ["on", "open", "opening", "unlocked", "playing", "cleaning", "mowing", "heat", "cool", "heat_cool", "auto", "dry", "fan_only"].includes(s.state);
  }

  _autoName(entities) {
    if (!entities?.length) return "";
    const first = this._entityName(entities[0]);
    return entities.length > 1 ? `${first} ${this._t("and_more", { n: entities.length - 1 })}` : first;
  }

  _selectableEntities() {
    const filter = this._config.entities;
    if (Array.isArray(filter) && filter.length) {
      return filter.filter((e) => TC_DOMAINS[tcDomain(e)]);
    }
    return Object.keys(this._hass?.states || {}).filter((e) => TC_DOMAINS[tcDomain(e)]);
  }

  /* ---------------------------------------------------- descriptions */
  _whenText(spec, isOff, onSpec) {
    if (isOff && spec.mode === "duration") {
      return this._t("when_duration", { duration: this._fmtDuration(spec.duration || 0) });
    }
    const type = spec.type || "time";
    if (type === "time") {
      let text = this._t("when_time", { time: this._fmtHHMM(spec.time) });
      if (isOff && (onSpec?.type || "time") === "time" && tcMinutes(spec.time) <= tcMinutes(onSpec.time)) {
        text += ` (${this._t("next_day")})`;
      }
      return text;
    }
    const sun = this._t(type === "sunrise" ? "sun_sunrise" : "sun_sunset");
    const offset = parseInt(spec.offset, 10) || 0;
    if (!offset) return this._t("when_sun", { sun });
    return this._t("when_sun_offset", {
      min: Math.abs(offset), dir: this._t(offset < 0 ? "before" : "after"), sun,
    });
  }

  _daysText(days) {
    const set = [...new Set(days || [])].sort();
    const key = set.join(",");
    if (key === "0,1,2,3,4,5,6") return this._t("every_day_s");
    if (key === "0,1,2,3,4") return this._t("weekdays_s");
    if (key === "5,6") return this._t("weekend_s");
    const names = this._dayNames("short");
    return this._t("on_days", { days: set.map((d) => names[d]).join(", ") });
  }

  _groupText(group, verbs) {
    let text = `${this._verb(verbs.on).toLowerCase()} ${this._whenText(group.on, false)}`;
    if (verbs.hasOff && group.off && group.off.mode !== "none") {
      text += `, ${this._verb(verbs.off).toLowerCase()} ${this._whenText(group.off, true, group.on)}`;
    }
    return text;
  }

  _summary(timer) {
    const verbs = this._verbsFor(timer.entities);
    const devices = (timer.entities || []).map((e) => this._entityName(e));
    const list = devices.length ? devices.join(", ") : "…";
    const groups = this._groups(timer);
    if (groups.length === 1) {
      return `<b>${tcEsc(list)}</b>: ${tcEsc(this._groupText(groups[0], verbs))}. ${tcEsc(this._daysText(timer.days))}`;
    }
    return `<b>${tcEsc(list)}</b>:<ul>${groups.map((g) => `
      <li><b>${tcEsc(g.days.length ? this._daysLabel(g.days) : "…")}</b>: ${tcEsc(this._groupText(g, verbs))}</li>`).join("")}</ul>`;
  }

  /** Short label for weekdays: "Every day", "Weekdays", "Mon–Wed, Sat". */
  _daysLabel(days) {
    const set = [...new Set(days || [])].sort((a, b) => a - b);
    const key = set.join(",");
    if (key === "0,1,2,3,4,5,6") return this._t("every_day");
    if (key === "0,1,2,3,4") return this._t("weekdays");
    if (key === "5,6") return this._t("weekend");
    const names = this._dayNames("short").map((n) => n.charAt(0).toUpperCase() + n.slice(1));
    const parts = [];
    let i = 0;
    while (i < set.length) {
      let j = i;
      while (j + 1 < set.length && set[j + 1] === set[j] + 1) j += 1;
      if (j - i >= 2) parts.push(`${names[set[i]]}–${names[set[j]]}`);
      else for (let k = i; k <= j; k += 1) parts.push(names[set[k]]);
      i = j + 1;
    }
    return parts.join(", ");
  }

  /** The main times plus any "other times", each with its own next moments. */
  _groups(timer) {
    const raw = [{ days: timer.days || [], on: timer.on, off: timer.off }, ...(timer.overrides || [])];
    return raw.map((g, i) => ({
      days: g.days || [],
      on: g.on,
      off: g.off || { mode: "none" },
      next_on: timer.groups?.[i]?.next_on ?? (i === 0 ? timer.next_on : null),
      next_off: timer.groups?.[i]?.next_off ?? (i === 0 ? timer.next_off : null),
    }));
  }

  _todayWeekday() {
    const date = this._parts(new Date().toISOString()).date;
    return (new Date(`${date}T12:00:00Z`).getUTCDay() + 6) % 7;
  }

  _render() {
    if (!this.shadowRoot) return;
    if (this._view === "edit" && this._draft) {
      this._renderEditor();
      return;
    }
    this._lastSig = this._stateSignature();
    const title = this._config.title ?? this._t("title");
    let body;
    if (this._error) {
      const code = this._error?.code;
      const msg = code === "unknown_command" || code === "not_loaded"
        ? this._t("not_loaded")
        : this._t("error", { msg: tcEsc(this._error?.message || code || this._error) });
      body = `<div class="notice">${msg}</div>`;
    } else if (this._timers === null) {
      body = `<div class="notice">${this._t("loading")}</div>`;
    } else {
      const timers = this._visibleTimers();
      body = timers.length
        ? timers.map((t) => this._renderTimer(t)).join("")
        : `<div class="empty"><ha-icon icon="mdi:timer-plus-outline"></ha-icon><div>${tcEsc(this._t("empty"))}</div></div>`;
    }
    this.shadowRoot.innerHTML = `
      <style>${TC_STYLES}</style>
      <ha-card>
        <div class="header">
          <div class="title">${title ? tcEsc(title) : ""}</div>
          ${this._error ? "" : `<button class="primary-btn" data-action="new"><ha-icon icon="mdi:plus"></ha-icon><span>${tcEsc(this._t("new_timer"))}</span></button>`}
        </div>
        <div class="list">${body}</div>
      </ha-card>`;
  }

  _renderTimer(timer) {
    const verbs = this._verbsFor(timer.entities);
    const enabled = timer.enabled !== false;
    const active = enabled && timer.active;
    const names = this._dayNames("narrow");
    const groups = this._groups(timer);
    const multi = groups.length > 1;
    const days = new Set(groups.flatMap((g) => g.days));

    const devices = (timer.entities || []).map((e) => `
      <span class="device ${this._isEntityOn(e) ? "is-on" : ""}" title="${tcEsc(e)}">
        <ha-icon icon="${tcEsc(this._entityIcon(e))}"></ha-icon>${tcEsc(this._entityName(e))}
      </span>`).join("");

    const events = groups.map((g) => {
      const hasOff = verbs.hasOff && g.off.mode !== "none";
      return `
        ${multi ? `<div class="group-label"><ha-icon icon="mdi:calendar-range"></ha-icon>${tcEsc(this._daysLabel(g.days))}</div>` : ""}
        <div class="events">
          ${this._eventBox(g, "on", verbs)}
          ${hasOff ? `<ha-icon class="arrow" icon="mdi:arrow-right-thick"></ha-icon>${this._eventBox(g, "off", verbs)}` : ""}
        </div>`;
    }).join("");

    // The bar shows the times that apply today.
    const today = this._todayWeekday();
    const barGroup = groups.find((g) => g.days.includes(today)) || groups[0];
    const bar = this._renderBar(barGroup, verbs.hasOff && barGroup.off.mode !== "none");

    let status;
    if (!enabled) status = `<ha-icon icon="mdi:pause-circle-outline"></ha-icon>${tcEsc(this._t("paused"))}`;
    else if (active && timer.next_off) {
      const p = this._parts(timer.next_off);
      status = `<ha-icon icon="mdi:play-circle"></ha-icon>${tcEsc(this._t("active_now", {
        verb: this._verb(verbs.off).toLowerCase(),
        when: this._t("when_time", { time: this._fmtHHMM(tcHHMM(p.minutes)) }),
      }))}`;
    } else if (timer.next_on) {
      const p = this._parts(timer.next_on);
      status = `<ha-icon icon="mdi:clock-outline"></ha-icon>${tcEsc(this._t("next", {
        verb: this._verb(verbs.on).toLowerCase(),
        day: this._dayWord(timer.next_on),
        time: this._fmtHHMM(tcHHMM(p.minutes)),
      }))}`;
    } else status = "";

    return `
      <div class="timer ${enabled ? "" : "paused"} ${active ? "active" : ""}" data-action="edit" data-id="${tcEsc(timer.id)}" tabindex="0" role="button" aria-label="${tcEsc(this._t("edit_timer"))}: ${tcEsc(timer.name)}">
        <div class="timer-top">
          <div class="timer-name">${tcEsc(timer.name || this._autoName(timer.entities))}</div>
          <label class="toggle" data-stop title="${enabled ? "" : tcEsc(this._t("paused"))}">
            <input type="checkbox" data-action="toggle" data-id="${tcEsc(timer.id)}" ${enabled ? "checked" : ""}>
            <span class="slider"></span>
          </label>
        </div>
        <div class="devices">${devices}</div>
        <div class="groups">${events}</div>
        ${bar}
        <div class="timer-bottom">
          <div class="daypills">${names.map((n, i) => `<span class="${days.has(i) ? "on" : ""}">${tcEsc(n)}</span>`).join("")}</div>
          <ha-icon class="edit-icon" icon="mdi:pencil"></ha-icon>
        </div>
        ${status ? `<div class="status">${status}</div>` : ""}
      </div>`;
  }

  _eventBox(timer, which, verbs) {
    const spec = which === "on" ? timer.on : timer.off;
    const iso = which === "on" ? timer.next_on : timer.next_off;
    const label = this._verb(which === "on" ? verbs.on : verbs.off, true);
    let main;
    let sub = "";
    let icon = which === "on" ? "mdi:power" : "mdi:power-off";
    if (which === "off" && spec.mode === "duration") {
      main = iso ? this._fmtHHMM(tcHHMM(this._parts(iso).minutes)) : "–";
      sub = this._t("when_duration", { duration: this._fmtDuration(spec.duration) });
      icon = "mdi:timer-sand";
    } else if ((spec.type || "time") === "time") {
      main = this._fmtHHMM(spec.time);
      if (which === "off" && (timer.on.type || "time") === "time" && tcMinutes(spec.time) <= tcMinutes(timer.on.time)) {
        sub = this._t("next_day");
      }
    } else {
      main = iso ? `≈ ${this._fmtHHMM(tcHHMM(this._parts(iso).minutes))}` : "–";
      sub = this._whenText(spec, which === "off", timer.on);
      icon = spec.type === "sunrise" ? "mdi:weather-sunset-up" : "mdi:weather-sunset-down";
    }
    return `
      <div class="event ${which}">
        <div class="event-label"><ha-icon icon="${icon}"></ha-icon>${tcEsc(label)}</div>
        <div class="event-time">${tcEsc(main)}</div>
        ${sub ? `<div class="event-sub">${tcEsc(sub)}</div>` : ""}
      </div>`;
  }

  _minuteOf(timer, which) {
    const spec = which === "on" ? timer.on : timer.off;
    const iso = which === "on" ? timer.next_on : timer.next_off;
    if (which === "off" && spec.mode === "duration") {
      return (this._minuteOf(timer, "on") + (spec.duration || 0)) % 1440;
    }
    if ((spec.type || "time") === "time") return tcMinutes(spec.time);
    return iso ? this._parts(iso).minutes : null;
  }

  _renderBar(timer, hasOff) {
    const on = this._minuteOf(timer, "on");
    if (on === null) return "";
    const pct = (m) => `${((m / 1440) * 100).toFixed(2)}%`;
    let segs = "";
    if (hasOff) {
      const off = this._minuteOf(timer, "off");
      if (off !== null) {
        const ranges = off > on ? [[on, off]] : [[on, 1440], [0, off]];
        segs = ranges.map(([a, b]) => `<div class="seg" style="left:${pct(a)};width:${pct(Math.max(b - a, 6))}"></div>`).join("");
      }
    } else {
      segs = `<div class="mark" style="left:${pct(on)}"></div>`;
    }
    const now = this._parts(new Date().toISOString()).minutes;
    return `
      <div class="bar" aria-hidden="true">
        <div class="track">${segs}<div class="now" style="left:${pct(now)}"></div></div>
        <div class="ticks"><span>00</span><span>06</span><span>12</span><span>18</span><span>24</span></div>
      </div>`;
  }

  /* ------------------------------------------------------------ editor */
  _newDraft() {
    const preset = (this._config.entities || []).length === 1 ? [...this._config.entities] : [];
    return {
      id: null,
      name: "",
      enabled: true,
      entities: preset,
      days: [0, 1, 2, 3, 4, 5, 6],
      on: { type: "time", time: "19:00", offset: 0 },
      off: { mode: "time", type: "time", time: "23:00", offset: 0, duration: 60 },
      options: { brightness: null, temperature: null, position: null },
      overrides: [],
    };
  }

  _fillSpecs(group) {
    return {
      days: [...(group.days || [])],
      on: { type: "time", time: "19:00", offset: 0, ...(group.on || {}) },
      off: { mode: "time", type: "time", time: "23:00", offset: 0, duration: 60, ...(group.off || {}) },
    };
  }

  _openEditor(timer) {
    if (timer) {
      const d = tcClone(timer);
      this._draft = {
        id: d.id,
        name: d.name || "",
        enabled: d.enabled !== false,
        entities: d.entities || [],
        ...this._fillSpecs({ days: d.days || [0, 1, 2, 3, 4, 5, 6], on: d.on, off: d.off }),
        options: { brightness: null, temperature: null, position: null, ...(d.options || {}) },
        overrides: (d.overrides || []).map((o) => this._fillSpecs(o)),
      };
    } else {
      this._draft = this._newDraft();
    }
    this._view = "edit";
    this._search = "";
    this._confirmDelete = false;
    this._showErrors = false;
    this._customDuration = new Set();
    this._render();
    this.shadowRoot.querySelector(".editor")?.scrollIntoView?.({ block: "nearest" });
  }

  _closeEditor() {
    this._view = "list";
    this._draft = null;
    this._render();
  }

  _validation() {
    const d = this._draft;
    const errors = [];
    if (!d.entities.length) errors.push(this._t("need_device"));
    if (!d.days.length) errors.push(this._t("need_day"));
    if (d.overrides.some((o) => !o.days.length)) errors.push(this._t("need_day_group"));
    return errors;
  }

  _segmented(name, options, value, extraClass = "") {
    return `<div class="segmented ${extraClass}" role="radiogroup">${options.map((o) => `
      <button type="button" role="radio" aria-checked="${o.value === value}" class="${o.value === value ? "selected" : ""}" data-action="set" data-field="${name}" data-value="${tcEsc(o.value)}">
        ${o.icon ? `<ha-icon icon="${o.icon}"></ha-icon>` : ""}<span>${tcEsc(o.label)}</span>
      </button>`).join("")}</div>`;
  }

  _momentEditor(prefix, spec) {
    const type = spec.type || "time";
    const typeSel = this._segmented(`${prefix}.type`, [
      { value: "time", label: this._t("at_time"), icon: "mdi:clock-outline" },
      { value: "sunrise", label: this._t("sunrise"), icon: "mdi:weather-sunset-up" },
      { value: "sunset", label: this._t("sunset"), icon: "mdi:weather-sunset-down" },
    ], type);
    if (type === "time") {
      return `${typeSel}
        <div class="field-row"><input class="time-input" type="time" data-field="${prefix}.time" value="${tcEsc(spec.time)}" required></div>`;
    }
    const offset = parseInt(spec.offset, 10) || 0;
    const dir = offset < 0 ? "before" : offset > 0 ? "after" : "exact";
    return `${typeSel}
      <div class="field-row sun-row">
        <select data-field="${prefix}.dir">
          <option value="exact" ${dir === "exact" ? "selected" : ""}>${tcEsc(this._t("exactly"))}</option>
          <option value="before" ${dir === "before" ? "selected" : ""}>${tcEsc(this._t("before"))}</option>
          <option value="after" ${dir === "after" ? "selected" : ""}>${tcEsc(this._t("after"))}</option>
        </select>
        ${dir === "exact" ? "" : `<input class="num" type="number" min="1" max="720" data-field="${prefix}.offset_abs" value="${Math.abs(offset) || 30}"><span class="unit">${tcEsc(this._t("min"))}</span>`}
        <span class="unit">${tcEsc(this._t(type === "sunrise" ? "sun_sunrise" : "sun_sunset"))}</span>
      </div>`;
  }

  _optionsEditor() {
    const d = this._draft;
    const domains = new Set(d.entities.map(tcDomain));
    const o = d.options;
    let html = "";
    if (domains.has("light")) {
      const on = o.brightness !== null && o.brightness !== undefined;
      html += `<div class="option">
        <label class="check"><input type="checkbox" data-action="opt-toggle" data-opt="brightness" ${on ? "checked" : ""}>${tcEsc(this._t("set_brightness"))}</label>
        ${on ? `<div class="field-row"><input type="range" min="1" max="100" data-field="options.brightness" value="${o.brightness}"><span class="range-val" data-val="brightness">${o.brightness}%</span></div>` : ""}
      </div>`;
    }
    if (domains.has("climate")) {
      const on = o.temperature !== null && o.temperature !== undefined;
      const unit = this._hass?.config?.unit_system?.temperature || "°C";
      html += `<div class="option">
        <label class="check"><input type="checkbox" data-action="opt-toggle" data-opt="temperature" ${on ? "checked" : ""}>${tcEsc(this._t("set_temperature"))}</label>
        ${on ? `<div class="field-row"><input class="num" type="number" step="0.5" data-field="options.temperature" value="${o.temperature}"><span class="unit">${tcEsc(unit)}</span></div>` : ""}
      </div>`;
    }
    if (domains.has("cover")) {
      const on = o.position !== null && o.position !== undefined;
      html += `<div class="option">
        <label class="check"><input type="checkbox" data-action="opt-toggle" data-opt="position" ${on ? "checked" : ""}>${tcEsc(this._t("set_position"))}</label>
        ${on ? `<div class="field-row"><input type="range" min="0" max="100" data-field="options.position" value="${o.position}"><span class="range-val" data-val="position">${o.position}%</span></div>` : ""}
      </div>`;
    }
    return html;
  }

  _devicePicker() {
    const d = this._draft;
    const restricted = Array.isArray(this._config.entities) && this._config.entities.length;
    if (restricted) {
      return `<div class="pick-list">${this._selectableEntities().map((e) => `
        <button type="button" class="pick ${d.entities.includes(e) ? "selected" : ""}" data-action="toggle-entity" data-entity="${tcEsc(e)}">
          <ha-icon icon="${tcEsc(this._entityIcon(e))}"></ha-icon><span>${tcEsc(this._entityName(e))}</span>
          ${d.entities.includes(e) ? `<ha-icon class="tick" icon="mdi:check"></ha-icon>` : ""}
        </button>`).join("")}</div>`;
    }
    const chips = d.entities.map((e) => `
      <span class="chip">
        <ha-icon icon="${tcEsc(this._entityIcon(e))}"></ha-icon><span>${tcEsc(this._entityName(e))}</span>
        <button type="button" class="chip-x" data-action="remove-entity" data-entity="${tcEsc(e)}" aria-label="remove"><ha-icon icon="mdi:close"></ha-icon></button>
      </span>`).join("");
    return `
      ${chips ? `<div class="chips">${chips}</div>` : ""}
      <div class="search">
        <ha-icon icon="mdi:magnify"></ha-icon>
        <input type="search" data-field="search" placeholder="${tcEsc(this._t("search"))}" value="${tcEsc(this._search)}" autocomplete="off">
      </div>
      <div class="results">${this._resultsHTML()}</div>`;
  }

  _resultsHTML() {
    const q = this._search.trim().toLowerCase();
    if (!q) return "";
    const words = q.split(/\s+/);
    const chosen = new Set(this._draft.entities);
    const matches = this._selectableEntities()
      .filter((e) => !chosen.has(e))
      .map((e) => ({ e, name: this._entityName(e) }))
      .filter(({ e, name }) => {
        const hay = `${name} ${e}`.toLowerCase();
        return words.every((w) => hay.includes(w));
      })
      .map((m) => {
        const name = m.name.toLowerCase();
        const rank = name.startsWith(q) ? 0 : name.split(/\s+/).some((w) => w.startsWith(words[0])) ? 1 : 2;
        return { ...m, rank };
      })
      .sort((a, b) => a.rank - b.rank || a.name.localeCompare(b.name))
      .slice(0, 8);
    if (!matches.length) return `<div class="no-results">${tcEsc(this._t("no_results"))}</div>`;
    return matches.map(({ e, name }) => `
      <button type="button" class="result" data-action="add-entity" data-entity="${tcEsc(e)}">
        <ha-icon icon="${tcEsc(this._entityIcon(e))}"></ha-icon>
        <span class="result-name">${tcEsc(name)}</span>
        <span class="result-id">${tcEsc(e)}</span>
      </button>`).join("");
  }

  _offEditor(prefix, group, verbs) {
    if (!verbs.hasOff) return `<div class="hint">${tcEsc(this._t("only_on"))}</div>`;
    const mode = group.off.mode;
    return `${this._segmented(`${prefix}.mode`, [
        { value: "time", label: this._t("off_at_time"), icon: "mdi:clock-outline" },
        { value: "duration", label: this._t("off_after"), icon: "mdi:timer-sand" },
        { value: "none", label: this._t("off_none", { verb: this._verb(verbs.off).toLowerCase() }), icon: "mdi:cancel" },
      ], mode, "wrap")}
      ${mode === "time" ? `<div class="sub-block">${this._momentEditor(prefix, group.off)}<div class="next-day-note" data-val="next-day" data-group="${prefix}">${this._nextDayNote(group)}</div></div>` : ""}
      ${mode === "duration" ? this._durationEditor(prefix, group.off) : ""}`;
  }

  /** Day buttons for the main times (gi = -1) or "other times" number gi. */
  _dayToggles(gi) {
    const d = this._draft;
    const names = this._dayNames("short");
    const lists = [d.days, ...d.overrides.map((o) => o.days)];
    const own = new Set(lists[gi + 1]);
    const elsewhere = new Set(lists.filter((_, i) => i !== gi + 1).flat());
    return `<div class="day-toggles">${names.map((n, i) => {
      const cls = own.has(i) ? "selected" : elsewhere.has(i) ? "elsewhere" : "";
      return `<button type="button" class="day ${cls}" aria-pressed="${own.has(i)}" data-action="day" data-group="${gi}" data-day="${i}">${tcEsc(n)}</button>`;
    }).join("")}</div>`;
  }

  _overrideBlock(o, i, verbs) {
    return `
      <div class="override">
        <div class="override-head">
          <ha-icon icon="mdi:calendar-clock"></ha-icon>
          <span>${tcEsc(this._t("other_times"))}${o.days.length ? ` · ${tcEsc(this._daysLabel(o.days))}` : ""}</span>
          <span class="spacer"></span>
          <button type="button" class="icon-btn" data-action="remove-override" data-index="${i}" aria-label="${tcEsc(this._t("remove"))}" title="${tcEsc(this._t("remove"))}"><ha-icon icon="mdi:delete-outline"></ha-icon></button>
        </div>
        <div class="label">${tcEsc(this._t("other_days"))}</div>
        ${this._dayToggles(i)}
        <div class="sub-title on"><ha-icon icon="mdi:power"></ha-icon>${tcEsc(this._verb(verbs.on))}</div>
        ${this._momentEditor(`overrides.${i}.on`, o.on)}
        ${verbs.hasOff ? `
          <div class="sub-title off"><ha-icon icon="mdi:power-off"></ha-icon>${tcEsc(this._verb(verbs.off))}</div>
          ${this._offEditor(`overrides.${i}.off`, o, verbs)}` : ""}
      </div>`;
  }

  _renderEditor() {
    const d = this._draft;
    const verbs = this._verbsFor(d.entities);
    const errors = this._validation();
    const dayKey = [...d.days].sort().join(",");
    const perDay = d.overrides.length > 0;
    const badge = perDay ? `<span class="badge">${tcEsc(d.days.length ? this._daysLabel(d.days) : "…")}</span>` : "";

    this.shadowRoot.innerHTML = `
      <style>${TC_STYLES}</style>
      <ha-card>
        <div class="editor">
          <div class="editor-head">
            <button class="icon-btn" data-action="cancel" aria-label="${tcEsc(this._t("cancel"))}"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
            <div class="title">${tcEsc(this._t(d.id ? "edit_timer" : "new_timer"))}</div>
          </div>

          <section class="step">
            <div class="step-title"><span class="num"><ha-icon icon="mdi:devices"></ha-icon></span>${tcEsc(this._t("step_devices"))}</div>
            ${this._devicePicker()}
          </section>

          <section class="step step-on">
            <div class="step-title"><span class="num on"><ha-icon icon="mdi:power"></ha-icon></span>${tcEsc(this._verb(verbs.on))}${badge}</div>
            ${this._momentEditor("on", d.on)}
            ${this._optionsEditor()}
          </section>

          <section class="step step-off">
            <div class="step-title"><span class="num off"><ha-icon icon="mdi:power-off"></ha-icon></span>${tcEsc(this._verb(verbs.off))}${verbs.hasOff ? badge : ""}</div>
            ${this._offEditor("off", d, verbs)}
          </section>

          <section class="step">
            <div class="step-title"><span class="num"><ha-icon icon="mdi:calendar-week"></ha-icon></span>${tcEsc(this._t("step_days"))}</div>
            ${perDay ? `<div class="label">${tcEsc(this._t("main_days"))}</div>` : `
            <div class="presets">
              <button type="button" class="preset ${dayKey === "0,1,2,3,4,5,6" ? "selected" : ""}" data-action="days" data-days="0,1,2,3,4,5,6">${tcEsc(this._t("every_day"))}</button>
              <button type="button" class="preset ${dayKey === "0,1,2,3,4" ? "selected" : ""}" data-action="days" data-days="0,1,2,3,4">${tcEsc(this._t("weekdays"))}</button>
              <button type="button" class="preset ${dayKey === "5,6" ? "selected" : ""}" data-action="days" data-days="5,6">${tcEsc(this._t("weekend"))}</button>
            </div>`}
            ${this._dayToggles(-1)}

            <label class="per-day-row">
              <span class="per-day-text">
                <span>${tcEsc(this._t("per_day"))}</span>
                <span class="muted small">${tcEsc(this._t("per_day_hint"))}</span>
              </span>
              <span class="toggle"><input type="checkbox" data-action="per-day" ${perDay ? "checked" : ""}><span class="slider"></span></span>
            </label>

            ${perDay ? `
              ${d.overrides.map((o, i) => this._overrideBlock(o, i, verbs)).join("")}
              <button type="button" class="text-btn add-override" data-action="add-override"><ha-icon icon="mdi:plus"></ha-icon>${tcEsc(this._t("add_other"))}</button>` : ""}
          </section>

          <section class="step">
            <div class="step-title"><span class="num"><ha-icon icon="mdi:tag-outline"></ha-icon></span>${tcEsc(this._t("step_name"))} <span class="muted">(${tcEsc(this._t("name_optional"))})</span></div>
            <input class="text-input" type="text" maxlength="100" data-field="name" value="${tcEsc(d.name)}" placeholder="${tcEsc(this._autoName(d.entities))}">
          </section>

          <div class="summary">
            <ha-icon icon="mdi:text-box-check-outline"></ha-icon>
            <div><div class="summary-title">${tcEsc(this._t("summary_title"))}</div><div class="summary-text" data-val="summary">${this._summary(this._draftAsTimer())}</div></div>
          </div>

          ${this._showErrors && errors.length ? `<div class="errors">${errors.map((e) => `<div>${tcEsc(e)}</div>`).join("")}</div>` : ""}

          ${d.id ? `
            <div class="try">
              <span>${tcEsc(this._t("try_now"))}</span>
              <button type="button" class="small-btn on" data-action="run" data-event="on"><ha-icon icon="mdi:power"></ha-icon>${tcEsc(this._verb(verbs.on))}</button>
              ${verbs.hasOff ? `<button type="button" class="small-btn off" data-action="run" data-event="off"><ha-icon icon="mdi:power-off"></ha-icon>${tcEsc(this._verb(verbs.off))}</button>` : ""}
            </div>` : ""}

          <div class="actions">
            ${d.id ? `<button type="button" class="text-btn danger ${this._confirmDelete ? "confirm" : ""}" data-action="delete"><ha-icon icon="mdi:delete-outline"></ha-icon>${tcEsc(this._t(this._confirmDelete ? "confirm_delete" : "delete"))}</button>` : ""}
            <span class="spacer"></span>
            <button type="button" class="text-btn" data-action="cancel">${tcEsc(this._t("cancel"))}</button>
            <button type="button" class="primary-btn" data-action="save" ${this._saving ? "disabled" : ""}><ha-icon icon="mdi:check"></ha-icon><span>${tcEsc(this._t("save"))}</span></button>
          </div>
        </div>
      </ha-card>`;
  }

  _durationEditor(prefix, off) {
    const dur = parseInt(off.duration, 10) || 60;
    const isPreset = TC_DURATION_PRESETS.includes(dur) && !this._customDuration?.has(prefix);
    return `<div class="sub-block">
      <div class="label">${tcEsc(this._t("for_how_long"))}</div>
      <div class="presets">
        ${TC_DURATION_PRESETS.map((m) => `<button type="button" class="preset ${isPreset && m === dur ? "selected" : ""}" data-action="duration" data-prefix="${prefix}" data-min="${m}">${tcEsc(this._fmtDuration(m))}</button>`).join("")}
        <button type="button" class="preset ${isPreset ? "" : "selected"}" data-action="duration-custom" data-prefix="${prefix}">${tcEsc(this._t("custom"))}</button>
      </div>
      ${isPreset ? "" : `<div class="field-row">
        <input class="num" type="number" min="0" max="24" data-field="${prefix}.dur_h" value="${Math.floor(dur / 60)}"><span class="unit">${tcEsc(this._t("hour"))}</span>
        <input class="num" type="number" min="0" max="59" data-field="${prefix}.dur_m" value="${dur % 60}"><span class="unit">${tcEsc(this._t("min"))}</span>
      </div>`}
    </div>`;
  }

  _nextDayNote(group) {
    if ((group.on.type || "time") !== "time" || (group.off.type || "time") !== "time") return "";
    if (tcMinutes(group.off.time) > tcMinutes(group.on.time)) return "";
    return `<ha-icon icon="mdi:weather-night"></ha-icon>${tcEsc(this._t("next_day"))}`;
  }

  _draftAsTimer() {
    const d = this._draft;
    const verbs = this._verbsFor(d.entities);
    const off = (spec) => (verbs.hasOff ? spec : { mode: "none" });
    return { ...d, off: off(d.off), overrides: d.overrides.map((o) => ({ ...o, off: off(o.off) })) };
  }

  _resolve(path) {
    if (!path) return this._draft;
    return path.split(".").reduce((obj, key) => (obj == null ? undefined : obj[key]), this._draft);
  }

  _refreshLive() {
    const root = this.shadowRoot;
    const summary = root.querySelector('[data-val="summary"]');
    if (summary) summary.innerHTML = this._summary(this._draftAsTimer());
    root.querySelectorAll('[data-val="next-day"]').forEach((note) => {
      const group = this._resolve(note.dataset.group.replace(/\.?off$/, ""));
      if (group) note.innerHTML = this._nextDayNote(group);
    });
    ["brightness", "position"].forEach((k) => {
      const el = root.querySelector(`[data-val="${k}"]`);
      if (el) el.textContent = `${this._draft.options[k]}%`;
    });
  }

  _setField(field, value) {
    const d = this._draft;
    if (field === "name") { d.name = value; return; }
    if (field === "search") { this._search = value; return; }
    const parts = field.split(".");
    const key = parts.pop();
    if (parts[0] === "options") {
      d.options[key] = value === "" ? null : Number(value);
      return;
    }
    const prefix = parts.join(".");
    const spec = this._resolve(prefix);
    if (!spec) return;
    if (key === "type") {
      spec.type = value;
      spec.offset = value === "time" ? 0 : spec.offset || 0;
    } else if (key === "time") spec.time = value || spec.time;
    else if (key === "dir") {
      const abs = Math.abs(parseInt(spec.offset, 10) || 0) || 30;
      spec.offset = value === "exact" ? 0 : value === "before" ? -abs : abs;
    } else if (key === "offset_abs") {
      const abs = Math.min(720, Math.max(1, parseInt(value, 10) || 1));
      spec.offset = (parseInt(spec.offset, 10) || 0) < 0 ? -abs : abs;
    } else if (key === "mode") spec.mode = value;
    else if (key === "dur_h" || key === "dur_m") {
      const root = this.shadowRoot;
      const h = parseInt(root.querySelector(`[data-field="${prefix}.dur_h"]`)?.value, 10) || 0;
      const m = parseInt(root.querySelector(`[data-field="${prefix}.dur_m"]`)?.value, 10) || 0;
      spec.duration = Math.min(1440, Math.max(1, h * 60 + m));
    }
  }

  /** Switch "different times on some days" on or off. */
  _setPerDay(on) {
    const d = this._draft;
    if (on) {
      // Most people want other times in the weekend: start with that.
      const weekend = [5, 6];
      d.days = d.days.filter((x) => !weekend.includes(x));
      if (!d.days.length) d.days = [0, 1, 2, 3, 4];
      d.overrides = [{ days: weekend, on: tcClone(d.on), off: tcClone(d.off) }];
    } else {
      // Back to one set of times: those days use the main times again.
      d.days = [...new Set([...d.days, ...d.overrides.flatMap((o) => o.days)])].sort((a, b) => a - b);
      d.overrides = [];
    }
    this._renderEditor();
  }

  /** Tap a day in a group: select it there (taking it from another group) or unselect it. */
  _toggleDay(gi, day) {
    const d = this._draft;
    const lists = [d.days, ...d.overrides.map((o) => o.days)];
    const idx = gi + 1;
    if (lists[idx].includes(day)) {
      lists[idx] = lists[idx].filter((x) => x !== day);
    } else {
      for (let i = 0; i < lists.length; i += 1) if (i !== idx) lists[i] = lists[i].filter((x) => x !== day);
      lists[idx] = [...lists[idx], day].sort((a, b) => a - b);
    }
    d.days = lists[0];
    d.overrides.forEach((o, i) => { o.days = lists[i + 1]; });
  }

  _onInput(ev) {
    const field = ev.target?.dataset?.field;
    if (!field || this._view !== "edit") return;
    this._setField(field, ev.target.value);
    if (field === "search") {
      const results = this.shadowRoot.querySelector(".results");
      if (results) results.innerHTML = this._resultsHTML();
      return;
    }
    this._refreshLive();
  }

  _onChange(ev) {
    const target = ev.target;
    if (target?.dataset?.action === "toggle") {
      ev.stopPropagation();
      this._toggleTimer(target.dataset.id, target.checked);
      return;
    }
    if (target?.dataset?.action === "per-day") {
      this._setPerDay(target.checked);
      return;
    }
    if (target?.dataset?.action === "opt-toggle") {
      const key = target.dataset.opt;
      const defaults = { brightness: 100, temperature: 20, position: 100 };
      this._draft.options[key] = target.checked ? defaults[key] : null;
      this._renderEditor();
      return;
    }
    const field = target?.dataset?.field;
    // "search" is handled on input; a late change event (fired when the old
    // input is removed by a re-render) must not bring back stale text.
    if (!field || field === "search" || this._view !== "edit" || !target.isConnected) return;
    this._setField(field, target.value);
    // Selects change the layout (e.g. the minutes field appears).
    if (field.endsWith(".dir")) this._renderEditor();
    else this._refreshLive();
  }

  _onKeyDown(ev) {
    const target = ev.target;
    if (target?.dataset?.field === "search" && ev.key === "Enter") {
      ev.preventDefault();
      const first = this.shadowRoot.querySelector(".result");
      if (first) this._addEntity(first.dataset.entity);
      return;
    }
    if ((ev.key === "Enter" || ev.key === " ") && target?.classList?.contains("timer")) {
      ev.preventDefault();
      const timer = (this._timers || []).find((t) => t.id === target.dataset.id);
      if (timer) this._openEditor(timer);
    }
  }

  _addEntity(entityId) {
    if (!this._draft.entities.includes(entityId)) this._draft.entities.push(entityId);
    this._search = "";
    this._renderEditor();
    this.shadowRoot.querySelector('[data-field="search"]')?.focus();
  }

  _onClick(ev) {
    const path = ev.composedPath();
    if (path.some((el) => el?.dataset && "stop" in el.dataset)) return;
    const el = path.find((n) => n?.dataset?.action);
    if (!el) return;
    const action = el.dataset.action;
    const d = this._draft;

    switch (action) {
      case "new":
        this._openEditor(null);
        break;
      case "edit": {
        const timer = (this._timers || []).find((t) => t.id === el.dataset.id);
        if (timer) this._openEditor(timer);
        break;
      }
      case "cancel":
        this._closeEditor();
        break;
      case "set":
        this._setField(el.dataset.field, el.dataset.value);
        this._renderEditor();
        break;
      case "add-entity":
        this._addEntity(el.dataset.entity);
        break;
      case "remove-entity":
        d.entities = d.entities.filter((e) => e !== el.dataset.entity);
        this._renderEditor();
        break;
      case "toggle-entity": {
        const e = el.dataset.entity;
        d.entities = d.entities.includes(e) ? d.entities.filter((x) => x !== e) : [...d.entities, e];
        this._renderEditor();
        break;
      }
      case "day":
        this._toggleDay(parseInt(el.dataset.group ?? "-1", 10), parseInt(el.dataset.day, 10));
        this._renderEditor();
        break;
      case "days":
        d.days = el.dataset.days.split(",").map(Number);
        this._renderEditor();
        break;
      case "add-override":
        d.overrides.push({ days: [], on: tcClone(d.on), off: tcClone(d.off) });
        this._renderEditor();
        break;
      case "remove-override": {
        const [removed] = d.overrides.splice(parseInt(el.dataset.index, 10), 1);
        // Those days go back to the main times.
        d.days = [...new Set([...d.days, ...(removed?.days || [])])].sort((a, b) => a - b);
        this._renderEditor();
        break;
      }
      case "duration": {
        this._customDuration.delete(el.dataset.prefix);
        const spec = this._resolve(el.dataset.prefix);
        if (spec) spec.duration = parseInt(el.dataset.min, 10);
        this._renderEditor();
        break;
      }
      case "duration-custom":
        this._customDuration.add(el.dataset.prefix);
        this._renderEditor();
        break;
      case "save":
        this._save();
        break;
      case "delete":
        if (!this._confirmDelete) {
          this._confirmDelete = true;
          this._renderEditor();
          clearTimeout(this._confirmTimer);
          this._confirmTimer = setTimeout(() => {
            if (this._confirmDelete && this._view === "edit") {
              this._confirmDelete = false;
              this._renderEditor();
            }
          }, 4000);
        } else {
          this._delete();
        }
        break;
      case "run":
        this._run(el.dataset.event);
        break;
      default:
        break;
    }
  }

  _toast(message) {
    this.dispatchEvent(new CustomEvent("hass-notification", {
      detail: { message }, bubbles: true, composed: true,
    }));
  }

  _payload() {
    const d = this._draft;
    const verbs = this._verbsFor(d.entities);
    const clean = (spec) => {
      const out = { type: spec.type || "time", time: spec.time || "00:00", offset: parseInt(spec.offset, 10) || 0 };
      if (out.type === "time") out.offset = 0;
      return out;
    };
    const cleanOff = (off) => (verbs.hasOff && off.mode !== "none"
      ? { mode: off.mode, ...clean(off), duration: Math.max(1, parseInt(off.duration, 10) || 60) }
      : { mode: "none" });
    const options = {};
    const domains = new Set(d.entities.map(tcDomain));
    if (domains.has("light") && d.options.brightness != null) options.brightness = Number(d.options.brightness);
    if (domains.has("climate") && d.options.temperature != null) options.temperature = Number(d.options.temperature);
    if (domains.has("cover") && d.options.position != null) options.position = Number(d.options.position);
    return {
      name: (d.name || "").trim() || this._autoName(d.entities),
      enabled: d.enabled,
      entities: d.entities,
      days: [...d.days].sort((a, b) => a - b),
      on: clean(d.on),
      off: cleanOff(d.off),
      options,
      overrides: d.overrides.map((o) => ({
        days: [...o.days].sort((a, b) => a - b),
        on: clean(o.on),
        off: cleanOff(o.off),
      })),
    };
  }

  async _save() {
    if (this._validation().length) {
      this._showErrors = true;
      this._renderEditor();
      return;
    }
    this._saving = true;
    try {
      const payload = this._payload();
      if (this._draft.id) {
        await this._hass.callWS({ type: "timercard/update", timer_id: this._draft.id, ...payload });
      } else {
        await this._hass.callWS({ type: "timercard/create", ...payload });
      }
      this._toast(this._t("saved"));
      this._saving = false;
      this._closeEditor();
    } catch (err) {
      this._saving = false;
      this._toast(this._t("error", { msg: err?.message || err }));
      this._renderEditor();
    }
  }

  async _delete() {
    try {
      await this._hass.callWS({ type: "timercard/delete", timer_id: this._draft.id });
      this._toast(this._t("deleted"));
      this._closeEditor();
    } catch (err) {
      this._toast(this._t("error", { msg: err?.message || err }));
    }
  }

  async _run(event) {
    try {
      await this._hass.callWS({ type: "timercard/run", timer_id: this._draft.id, event });
    } catch (err) {
      this._toast(this._t("error", { msg: err?.message || err }));
    }
  }

  async _toggleTimer(id, enabled) {
    try {
      await this._hass.callWS({ type: "timercard/update", timer_id: id, enabled });
    } catch (err) {
      this._toast(this._t("error", { msg: err?.message || err }));
      this._render();
    }
  }
}

const TC_STYLES = `
  :host {
    --tc-on: var(--timercard-on-color, #2e9d4f);
    --tc-off: var(--timercard-off-color, #d9534f);
    --tc-accent: var(--primary-color, #03a9f4);
    --tc-text: var(--primary-text-color, #212121);
    --tc-muted: var(--secondary-text-color, #727272);
    --tc-line: var(--divider-color, rgba(0,0,0,.12));
    --tc-soft: var(--secondary-background-color, #f3f3f3);
    --tc-card: var(--card-background-color, var(--ha-card-background, #fff));
    --tc-radius: 12px;
    display: block;
  }
  * { box-sizing: border-box; }
  ha-card { overflow: hidden; color: var(--tc-text); }
  ha-icon { --mdc-icon-size: 18px; flex: none; }
  button { font: inherit; color: inherit; cursor: pointer; }
  input, select { font: inherit; color: var(--tc-text); }

  .header { display: flex; align-items: center; gap: 12px; padding: 16px 16px 8px; }
  .title { flex: 1; font-size: 1.25rem; font-weight: 500; line-height: 1.3; min-width: 0; }
  .list { display: flex; flex-direction: column; gap: 12px; padding: 8px 16px 16px; }

  .primary-btn {
    display: inline-flex; align-items: center; gap: 6px; border: none; border-radius: 999px;
    background: var(--tc-accent); color: var(--text-primary-color, #fff);
    padding: 8px 16px 8px 12px; font-weight: 500; white-space: nowrap; min-height: 36px;
  }
  .primary-btn:disabled { opacity: .5; cursor: default; }
  .text-btn {
    display: inline-flex; align-items: center; gap: 6px; border: none; background: none;
    padding: 8px 12px; border-radius: 999px; font-weight: 500; color: var(--tc-accent); min-height: 36px;
  }
  .text-btn:hover { background: color-mix(in srgb, var(--tc-accent) 10%, transparent); }
  .text-btn.danger { color: var(--tc-off); }
  .text-btn.danger:hover, .text-btn.danger.confirm { background: color-mix(in srgb, var(--tc-off) 12%, transparent); }
  .icon-btn { border: none; background: none; padding: 6px; border-radius: 50%; display: inline-flex; }
  .icon-btn:hover { background: var(--tc-soft); }
  .icon-btn ha-icon { --mdc-icon-size: 22px; }

  .notice, .empty { padding: 24px 8px; text-align: center; color: var(--tc-muted); line-height: 1.5; }
  .empty ha-icon { --mdc-icon-size: 48px; display: block; margin: 0 auto 8px; opacity: .6; }

  /* ---- timer tile ---- */
  .timer {
    border: 1px solid var(--tc-line); border-radius: var(--tc-radius); padding: 12px 14px;
    display: flex; flex-direction: column; gap: 10px; cursor: pointer; transition: border-color .15s, box-shadow .15s;
    background: var(--tc-card); outline: none;
  }
  .timer:hover, .timer:focus-visible { border-color: var(--tc-accent); box-shadow: 0 0 0 1px var(--tc-accent) inset; }
  .timer.active { border-color: color-mix(in srgb, var(--tc-on) 60%, var(--tc-line)); }
  .timer.paused .events, .timer.paused .bar, .timer.paused .devices, .timer.paused .daypills { opacity: .45; }
  .timer-top { display: flex; align-items: center; gap: 12px; }
  .timer-name { flex: 1; font-weight: 500; font-size: 1.05rem; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .devices { display: flex; flex-wrap: wrap; gap: 6px; }
  .device {
    display: inline-flex; align-items: center; gap: 4px; font-size: .85rem; color: var(--tc-muted);
    background: var(--tc-soft); border-radius: 999px; padding: 2px 10px 2px 6px; max-width: 100%;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .device ha-icon { --mdc-icon-size: 16px; }
  .device.is-on ha-icon { color: var(--state-active-color, var(--state-icon-active-color, #fdd835)); }

  .events { display: flex; align-items: stretch; gap: 8px; }
  .event {
    flex: 1; min-width: 0; border-radius: 10px; padding: 8px 10px;
    border-left: 4px solid; display: flex; flex-direction: column; gap: 2px;
  }
  .event.on { border-color: var(--tc-on); background: color-mix(in srgb, var(--tc-on) 10%, transparent); }
  .event.off { border-color: var(--tc-off); background: color-mix(in srgb, var(--tc-off) 10%, transparent); }
  .event-label { display: flex; align-items: center; gap: 4px; font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
  .event.on .event-label { color: var(--tc-on); }
  .event.off .event-label { color: var(--tc-off); }
  .event-label ha-icon { --mdc-icon-size: 15px; }
  .event-time { font-size: 1.5rem; font-weight: 500; line-height: 1.15; font-variant-numeric: tabular-nums; }
  .event-sub { font-size: .78rem; color: var(--tc-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .arrow { align-self: center; color: var(--tc-muted); --mdc-icon-size: 20px; }

  .bar .track { position: relative; height: 8px; border-radius: 4px; background: var(--tc-soft); overflow: hidden; }
  .bar .seg { position: absolute; top: 0; bottom: 0; background: var(--tc-on); border-radius: 4px; opacity: .85; }
  .bar .mark { position: absolute; top: 0; bottom: 0; width: 4px; margin-left: -2px; background: var(--tc-on); border-radius: 2px; }
  .bar .now { position: absolute; top: -2px; bottom: -2px; width: 2px; margin-left: -1px; background: var(--tc-text); opacity: .55; }
  .bar .ticks { display: flex; justify-content: space-between; font-size: .65rem; color: var(--tc-muted); margin-top: 2px; font-variant-numeric: tabular-nums; }

  .timer-bottom { display: flex; align-items: center; gap: 8px; }
  .daypills { display: flex; gap: 4px; flex: 1; flex-wrap: wrap; }
  .daypills span {
    width: 24px; height: 24px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center;
    font-size: .72rem; font-weight: 600; color: var(--tc-muted); background: var(--tc-soft); text-transform: uppercase;
  }
  .daypills span.on { background: var(--tc-accent); color: var(--text-primary-color, #fff); }
  .edit-icon { color: var(--tc-muted); }
  .status { display: flex; align-items: center; gap: 6px; font-size: .85rem; color: var(--tc-muted); border-top: 1px solid var(--tc-line); padding-top: 8px; }
  .status ha-icon { --mdc-icon-size: 16px; }
  .timer.active .status { color: var(--tc-on); font-weight: 500; }

  /* toggle */
  .toggle { position: relative; width: 40px; height: 22px; flex: none; cursor: pointer; }
  .toggle input { opacity: 0; width: 100%; height: 100%; margin: 0; position: absolute; cursor: pointer; z-index: 1; }
  .toggle .slider { position: absolute; inset: 0; border-radius: 999px; background: var(--switch-unchecked-track-color, #9e9e9e); opacity: .6; transition: background .15s; }
  .toggle .slider::after {
    content: ""; position: absolute; width: 18px; height: 18px; top: 2px; left: 2px; border-radius: 50%;
    background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.3); transition: transform .15s;
  }
  .toggle input:checked + .slider { background: var(--switch-checked-track-color, var(--tc-accent)); opacity: 1; }
  .toggle input:checked + .slider::after { transform: translateX(18px); }
  .toggle input:focus-visible + .slider { outline: 2px solid var(--tc-accent); outline-offset: 2px; }

  /* ---- editor ---- */
  .editor { padding: 8px 16px 16px; display: flex; flex-direction: column; gap: 12px; }
  .editor-head { display: flex; align-items: center; gap: 8px; margin-left: -6px; }
  .step { border: 1px solid var(--tc-line); border-radius: var(--tc-radius); padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .step-on { border-left: 4px solid var(--tc-on); }
  .step-off { border-left: 4px solid var(--tc-off); }
  .step-title { display: flex; align-items: center; gap: 8px; font-weight: 500; }
  .step-title .num {
    width: 26px; height: 26px; border-radius: 50%; flex: none; display: inline-flex; align-items: center; justify-content: center;
    background: var(--tc-soft); font-size: .85rem; font-weight: 600;
  }
  .step-title .num ha-icon { --mdc-icon-size: 16px; }
  .step-title .num.on { background: var(--tc-on); color: #fff; }
  .step-title .num.off { background: var(--tc-off); color: #fff; }
  .muted { color: var(--tc-muted); font-weight: 400; font-size: .9em; }
  .hint { color: var(--tc-muted); font-size: .9rem; }
  .label { font-size: .9rem; color: var(--tc-muted); }
  .sub-block { display: flex; flex-direction: column; gap: 10px; padding-top: 2px; }

  .segmented { display: flex; gap: 6px; flex-wrap: wrap; }
  .segmented button, .preset, .day, .pick {
    border: 1px solid var(--tc-line); background: var(--tc-card); border-radius: 999px; padding: 6px 12px;
    display: inline-flex; align-items: center; gap: 6px; min-height: 36px; font-size: .9rem;
  }
  .segmented button:hover, .preset:hover, .day:hover, .pick:hover { border-color: var(--tc-accent); }
  .segmented button.selected, .preset.selected, .day.selected, .pick.selected {
    background: color-mix(in srgb, var(--tc-accent) 16%, transparent); border-color: var(--tc-accent); color: var(--tc-text); font-weight: 500;
  }
  .segmented ha-icon { --mdc-icon-size: 16px; }
  .presets { display: flex; gap: 6px; flex-wrap: wrap; }
  .day-toggles { display: flex; gap: 6px; flex-wrap: wrap; }
  .day { width: 44px; justify-content: center; padding: 6px 0; text-transform: capitalize; }

  .field-row { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .time-input {
    font-size: 1.6rem; font-variant-numeric: tabular-nums; padding: 6px 10px; border-radius: 10px;
    border: 1px solid var(--tc-line); background: var(--tc-soft); color: var(--tc-text); min-width: 140px;
  }
  .time-input::-webkit-calendar-picker-indicator { filter: var(--timercard-picker-filter, none); }
  .num { width: 76px; padding: 6px 8px; border-radius: 8px; border: 1px solid var(--tc-line); background: var(--tc-soft); }
  select { padding: 7px 8px; border-radius: 8px; border: 1px solid var(--tc-line); background: var(--tc-soft); }
  .unit { color: var(--tc-muted); }
  .text-input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--tc-line); background: var(--tc-soft); }
  input:focus-visible, select:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 1px; }
  input[type=range] { flex: 1; min-width: 120px; accent-color: var(--tc-on); }
  .range-val { min-width: 44px; text-align: right; font-variant-numeric: tabular-nums; }
  .next-day-note { display: flex; align-items: center; gap: 6px; color: var(--tc-muted); font-size: .85rem; }
  .next-day-note:empty { display: none; }
  .option { display: flex; flex-direction: column; gap: 6px; border-top: 1px dashed var(--tc-line); padding-top: 10px; }
  .check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; }
  .check input { width: 18px; height: 18px; accent-color: var(--tc-accent); }

  .chips { display: flex; flex-wrap: wrap; gap: 6px; }
  .chip {
    display: inline-flex; align-items: center; gap: 6px; padding: 4px 4px 4px 10px; border-radius: 999px;
    background: color-mix(in srgb, var(--tc-accent) 16%, transparent); font-size: .9rem; max-width: 100%;
  }
  .chip > span { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chip-x { border: none; background: none; padding: 2px; border-radius: 50%; display: inline-flex; }
  .chip-x:hover { background: color-mix(in srgb, var(--tc-text) 12%, transparent); }
  .chip-x ha-icon { --mdc-icon-size: 16px; }
  .search {
    display: flex; align-items: center; gap: 8px; border: 1px solid var(--tc-line); border-radius: 10px;
    padding: 0 10px; background: var(--tc-soft);
  }
  .search ha-icon { color: var(--tc-muted); }
  .search input { flex: 1; border: none; background: none; padding: 10px 0; outline: none; min-width: 0; }
  .results { display: flex; flex-direction: column; }
  .results:empty { display: none; }
  .result {
    display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto; column-gap: 10px; align-items: center;
    text-align: left; border: none; background: none; padding: 8px; border-radius: 8px;
  }
  .result:hover { background: var(--tc-soft); }
  .result ha-icon { grid-row: span 2; color: var(--tc-muted); }
  .result-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .result-id { font-size: .75rem; color: var(--tc-muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .no-results { color: var(--tc-muted); padding: 8px; font-size: .9rem; }
  .pick-list { display: flex; flex-wrap: wrap; gap: 6px; }
  .pick .tick { --mdc-icon-size: 16px; color: var(--tc-accent); }

  .groups { display: flex; flex-direction: column; gap: 6px; }
  .group-label { display: flex; align-items: center; gap: 4px; font-size: .8rem; font-weight: 500; color: var(--tc-muted); margin-top: 2px; }
  .group-label ha-icon { --mdc-icon-size: 14px; }
  .badge {
    margin-left: auto; font-size: .78rem; font-weight: 500; padding: 2px 10px; border-radius: 999px;
    background: var(--tc-soft); color: var(--tc-muted); white-space: nowrap;
  }
  .day.elsewhere { border-style: dashed; color: var(--tc-muted); opacity: .7; }
  .per-day-row {
    display: flex; align-items: center; gap: 12px; cursor: pointer;
    border-top: 1px dashed var(--tc-line); padding-top: 10px; margin-top: 2px;
  }
  .per-day-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
  .small { font-size: .8rem; }
  .override {
    display: flex; flex-direction: column; gap: 10px; padding: 12px; border-radius: 10px;
    border: 1px solid var(--tc-line); background: color-mix(in srgb, var(--tc-soft) 50%, transparent);
  }
  .override-head { display: flex; align-items: center; gap: 8px; font-weight: 500; margin: -4px -6px -4px 0; }
  .override-head ha-icon { color: var(--tc-accent); }
  .sub-title { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: .9rem; padding-top: 4px; }
  .sub-title ha-icon { --mdc-icon-size: 16px; }
  .sub-title.on { color: var(--tc-on); }
  .sub-title.off { color: var(--tc-off); border-top: 1px dashed var(--tc-line); padding-top: 10px; }
  .add-override { align-self: flex-start; }
  .summary ul { margin: 4px 0 0; padding-left: 18px; }
  .summary {
    display: flex; gap: 10px; align-items: flex-start; padding: 12px; border-radius: var(--tc-radius);
    background: color-mix(in srgb, var(--tc-accent) 9%, transparent); line-height: 1.45;
  }
  .summary > ha-icon { color: var(--tc-accent); --mdc-icon-size: 22px; margin-top: 1px; }
  .summary-title { font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; color: var(--tc-muted); }
  .errors { color: var(--tc-off); font-size: .9rem; }
  .try { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; font-size: .9rem; color: var(--tc-muted); }
  .small-btn { display: inline-flex; align-items: center; gap: 4px; border-radius: 999px; padding: 4px 12px; border: 1px solid; background: none; font-size: .85rem; min-height: 32px; }
  .small-btn ha-icon { --mdc-icon-size: 15px; }
  .small-btn.on { color: var(--tc-on); border-color: var(--tc-on); }
  .small-btn.off { color: var(--tc-off); border-color: var(--tc-off); }
  .actions { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
  .spacer { flex: 1; }

  @media (max-width: 420px) {
    .event-time { font-size: 1.3rem; }
    .day { width: 40px; }
  }
`;

/* --------------------------------------------------------------------------
 * Visual card editor (shown when the card is added through the UI)
 * ------------------------------------------------------------------------ */
class TimercardCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = { ...(config || {}) };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    if (this._form) this._form.hass = hass;
    else this._render();
  }

  _render() {
    if (!this._hass || !this._config) return;
    const nl = (this._hass.locale?.language || "").startsWith("nl");
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: nl ? "Titel" : "Title",
        entities: nl
          ? "Alleen deze apparaten (leeg = alle apparaten)"
          : "Only these devices (empty = all devices)",
      })[s.name];
      this._form.addEventListener("value-changed", (ev) => {
        const value = { ...ev.detail.value };
        if (!value.title) delete value.title;
        if (!value.entities || !value.entities.length) delete value.entities;
        this._config = { ...value, type: this._config.type };
        this.dispatchEvent(new CustomEvent("config-changed", {
          detail: { config: this._config }, bubbles: true, composed: true,
        }));
      });
      this.appendChild(this._form);
    }
    this._form.hass = this._hass;
    this._form.data = this._config;
    this._form.schema = [
      { name: "title", selector: { text: {} } },
      {
        name: "entities",
        selector: { entity: { multiple: true, filter: [{ domain: Object.keys(TC_DOMAINS) }] } },
      },
    ];
  }
}

const tcRegister = () => {
  if (customElements.get("timercard-card")) return;
  customElements.define("timercard-card", TimercardCard);
  customElements.define("timercard-card-editor", TimercardCardEditor);
  window.customCards = window.customCards || [];
  if (!window.customCards.some((c) => c.type === "timercard-card")) {
    window.customCards.push({
      type: "timercard-card",
      name: "Timercard",
      description: "Easy timers: turn devices on and off at set times, with both moments in one timer.",
      preview: false,
      documentationURL: "https://github.com/just2701/timercard-ha",
    });
  }
  console.info(`%c TIMERCARD %c ${TC_VERSION} `, "background:#2e9d4f;color:#fff;font-weight:600", "background:#444;color:#fff");
};

/*
 * The integration loads this file very early, possibly before Home Assistant
 * itself. On some browsers HA then swaps in a polyfilled custom element
 * registry, which would make an element defined *before* that invisible to
 * HA. So wait until HA has defined its own root element (or a few seconds,
 * for pages without it) and register the card in the registry HA uses.
 */
if (customElements.get("home-assistant") || customElements.get("hc-main")) {
  tcRegister();
} else {
  Promise.race([
    customElements.whenDefined("home-assistant"),
    customElements.whenDefined("hc-main"),
    new Promise((resolve) => setTimeout(resolve, 5000)),
  ]).then(() => window.customElements.get("timercard-card") || tcRegister());
}
