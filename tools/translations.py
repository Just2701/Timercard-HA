"""All Timercard texts in one place.

Run ``python3 tools/translations.py`` after changing anything here. It
rewrites the TC_I18N block in the card and the integration's
translations/*.json files.

Placeholders like {time} must stay as they are. Their position may change to
fit the language (e.g. "{when} {verb}" in Hindi).
"""

from __future__ import annotations

import json
from pathlib import Path
import re

VERB_KEYS = ["turn_on", "turn_off", "open", "close", "unlock", "lock", "start", "dock",
             "activate", "run", "stop", "press"]

T: dict[str, dict] = {}

T["en"] = dict(
    title="Timers", new_timer="New timer", edit_timer="Edit timer",
    empty="No timers yet. Tap “New timer” to make your first one.",
    not_loaded="The Timercard integration is not set up yet. Go to Settings → Devices & services → Add integration and choose “Timercard”.",
    loading="Loading timers…",
    step_devices="What should the timer control?", search="Search for a device…", no_results="Nothing found",
    step_action="What should the timer do?", action_both="{on} and {off}", action_only="Only {verb}",
    action_when="{verb} {when}",
    step_days="On which days?", step_name="Name", name_optional="optional",
    every_day="Every day", weekdays="Weekdays", weekend="Weekend",
    at_time="Time", sunrise="Sunrise", sunset="Sunset",
    exactly_sun="exactly at {sun}", before="before", after="after", offset_unit="min {dir} {sun}",
    min="min", hour="h",
    off_at_time="At a time", off_after="After a while", for_how_long="How long should it stay on?",
    custom="Other", next_day="next day",
    only_on="These devices can only be switched one way, so there is nothing to undo.",
    set_brightness="Set brightness", set_temperature="Set temperature", set_position="Set position",
    save="Save", cancel="Cancel", delete="Delete", confirm_delete="Tap again to delete", try_now="Try it now:",
    need_device="Choose at least one device.", need_day="Choose at least one day.",
    need_day_group="Choose at least one day for each set of other times.",
    per_day="Different times on some days", per_day_hint="For example later in the weekend",
    main_days="The times above are used on:", other_times="Other times", other_days="On these days:",
    add_other="Add other days", remove="Remove",
    summary_title="In short",
    when_time="at {time}", when_sun="at {sun}", when_sun_offset="{min} min {dir} {sun}",
    sun_sunrise="sunrise", sun_sunset="sunset", when_duration="after {duration}",
    on_days="On {days}.", every_day_s="Every day.", weekdays_s="On weekdays.", weekend_s="In the weekend.",
    active_now="Running now · {verb} {when}", next="Next: {verb} {day} at {time}",
    today="today", tomorrow="tomorrow", paused="Paused – this timer will not run",
    and_more="+{n}", saved="Timer saved", deleted="Timer deleted", error="Something went wrong: {msg}",
    cfg_title="Title", cfg_entities="Only these devices (empty = all devices)",
    verbs=["Turn on", "Turn off", "Open", "Close", "Unlock", "Lock", "Start", "Send to dock",
           "Activate", "Run", "Stop", "Press"],
    shorts=["On", "Off", "Open", "Close", "Unlock", "Lock", "Start", "Dock", "Activate", "Run", "Stop", "Press"],
    setup=dict(
        title="Timercard",
        description="Add Timercard? After this, add the \"Timercard\" card to a dashboard to create your timers.",
        abort="Timercard is already set up.",
        done="Timercard is ready. Now refresh your browser (Ctrl+F5, or Cmd+Shift+R on a Mac). In the Home Assistant app: Settings → Companion app → Debugging → Reset frontend cache. Then edit a dashboard, choose Add card and search for \"Timercard\".",
    ),
)

T["nl"] = dict(
    title="Timers", new_timer="Nieuwe timer", edit_timer="Timer bewerken",
    empty="Nog geen timers. Tik op “Nieuwe timer” om je eerste te maken.",
    not_loaded="De Timercard-integratie is nog niet ingesteld. Ga naar Instellingen → Apparaten & diensten → Integratie toevoegen en kies “Timercard”.",
    loading="Timers laden…",
    step_devices="Wat moet de timer bedienen?", search="Zoek een apparaat…", no_results="Niets gevonden",
    step_action="Wat moet de timer doen?", action_both="{on} en {off}", action_only="Alleen {verb}",
    action_when="{verb} {when}",
    step_days="Op welke dagen?", step_name="Naam", name_optional="optioneel",
    every_day="Elke dag", weekdays="Werkdagen", weekend="Weekend",
    at_time="Tijd", sunrise="Zonsopkomst", sunset="Zonsondergang",
    exactly_sun="precies bij {sun}", before="voor", after="na", offset_unit="min {dir} {sun}",
    min="min", hour="u",
    off_at_time="Op een tijd", off_after="Na een tijdje", for_how_long="Hoe lang moet het aan blijven?",
    custom="Anders", next_day="volgende dag",
    only_on="Deze apparaten kunnen maar één kant op, dus er valt niets terug te zetten.",
    set_brightness="Helderheid instellen", set_temperature="Temperatuur instellen", set_position="Positie instellen",
    save="Opslaan", cancel="Annuleren", delete="Verwijderen", confirm_delete="Tik nogmaals om te verwijderen",
    try_now="Nu testen:",
    need_device="Kies minstens één apparaat.", need_day="Kies minstens één dag.",
    need_day_group="Kies minstens één dag voor elke set andere tijden.",
    per_day="Andere tijden op sommige dagen", per_day_hint="Bijvoorbeeld later in het weekend",
    main_days="De tijden hierboven gelden op:", other_times="Andere tijden", other_days="Op deze dagen:",
    add_other="Andere dagen toevoegen", remove="Verwijderen",
    summary_title="Kort gezegd",
    when_time="om {time}", when_sun="bij {sun}", when_sun_offset="{min} min {dir} {sun}",
    sun_sunrise="zonsopkomst", sun_sunset="zonsondergang", when_duration="na {duration}",
    on_days="Op {days}.", every_day_s="Elke dag.", weekdays_s="Op werkdagen.", weekend_s="In het weekend.",
    active_now="Nu actief · {verb} {when}", next="Volgende: {verb} {day} om {time}",
    today="vandaag", tomorrow="morgen", paused="Gepauzeerd – deze timer gaat niet af",
    and_more="+{n}", saved="Timer opgeslagen", deleted="Timer verwijderd", error="Er ging iets mis: {msg}",
    cfg_title="Titel", cfg_entities="Alleen deze apparaten (leeg = alle apparaten)",
    verbs=["Aanzetten", "Uitzetten", "Openen", "Sluiten", "Ontgrendelen", "Vergrendelen", "Starten",
           "Terug naar dock", "Activeren", "Uitvoeren", "Stoppen", "Indrukken"],
    shorts=["Aan", "Uit", "Open", "Dicht", "Open", "Op slot", "Start", "Dock", "Activeer", "Start", "Stop", "Druk"],
    setup=dict(
        title="Timercard",
        description="Timercard toevoegen? Voeg daarna de \"Timercard\"-kaart toe aan een dashboard om je timers te maken.",
        abort="Timercard is al ingesteld.",
        done="Timercard is klaar. Ververs nu je browser (Ctrl+F5, of Cmd+Shift+R op een Mac). In de Home Assistant-app: Instellingen → Companion-app → Foutopsporing → Frontend-cache resetten. Bewerk daarna een dashboard, kies Kaart toevoegen en zoek op \"Timercard\".",
    ),
)

