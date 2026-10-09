/* LEVEL 07 · BUILD 004.16 — журнал инвестиционных решений */
window.RAZGON_DECISIONS=[
 {date:"09.10.2026",ticker:"YDEX",action:"HOLD",reason:"После резкого движения сначала проверяем причину, а не реагируем эмоциями.",result:"В ожидании проверки события"},
 {date:"09.10.2026",ticker:"T",action:"WATCH",reason:"Дивидендный сценарий требует отдельного контроля перед отсечкой.",result:"Нужно сравнить движение до и после дивидендного гэпа"},
 {date:"06.10.2026",ticker:"VTBR",action:"SELL PART",reason:"Частичная фиксация прибыли по торговому плану.",result:"Зафиксировано +40,11 ₽"}
];
window.RAZGON_DECISION_API={byTicker:t=>window.RAZGON_DECISIONS.filter(x=>x.ticker===t)};
