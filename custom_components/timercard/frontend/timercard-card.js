/*
 * Timercard – an easy timer card for Home Assistant.
 *
 * Every timer has one "on" moment and (optionally) one "off" moment, so you
 * always see in one place what switches a device on and what switches it off.
 *
 * Needs the Timercard integration (custom_components/timercard), which stores
 * and runs the timers.
 */

const TC_VERSION = "1.4.0";

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
  "en": {
    "title": "Timers",
    "new_timer": "New timer",
    "edit_timer": "Edit timer",
    "empty": "No timers yet. Tap “New timer” to make your first one.",
    "not_loaded": "The Timercard integration is not set up yet. Go to Settings → Devices & services → Add integration and choose “Timercard”.",
    "waiting": "Waiting for Timercard to start… This message goes away by itself. If it stays, check that the Timercard integration is set up under Settings → Devices & services.",
    "loading": "Loading timers…",
    "step_devices": "What should the timer control?",
    "search": "Search for a device…",
    "no_results": "Nothing found",
    "step_action": "What should the timer do?",
    "action_both": "{on} and {off}",
    "action_only": "Only {verb}",
    "action_when": "{verb} {when}",
    "step_days": "On which days?",
    "step_name": "Name",
    "name_optional": "optional",
    "every_day": "Every day",
    "weekdays": "Weekdays",
    "weekend": "Weekend",
    "at_time": "Time",
    "sunrise": "Sunrise",
    "sunset": "Sunset",
    "exactly_sun": "exactly at {sun}",
    "before": "before",
    "after": "after",
    "offset_unit": "min {dir} {sun}",
    "min": "min",
    "hour": "h",
    "off_at_time": "At a time",
    "off_after": "After a while",
    "for_how_long": "How long should it stay on?",
    "custom": "Other",
    "next_day": "next day",
    "only_on": "These devices can only be switched one way, so there is nothing to undo.",
    "set_brightness": "Set brightness",
    "set_temperature": "Set temperature",
    "set_position": "Set position",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm_delete": "Tap again to delete",
    "try_now": "Try it now:",
    "need_device": "Choose at least one device.",
    "need_day": "Choose at least one day.",
    "need_day_group": "Choose at least one day for each set of other times.",
    "per_day": "Different times on some days",
    "per_day_hint": "For example later in the weekend",
    "main_days": "The times above are used on:",
    "other_times": "Other times",
    "other_days": "On these days:",
    "add_other": "Add other days",
    "remove": "Remove",
    "summary_title": "In short",
    "when_time": "at {time}",
    "when_sun": "at {sun}",
    "when_sun_offset": "{min} min {dir} {sun}",
    "sun_sunrise": "sunrise",
    "sun_sunset": "sunset",
    "when_duration": "after {duration}",
    "on_days": "On {days}.",
    "every_day_s": "Every day.",
    "weekdays_s": "On weekdays.",
    "weekend_s": "In the weekend.",
    "active_now": "Running now · {verb} {when}",
    "next": "Next: {verb} {day} at {time}",
    "today": "today",
    "tomorrow": "tomorrow",
    "paused": "Paused – this timer will not run",
    "and_more": "+{n}",
    "saved": "Timer saved",
    "deleted": "Timer deleted",
    "error": "Something went wrong: {msg}",
    "cfg_title": "Title",
    "cfg_entities": "Only these devices (empty = all devices)",
    "verbs": {
      "turn_on": "Turn on",
      "turn_off": "Turn off",
      "open": "Open",
      "close": "Close",
      "unlock": "Unlock",
      "lock": "Lock",
      "start": "Start",
      "dock": "Send to dock",
      "activate": "Activate",
      "run": "Run",
      "stop": "Stop",
      "press": "Press"
    },
    "shorts": {
      "turn_on": "On",
      "turn_off": "Off",
      "open": "Open",
      "close": "Close",
      "unlock": "Unlock",
      "lock": "Lock",
      "start": "Start",
      "dock": "Dock",
      "activate": "Activate",
      "run": "Run",
      "stop": "Stop",
      "press": "Press"
    }
  },
  "nl": {
    "title": "Timers",
    "new_timer": "Nieuwe timer",
    "edit_timer": "Timer bewerken",
    "empty": "Nog geen timers. Tik op “Nieuwe timer” om je eerste te maken.",
    "not_loaded": "De Timercard-integratie is nog niet ingesteld. Ga naar Instellingen → Apparaten & diensten → Integratie toevoegen en kies “Timercard”.",
    "waiting": "Wachten tot Timercard gestart is… Deze melding verdwijnt vanzelf. Blijft ze staan, controleer dan of de Timercard-integratie is ingesteld onder Instellingen → Apparaten & diensten.",
    "loading": "Timers laden…",
    "step_devices": "Wat moet de timer bedienen?",
    "search": "Zoek een apparaat…",
    "no_results": "Niets gevonden",
    "step_action": "Wat moet de timer doen?",
    "action_both": "{on} en {off}",
    "action_only": "Alleen {verb}",
    "action_when": "{verb} {when}",
    "step_days": "Op welke dagen?",
    "step_name": "Naam",
    "name_optional": "optioneel",
    "every_day": "Elke dag",
    "weekdays": "Werkdagen",
    "weekend": "Weekend",
    "at_time": "Tijd",
    "sunrise": "Zonsopkomst",
    "sunset": "Zonsondergang",
    "exactly_sun": "precies bij {sun}",
    "before": "voor",
    "after": "na",
    "offset_unit": "min {dir} {sun}",
    "min": "min",
    "hour": "u",
    "off_at_time": "Op een tijd",
    "off_after": "Na een tijdje",
    "for_how_long": "Hoe lang moet het aan blijven?",
    "custom": "Anders",
    "next_day": "volgende dag",
    "only_on": "Deze apparaten kunnen maar één kant op, dus er valt niets terug te zetten.",
    "set_brightness": "Helderheid instellen",
    "set_temperature": "Temperatuur instellen",
    "set_position": "Positie instellen",
    "save": "Opslaan",
    "cancel": "Annuleren",
    "delete": "Verwijderen",
    "confirm_delete": "Tik nogmaals om te verwijderen",
    "try_now": "Nu testen:",
    "need_device": "Kies minstens één apparaat.",
    "need_day": "Kies minstens één dag.",
    "need_day_group": "Kies minstens één dag voor elke set andere tijden.",
    "per_day": "Andere tijden op sommige dagen",
    "per_day_hint": "Bijvoorbeeld later in het weekend",
    "main_days": "De tijden hierboven gelden op:",
    "other_times": "Andere tijden",
    "other_days": "Op deze dagen:",
    "add_other": "Andere dagen toevoegen",
    "remove": "Verwijderen",
    "summary_title": "Kort gezegd",
    "when_time": "om {time}",
    "when_sun": "bij {sun}",
    "when_sun_offset": "{min} min {dir} {sun}",
    "sun_sunrise": "zonsopkomst",
    "sun_sunset": "zonsondergang",
    "when_duration": "na {duration}",
    "on_days": "Op {days}.",
    "every_day_s": "Elke dag.",
    "weekdays_s": "Op werkdagen.",
    "weekend_s": "In het weekend.",
    "active_now": "Nu actief · {verb} {when}",
    "next": "Volgende: {verb} {day} om {time}",
    "today": "vandaag",
    "tomorrow": "morgen",
    "paused": "Gepauzeerd – deze timer gaat niet af",
    "and_more": "+{n}",
    "saved": "Timer opgeslagen",
    "deleted": "Timer verwijderd",
    "error": "Er ging iets mis: {msg}",
    "cfg_title": "Titel",
    "cfg_entities": "Alleen deze apparaten (leeg = alle apparaten)",
    "verbs": {
      "turn_on": "Aanzetten",
      "turn_off": "Uitzetten",
      "open": "Openen",
      "close": "Sluiten",
      "unlock": "Ontgrendelen",
      "lock": "Vergrendelen",
      "start": "Starten",
      "dock": "Terug naar dock",
      "activate": "Activeren",
      "run": "Uitvoeren",
      "stop": "Stoppen",
      "press": "Indrukken"
    },
    "shorts": {
      "turn_on": "Aan",
      "turn_off": "Uit",
      "open": "Open",
      "close": "Dicht",
      "unlock": "Open",
      "lock": "Op slot",
      "start": "Start",
      "dock": "Dock",
      "activate": "Activeer",
      "run": "Start",
      "stop": "Stop",
      "press": "Druk"
    }
  },
  "zh": {
    "title": "定时器",
    "new_timer": "新建定时器",
    "edit_timer": "编辑定时器",
    "empty": "还没有定时器。点击“新建定时器”创建第一个。",
    "not_loaded": "Timercard 集成尚未设置。请前往“设置 → 设备与服务 → 添加集成”，然后选择“Timercard”。",
    "waiting": "正在等待 Timercard 启动… 此消息会自动消失。如果一直显示，请在“设置 → 设备与服务”中检查是否已设置 Timercard 集成。",
    "loading": "正在加载定时器…",
    "step_devices": "定时器要控制什么？",
    "search": "搜索设备…",
    "no_results": "未找到",
    "step_action": "定时器要做什么？",
    "action_both": "{on}和{off}",
    "action_only": "仅{verb}",
    "action_when": "{when} {verb}",
    "step_days": "在哪几天？",
    "step_name": "名称",
    "name_optional": "可选",
    "every_day": "每天",
    "weekdays": "工作日",
    "weekend": "周末",
    "at_time": "时间",
    "sunrise": "日出",
    "sunset": "日落",
    "exactly_sun": "{sun}时",
    "before": "之前",
    "after": "之后",
    "offset_unit": "分钟（{sun}{dir}）",
    "min": "分钟",
    "hour": "小时",
    "off_at_time": "指定时间",
    "off_after": "一段时间后",
    "for_how_long": "要保持开启多久？",
    "custom": "其他",
    "next_day": "次日",
    "only_on": "这些设备只能单向操作，因此没有需要撤销的动作。",
    "set_brightness": "设置亮度",
    "set_temperature": "设置温度",
    "set_position": "设置位置",
    "save": "保存",
    "cancel": "取消",
    "delete": "删除",
    "confirm_delete": "再次点击以删除",
    "try_now": "立即测试：",
    "need_device": "请至少选择一个设备。",
    "need_day": "请至少选择一天。",
    "need_day_group": "每组其他时间都需要至少选择一天。",
    "per_day": "某些日子使用不同时间",
    "per_day_hint": "例如周末晚一些",
    "main_days": "上面的时间用于：",
    "other_times": "其他时间",
    "other_days": "在这些日子：",
    "add_other": "添加其他日子",
    "remove": "移除",
    "summary_title": "简要说明",
    "when_time": "{time}",
    "when_sun": "{sun}时",
    "when_sun_offset": "{sun}{dir} {min} 分钟",
    "sun_sunrise": "日出",
    "sun_sunset": "日落",
    "when_duration": "{duration}后",
    "on_days": "{days}。",
    "every_day_s": "每天。",
    "weekdays_s": "工作日。",
    "weekend_s": "周末。",
    "active_now": "正在运行 · {when} {verb}",
    "next": "下次：{day} {time} {verb}",
    "today": "今天",
    "tomorrow": "明天",
    "paused": "已暂停 – 此定时器不会运行",
    "and_more": "+{n}",
    "saved": "定时器已保存",
    "deleted": "定时器已删除",
    "error": "出错了：{msg}",
    "cfg_title": "标题",
    "cfg_entities": "仅这些设备（留空 = 全部设备）",
    "verbs": {
      "turn_on": "打开",
      "turn_off": "关闭",
      "open": "打开",
      "close": "关闭",
      "unlock": "解锁",
      "lock": "上锁",
      "start": "启动",
      "dock": "返回充电座",
      "activate": "激活",
      "run": "运行",
      "stop": "停止",
      "press": "按下"
    },
    "shorts": {
      "turn_on": "开",
      "turn_off": "关",
      "open": "开",
      "close": "关",
      "unlock": "解锁",
      "lock": "上锁",
      "start": "启动",
      "dock": "回座",
      "activate": "激活",
      "run": "运行",
      "stop": "停止",
      "press": "按下"
    }
  },
  "hi": {
    "title": "टाइमर",
    "new_timer": "नया टाइमर",
    "edit_timer": "टाइमर बदलें",
    "empty": "अभी कोई टाइमर नहीं है। पहला टाइमर बनाने के लिए “नया टाइमर” पर टैप करें।",
    "not_loaded": "Timercard इंटीग्रेशन अभी सेट नहीं है। सेटिंग्स → डिवाइस और सेवाएँ → इंटीग्रेशन जोड़ें पर जाएँ और “Timercard” चुनें।",
    "waiting": "Timercard के शुरू होने की प्रतीक्षा है… यह संदेश अपने आप हट जाएगा। अगर यह बना रहे, तो सेटिंग्स → डिवाइस और सेवाएँ में देखें कि Timercard इंटीग्रेशन सेट है।",
    "loading": "टाइमर लोड हो रहे हैं…",
    "step_devices": "टाइमर किसे नियंत्रित करे?",
    "search": "डिवाइस खोजें…",
    "no_results": "कुछ नहीं मिला",
    "step_action": "टाइमर क्या करे?",
    "action_both": "{on} और {off}",
    "action_only": "केवल {verb}",
    "action_when": "{when} {verb}",
    "step_days": "किन दिनों पर?",
    "step_name": "नाम",
    "name_optional": "वैकल्पिक",
    "every_day": "हर दिन",
    "weekdays": "कार्यदिवस",
    "weekend": "सप्ताहांत",
    "at_time": "समय",
    "sunrise": "सूर्योदय",
    "sunset": "सूर्यास्त",
    "exactly_sun": "ठीक {sun} पर",
    "before": "पहले",
    "after": "बाद",
    "offset_unit": "मिनट ({sun} से {dir})",
    "min": "मिनट",
    "hour": "घंटे",
    "off_at_time": "किसी समय पर",
    "off_after": "कुछ देर बाद",
    "for_how_long": "कितनी देर चालू रहे?",
    "custom": "अन्य",
    "next_day": "अगले दिन",
    "only_on": "ये डिवाइस केवल एक ही तरफ़ काम करते हैं, इसलिए वापस करने को कुछ नहीं है।",
    "set_brightness": "चमक सेट करें",
    "set_temperature": "तापमान सेट करें",
    "set_position": "स्थिति सेट करें",
    "save": "सहेजें",
    "cancel": "रद्द करें",
    "delete": "हटाएँ",
    "confirm_delete": "हटाने के लिए फिर से टैप करें",
    "try_now": "अभी आज़माएँ:",
    "need_device": "कम से कम एक डिवाइस चुनें।",
    "need_day": "कम से कम एक दिन चुनें।",
    "need_day_group": "अन्य समय के हर सेट के लिए कम से कम एक दिन चुनें।",
    "per_day": "कुछ दिनों पर अलग समय",
    "per_day_hint": "जैसे सप्ताहांत में थोड़ा देर से",
    "main_days": "ऊपर का समय इन दिनों पर लागू है:",
    "other_times": "अन्य समय",
    "other_days": "इन दिनों पर:",
    "add_other": "अन्य दिन जोड़ें",
    "remove": "हटाएँ",
    "summary_title": "संक्षेप में",
    "when_time": "{time} बजे",
    "when_sun": "{sun} पर",
    "when_sun_offset": "{sun} से {min} मिनट {dir}",
    "sun_sunrise": "सूर्योदय",
    "sun_sunset": "सूर्यास्त",
    "when_duration": "{duration} बाद",
    "on_days": "{days} को।",
    "every_day_s": "हर दिन।",
    "weekdays_s": "कार्यदिवसों पर।",
    "weekend_s": "सप्ताहांत पर।",
    "active_now": "अभी चल रहा है · {when} {verb}",
    "next": "अगला: {day} {time} बजे {verb}",
    "today": "आज",
    "tomorrow": "कल",
    "paused": "रुका हुआ – यह टाइमर नहीं चलेगा",
    "and_more": "+{n}",
    "saved": "टाइमर सहेजा गया",
    "deleted": "टाइमर हटाया गया",
    "error": "कुछ गलत हो गया: {msg}",
    "cfg_title": "शीर्षक",
    "cfg_entities": "केवल ये डिवाइस (खाली = सभी डिवाइस)",
    "verbs": {
      "turn_on": "चालू करें",
      "turn_off": "बंद करें",
      "open": "खोलें",
      "close": "बंद करें",
      "unlock": "अनलॉक करें",
      "lock": "लॉक करें",
      "start": "शुरू करें",
      "dock": "डॉक पर भेजें",
      "activate": "सक्रिय करें",
      "run": "चलाएँ",
      "stop": "रोकें",
      "press": "दबाएँ"
    },
    "shorts": {
      "turn_on": "चालू",
      "turn_off": "बंद",
      "open": "खोलें",
      "close": "बंद",
      "unlock": "अनलॉक",
      "lock": "लॉक",
      "start": "शुरू",
      "dock": "डॉक",
      "activate": "सक्रिय",
      "run": "चलाएँ",
      "stop": "रोकें",
      "press": "दबाएँ"
    }
  },
  "es": {
    "title": "Temporizadores",
    "new_timer": "Nuevo temporizador",
    "edit_timer": "Editar temporizador",
    "empty": "Aún no hay temporizadores. Toca «Nuevo temporizador» para crear el primero.",
    "not_loaded": "La integración Timercard aún no está configurada. Ve a Ajustes → Dispositivos y servicios → Añadir integración y elige «Timercard».",
    "waiting": "Esperando a que Timercard se inicie… Este mensaje desaparece solo. Si no desaparece, comprueba que la integración Timercard está configurada en Ajustes → Dispositivos y servicios.",
    "loading": "Cargando temporizadores…",
    "step_devices": "¿Qué debe controlar el temporizador?",
    "search": "Buscar un dispositivo…",
    "no_results": "No se encontró nada",
    "step_action": "¿Qué debe hacer el temporizador?",
    "action_both": "{on} y {off}",
    "action_only": "Solo {verb}",
    "action_when": "{verb} {when}",
    "step_days": "¿Qué días?",
    "step_name": "Nombre",
    "name_optional": "opcional",
    "every_day": "Todos los días",
    "weekdays": "Entre semana",
    "weekend": "Fin de semana",
    "at_time": "Hora",
    "sunrise": "Amanecer",
    "sunset": "Atardecer",
    "exactly_sun": "justo al {sun}",
    "before": "antes",
    "after": "después",
    "offset_unit": "min {dir} del {sun}",
    "min": "min",
    "hour": "h",
    "off_at_time": "A una hora",
    "off_after": "Después de un rato",
    "for_how_long": "¿Cuánto tiempo debe quedarse encendido?",
    "custom": "Otro",
    "next_day": "día siguiente",
    "only_on": "Estos dispositivos solo funcionan en un sentido, así que no hay nada que deshacer.",
    "set_brightness": "Ajustar brillo",
    "set_temperature": "Ajustar temperatura",
    "set_position": "Ajustar posición",
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "confirm_delete": "Toca otra vez para eliminar",
    "try_now": "Probar ahora:",
    "need_device": "Elige al menos un dispositivo.",
    "need_day": "Elige al menos un día.",
    "need_day_group": "Elige al menos un día para cada grupo de otros horarios.",
    "per_day": "Otros horarios algunos días",
    "per_day_hint": "Por ejemplo, más tarde el fin de semana",
    "main_days": "Los horarios de arriba se usan:",
    "other_times": "Otros horarios",
    "other_days": "Estos días:",
    "add_other": "Añadir otros días",
    "remove": "Quitar",
    "summary_title": "En resumen",
    "when_time": "a las {time}",
    "when_sun": "al {sun}",
    "when_sun_offset": "{min} min {dir} del {sun}",
    "sun_sunrise": "amanecer",
    "sun_sunset": "atardecer",
    "when_duration": "después de {duration}",
    "on_days": "Días: {days}.",
    "every_day_s": "Todos los días.",
    "weekdays_s": "Entre semana.",
    "weekend_s": "El fin de semana.",
    "active_now": "Activo ahora · {verb} {when}",
    "next": "Próximo: {verb} {day} a las {time}",
    "today": "hoy",
    "tomorrow": "mañana",
    "paused": "En pausa: este temporizador no se ejecutará",
    "and_more": "+{n}",
    "saved": "Temporizador guardado",
    "deleted": "Temporizador eliminado",
    "error": "Algo salió mal: {msg}",
    "cfg_title": "Título",
    "cfg_entities": "Solo estos dispositivos (vacío = todos)",
    "verbs": {
      "turn_on": "Encender",
      "turn_off": "Apagar",
      "open": "Abrir",
      "close": "Cerrar",
      "unlock": "Desbloquear",
      "lock": "Bloquear",
      "start": "Iniciar",
      "dock": "Volver a la base",
      "activate": "Activar",
      "run": "Ejecutar",
      "stop": "Detener",
      "press": "Pulsar"
    },
    "shorts": {
      "turn_on": "Encender",
      "turn_off": "Apagar",
      "open": "Abrir",
      "close": "Cerrar",
      "unlock": "Desbloquear",
      "lock": "Bloquear",
      "start": "Iniciar",
      "dock": "Base",
      "activate": "Activar",
      "run": "Ejecutar",
      "stop": "Detener",
      "press": "Pulsar"
    }
  },
  "ar": {
    "title": "المؤقتات",
    "new_timer": "مؤقت جديد",
    "edit_timer": "تعديل المؤقت",
    "empty": "لا توجد مؤقتات بعد. اضغط على «مؤقت جديد» لإنشاء أول مؤقت.",
    "not_loaded": "لم يتم إعداد تكامل Timercard بعد. انتقل إلى الإعدادات ← الأجهزة والخدمات ← إضافة تكامل واختر «Timercard».",
    "waiting": "في انتظار بدء Timercard… ستختفي هذه الرسالة تلقائيًا. إذا بقيت، فتحقق من إعداد تكامل Timercard في الإعدادات ← الأجهزة والخدمات.",
    "loading": "جارٍ تحميل المؤقتات…",
    "step_devices": "ما الذي يتحكم فيه المؤقت؟",
    "search": "ابحث عن جهاز…",
    "no_results": "لم يتم العثور على شيء",
    "step_action": "ماذا يفعل المؤقت؟",
    "action_both": "{on} و{off}",
    "action_only": "{verb} فقط",
    "action_when": "{verb} {when}",
    "step_days": "في أي أيام؟",
    "step_name": "الاسم",
    "name_optional": "اختياري",
    "every_day": "كل يوم",
    "weekdays": "أيام العمل",
    "weekend": "عطلة نهاية الأسبوع",
    "at_time": "وقت",
    "sunrise": "الشروق",
    "sunset": "الغروب",
    "exactly_sun": "تمامًا عند {sun}",
    "before": "قبل",
    "after": "بعد",
    "offset_unit": "دقيقة {dir} {sun}",
    "min": "دقيقة",
    "hour": "ساعة",
    "off_at_time": "في وقت محدد",
    "off_after": "بعد مدة",
    "for_how_long": "كم من الوقت يبقى قيد التشغيل؟",
    "custom": "أخرى",
    "next_day": "اليوم التالي",
    "only_on": "هذه الأجهزة تعمل في اتجاه واحد فقط، لذلك لا يوجد ما يمكن التراجع عنه.",
    "set_brightness": "ضبط السطوع",
    "set_temperature": "ضبط درجة الحرارة",
    "set_position": "ضبط الموضع",
    "save": "حفظ",
    "cancel": "إلغاء",
    "delete": "حذف",
    "confirm_delete": "اضغط مرة أخرى للحذف",
    "try_now": "جرّب الآن:",
    "need_device": "اختر جهازًا واحدًا على الأقل.",
    "need_day": "اختر يومًا واحدًا على الأقل.",
    "need_day_group": "اختر يومًا واحدًا على الأقل لكل مجموعة من الأوقات الأخرى.",
    "per_day": "أوقات مختلفة في بعض الأيام",
    "per_day_hint": "مثلًا في وقت لاحق في عطلة نهاية الأسبوع",
    "main_days": "الأوقات أعلاه تُستخدم في:",
    "other_times": "أوقات أخرى",
    "other_days": "في هذه الأيام:",
    "add_other": "إضافة أيام أخرى",
    "remove": "إزالة",
    "summary_title": "باختصار",
    "when_time": "الساعة {time}",
    "when_sun": "عند {sun}",
    "when_sun_offset": "{min} دقيقة {dir} {sun}",
    "sun_sunrise": "الشروق",
    "sun_sunset": "الغروب",
    "when_duration": "بعد {duration}",
    "on_days": "الأيام: {days}.",
    "every_day_s": "كل يوم.",
    "weekdays_s": "في أيام العمل.",
    "weekend_s": "في عطلة نهاية الأسبوع.",
    "active_now": "يعمل الآن · {verb} {when}",
    "next": "التالي: {verb} {day} الساعة {time}",
    "today": "اليوم",
    "tomorrow": "غدًا",
    "paused": "متوقف مؤقتًا – لن يعمل هذا المؤقت",
    "and_more": "+{n}",
    "saved": "تم حفظ المؤقت",
    "deleted": "تم حذف المؤقت",
    "error": "حدث خطأ ما: {msg}",
    "cfg_title": "العنوان",
    "cfg_entities": "هذه الأجهزة فقط (فارغ = كل الأجهزة)",
    "verbs": {
      "turn_on": "تشغيل",
      "turn_off": "إيقاف",
      "open": "فتح",
      "close": "إغلاق",
      "unlock": "إلغاء القفل",
      "lock": "قفل",
      "start": "بدء",
      "dock": "العودة إلى القاعدة",
      "activate": "تفعيل",
      "run": "تنفيذ",
      "stop": "إيقاف",
      "press": "ضغط"
    },
    "shorts": {
      "turn_on": "تشغيل",
      "turn_off": "إيقاف",
      "open": "فتح",
      "close": "إغلاق",
      "unlock": "فتح القفل",
      "lock": "قفل",
      "start": "بدء",
      "dock": "القاعدة",
      "activate": "تفعيل",
      "run": "تنفيذ",
      "stop": "إيقاف",
      "press": "ضغط"
    }
  },
  "fr": {
    "title": "Minuteurs",
    "new_timer": "Nouveau minuteur",
    "edit_timer": "Modifier le minuteur",
    "empty": "Aucun minuteur pour l’instant. Touchez « Nouveau minuteur » pour créer le premier.",
    "not_loaded": "L’intégration Timercard n’est pas encore configurée. Allez dans Paramètres → Appareils et services → Ajouter une intégration et choisissez « Timercard ».",
    "waiting": "En attente du démarrage de Timercard… Ce message disparaît tout seul. S’il reste affiché, vérifiez que l’intégration Timercard est configurée dans Paramètres → Appareils et services.",
    "loading": "Chargement des minuteurs…",
    "step_devices": "Que doit commander le minuteur ?",
    "search": "Rechercher un appareil…",
    "no_results": "Aucun résultat",
    "step_action": "Que doit faire le minuteur ?",
    "action_both": "{on} et {off}",
    "action_only": "Seulement {verb}",
    "action_when": "{verb} {when}",
    "step_days": "Quels jours ?",
    "step_name": "Nom",
    "name_optional": "facultatif",
    "every_day": "Tous les jours",
    "weekdays": "En semaine",
    "weekend": "Week-end",
    "at_time": "Heure",
    "sunrise": "Lever du soleil",
    "sunset": "Coucher du soleil",
    "exactly_sun": "pile au {sun}",
    "before": "avant",
    "after": "après",
    "offset_unit": "min {dir} le {sun}",
    "min": "min",
    "hour": "h",
    "off_at_time": "À une heure",
    "off_after": "Après un moment",
    "for_how_long": "Combien de temps doit-il rester allumé ?",
    "custom": "Autre",
    "next_day": "le lendemain",
    "only_on": "Ces appareils ne fonctionnent que dans un sens : il n’y a rien à annuler.",
    "set_brightness": "Régler la luminosité",
    "set_temperature": "Régler la température",
    "set_position": "Régler la position",
    "save": "Enregistrer",
    "cancel": "Annuler",
    "delete": "Supprimer",
    "confirm_delete": "Touchez encore pour supprimer",
    "try_now": "Tester maintenant :",
    "need_device": "Choisissez au moins un appareil.",
    "need_day": "Choisissez au moins un jour.",
    "need_day_group": "Choisissez au moins un jour pour chaque groupe d’autres horaires.",
    "per_day": "Autres horaires certains jours",
    "per_day_hint": "Par exemple plus tard le week-end",
    "main_days": "Les horaires ci-dessus s’appliquent :",
    "other_times": "Autres horaires",
    "other_days": "Ces jours-là :",
    "add_other": "Ajouter d’autres jours",
    "remove": "Retirer",
    "summary_title": "En bref",
    "when_time": "à {time}",
    "when_sun": "au {sun}",
    "when_sun_offset": "{min} min {dir} le {sun}",
    "sun_sunrise": "lever du soleil",
    "sun_sunset": "coucher du soleil",
    "when_duration": "après {duration}",
    "on_days": "Jours : {days}.",
    "every_day_s": "Tous les jours.",
    "weekdays_s": "En semaine.",
    "weekend_s": "Le week-end.",
    "active_now": "En cours · {verb} {when}",
    "next": "Prochain : {verb} {day} à {time}",
    "today": "aujourd’hui",
    "tomorrow": "demain",
    "paused": "En pause – ce minuteur ne se déclenchera pas",
    "and_more": "+{n}",
    "saved": "Minuteur enregistré",
    "deleted": "Minuteur supprimé",
    "error": "Une erreur est survenue : {msg}",
    "cfg_title": "Titre",
    "cfg_entities": "Seulement ces appareils (vide = tous)",
    "verbs": {
      "turn_on": "Allumer",
      "turn_off": "Éteindre",
      "open": "Ouvrir",
      "close": "Fermer",
      "unlock": "Déverrouiller",
      "lock": "Verrouiller",
      "start": "Démarrer",
      "dock": "Retour à la base",
      "activate": "Activer",
      "run": "Lancer",
      "stop": "Arrêter",
      "press": "Appuyer"
    },
    "shorts": {
      "turn_on": "Allumer",
      "turn_off": "Éteindre",
      "open": "Ouvrir",
      "close": "Fermer",
      "unlock": "Déverrouiller",
      "lock": "Verrouiller",
      "start": "Démarrer",
      "dock": "Base",
      "activate": "Activer",
      "run": "Lancer",
      "stop": "Arrêter",
      "press": "Appuyer"
    }
  },
  "bn": {
    "title": "টাইমার",
    "new_timer": "নতুন টাইমার",
    "edit_timer": "টাইমার সম্পাদনা",
    "empty": "এখনও কোনো টাইমার নেই। প্রথমটি বানাতে “নতুন টাইমার”-এ ট্যাপ করুন।",
    "not_loaded": "Timercard ইন্টিগ্রেশন এখনও সেট আপ করা হয়নি। সেটিংস → ডিভাইস ও পরিষেবা → ইন্টিগ্রেশন যোগ করুন-এ গিয়ে “Timercard” বেছে নিন।",
    "waiting": "Timercard চালু হওয়ার অপেক্ষা… এই বার্তাটি নিজে থেকেই চলে যাবে। যদি থেকে যায়, তাহলে সেটিংস → ডিভাইস ও পরিষেবা-তে Timercard ইন্টিগ্রেশন সেট আপ আছে কি না দেখুন।",
    "loading": "টাইমার লোড হচ্ছে…",
    "step_devices": "টাইমার কী নিয়ন্ত্রণ করবে?",
    "search": "ডিভাইস খুঁজুন…",
    "no_results": "কিছু পাওয়া যায়নি",
    "step_action": "টাইমার কী করবে?",
    "action_both": "{on} ও {off}",
    "action_only": "শুধু {verb}",
    "action_when": "{when} {verb}",
    "step_days": "কোন কোন দিন?",
    "step_name": "নাম",
    "name_optional": "ঐচ্ছিক",
    "every_day": "প্রতিদিন",
    "weekdays": "কর্মদিবস",
    "weekend": "সপ্তাহান্ত",
    "at_time": "সময়",
    "sunrise": "সূর্যোদয়",
    "sunset": "সূর্যাস্ত",
    "exactly_sun": "ঠিক {sun}-এ",
    "before": "আগে",
    "after": "পরে",
    "offset_unit": "মিনিট ({sun}-এর {dir})",
    "min": "মিনিট",
    "hour": "ঘণ্টা",
    "off_at_time": "নির্দিষ্ট সময়ে",
    "off_after": "কিছুক্ষণ পরে",
    "for_how_long": "কতক্ষণ চালু থাকবে?",
    "custom": "অন্য",
    "next_day": "পরের দিন",
    "only_on": "এই ডিভাইসগুলো শুধু এক দিকেই কাজ করে, তাই ফেরানোর কিছু নেই।",
    "set_brightness": "উজ্জ্বলতা সেট করুন",
    "set_temperature": "তাপমাত্রা সেট করুন",
    "set_position": "অবস্থান সেট করুন",
    "save": "সংরক্ষণ",
    "cancel": "বাতিল",
    "delete": "মুছুন",
    "confirm_delete": "মুছতে আবার ট্যাপ করুন",
    "try_now": "এখনই চেষ্টা করুন:",
    "need_device": "অন্তত একটি ডিভাইস বেছে নিন।",
    "need_day": "অন্তত একটি দিন বেছে নিন।",
    "need_day_group": "অন্য সময়ের প্রতিটি সেটের জন্য অন্তত একটি দিন বেছে নিন।",
    "per_day": "কিছু দিনে ভিন্ন সময়",
    "per_day_hint": "যেমন সপ্তাহান্তে একটু দেরিতে",
    "main_days": "উপরের সময় প্রযোজ্য:",
    "other_times": "অন্য সময়",
    "other_days": "এই দিনগুলোতে:",
    "add_other": "অন্য দিন যোগ করুন",
    "remove": "সরান",
    "summary_title": "সংক্ষেপে",
    "when_time": "{time}-এ",
    "when_sun": "{sun}-এ",
    "when_sun_offset": "{sun}-এর {min} মিনিট {dir}",
    "sun_sunrise": "সূর্যোদয়",
    "sun_sunset": "সূর্যাস্ত",
    "when_duration": "{duration} পরে",
    "on_days": "{days}।",
    "every_day_s": "প্রতিদিন।",
    "weekdays_s": "কর্মদিবসে।",
    "weekend_s": "সপ্তাহান্তে।",
    "active_now": "এখন চলছে · {when} {verb}",
    "next": "পরবর্তী: {day} {time}-এ {verb}",
    "today": "আজ",
    "tomorrow": "আগামীকাল",
    "paused": "বিরতিতে – এই টাইমার চলবে না",
    "and_more": "+{n}",
    "saved": "টাইমার সংরক্ষিত হয়েছে",
    "deleted": "টাইমার মুছে ফেলা হয়েছে",
    "error": "কিছু ভুল হয়েছে: {msg}",
    "cfg_title": "শিরোনাম",
    "cfg_entities": "শুধু এই ডিভাইসগুলো (খালি = সব)",
    "verbs": {
      "turn_on": "চালু করুন",
      "turn_off": "বন্ধ করুন",
      "open": "খুলুন",
      "close": "বন্ধ করুন",
      "unlock": "আনলক করুন",
      "lock": "লক করুন",
      "start": "শুরু করুন",
      "dock": "ডকে পাঠান",
      "activate": "সক্রিয় করুন",
      "run": "চালান",
      "stop": "থামান",
      "press": "চাপুন"
    },
    "shorts": {
      "turn_on": "চালু",
      "turn_off": "বন্ধ",
      "open": "খোলা",
      "close": "বন্ধ",
      "unlock": "আনলক",
      "lock": "লক",
      "start": "শুরু",
      "dock": "ডক",
      "activate": "সক্রিয়",
      "run": "চালান",
      "stop": "থামান",
      "press": "চাপুন"
    }
  },
  "pt": {
    "title": "Temporizadores",
    "new_timer": "Novo temporizador",
    "edit_timer": "Editar temporizador",
    "empty": "Ainda não há temporizadores. Toque em “Novo temporizador” para criar o primeiro.",
    "not_loaded": "A integração Timercard ainda não está configurada. Vá a Configurações → Dispositivos e serviços → Adicionar integração e escolha “Timercard”.",
    "waiting": "Aguardando o Timercard iniciar… Esta mensagem some sozinha. Se continuar, verifique se a integração Timercard está configurada em Configurações → Dispositivos e serviços.",
    "loading": "Carregando temporizadores…",
    "step_devices": "O que o temporizador deve controlar?",
    "search": "Pesquisar um dispositivo…",
    "no_results": "Nada encontrado",
    "step_action": "O que o temporizador deve fazer?",
    "action_both": "{on} e {off}",
    "action_only": "Só {verb}",
    "action_when": "{verb} {when}",
    "step_days": "Em quais dias?",
    "step_name": "Nome",
    "name_optional": "opcional",
    "every_day": "Todos os dias",
    "weekdays": "Dias úteis",
    "weekend": "Fim de semana",
    "at_time": "Hora",
    "sunrise": "Nascer do sol",
    "sunset": "Pôr do sol",
    "exactly_sun": "exatamente no {sun}",
    "before": "antes",
    "after": "depois",
    "offset_unit": "min {dir} do {sun}",
    "min": "min",
    "hour": "h",
    "off_at_time": "Num horário",
    "off_after": "Depois de um tempo",
    "for_how_long": "Por quanto tempo deve ficar ligado?",
    "custom": "Outro",
    "next_day": "dia seguinte",
    "only_on": "Estes dispositivos só funcionam num sentido, por isso não há nada para desfazer.",
    "set_brightness": "Definir brilho",
    "set_temperature": "Definir temperatura",
    "set_position": "Definir posição",
    "save": "Salvar",
    "cancel": "Cancelar",
    "delete": "Excluir",
    "confirm_delete": "Toque de novo para excluir",
    "try_now": "Testar agora:",
    "need_device": "Escolha pelo menos um dispositivo.",
    "need_day": "Escolha pelo menos um dia.",
    "need_day_group": "Escolha pelo menos um dia para cada grupo de outros horários.",
    "per_day": "Horários diferentes em alguns dias",
    "per_day_hint": "Por exemplo, mais tarde no fim de semana",
    "main_days": "Os horários acima valem em:",
    "other_times": "Outros horários",
    "other_days": "Nestes dias:",
    "add_other": "Adicionar outros dias",
    "remove": "Remover",
    "summary_title": "Resumindo",
    "when_time": "às {time}",
    "when_sun": "no {sun}",
    "when_sun_offset": "{min} min {dir} do {sun}",
    "sun_sunrise": "nascer do sol",
    "sun_sunset": "pôr do sol",
    "when_duration": "depois de {duration}",
    "on_days": "Dias: {days}.",
    "every_day_s": "Todos os dias.",
    "weekdays_s": "Nos dias úteis.",
    "weekend_s": "No fim de semana.",
    "active_now": "Ativo agora · {verb} {when}",
    "next": "Próximo: {verb} {day} às {time}",
    "today": "hoje",
    "tomorrow": "amanhã",
    "paused": "Pausado – este temporizador não vai funcionar",
    "and_more": "+{n}",
    "saved": "Temporizador salvo",
    "deleted": "Temporizador excluído",
    "error": "Algo deu errado: {msg}",
    "cfg_title": "Título",
    "cfg_entities": "Só estes dispositivos (vazio = todos)",
    "verbs": {
      "turn_on": "Ligar",
      "turn_off": "Desligar",
      "open": "Abrir",
      "close": "Fechar",
      "unlock": "Desbloquear",
      "lock": "Bloquear",
      "start": "Iniciar",
      "dock": "Voltar à base",
      "activate": "Ativar",
      "run": "Executar",
      "stop": "Parar",
      "press": "Pressionar"
    },
    "shorts": {
      "turn_on": "Ligar",
      "turn_off": "Desligar",
      "open": "Abrir",
      "close": "Fechar",
      "unlock": "Desbloquear",
      "lock": "Bloquear",
      "start": "Iniciar",
      "dock": "Base",
      "activate": "Ativar",
      "run": "Executar",
      "stop": "Parar",
      "press": "Pressionar"
    }
  },
  "ru": {
    "title": "Таймеры",
    "new_timer": "Новый таймер",
    "edit_timer": "Изменить таймер",
    "empty": "Таймеров пока нет. Нажмите «Новый таймер», чтобы создать первый.",
    "not_loaded": "Интеграция Timercard ещё не настроена. Откройте Настройки → Устройства и службы → Добавить интеграцию и выберите «Timercard».",
    "waiting": "Ожидание запуска Timercard… Это сообщение исчезнет само. Если оно не исчезает, проверьте, что интеграция Timercard настроена в разделе Настройки → Устройства и службы.",
    "loading": "Загрузка таймеров…",
    "step_devices": "Чем должен управлять таймер?",
    "search": "Найти устройство…",
    "no_results": "Ничего не найдено",
    "step_action": "Что должен делать таймер?",
    "action_both": "{on} и {off}",
    "action_only": "Только {verb}",
    "action_when": "{verb} {when}",
    "step_days": "В какие дни?",
    "step_name": "Название",
    "name_optional": "необязательно",
    "every_day": "Каждый день",
    "weekdays": "Будни",
    "weekend": "Выходные",
    "at_time": "Время",
    "sunrise": "Восход",
    "sunset": "Закат",
    "exactly_sun": "ровно в момент {sun}",
    "before": "до",
    "after": "после",
    "offset_unit": "мин {dir} {sun}",
    "min": "мин",
    "hour": "ч",
    "off_at_time": "В заданное время",
    "off_after": "Через некоторое время",
    "for_how_long": "Сколько времени оставить включённым?",
    "custom": "Другое",
    "next_day": "на следующий день",
    "only_on": "Эти устройства работают только в одну сторону, отменять нечего.",
    "set_brightness": "Задать яркость",
    "set_temperature": "Задать температуру",
    "set_position": "Задать положение",
    "save": "Сохранить",
    "cancel": "Отмена",
    "delete": "Удалить",
    "confirm_delete": "Нажмите ещё раз, чтобы удалить",
    "try_now": "Проверить сейчас:",
    "need_device": "Выберите хотя бы одно устройство.",
    "need_day": "Выберите хотя бы один день.",
    "need_day_group": "Выберите хотя бы один день для каждого набора другого времени.",
    "per_day": "Другое время в некоторые дни",
    "per_day_hint": "Например, позже в выходные",
    "main_days": "Время выше действует в дни:",
    "other_times": "Другое время",
    "other_days": "В эти дни:",
    "add_other": "Добавить другие дни",
    "remove": "Убрать",
    "summary_title": "Кратко",
    "when_time": "в {time}",
    "when_sun": "в момент {sun}",
    "when_sun_offset": "{min} мин {dir} {sun}",
    "sun_sunrise": "восхода",
    "sun_sunset": "заката",
    "when_duration": "через {duration}",
    "on_days": "Дни: {days}.",
    "every_day_s": "Каждый день.",
    "weekdays_s": "По будням.",
    "weekend_s": "По выходным.",
    "active_now": "Работает сейчас · {verb} {when}",
    "next": "Далее: {verb} {day} в {time}",
    "today": "сегодня",
    "tomorrow": "завтра",
    "paused": "На паузе — этот таймер не сработает",
    "and_more": "+{n}",
    "saved": "Таймер сохранён",
    "deleted": "Таймер удалён",
    "error": "Что-то пошло не так: {msg}",
    "cfg_title": "Заголовок",
    "cfg_entities": "Только эти устройства (пусто = все)",
    "verbs": {
      "turn_on": "Включить",
      "turn_off": "Выключить",
      "open": "Открыть",
      "close": "Закрыть",
      "unlock": "Разблокировать",
      "lock": "Заблокировать",
      "start": "Запустить",
      "dock": "Вернуть на базу",
      "activate": "Активировать",
      "run": "Запустить",
      "stop": "Остановить",
      "press": "Нажать"
    },
    "shorts": {
      "turn_on": "Вкл",
      "turn_off": "Выкл",
      "open": "Открыть",
      "close": "Закрыть",
      "unlock": "Разблок.",
      "lock": "Заблок.",
      "start": "Старт",
      "dock": "База",
      "activate": "Активировать",
      "run": "Запуск",
      "stop": "Стоп",
      "press": "Нажать"
    }
  },
  "ur": {
    "title": "ٹائمر",
    "new_timer": "نیا ٹائمر",
    "edit_timer": "ٹائمر میں ترمیم",
    "empty": "ابھی کوئی ٹائمر نہیں ہے۔ پہلا ٹائمر بنانے کے لیے “نیا ٹائمر” پر ٹیپ کریں۔",
    "not_loaded": "Timercard انٹیگریشن ابھی سیٹ اپ نہیں ہوئی۔ سیٹنگز ← ڈیوائسز اور سروسز ← انٹیگریشن شامل کریں پر جائیں اور “Timercard” منتخب کریں۔",
    "waiting": "Timercard کے شروع ہونے کا انتظار… یہ پیغام خود ہی ہٹ جائے گا۔ اگر یہ رہے تو سیٹنگز ← ڈیوائسز اور سروسز میں دیکھیں کہ Timercard انٹیگریشن سیٹ اپ ہے۔",
    "loading": "ٹائمر لوڈ ہو رہے ہیں…",
    "step_devices": "ٹائمر کس کو کنٹرول کرے؟",
    "search": "ڈیوائس تلاش کریں…",
    "no_results": "کچھ نہیں ملا",
    "step_action": "ٹائمر کیا کرے؟",
    "action_both": "{on} اور {off}",
    "action_only": "صرف {verb}",
    "action_when": "{when} {verb}",
    "step_days": "کن دنوں میں؟",
    "step_name": "نام",
    "name_optional": "اختیاری",
    "every_day": "ہر روز",
    "weekdays": "کام کے دن",
    "weekend": "ویک اینڈ",
    "at_time": "وقت",
    "sunrise": "طلوعِ آفتاب",
    "sunset": "غروبِ آفتاب",
    "exactly_sun": "عین {sun} پر",
    "before": "پہلے",
    "after": "بعد",
    "offset_unit": "منٹ ({sun} سے {dir})",
    "min": "منٹ",
    "hour": "گھنٹے",
    "off_at_time": "کسی وقت پر",
    "off_after": "کچھ دیر بعد",
    "for_how_long": "کتنی دیر آن رہے؟",
    "custom": "دیگر",
    "next_day": "اگلے دن",
    "only_on": "یہ ڈیوائسز صرف ایک طرف کام کرتی ہیں، اس لیے واپس کرنے کو کچھ نہیں۔",
    "set_brightness": "روشنی سیٹ کریں",
    "set_temperature": "درجہ حرارت سیٹ کریں",
    "set_position": "پوزیشن سیٹ کریں",
    "save": "محفوظ کریں",
    "cancel": "منسوخ",
    "delete": "حذف کریں",
    "confirm_delete": "حذف کرنے کے لیے دوبارہ ٹیپ کریں",
    "try_now": "ابھی آزمائیں:",
    "need_device": "کم از کم ایک ڈیوائس منتخب کریں۔",
    "need_day": "کم از کم ایک دن منتخب کریں۔",
    "need_day_group": "دیگر اوقات کے ہر سیٹ کے لیے کم از کم ایک دن منتخب کریں۔",
    "per_day": "کچھ دنوں میں مختلف اوقات",
    "per_day_hint": "مثلاً ویک اینڈ پر ذرا دیر سے",
    "main_days": "اوپر والے اوقات ان دنوں میں:",
    "other_times": "دیگر اوقات",
    "other_days": "ان دنوں میں:",
    "add_other": "دیگر دن شامل کریں",
    "remove": "ہٹائیں",
    "summary_title": "مختصراً",
    "when_time": "{time} بجے",
    "when_sun": "{sun} پر",
    "when_sun_offset": "{sun} سے {min} منٹ {dir}",
    "sun_sunrise": "طلوعِ آفتاب",
    "sun_sunset": "غروبِ آفتاب",
    "when_duration": "{duration} بعد",
    "on_days": "{days} کو۔",
    "every_day_s": "ہر روز۔",
    "weekdays_s": "کام کے دنوں میں۔",
    "weekend_s": "ویک اینڈ پر۔",
    "active_now": "ابھی چل رہا ہے · {when} {verb}",
    "next": "اگلا: {day} {time} بجے {verb}",
    "today": "آج",
    "tomorrow": "کل",
    "paused": "موقوف – یہ ٹائمر نہیں چلے گا",
    "and_more": "+{n}",
    "saved": "ٹائمر محفوظ ہو گیا",
    "deleted": "ٹائمر حذف ہو گیا",
    "error": "کچھ غلط ہو گیا: {msg}",
    "cfg_title": "عنوان",
    "cfg_entities": "صرف یہ ڈیوائسز (خالی = سب)",
    "verbs": {
      "turn_on": "آن کریں",
      "turn_off": "بند کریں",
      "open": "کھولیں",
      "close": "بند کریں",
      "unlock": "ان لاک کریں",
      "lock": "لاک کریں",
      "start": "شروع کریں",
      "dock": "ڈاک پر بھیجیں",
      "activate": "فعال کریں",
      "run": "چلائیں",
      "stop": "روکیں",
      "press": "دبائیں"
    },
    "shorts": {
      "turn_on": "آن",
      "turn_off": "بند",
      "open": "کھولیں",
      "close": "بند",
      "unlock": "ان لاک",
      "lock": "لاک",
      "start": "شروع",
      "dock": "ڈاک",
      "activate": "فعال",
      "run": "چلائیں",
      "stop": "روکیں",
      "press": "دبائیں"
    }
  },
  "id": {
    "title": "Timer",
    "new_timer": "Timer baru",
    "edit_timer": "Ubah timer",
    "empty": "Belum ada timer. Ketuk “Timer baru” untuk membuat yang pertama.",
    "not_loaded": "Integrasi Timercard belum disiapkan. Buka Pengaturan → Perangkat & layanan → Tambahkan integrasi lalu pilih “Timercard”.",
    "waiting": "Menunggu Timercard dimulai… Pesan ini akan hilang sendiri. Jika tetap muncul, periksa apakah integrasi Timercard sudah disiapkan di Pengaturan → Perangkat & layanan.",
    "loading": "Memuat timer…",
    "step_devices": "Apa yang harus dikendalikan timer?",
    "search": "Cari perangkat…",
    "no_results": "Tidak ditemukan",
    "step_action": "Apa yang harus dilakukan timer?",
    "action_both": "{on} dan {off}",
    "action_only": "Hanya {verb}",
    "action_when": "{verb} {when}",
    "step_days": "Pada hari apa?",
    "step_name": "Nama",
    "name_optional": "opsional",
    "every_day": "Setiap hari",
    "weekdays": "Hari kerja",
    "weekend": "Akhir pekan",
    "at_time": "Waktu",
    "sunrise": "Matahari terbit",
    "sunset": "Matahari terbenam",
    "exactly_sun": "tepat saat {sun}",
    "before": "sebelum",
    "after": "setelah",
    "offset_unit": "menit {dir} {sun}",
    "min": "mnt",
    "hour": "j",
    "off_at_time": "Pada waktu tertentu",
    "off_after": "Setelah beberapa saat",
    "for_how_long": "Berapa lama harus tetap menyala?",
    "custom": "Lainnya",
    "next_day": "hari berikutnya",
    "only_on": "Perangkat ini hanya bisa satu arah, jadi tidak ada yang perlu dibatalkan.",
    "set_brightness": "Atur kecerahan",
    "set_temperature": "Atur suhu",
    "set_position": "Atur posisi",
    "save": "Simpan",
    "cancel": "Batal",
    "delete": "Hapus",
    "confirm_delete": "Ketuk lagi untuk menghapus",
    "try_now": "Coba sekarang:",
    "need_device": "Pilih minimal satu perangkat.",
    "need_day": "Pilih minimal satu hari.",
    "need_day_group": "Pilih minimal satu hari untuk setiap set waktu lain.",
    "per_day": "Waktu berbeda di beberapa hari",
    "per_day_hint": "Misalnya lebih larut di akhir pekan",
    "main_days": "Waktu di atas berlaku pada:",
    "other_times": "Waktu lain",
    "other_days": "Pada hari-hari ini:",
    "add_other": "Tambah hari lain",
    "remove": "Hapus",
    "summary_title": "Singkatnya",
    "when_time": "pukul {time}",
    "when_sun": "saat {sun}",
    "when_sun_offset": "{min} menit {dir} {sun}",
    "sun_sunrise": "matahari terbit",
    "sun_sunset": "matahari terbenam",
    "when_duration": "setelah {duration}",
    "on_days": "Pada {days}.",
    "every_day_s": "Setiap hari.",
    "weekdays_s": "Pada hari kerja.",
    "weekend_s": "Pada akhir pekan.",
    "active_now": "Sedang berjalan · {verb} {when}",
    "next": "Berikutnya: {verb} {day} pukul {time}",
    "today": "hari ini",
    "tomorrow": "besok",
    "paused": "Dijeda – timer ini tidak akan berjalan",
    "and_more": "+{n}",
    "saved": "Timer disimpan",
    "deleted": "Timer dihapus",
    "error": "Terjadi kesalahan: {msg}",
    "cfg_title": "Judul",
    "cfg_entities": "Hanya perangkat ini (kosong = semua)",
    "verbs": {
      "turn_on": "Nyalakan",
      "turn_off": "Matikan",
      "open": "Buka",
      "close": "Tutup",
      "unlock": "Buka kunci",
      "lock": "Kunci",
      "start": "Mulai",
      "dock": "Kembali ke dok",
      "activate": "Aktifkan",
      "run": "Jalankan",
      "stop": "Hentikan",
      "press": "Tekan"
    },
    "shorts": {
      "turn_on": "Nyala",
      "turn_off": "Mati",
      "open": "Buka",
      "close": "Tutup",
      "unlock": "Buka kunci",
      "lock": "Kunci",
      "start": "Mulai",
      "dock": "Dok",
      "activate": "Aktifkan",
      "run": "Jalankan",
      "stop": "Henti",
      "press": "Tekan"
    }
  }
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
    this.shadowRoot.addEventListener("focusin", (ev) => {
      if (ev.target?.classList?.contains("tp-field")) ev.target.select();
    });
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
    this._attached = true;
    if (this._hass) this._subscribe();
    this._tick = setInterval(() => {
      if (this._view === "list") this._render();
    }, 30000);
  }

  disconnectedCallback() {
    this._attached = false;
    clearInterval(this._tick);
    clearTimeout(this._retryTimer);
    this._unsubscribe();
    if (this._readyConn) {
      this._readyConn.removeEventListener("ready", this._onReady);
      this._readyConn = null;
    }
  }

  getCardSize() {
    return 2 + 3 * (this._visibleTimers().length || 1);
  }

  getGridOptions() {
    // Fill the whole section; make the section wider for more room.
    return { columns: "full", min_columns: 6, rows: "auto" };
  }

  /* ---------------------------------------------------------- data */
  async _subscribe() {
    if (this._subPromise || !this._hass) return;
    const conn = this._hass.connection;
    // After Home Assistant restarts, subscribe again ourselves: Timercard may
    // still be starting at the moment the connection comes back.
    if (this._readyConn !== conn) {
      if (this._readyConn) this._readyConn.removeEventListener("ready", this._onReady);
      this._onReady = this._onReady || (() => {
        this._unsubscribe();
        this._subscribe();
      });
      conn.addEventListener("ready", this._onReady);
      this._readyConn = conn;
    }
    clearTimeout(this._retryTimer);
    this._subPromise = conn.subscribeMessage(
      (msg) => {
        this._timers = msg.timers || [];
        this._error = null;
        if (this._view === "list") this._render();
      },
      { type: "timercard/subscribe" },
      { resubscribe: false }
    );
    try {
      this._unsub = await this._subPromise;
      if (this._error) {
        this._error = null;
        if (this._view === "list") this._render();
      }
    } catch (err) {
      this._subPromise = null;
      this._error = err;
      this._render();
      // Timercard not (yet) running: keep trying, so the card fills in by
      // itself as soon as Home Assistant has finished starting.
      if (this._attached !== false) {
        this._retryTimer = setTimeout(() => this._subscribe(), 5000);
      }
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

  /** Locale for Intl, always with Latin digits so times match the input fields. */
  get _intlLang() {
    const tag = `${this._lang}-u-nu-latn`;
    try {
      Intl.DateTimeFormat.supportedLocalesOf(tag);
      return tag;
    } catch (e) {
      return "en";
    }
  }

  get _rtl() {
    return ["ar", "ur", "he", "fa"].includes(this._lang.split("-")[0].toLowerCase());
  }

  get _dir() {
    return this._rtl ? "rtl" : "ltr";
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

  /** "on_off", "on" (only turn on) or "off" (only turn off). */
  _actionOf(timer) {
    if (!this._verbsFor(timer.entities).hasOff) return "on";
    if (timer.action) return timer.action;
    return timer.off?.mode === "none" ? "on" : "on_off";
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
      const opts = new Intl.DateTimeFormat(fmt === "system" ? undefined : this._intlLang, {
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
    try {
      return new Intl.DateTimeFormat(this._intlLang, {
        hour: "numeric", minute: "2-digit", hour12: true, timeZone: "UTC",
      }).format(new Date(Date.UTC(2000, 0, 1, Math.floor(mins / 60), mins % 60)));
    } catch (e) {
      const h = Math.floor(mins / 60);
      return `${((h + 11) % 12) + 1}:${String(mins % 60).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
    }
  }

  /** Localised AM / PM labels. */
  _dayPeriods() {
    const label = (h) => {
      try {
        const parts = new Intl.DateTimeFormat(this._intlLang, { hour: "numeric", hour12: true, timeZone: "UTC" })
          .formatToParts(new Date(Date.UTC(2000, 0, 1, h)));
        return parts.find((x) => x.type === "dayPeriod")?.value;
      } catch (e) {
        return undefined;
      }
    };
    return [label(9) || "AM", label(15) || "PM"];
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
    return new Intl.DateTimeFormat(this._intlLang, { weekday: "long", timeZone: this._tz }).format(new Date(iso));
  }

  _dayNames(style = "short") {
    // 2024-01-01 was a Monday.
    const fmt = new Intl.DateTimeFormat(this._intlLang, { weekday: style, timeZone: "UTC" });
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
      if (isOff && onSpec && (onSpec.type || "time") === "time" && tcMinutes(spec.time) <= tcMinutes(onSpec.time)) {
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
    const part = (verb, when) => this._t("action_when", { verb: this._verb(verb).toLowerCase(), when });
    if (group.action === "off") return part(verbs.off, this._whenText(group.off, true, null));
    let text = part(verbs.on, this._whenText(group.on, false));
    if (group.action === "on_off" && group.off && group.off.mode !== "none") {
      text += `, ${part(verbs.off, this._whenText(group.off, true, group.on))}`;
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
    const action = this._actionOf(timer);
    const raw = [{ days: timer.days || [], on: timer.on, off: timer.off }, ...(timer.overrides || [])];
    return raw.map((g, i) => ({
      action,
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
        ? this._t("waiting")
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
      <ha-card dir="${this._dir}">
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

    const arrow = this._rtl ? "mdi:arrow-left-thick" : "mdi:arrow-right-thick";
    const shows = (g) => (g.action === "off" ? "off" : g.action === "on" || g.off.mode === "none" ? "on" : "both");
    const events = groups.map((g) => {
      const show = shows(g);
      return `
        ${multi ? `<div class="group-label"><ha-icon icon="mdi:calendar-range"></ha-icon>${tcEsc(this._daysLabel(g.days))}</div>` : ""}
        <div class="events">
          ${show !== "off" ? this._eventBox(g, "on", verbs) : ""}
          ${show === "both" ? `<ha-icon class="arrow" icon="${arrow}"></ha-icon>` : ""}
          ${show !== "on" ? this._eventBox(g, "off", verbs) : ""}
        </div>`;
    }).join("");

    // The bar shows the times that apply today.
    const today = this._todayWeekday();
    const barGroup = groups.find((g) => g.days.includes(today)) || groups[0];
    const bar = this._renderBar(barGroup, shows(barGroup));

    let status;
    if (!enabled) status = `<ha-icon icon="mdi:pause-circle-outline"></ha-icon>${tcEsc(this._t("paused"))}`;
    else if (active && timer.next_off) {
      const p = this._parts(timer.next_off);
      status = `<ha-icon icon="mdi:play-circle"></ha-icon>${tcEsc(this._t("active_now", {
        verb: this._verb(verbs.off).toLowerCase(),
        when: this._t("when_time", { time: this._fmtHHMM(tcHHMM(p.minutes)) }),
      }))}`;
    } else if (groups[0].action === "off" && timer.next_off) {
      const p = this._parts(timer.next_off);
      status = `<ha-icon icon="mdi:clock-outline"></ha-icon>${tcEsc(this._t("next", {
        verb: this._verb(verbs.off).toLowerCase(),
        day: this._dayWord(timer.next_off),
        time: this._fmtHHMM(tcHHMM(p.minutes)),
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
      if (which === "off" && timer.action !== "off" && (timer.on.type || "time") === "time" && tcMinutes(spec.time) <= tcMinutes(timer.on.time)) {
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

  _renderBar(timer, show) {
    const pct = (m) => `${((m / 1440) * 100).toFixed(2)}%`;
    if (show === "off") {
      const off = this._minuteOf(timer, "off");
      if (off === null) return "";
      return this._barHTML(`<div class="mark off" style="left:${pct(off)}"></div>`);
    }
    const on = this._minuteOf(timer, "on");
    if (on === null) return "";
    let segs = "";
    if (show === "both") {
      const off = this._minuteOf(timer, "off");
      if (off !== null) {
        const ranges = off > on ? [[on, off]] : [[on, 1440], [0, off]];
        segs = ranges.map(([a, b]) => `<div class="seg" style="left:${pct(a)};width:${pct(Math.max(b - a, 6))}"></div>`).join("");
      }
    } else {
      segs = `<div class="mark" style="left:${pct(on)}"></div>`;
    }
    return this._barHTML(segs);
  }

  _barHTML(segs) {
    const pct = (m) => `${((m / 1440) * 100).toFixed(2)}%`;
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
      action: "on_off",
    };
  }

  _fillSpecs(group) {
    return {
      days: [...(group.days || [])],
      on: { type: "time", time: "19:00", offset: 0, ...(group.on || {}) },
      off: this._fillOff(group.off),
    };
  }

  _fillOff(off) {
    const filled = { mode: "time", type: "time", time: "23:00", offset: 0, duration: 60, ...(off || {}) };
    // "Don't turn off" is now the "Only turn on" choice, so keep a usable off time.
    if (filled.mode === "none") filled.mode = "time";
    return filled;
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
        action: this._actionOf(d),
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
        <div class="field-row">${this._timePicker(prefix, spec.time)}</div>`;
    }
    const offset = parseInt(spec.offset, 10) || 0;
    const dir = offset < 0 ? "before" : offset > 0 ? "after" : "exact";
    const sun = this._t(type === "sunrise" ? "sun_sunrise" : "sun_sunset");
    // Buttons instead of a <select>: native pickers are unreliable in the
    // Home Assistant Mac app.
    return `${typeSel}
      ${this._segmented(`${prefix}.dir`, [
        { value: "exact", label: this._t("exactly_sun", { sun }) },
        { value: "before", label: this._t("before") },
        { value: "after", label: this._t("after") },
      ], dir)}
      ${dir === "exact" ? "" : `<div class="field-row sun-row">
        <input class="num" type="text" inputmode="numeric" maxlength="3" autocomplete="off" data-field="${prefix}.offset_abs" value="${Math.abs(offset) || 30}">
        <span class="unit">${tcEsc(this._t("offset_unit", { dir: this._t(dir), sun }))}</span>
      </div>`}`;
  }

  /**
   * Hour and minute fields with up/down buttons. Deliberately not
   * <input type="time">: in the Home Assistant Mac app that opens a system
   * time picker which can crash the app.
   */
  _timePicker(prefix, value) {
    const mins = tcMinutes(value);
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const h12 = this._hour12;
    const pad = (n) => String(n).padStart(2, "0");
    const step = (part, delta, icon) => `
      <button type="button" class="tp-step" tabindex="-1" data-action="time-step" data-prefix="${prefix}" data-part="${part}" data-delta="${delta}" aria-label="${delta > 0 ? "+" : "-"}">
        <ha-icon icon="${icon}"></ha-icon>
      </button>`;
    return `
      <div class="time-picker" data-picker="${prefix}">
        <div class="tp-col">
          ${step("h", 1, "mdi:chevron-up")}
          <input class="tp-field" type="text" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="hours" data-field="${prefix}.hh" value="${h12 ? ((h + 11) % 12) + 1 : pad(h)}">
          ${step("h", -1, "mdi:chevron-down")}
        </div>
        <span class="tp-colon">:</span>
        <div class="tp-col">
          ${step("m", 5, "mdi:chevron-up")}
          <input class="tp-field" type="text" inputmode="numeric" maxlength="2" autocomplete="off" aria-label="minutes" data-field="${prefix}.mm" value="${pad(m)}">
          ${step("m", -5, "mdi:chevron-down")}
        </div>
        ${h12 ? `
          <div class="tp-ampm">
            <button type="button" class="${h < 12 ? "selected" : ""}" data-action="ampm" data-prefix="${prefix}" data-value="am">${tcEsc(this._dayPeriods()[0])}</button>
            <button type="button" class="${h >= 12 ? "selected" : ""}" data-action="ampm" data-prefix="${prefix}" data-value="pm">${tcEsc(this._dayPeriods()[1])}</button>
          </div>` : ""}
      </div>`;
  }

  /** Write a new time (minutes since midnight) and update the picker in place. */
  _setTime(prefix, minutes) {
    const spec = this._resolve(prefix);
    if (!spec) return;
    spec.time = tcHHMM(minutes);
    this._syncTimePicker(prefix);
    this._refreshLive();
  }

  _syncTimePicker(prefix) {
    const spec = this._resolve(prefix);
    const picker = this.shadowRoot.querySelector(`[data-picker="${prefix}"]`);
    if (!spec || !picker) return;
    const mins = tcMinutes(spec.time);
    const h = Math.floor(mins / 60);
    const hh = picker.querySelector('[data-field$=".hh"]');
    const mm = picker.querySelector('[data-field$=".mm"]');
    const shownH = this._hour12 ? String(((h + 11) % 12) + 1) : String(h).padStart(2, "0");
    if (hh && hh.value !== shownH) hh.value = shownH;
    const shownM = String(mins % 60).padStart(2, "0");
    if (mm && mm.value !== shownM) mm.value = shownM;
    picker.querySelectorAll("[data-action=ampm]").forEach((b) => {
      b.classList.toggle("selected", (b.dataset.value === "pm") === (h >= 12));
    });
  }

  /** Typing in the hour/minute field. Returns true when the input is complete. */
  _typeTime(prefix, part, raw) {
    const spec = this._resolve(prefix);
    if (!spec) return false;
    const digits = String(raw).replace(/\D/g, "");
    if (!digits) return false;
    const n = parseInt(digits, 10);
    const mins = tcMinutes(spec.time);
    let h = Math.floor(mins / 60);
    let m = mins % 60;
    if (part === "h") {
      if (this._hour12) {
        if (n < 1 || n > 12) return false;
        h = (n % 12) + (h >= 12 ? 12 : 0);
      } else {
        if (n > 23) return false;
        h = n;
      }
    } else {
      if (n > 59) return false;
      m = n;
    }
    spec.time = tcHHMM(h * 60 + m);
    this._refreshLive();
    // Done when two digits are typed or no second digit could follow.
    if (digits.length >= 2) return true;
    return part === "h" ? n > (this._hour12 ? 1 : 2) : n > 5;
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
    if (this._draft.action === "off") return this._momentEditor(prefix, group.off);
    const mode = group.off.mode;
    return `${this._segmented(`${prefix}.mode`, [
        { value: "time", label: this._t("off_at_time"), icon: "mdi:clock-outline" },
        { value: "duration", label: this._t("off_after"), icon: "mdi:timer-sand" },
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
        ${this._draft.action !== "off" ? `
          <div class="sub-title on"><ha-icon icon="mdi:power"></ha-icon>${tcEsc(this._verb(verbs.on))}</div>
          ${this._momentEditor(`overrides.${i}.on`, o.on)}` : ""}
        ${this._draft.action !== "on" ? `
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
    if (!verbs.hasOff) d.action = "on";
    const action = d.action;
    const badge = perDay ? `<span class="badge">${tcEsc(d.days.length ? this._daysLabel(d.days) : "…")}</span>` : "";

    this.shadowRoot.innerHTML = `
      <style>${TC_STYLES}</style>
      <ha-card dir="${this._dir}">
        <div class="editor">
          <div class="editor-head">
            <button class="icon-btn" data-action="cancel" aria-label="${tcEsc(this._t("cancel"))}"><ha-icon icon="${this._rtl ? "mdi:arrow-right" : "mdi:arrow-left"}"></ha-icon></button>
            <div class="title">${tcEsc(this._t(d.id ? "edit_timer" : "new_timer"))}</div>
          </div>

          <section class="step">
            <div class="step-title"><span class="num"><ha-icon icon="mdi:devices"></ha-icon></span>${tcEsc(this._t("step_devices"))}</div>
            ${this._devicePicker()}
          </section>

          ${verbs.hasOff ? `
          <section class="step">
            <div class="step-title"><span class="num"><ha-icon icon="mdi:swap-horizontal"></ha-icon></span>${tcEsc(this._t("step_action"))}</div>
            ${this._segmented("action", [
              { value: "on_off", label: this._t("action_both", { on: this._verb(verbs.on), off: this._verb(verbs.off).toLowerCase() }), icon: "mdi:power-cycle" },
              { value: "on", label: this._t("action_only", { verb: this._verb(verbs.on).toLowerCase() }), icon: "mdi:power" },
              { value: "off", label: this._t("action_only", { verb: this._verb(verbs.off).toLowerCase() }), icon: "mdi:power-off" },
            ], action, "wrap")}
          </section>` : `<div class="hint">${tcEsc(this._t("only_on"))}</div>`}

          ${action !== "off" ? `
          <section class="step step-on">
            <div class="step-title"><span class="num on"><ha-icon icon="mdi:power"></ha-icon></span>${tcEsc(this._verb(verbs.on))}${badge}</div>
            ${this._momentEditor("on", d.on)}
            ${this._optionsEditor()}
          </section>` : ""}

          ${action !== "on" ? `
          <section class="step step-off">
            <div class="step-title"><span class="num off"><ha-icon icon="mdi:power-off"></ha-icon></span>${tcEsc(this._verb(verbs.off))}${badge}</div>
            ${this._offEditor("off", d, verbs)}
          </section>` : ""}

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
              ${action !== "off" ? `<button type="button" class="small-btn on" data-action="run" data-event="on"><ha-icon icon="mdi:power"></ha-icon>${tcEsc(this._verb(verbs.on))}</button>` : ""}
              ${action !== "on" ? `<button type="button" class="small-btn off" data-action="run" data-event="off"><ha-icon icon="mdi:power-off"></ha-icon>${tcEsc(this._verb(verbs.off))}</button>` : ""}
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
    return { ...d, action: verbs.hasOff ? d.action : "on" };
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
    if (field === "action") { d.action = value; return; }
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
    const timePart = field.match(/^(.*)\.(hh|mm)$/);
    if (timePart) {
      const [, prefix, part] = timePart;
      const done = this._typeTime(prefix, part === "hh" ? "h" : "m", ev.target.value);
      if (done && part === "hh") {
        const next = this.shadowRoot.querySelector(`[data-field="${prefix}.mm"]`);
        next?.focus();
        next?.select();
      }
      return;
    }
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
    const timePart = field.match(/^(.*)\.(hh|mm)$/);
    if (timePart) {
      // Leaving the field: show the stored time neatly (e.g. "7" -> "07").
      this._syncTimePicker(timePart[1]);
      return;
    }
    this._setField(field, target.value);
    // Selects change the layout (e.g. the minutes field appears).
    if (field.endsWith(".dir")) this._renderEditor();
    else this._refreshLive();
  }

  _onKeyDown(ev) {
    const target = ev.target;
    const timePart = target?.dataset?.field?.match(/^(.*)\.(hh|mm)$/);
    if (timePart && (ev.key === "ArrowUp" || ev.key === "ArrowDown")) {
      ev.preventDefault();
      const spec = this._resolve(timePart[1]);
      const delta = (ev.key === "ArrowUp" ? 1 : -1) * (timePart[2] === "hh" ? 60 : 1);
      if (spec) this._setTime(timePart[1], tcMinutes(spec.time) + delta);
      target.select();
      return;
    }
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
      case "time-step": {
        const spec = this._resolve(el.dataset.prefix);
        if (!spec) break;
        const mins = tcMinutes(spec.time);
        const delta = parseInt(el.dataset.delta, 10);
        if (el.dataset.part === "h") {
          this._setTime(el.dataset.prefix, mins + delta * 60);
        } else {
          // Minutes move in steps of 5 and stay within the hour.
          const m = mins % 60;
          const next = delta > 0 ? Math.floor(m / 5) * 5 + 5 : Math.ceil(m / 5) * 5 - 5;
          this._setTime(el.dataset.prefix, mins - m + ((next % 60) + 60) % 60);
        }
        break;
      }
      case "ampm": {
        const spec = this._resolve(el.dataset.prefix);
        if (!spec) break;
        const mins = tcMinutes(spec.time);
        const pm = el.dataset.value === "pm";
        this._setTime(el.dataset.prefix, (mins % 720) + (pm ? 720 : 0));
        break;
      }
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
    const action = verbs.hasOff ? d.action : "on";
    const cleanOff = (off) => {
      if (action === "on" || off.mode === "none") return { mode: "none" };
      // Only turning off needs a moment of its own, not "after a while".
      const mode = action === "off" ? "time" : off.mode;
      return { mode, ...clean(off), duration: Math.max(1, parseInt(off.duration, 10) || 60) };
    };
    const options = {};
    const domains = new Set(d.entities.map(tcDomain));
    if (domains.has("light") && d.options.brightness != null) options.brightness = Number(d.options.brightness);
    if (domains.has("climate") && d.options.temperature != null) options.temperature = Number(d.options.temperature);
    if (domains.has("cover") && d.options.position != null) options.position = Number(d.options.position);
    return {
      name: (d.name || "").trim() || this._autoName(d.entities),
      enabled: d.enabled,
      action,
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
  ha-card { overflow: hidden; color: var(--tc-text); container-type: inline-size; }
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
    border-inline-start: 4px solid; display: flex; flex-direction: column; gap: 2px;
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

  .bar { direction: ltr; }
  .time-picker, .event-time { direction: ltr; unicode-bidi: isolate; }
  .toggle { direction: ltr; }
  .bar .track { position: relative; height: 8px; border-radius: 4px; background: var(--tc-soft); overflow: hidden; }
  .bar .seg { position: absolute; top: 0; bottom: 0; background: var(--tc-on); border-radius: 4px; opacity: .85; }
  .bar .mark { position: absolute; top: 0; bottom: 0; width: 4px; margin-left: -2px; background: var(--tc-on); border-radius: 2px; }
  .bar .mark.off { background: var(--tc-off); }
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
  .editor-head { display: flex; align-items: center; gap: 8px; margin-inline-start: -6px; }
  .step { border: 1px solid var(--tc-line); border-radius: var(--tc-radius); padding: 12px; display: flex; flex-direction: column; gap: 10px; }
  .step-on { border-inline-start: 4px solid var(--tc-on); }
  .step-off { border-inline-start: 4px solid var(--tc-off); }
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
  .time-picker { display: inline-flex; align-items: center; gap: 4px; }
  .tp-col { display: flex; flex-direction: column; align-items: center; }
  .tp-step {
    border: none; background: none; padding: 0 12px; border-radius: 8px; color: var(--tc-muted);
    display: inline-flex; min-height: 28px; align-items: center;
  }
  .tp-step:hover { background: var(--tc-soft); color: var(--tc-text); }
  .tp-step ha-icon { --mdc-icon-size: 24px; }
  .tp-field {
    width: 68px; text-align: center; font-size: 1.8rem; font-variant-numeric: tabular-nums; padding: 4px 0;
    border-radius: 10px; border: 1px solid var(--tc-line); background: var(--tc-soft); color: var(--tc-text);
  }
  .tp-colon { font-size: 1.8rem; font-weight: 500; padding-bottom: 2px; }
  .tp-ampm { display: flex; flex-direction: column; gap: 6px; margin-inline-start: 8px; }
  .tp-ampm button {
    border: 1px solid var(--tc-line); background: var(--tc-card); border-radius: 8px; padding: 4px 10px;
    font-size: .85rem; min-height: 32px;
  }
  .tp-ampm button.selected {
    background: color-mix(in srgb, var(--tc-accent) 16%, transparent); border-color: var(--tc-accent); font-weight: 500;
  }
  .num { width: 76px; padding: 6px 8px; border-radius: 8px; border: 1px solid var(--tc-line); background: var(--tc-soft); }
  .unit { color: var(--tc-muted); }
  .text-input { width: 100%; padding: 10px 12px; border-radius: 10px; border: 1px solid var(--tc-line); background: var(--tc-soft); }
  input:focus-visible { outline: 2px solid var(--tc-accent); outline-offset: 1px; }
  input[type=range] { flex: 1; min-width: 120px; accent-color: var(--tc-on); }
  .range-val { min-width: 44px; text-align: end; font-variant-numeric: tabular-nums; }
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
    text-align: start; border: none; background: none; padding: 8px; border-radius: 8px;
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
    margin-inline-start: auto; font-size: .78rem; font-weight: 500; padding: 2px 10px; border-radius: 999px;
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
  .override-head { display: flex; align-items: center; gap: 8px; font-weight: 500; margin-block: -4px; margin-inline-end: -6px; }
  .override-head ha-icon { color: var(--tc-accent); }
  .sub-title { display: flex; align-items: center; gap: 6px; font-weight: 500; font-size: .9rem; padding-top: 4px; }
  .sub-title ha-icon { --mdc-icon-size: 16px; }
  .sub-title.on { color: var(--tc-on); }
  .sub-title.off { color: var(--tc-off); border-top: 1px dashed var(--tc-line); padding-top: 10px; }
  .add-override { align-self: flex-start; }
  .summary ul { margin: 4px 0 0; padding-inline-start: 18px; }
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

  /* Wide card (wide dashboard section, panel view): timers side by side,
     and the editor stays a comfortable width in the middle. */
  @container (min-width: 720px) {
    .list { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); align-items: start; }
    .list > .notice, .list > .empty { grid-column: 1 / -1; }
    .editor { max-width: 760px; margin-inline: auto; }
  }

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
    const lang = (this._hass.locale?.language || this._hass.language || "en").split("-")[0].toLowerCase();
    const strings = TC_I18N[lang] || TC_I18N.en;
    if (!this._form) {
      this._form = document.createElement("ha-form");
      this._form.computeLabel = (s) => ({
        title: strings.cfg_title || TC_I18N.en.cfg_title,
        entities: strings.cfg_entities || TC_I18N.en.cfg_entities,
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