T["zh"] = dict(
    title="定时器", new_timer="新建定时器", edit_timer="编辑定时器",
    empty="还没有定时器。点击“新建定时器”创建第一个。",
    not_loaded="Timercard 集成尚未设置。请前往“设置 → 设备与服务 → 添加集成”，然后选择“Timercard”。",
    loading="正在加载定时器…",
    step_devices="定时器要控制什么？", search="搜索设备…", no_results="未找到",
    step_action="定时器要做什么？", action_both="{on}和{off}", action_only="仅{verb}",
    action_when="{when} {verb}",
    step_days="在哪几天？", step_name="名称", name_optional="可选",
    every_day="每天", weekdays="工作日", weekend="周末",
    at_time="时间", sunrise="日出", sunset="日落",
    exactly_sun="{sun}时", before="之前", after="之后", offset_unit="分钟（{sun}{dir}）",
    min="分钟", hour="小时",
    off_at_time="指定时间", off_after="一段时间后", for_how_long="要保持开启多久？",
    custom="其他", next_day="次日",
    only_on="这些设备只能单向操作，因此没有需要撤销的动作。",
    set_brightness="设置亮度", set_temperature="设置温度", set_position="设置位置",
    save="保存", cancel="取消", delete="删除", confirm_delete="再次点击以删除", try_now="立即测试：",
    need_device="请至少选择一个设备。", need_day="请至少选择一天。",
    need_day_group="每组其他时间都需要至少选择一天。",
    per_day="某些日子使用不同时间", per_day_hint="例如周末晚一些",
    main_days="上面的时间用于：", other_times="其他时间", other_days="在这些日子：",
    add_other="添加其他日子", remove="移除",
    summary_title="简要说明",
    when_time="{time}", when_sun="{sun}时", when_sun_offset="{sun}{dir} {min} 分钟",
    sun_sunrise="日出", sun_sunset="日落", when_duration="{duration}后",
    on_days="{days}。", every_day_s="每天。", weekdays_s="工作日。", weekend_s="周末。",
    active_now="正在运行 · {when} {verb}", next="下次：{day} {time} {verb}",
    today="今天", tomorrow="明天", paused="已暂停 – 此定时器不会运行",
    and_more="+{n}", saved="定时器已保存", deleted="定时器已删除", error="出错了：{msg}",
    cfg_title="标题", cfg_entities="仅这些设备（留空 = 全部设备）",
    verbs=["打开", "关闭", "打开", "关闭", "解锁", "上锁", "启动", "返回充电座", "激活", "运行", "停止", "按下"],
    shorts=["开", "关", "开", "关", "解锁", "上锁", "启动", "回座", "激活", "运行", "停止", "按下"],
    setup=dict(
        title="Timercard",
        description="添加 Timercard？完成后，将“Timercard”卡片添加到仪表板即可创建定时器。",
        abort="Timercard 已经设置好了。",
        done="Timercard 已就绪。请刷新浏览器（Ctrl+F5，Mac 上为 Cmd+Shift+R）。在 Home Assistant 应用中：设置 → 配套应用 → 调试 → 重置前端缓存。然后编辑仪表板，选择“添加卡片”并搜索“Timercard”。",
    ),
)

T["hi"] = dict(
    title="टाइमर", new_timer="नया टाइमर", edit_timer="टाइमर बदलें",
    empty="अभी कोई टाइमर नहीं है। पहला टाइमर बनाने के लिए “नया टाइमर” पर टैप करें।",
    not_loaded="Timercard इंटीग्रेशन अभी सेट नहीं है। सेटिंग्स → डिवाइस और सेवाएँ → इंटीग्रेशन जोड़ें पर जाएँ और “Timercard” चुनें।",
    loading="टाइमर लोड हो रहे हैं…",
    step_devices="टाइमर किसे नियंत्रित करे?", search="डिवाइस खोजें…", no_results="कुछ नहीं मिला",
    step_action="टाइमर क्या करे?", action_both="{on} और {off}", action_only="केवल {verb}",
    action_when="{when} {verb}",
    step_days="किन दिनों पर?", step_name="नाम", name_optional="वैकल्पिक",
    every_day="हर दिन", weekdays="कार्यदिवस", weekend="सप्ताहांत",
    at_time="समय", sunrise="सूर्योदय", sunset="सूर्यास्त",
    exactly_sun="ठीक {sun} पर", before="पहले", after="बाद", offset_unit="मिनट ({sun} से {dir})",
    min="मिनट", hour="घंटे",
    off_at_time="किसी समय पर", off_after="कुछ देर बाद", for_how_long="कितनी देर चालू रहे?",
    custom="अन्य", next_day="अगले दिन",
    only_on="ये डिवाइस केवल एक ही तरफ़ काम करते हैं, इसलिए वापस करने को कुछ नहीं है।",
    set_brightness="चमक सेट करें", set_temperature="तापमान सेट करें", set_position="स्थिति सेट करें",
    save="सहेजें", cancel="रद्द करें", delete="हटाएँ", confirm_delete="हटाने के लिए फिर से टैप करें",
    try_now="अभी आज़माएँ:",
    need_device="कम से कम एक डिवाइस चुनें।", need_day="कम से कम एक दिन चुनें।",
    need_day_group="अन्य समय के हर सेट के लिए कम से कम एक दिन चुनें।",
    per_day="कुछ दिनों पर अलग समय", per_day_hint="जैसे सप्ताहांत में थोड़ा देर से",
    main_days="ऊपर का समय इन दिनों पर लागू है:", other_times="अन्य समय", other_days="इन दिनों पर:",
    add_other="अन्य दिन जोड़ें", remove="हटाएँ",
    summary_title="संक्षेप में",
    when_time="{time} बजे", when_sun="{sun} पर", when_sun_offset="{sun} से {min} मिनट {dir}",
    sun_sunrise="सूर्योदय", sun_sunset="सूर्यास्त", when_duration="{duration} बाद",
    on_days="{days} को।", every_day_s="हर दिन।", weekdays_s="कार्यदिवसों पर।", weekend_s="सप्ताहांत पर।",
    active_now="अभी चल रहा है · {when} {verb}", next="अगला: {day} {time} बजे {verb}",
    today="आज", tomorrow="कल", paused="रुका हुआ – यह टाइमर नहीं चलेगा",
    and_more="+{n}", saved="टाइमर सहेजा गया", deleted="टाइमर हटाया गया", error="कुछ गलत हो गया: {msg}",
    cfg_title="शीर्षक", cfg_entities="केवल ये डिवाइस (खाली = सभी डिवाइस)",
    verbs=["चालू करें", "बंद करें", "खोलें", "बंद करें", "अनलॉक करें", "लॉक करें", "शुरू करें",
           "डॉक पर भेजें", "सक्रिय करें", "चलाएँ", "रोकें", "दबाएँ"],
    shorts=["चालू", "बंद", "खोलें", "बंद", "अनलॉक", "लॉक", "शुरू", "डॉक", "सक्रिय", "चलाएँ", "रोकें", "दबाएँ"],
    setup=dict(
        title="Timercard",
        description="Timercard जोड़ें? इसके बाद टाइमर बनाने के लिए डैशबोर्ड पर \"Timercard\" कार्ड जोड़ें।",
        abort="Timercard पहले से सेट है।",
        done="Timercard तैयार है। अब अपना ब्राउज़र रीफ़्रेश करें (Ctrl+F5, Mac पर Cmd+Shift+R)। Home Assistant ऐप में: सेटिंग्स → Companion ऐप → डीबगिंग → फ़्रंटएंड कैश रीसेट करें। फिर डैशबोर्ड संपादित करें, कार्ड जोड़ें चुनें और \"Timercard\" खोजें।",
    ),
)

T["es"] = dict(
    title="Temporizadores", new_timer="Nuevo temporizador", edit_timer="Editar temporizador",
    empty="Aún no hay temporizadores. Toca «Nuevo temporizador» para crear el primero.",
    not_loaded="La integración Timercard aún no está configurada. Ve a Ajustes → Dispositivos y servicios → Añadir integración y elige «Timercard».",
    loading="Cargando temporizadores…",
    step_devices="¿Qué debe controlar el temporizador?", search="Buscar un dispositivo…", no_results="No se encontró nada",
    step_action="¿Qué debe hacer el temporizador?", action_both="{on} y {off}", action_only="Solo {verb}",
    action_when="{verb} {when}",
    step_days="¿Qué días?", step_name="Nombre", name_optional="opcional",
    every_day="Todos los días", weekdays="Entre semana", weekend="Fin de semana",
    at_time="Hora", sunrise="Amanecer", sunset="Atardecer",
    exactly_sun="justo al {sun}", before="antes", after="después", offset_unit="min {dir} del {sun}",
    min="min", hour="h",
    off_at_time="A una hora", off_after="Después de un rato", for_how_long="¿Cuánto tiempo debe quedarse encendido?",
    custom="Otro", next_day="día siguiente",
    only_on="Estos dispositivos solo funcionan en un sentido, así que no hay nada que deshacer.",
    set_brightness="Ajustar brillo", set_temperature="Ajustar temperatura", set_position="Ajustar posición",
    save="Guardar", cancel="Cancelar", delete="Eliminar", confirm_delete="Toca otra vez para eliminar",
    try_now="Probar ahora:",
    need_device="Elige al menos un dispositivo.", need_day="Elige al menos un día.",
    need_day_group="Elige al menos un día para cada grupo de otros horarios.",
    per_day="Otros horarios algunos días", per_day_hint="Por ejemplo, más tarde el fin de semana",
    main_days="Los horarios de arriba se usan:", other_times="Otros horarios", other_days="Estos días:",
    add_other="Añadir otros días", remove="Quitar",
    summary_title="En resumen",
    when_time="a las {time}", when_sun="al {sun}", when_sun_offset="{min} min {dir} del {sun}",
    sun_sunrise="amanecer", sun_sunset="atardecer", when_duration="después de {duration}",
    on_days="Días: {days}.", every_day_s="Todos los días.", weekdays_s="Entre semana.", weekend_s="El fin de semana.",
    active_now="Activo ahora · {verb} {when}", next="Próximo: {verb} {day} a las {time}",
    today="hoy", tomorrow="mañana", paused="En pausa: este temporizador no se ejecutará",
    and_more="+{n}", saved="Temporizador guardado", deleted="Temporizador eliminado", error="Algo salió mal: {msg}",
    cfg_title="Título", cfg_entities="Solo estos dispositivos (vacío = todos)",
    verbs=["Encender", "Apagar", "Abrir", "Cerrar", "Desbloquear", "Bloquear", "Iniciar", "Volver a la base",
           "Activar", "Ejecutar", "Detener", "Pulsar"],
    shorts=["Encender", "Apagar", "Abrir", "Cerrar", "Desbloquear", "Bloquear", "Iniciar", "Base",
            "Activar", "Ejecutar", "Detener", "Pulsar"],
    setup=dict(
        title="Timercard",
        description="¿Añadir Timercard? Después, añade la tarjeta \"Timercard\" a un panel para crear tus temporizadores.",
        abort="Timercard ya está configurado.",
        done="Timercard está listo. Ahora actualiza el navegador (Ctrl+F5, o Cmd+Shift+R en un Mac). En la app de Home Assistant: Ajustes → App complementaria → Depuración → Restablecer caché del frontend. Luego edita un panel, elige Añadir tarjeta y busca \"Timercard\".",
    ),
)

T["ar"] = dict(
    title="المؤقتات", new_timer="مؤقت جديد", edit_timer="تعديل المؤقت",
    empty="لا توجد مؤقتات بعد. اضغط على «مؤقت جديد» لإنشاء أول مؤقت.",
    not_loaded="لم يتم إعداد تكامل Timercard بعد. انتقل إلى الإعدادات ← الأجهزة والخدمات ← إضافة تكامل واختر «Timercard».",
    loading="جارٍ تحميل المؤقتات…",
    step_devices="ما الذي يتحكم فيه المؤقت؟", search="ابحث عن جهاز…", no_results="لم يتم العثور على شيء",
    step_action="ماذا يفعل المؤقت؟", action_both="{on} و{off}", action_only="{verb} فقط",
    action_when="{verb} {when}",
    step_days="في أي أيام؟", step_name="الاسم", name_optional="اختياري",
    every_day="كل يوم", weekdays="أيام العمل", weekend="عطلة نهاية الأسبوع",
    at_time="وقت", sunrise="الشروق", sunset="الغروب",
    exactly_sun="تمامًا عند {sun}", before="قبل", after="بعد", offset_unit="دقيقة {dir} {sun}",
    min="دقيقة", hour="ساعة",
    off_at_time="في وقت محدد", off_after="بعد مدة", for_how_long="كم من الوقت يبقى قيد التشغيل؟",
    custom="أخرى", next_day="اليوم التالي",
    only_on="هذه الأجهزة تعمل في اتجاه واحد فقط، لذلك لا يوجد ما يمكن التراجع عنه.",
    set_brightness="ضبط السطوع", set_temperature="ضبط درجة الحرارة", set_position="ضبط الموضع",
    save="حفظ", cancel="إلغاء", delete="حذف", confirm_delete="اضغط مرة أخرى للحذف", try_now="جرّب الآن:",
    need_device="اختر جهازًا واحدًا على الأقل.", need_day="اختر يومًا واحدًا على الأقل.",
    need_day_group="اختر يومًا واحدًا على الأقل لكل مجموعة من الأوقات الأخرى.",
    per_day="أوقات مختلفة في بعض الأيام", per_day_hint="مثلًا في وقت لاحق في عطلة نهاية الأسبوع",
    main_days="الأوقات أعلاه تُستخدم في:", other_times="أوقات أخرى", other_days="في هذه الأيام:",
    add_other="إضافة أيام أخرى", remove="إزالة",
    summary_title="باختصار",
    when_time="الساعة {time}", when_sun="عند {sun}", when_sun_offset="{min} دقيقة {dir} {sun}",
    sun_sunrise="الشروق", sun_sunset="الغروب", when_duration="بعد {duration}",
    on_days="الأيام: {days}.", every_day_s="كل يوم.", weekdays_s="في أيام العمل.", weekend_s="في عطلة نهاية الأسبوع.",
    active_now="يعمل الآن · {verb} {when}", next="التالي: {verb} {day} الساعة {time}",
    today="اليوم", tomorrow="غدًا", paused="متوقف مؤقتًا – لن يعمل هذا المؤقت",
    and_more="+{n}", saved="تم حفظ المؤقت", deleted="تم حذف المؤقت", error="حدث خطأ ما: {msg}",
    cfg_title="العنوان", cfg_entities="هذه الأجهزة فقط (فارغ = كل الأجهزة)",
    verbs=["تشغيل", "إيقاف", "فتح", "إغلاق", "إلغاء القفل", "قفل", "بدء", "العودة إلى القاعدة",
           "تفعيل", "تنفيذ", "إيقاف", "ضغط"],
    shorts=["تشغيل", "إيقاف", "فتح", "إغلاق", "فتح القفل", "قفل", "بدء", "القاعدة", "تفعيل", "تنفيذ", "إيقاف", "ضغط"],
    setup=dict(
        title="Timercard",
        description="هل تريد إضافة Timercard؟ بعد ذلك أضف بطاقة \"Timercard\" إلى لوحة معلومات لإنشاء المؤقتات.",
        abort="تم إعداد Timercard بالفعل.",
        done="Timercard جاهز. حدّث المتصفح الآن (Ctrl+F5، أو Cmd+Shift+R على Mac). في تطبيق Home Assistant: الإعدادات ← التطبيق المرافق ← تصحيح الأخطاء ← إعادة تعيين ذاكرة التخزين المؤقت للواجهة. ثم عدّل لوحة معلومات واختر إضافة بطاقة وابحث عن \"Timercard\".",
    ),
)

T["fr"] = dict(
    title="Minuteurs", new_timer="Nouveau minuteur", edit_timer="Modifier le minuteur",
    empty="Aucun minuteur pour l’instant. Touchez « Nouveau minuteur » pour créer le premier.",
    not_loaded="L’intégration Timercard n’est pas encore configurée. Allez dans Paramètres → Appareils et services → Ajouter une intégration et choisissez « Timercard ».",
    loading="Chargement des minuteurs…",
    step_devices="Que doit commander le minuteur ?", search="Rechercher un appareil…", no_results="Aucun résultat",
    step_action="Que doit faire le minuteur ?", action_both="{on} et {off}", action_only="Seulement {verb}",
    action_when="{verb} {when}",
    step_days="Quels jours ?", step_name="Nom", name_optional="facultatif",
    every_day="Tous les jours", weekdays="En semaine", weekend="Week-end",
    at_time="Heure", sunrise="Lever du soleil", sunset="Coucher du soleil",
    exactly_sun="pile au {sun}", before="avant", after="après", offset_unit="min {dir} le {sun}",
    min="min", hour="h",
    off_at_time="À une heure", off_after="Après un moment", for_how_long="Combien de temps doit-il rester allumé ?",
    custom="Autre", next_day="le lendemain",
    only_on="Ces appareils ne fonctionnent que dans un sens : il n’y a rien à annuler.",
    set_brightness="Régler la luminosité", set_temperature="Régler la température", set_position="Régler la position",
    save="Enregistrer", cancel="Annuler", delete="Supprimer", confirm_delete="Touchez encore pour supprimer",
    try_now="Tester maintenant :",
    need_device="Choisissez au moins un appareil.", need_day="Choisissez au moins un jour.",
    need_day_group="Choisissez au moins un jour pour chaque groupe d’autres horaires.",
    per_day="Autres horaires certains jours", per_day_hint="Par exemple plus tard le week-end",
    main_days="Les horaires ci-dessus s’appliquent :", other_times="Autres horaires", other_days="Ces jours-là :",
    add_other="Ajouter d’autres jours", remove="Retirer",
    summary_title="En bref",
    when_time="à {time}", when_sun="au {sun}", when_sun_offset="{min} min {dir} le {sun}",
    sun_sunrise="lever du soleil", sun_sunset="coucher du soleil", when_duration="après {duration}",
    on_days="Jours : {days}.", every_day_s="Tous les jours.", weekdays_s="En semaine.", weekend_s="Le week-end.",
    active_now="En cours · {verb} {when}", next="Prochain : {verb} {day} à {time}",
    today="aujourd’hui", tomorrow="demain", paused="En pause – ce minuteur ne se déclenchera pas",
    and_more="+{n}", saved="Minuteur enregistré", deleted="Minuteur supprimé", error="Une erreur est survenue : {msg}",
    cfg_title="Titre", cfg_entities="Seulement ces appareils (vide = tous)",
    verbs=["Allumer", "Éteindre", "Ouvrir", "Fermer", "Déverrouiller", "Verrouiller", "Démarrer",
           "Retour à la base", "Activer", "Lancer", "Arrêter", "Appuyer"],
    shorts=["Allumer", "Éteindre", "Ouvrir", "Fermer", "Déverrouiller", "Verrouiller", "Démarrer", "Base",
            "Activer", "Lancer", "Arrêter", "Appuyer"],
    setup=dict(
        title="Timercard",
        description="Ajouter Timercard ? Ajoutez ensuite la carte « Timercard » à un tableau de bord pour créer vos minuteurs.",
        abort="Timercard est déjà configuré.",
        done="Timercard est prêt. Actualisez maintenant votre navigateur (Ctrl+F5, ou Cmd+Maj+R sur Mac). Dans l’app Home Assistant : Paramètres → Application compagnon → Débogage → Réinitialiser le cache du frontend. Modifiez ensuite un tableau de bord, choisissez Ajouter une carte et recherchez « Timercard ».",
    ),
)

T["bn"] = dict(
    title="টাইমার", new_timer="নতুন টাইমার", edit_timer="টাইমার সম্পাদনা",
    empty="এখনও কোনো টাইমার নেই। প্রথমটি বানাতে “নতুন টাইমার”-এ ট্যাপ করুন।",
    not_loaded="Timercard ইন্টিগ্রেশন এখনও সেট আপ করা হয়নি। সেটিংস → ডিভাইস ও পরিষেবা → ইন্টিগ্রেশন যোগ করুন-এ গিয়ে “Timercard” বেছে নিন।",
    loading="টাইমার লোড হচ্ছে…",
    step_devices="টাইমার কী নিয়ন্ত্রণ করবে?", search="ডিভাইস খুঁজুন…", no_results="কিছু পাওয়া যায়নি",
    step_action="টাইমার কী করবে?", action_both="{on} ও {off}", action_only="শুধু {verb}",
    action_when="{when} {verb}",
    step_days="কোন কোন দিন?", step_name="নাম", name_optional="ঐচ্ছিক",
    every_day="প্রতিদিন", weekdays="কর্মদিবস", weekend="সপ্তাহান্ত",
    at_time="সময়", sunrise="সূর্যোদয়", sunset="সূর্যাস্ত",
    exactly_sun="ঠিক {sun}-এ", before="আগে", after="পরে", offset_unit="মিনিট ({sun}-এর {dir})",
    min="মিনিট", hour="ঘণ্টা",
    off_at_time="নির্দিষ্ট সময়ে", off_after="কিছুক্ষণ পরে", for_how_long="কতক্ষণ চালু থাকবে?",
    custom="অন্য", next_day="পরের দিন",
    only_on="এই ডিভাইসগুলো শুধু এক দিকেই কাজ করে, তাই ফেরানোর কিছু নেই।",
    set_brightness="উজ্জ্বলতা সেট করুন", set_temperature="তাপমাত্রা সেট করুন", set_position="অবস্থান সেট করুন",
    save="সংরক্ষণ", cancel="বাতিল", delete="মুছুন", confirm_delete="মুছতে আবার ট্যাপ করুন",
    try_now="এখনই চেষ্টা করুন:",
    need_device="অন্তত একটি ডিভাইস বেছে নিন।", need_day="অন্তত একটি দিন বেছে নিন।",
    need_day_group="অন্য সময়ের প্রতিটি সেটের জন্য অন্তত একটি দিন বেছে নিন।",
    per_day="কিছু দিনে ভিন্ন সময়", per_day_hint="যেমন সপ্তাহান্তে একটু দেরিতে",
    main_days="উপরের সময় প্রযোজ্য:", other_times="অন্য সময়", other_days="এই দিনগুলোতে:",
    add_other="অন্য দিন যোগ করুন", remove="সরান",
    summary_title="সংক্ষেপে",
    when_time="{time}-এ", when_sun="{sun}-এ", when_sun_offset="{sun}-এর {min} মিনিট {dir}",
    sun_sunrise="সূর্যোদয়", sun_sunset="সূর্যাস্ত", when_duration="{duration} পরে",
    on_days="{days}।", every_day_s="প্রতিদিন।", weekdays_s="কর্মদিবসে।", weekend_s="সপ্তাহান্তে।",
    active_now="এখন চলছে · {when} {verb}", next="পরবর্তী: {day} {time}-এ {verb}",
    today="আজ", tomorrow="আগামীকাল", paused="বিরতিতে – এই টাইমার চলবে না",
    and_more="+{n}", saved="টাইমার সংরক্ষিত হয়েছে", deleted="টাইমার মুছে ফেলা হয়েছে", error="কিছু ভুল হয়েছে: {msg}",
    cfg_title="শিরোনাম", cfg_entities="শুধু এই ডিভাইসগুলো (খালি = সব)",
    verbs=["চালু করুন", "বন্ধ করুন", "খুলুন", "বন্ধ করুন", "আনলক করুন", "লক করুন", "শুরু করুন",
           "ডকে পাঠান", "সক্রিয় করুন", "চালান", "থামান", "চাপুন"],
    shorts=["চালু", "বন্ধ", "খোলা", "বন্ধ", "আনলক", "লক", "শুরু", "ডক", "সক্রিয়", "চালান", "থামান", "চাপুন"],
    setup=dict(
        title="Timercard",
        description="Timercard যোগ করবেন? এরপর টাইমার তৈরি করতে ড্যাশবোর্ডে \"Timercard\" কার্ড যোগ করুন।",
        abort="Timercard আগেই সেট আপ করা আছে।",
        done="Timercard প্রস্তুত। এখন ব্রাউজার রিফ্রেশ করুন (Ctrl+F5, Mac-এ Cmd+Shift+R)। Home Assistant অ্যাপে: সেটিংস → Companion অ্যাপ → ডিবাগিং → ফ্রন্টএন্ড ক্যাশ রিসেট করুন। তারপর একটি ড্যাশবোর্ড সম্পাদনা করুন, কার্ড যোগ করুন বেছে নিয়ে \"Timercard\" খুঁজুন।",
    ),
)

T["pt"] = dict(
    title="Temporizadores", new_timer="Novo temporizador", edit_timer="Editar temporizador",
    empty="Ainda não há temporizadores. Toque em “Novo temporizador” para criar o primeiro.",
    not_loaded="A integração Timercard ainda não está configurada. Vá a Configurações → Dispositivos e serviços → Adicionar integração e escolha “Timercard”.",
    loading="Carregando temporizadores…",
    step_devices="O que o temporizador deve controlar?", search="Pesquisar um dispositivo…", no_results="Nada encontrado",
    step_action="O que o temporizador deve fazer?", action_both="{on} e {off}", action_only="Só {verb}",
    action_when="{verb} {when}",
    step_days="Em quais dias?", step_name="Nome", name_optional="opcional",
    every_day="Todos os dias", weekdays="Dias úteis", weekend="Fim de semana",
    at_time="Hora", sunrise="Nascer do sol", sunset="Pôr do sol",
    exactly_sun="exatamente no {sun}", before="antes", after="depois", offset_unit="min {dir} do {sun}",
    min="min", hour="h",
    off_at_time="Num horário", off_after="Depois de um tempo", for_how_long="Por quanto tempo deve ficar ligado?",
    custom="Outro", next_day="dia seguinte",
    only_on="Estes dispositivos só funcionam num sentido, por isso não há nada para desfazer.",
    set_brightness="Definir brilho", set_temperature="Definir temperatura", set_position="Definir posição",
    save="Salvar", cancel="Cancelar", delete="Excluir", confirm_delete="Toque de novo para excluir",
    try_now="Testar agora:",
    need_device="Escolha pelo menos um dispositivo.", need_day="Escolha pelo menos um dia.",
    need_day_group="Escolha pelo menos um dia para cada grupo de outros horários.",
    per_day="Horários diferentes em alguns dias", per_day_hint="Por exemplo, mais tarde no fim de semana",
    main_days="Os horários acima valem em:", other_times="Outros horários", other_days="Nestes dias:",
    add_other="Adicionar outros dias", remove="Remover",
    summary_title="Resumindo",
    when_time="às {time}", when_sun="no {sun}", when_sun_offset="{min} min {dir} do {sun}",
    sun_sunrise="nascer do sol", sun_sunset="pôr do sol", when_duration="depois de {duration}",
    on_days="Dias: {days}.", every_day_s="Todos os dias.", weekdays_s="Nos dias úteis.", weekend_s="No fim de semana.",
    active_now="Ativo agora · {verb} {when}", next="Próximo: {verb} {day} às {time}",
    today="hoje", tomorrow="amanhã", paused="Pausado – este temporizador não vai funcionar",
    and_more="+{n}", saved="Temporizador salvo", deleted="Temporizador excluído", error="Algo deu errado: {msg}",
    cfg_title="Título", cfg_entities="Só estes dispositivos (vazio = todos)",
    verbs=["Ligar", "Desligar", "Abrir", "Fechar", "Desbloquear", "Bloquear", "Iniciar", "Voltar à base",
           "Ativar", "Executar", "Parar", "Pressionar"],
    shorts=["Ligar", "Desligar", "Abrir", "Fechar", "Desbloquear", "Bloquear", "Iniciar", "Base",
            "Ativar", "Executar", "Parar", "Pressionar"],
    setup=dict(
        title="Timercard",
        description="Adicionar o Timercard? Depois, adicione o cartão \"Timercard\" a um painel para criar seus temporizadores.",
        abort="O Timercard já está configurado.",
        done="O Timercard está pronto. Agora atualize o navegador (Ctrl+F5, ou Cmd+Shift+R no Mac). No app Home Assistant: Configurações → App complementar → Depuração → Redefinir cache do frontend. Depois edite um painel, escolha Adicionar cartão e pesquise \"Timercard\".",
    ),
)

T["ru"] = dict(
    title="Таймеры", new_timer="Новый таймер", edit_timer="Изменить таймер",
    empty="Таймеров пока нет. Нажмите «Новый таймер», чтобы создать первый.",
    not_loaded="Интеграция Timercard ещё не настроена. Откройте Настройки → Устройства и службы → Добавить интеграцию и выберите «Timercard».",
    loading="Загрузка таймеров…",
    step_devices="Чем должен управлять таймер?", search="Найти устройство…", no_results="Ничего не найдено",
    step_action="Что должен делать таймер?", action_both="{on} и {off}", action_only="Только {verb}",
    action_when="{verb} {when}",
    step_days="В какие дни?", step_name="Название", name_optional="необязательно",
    every_day="Каждый день", weekdays="Будни", weekend="Выходные",
    at_time="Время", sunrise="Восход", sunset="Закат",
    exactly_sun="ровно в момент {sun}", before="до", after="после", offset_unit="мин {dir} {sun}",
    min="мин", hour="ч",
    off_at_time="В заданное время", off_after="Через некоторое время", for_how_long="Сколько времени оставить включённым?",
    custom="Другое", next_day="на следующий день",
    only_on="Эти устройства работают только в одну сторону, отменять нечего.",
    set_brightness="Задать яркость", set_temperature="Задать температуру", set_position="Задать положение",
    save="Сохранить", cancel="Отмена", delete="Удалить", confirm_delete="Нажмите ещё раз, чтобы удалить",
    try_now="Проверить сейчас:",
    need_device="Выберите хотя бы одно устройство.", need_day="Выберите хотя бы один день.",
    need_day_group="Выберите хотя бы один день для каждого набора другого времени.",
    per_day="Другое время в некоторые дни", per_day_hint="Например, позже в выходные",
    main_days="Время выше действует в дни:", other_times="Другое время", other_days="В эти дни:",
    add_other="Добавить другие дни", remove="Убрать",
    summary_title="Кратко",
    when_time="в {time}", when_sun="в момент {sun}", when_sun_offset="{min} мин {dir} {sun}",
    sun_sunrise="восхода", sun_sunset="заката", when_duration="через {duration}",
    on_days="Дни: {days}.", every_day_s="Каждый день.", weekdays_s="По будням.", weekend_s="По выходным.",
    active_now="Работает сейчас · {verb} {when}", next="Далее: {verb} {day} в {time}",
    today="сегодня", tomorrow="завтра", paused="На паузе — этот таймер не сработает",
    and_more="+{n}", saved="Таймер сохранён", deleted="Таймер удалён", error="Что-то пошло не так: {msg}",
    cfg_title="Заголовок", cfg_entities="Только эти устройства (пусто = все)",
    verbs=["Включить", "Выключить", "Открыть", "Закрыть", "Разблокировать", "Заблокировать", "Запустить",
           "Вернуть на базу", "Активировать", "Запустить", "Остановить", "Нажать"],
    shorts=["Вкл", "Выкл", "Открыть", "Закрыть", "Разблок.", "Заблок.", "Старт", "База", "Активировать",
            "Запуск", "Стоп", "Нажать"],
    setup=dict(
        title="Timercard",
        description="Добавить Timercard? После этого добавьте карточку «Timercard» на панель, чтобы создавать таймеры.",
        abort="Timercard уже настроен.",
        done="Timercard готов. Обновите браузер (Ctrl+F5 или Cmd+Shift+R на Mac). В приложении Home Assistant: Настройки → Companion-приложение → Отладка → Сбросить кэш интерфейса. Затем измените панель, выберите «Добавить карточку» и найдите «Timercard».",
    ),
)

T["ur"] = dict(
    title="ٹائمر", new_timer="نیا ٹائمر", edit_timer="ٹائمر میں ترمیم",
    empty="ابھی کوئی ٹائمر نہیں ہے۔ پہلا ٹائمر بنانے کے لیے “نیا ٹائمر” پر ٹیپ کریں۔",
    not_loaded="Timercard انٹیگریشن ابھی سیٹ اپ نہیں ہوئی۔ سیٹنگز ← ڈیوائسز اور سروسز ← انٹیگریشن شامل کریں پر جائیں اور “Timercard” منتخب کریں۔",
    loading="ٹائمر لوڈ ہو رہے ہیں…",
    step_devices="ٹائمر کس کو کنٹرول کرے؟", search="ڈیوائس تلاش کریں…", no_results="کچھ نہیں ملا",
    step_action="ٹائمر کیا کرے؟", action_both="{on} اور {off}", action_only="صرف {verb}",
    action_when="{when} {verb}",
    step_days="کن دنوں میں؟", step_name="نام", name_optional="اختیاری",
    every_day="ہر روز", weekdays="کام کے دن", weekend="ویک اینڈ",
    at_time="وقت", sunrise="طلوعِ آفتاب", sunset="غروبِ آفتاب",
    exactly_sun="عین {sun} پر", before="پہلے", after="بعد", offset_unit="منٹ ({sun} سے {dir})",
    min="منٹ", hour="گھنٹے",
    off_at_time="کسی وقت پر", off_after="کچھ دیر بعد", for_how_long="کتنی دیر آن رہے؟",
    custom="دیگر", next_day="اگلے دن",
    only_on="یہ ڈیوائسز صرف ایک طرف کام کرتی ہیں، اس لیے واپس کرنے کو کچھ نہیں۔",
    set_brightness="روشنی سیٹ کریں", set_temperature="درجہ حرارت سیٹ کریں", set_position="پوزیشن سیٹ کریں",
    save="محفوظ کریں", cancel="منسوخ", delete="حذف کریں", confirm_delete="حذف کرنے کے لیے دوبارہ ٹیپ کریں",
    try_now="ابھی آزمائیں:",
    need_device="کم از کم ایک ڈیوائس منتخب کریں۔", need_day="کم از کم ایک دن منتخب کریں۔",
    need_day_group="دیگر اوقات کے ہر سیٹ کے لیے کم از کم ایک دن منتخب کریں۔",
    per_day="کچھ دنوں میں مختلف اوقات", per_day_hint="مثلاً ویک اینڈ پر ذرا دیر سے",
    main_days="اوپر والے اوقات ان دنوں میں:", other_times="دیگر اوقات", other_days="ان دنوں میں:",
    add_other="دیگر دن شامل کریں", remove="ہٹائیں",
    summary_title="مختصراً",
    when_time="{time} بجے", when_sun="{sun} پر", when_sun_offset="{sun} سے {min} منٹ {dir}",
    sun_sunrise="طلوعِ آفتاب", sun_sunset="غروبِ آفتاب", when_duration="{duration} بعد",
    on_days="{days} کو۔", every_day_s="ہر روز۔", weekdays_s="کام کے دنوں میں۔", weekend_s="ویک اینڈ پر۔",
    active_now="ابھی چل رہا ہے · {when} {verb}", next="اگلا: {day} {time} بجے {verb}",
    today="آج", tomorrow="کل", paused="موقوف – یہ ٹائمر نہیں چلے گا",
    and_more="+{n}", saved="ٹائمر محفوظ ہو گیا", deleted="ٹائمر حذف ہو گیا", error="کچھ غلط ہو گیا: {msg}",
    cfg_title="عنوان", cfg_entities="صرف یہ ڈیوائسز (خالی = سب)",
    verbs=["آن کریں", "بند کریں", "کھولیں", "بند کریں", "ان لاک کریں", "لاک کریں", "شروع کریں",
           "ڈاک پر بھیجیں", "فعال کریں", "چلائیں", "روکیں", "دبائیں"],
    shorts=["آن", "بند", "کھولیں", "بند", "ان لاک", "لاک", "شروع", "ڈاک", "فعال", "چلائیں", "روکیں", "دبائیں"],
    setup=dict(
        title="Timercard",
        description="Timercard شامل کریں؟ اس کے بعد ٹائمر بنانے کے لیے ڈیش بورڈ میں \"Timercard\" کارڈ شامل کریں۔",
        abort="Timercard پہلے سے سیٹ اپ ہے۔",
        done="Timercard تیار ہے۔ اب اپنا براؤزر ریفریش کریں (Ctrl+F5، Mac پر Cmd+Shift+R)۔ Home Assistant ایپ میں: سیٹنگز ← Companion ایپ ← ڈیبگنگ ← فرنٹ اینڈ کیش ری سیٹ کریں۔ پھر ڈیش بورڈ میں ترمیم کریں، کارڈ شامل کریں منتخب کریں اور \"Timercard\" تلاش کریں۔",
    ),
)

T["id"] = dict(
    title="Timer", new_timer="Timer baru", edit_timer="Ubah timer",
    empty="Belum ada timer. Ketuk “Timer baru” untuk membuat yang pertama.",
    not_loaded="Integrasi Timercard belum disiapkan. Buka Pengaturan → Perangkat & layanan → Tambahkan integrasi lalu pilih “Timercard”.",
    loading="Memuat timer…",
    step_devices="Apa yang harus dikendalikan timer?", search="Cari perangkat…", no_results="Tidak ditemukan",
    step_action="Apa yang harus dilakukan timer?", action_both="{on} dan {off}", action_only="Hanya {verb}",
    action_when="{verb} {when}",
    step_days="Pada hari apa?", step_name="Nama", name_optional="opsional",
    every_day="Setiap hari", weekdays="Hari kerja", weekend="Akhir pekan",
    at_time="Waktu", sunrise="Matahari terbit", sunset="Matahari terbenam",
    exactly_sun="tepat saat {sun}", before="sebelum", after="setelah", offset_unit="menit {dir} {sun}",
    min="mnt", hour="j",
    off_at_time="Pada waktu tertentu", off_after="Setelah beberapa saat", for_how_long="Berapa lama harus tetap menyala?",
    custom="Lainnya", next_day="hari berikutnya",
    only_on="Perangkat ini hanya bisa satu arah, jadi tidak ada yang perlu dibatalkan.",
    set_brightness="Atur kecerahan", set_temperature="Atur suhu", set_position="Atur posisi",
    save="Simpan", cancel="Batal", delete="Hapus", confirm_delete="Ketuk lagi untuk menghapus",
    try_now="Coba sekarang:",
    need_device="Pilih minimal satu perangkat.", need_day="Pilih minimal satu hari.",
    need_day_group="Pilih minimal satu hari untuk setiap set waktu lain.",
    per_day="Waktu berbeda di beberapa hari", per_day_hint="Misalnya lebih larut di akhir pekan",
    main_days="Waktu di atas berlaku pada:", other_times="Waktu lain", other_days="Pada hari-hari ini:",
    add_other="Tambah hari lain", remove="Hapus",
    summary_title="Singkatnya",
    when_time="pukul {time}", when_sun="saat {sun}", when_sun_offset="{min} menit {dir} {sun}",
    sun_sunrise="matahari terbit", sun_sunset="matahari terbenam", when_duration="setelah {duration}",
    on_days="Pada {days}.", every_day_s="Setiap hari.", weekdays_s="Pada hari kerja.", weekend_s="Pada akhir pekan.",
    active_now="Sedang berjalan · {verb} {when}", next="Berikutnya: {verb} {day} pukul {time}",
    today="hari ini", tomorrow="besok", paused="Dijeda – timer ini tidak akan berjalan",
    and_more="+{n}", saved="Timer disimpan", deleted="Timer dihapus", error="Terjadi kesalahan: {msg}",
    cfg_title="Judul", cfg_entities="Hanya perangkat ini (kosong = semua)",
    verbs=["Nyalakan", "Matikan", "Buka", "Tutup", "Buka kunci", "Kunci", "Mulai", "Kembali ke dok",
           "Aktifkan", "Jalankan", "Hentikan", "Tekan"],
    shorts=["Nyala", "Mati", "Buka", "Tutup", "Buka kunci", "Kunci", "Mulai", "Dok", "Aktifkan", "Jalankan",
            "Henti", "Tekan"],
    setup=dict(
        title="Timercard",
        description="Tambahkan Timercard? Setelah itu, tambahkan kartu \"Timercard\" ke dasbor untuk membuat timer.",
        abort="Timercard sudah disiapkan.",
        done="Timercard siap. Sekarang muat ulang browser (Ctrl+F5, atau Cmd+Shift+R di Mac). Di aplikasi Home Assistant: Pengaturan → Aplikasi pendamping → Debugging → Atur ulang cache frontend. Lalu ubah dasbor, pilih Tambah kartu dan cari \"Timercard\".",
    ),
)


def _check() -> None:
    en = T["en"]
    keys = set(en) - {"setup"}
    for lang, strings in T.items():
        missing = keys - set(strings)
        extra = set(strings) - keys - {"setup"}
        assert not missing and not extra, (lang, missing, extra)
        for key in ("verbs", "shorts"):
            assert len(strings[key]) == len(VERB_KEYS), (lang, key)
        for key, value in strings.items():
            if isinstance(value, str):
                want = set(re.findall(r"\{\w+\}", en[key]))
                got = set(re.findall(r"\{\w+\}", value))
                assert want == got, (lang, key, want, got)


def main() -> None:
    _check()
    root = Path(__file__).resolve().parent.parent
    comp = root / "custom_components" / "timercard"

    # 1. The card
    block = {}
    for lang, strings in T.items():
        out = {k: v for k, v in strings.items() if k not in ("setup", "verbs", "shorts")}
        out["verbs"] = dict(zip(VERB_KEYS, strings["verbs"]))
        out["shorts"] = dict(zip(VERB_KEYS, strings["shorts"]))
        block[lang] = out
    js = "const TC_I18N = " + json.dumps(block, ensure_ascii=False, indent=2) + ";\n"
    card = comp / "frontend" / "timercard-card.js"
    src = card.read_text()
    start = src.index("const TC_I18N = {")
    end = src.index("\n};\n", start) + 4
    card.write_text(src[:start] + js + src[end:])

    # 2. The integration's setup dialog
    for lang, strings in T.items():
        setup = strings["setup"]
        data = {
            "config": {
                "step": {"user": {"title": setup["title"], "description": setup["description"]}},
                "abort": {"single_instance_allowed": setup["abort"]},
                "create_entry": {"default": setup["done"]},
            }
        }
        text = json.dumps(data, ensure_ascii=False, indent=2) + "\n"
        name = "zh-Hans" if lang == "zh" else lang
        (comp / "translations" / f"{name}.json").write_text(text)
        if lang == "pt":
            (comp / "translations" / "pt-BR.json").write_text(text)
        if lang == "en":
            (comp / "strings.json").write_text(text)
    print(f"Wrote {len(T)} languages: {', '.join(T)}")


if __name__ == "__main__":
    main()
