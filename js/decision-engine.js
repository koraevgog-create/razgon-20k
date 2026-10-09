/* BUILD 004.17 — прозрачный сценарный анализатор. Не является торговым сигналом. */
(function(){
 const D=window.RAZGON_DATA,api=window.RAZGON_COMPANY_API,history=window.RAZGON_DECISIONS||[];
 const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'}[c]));
 const fmt=n=>Number(n).toLocaleString('ru-RU',{maximumFractionDigits:1});
 function assess(t,impact='unknown',verified=false){
  const p=api.position(t),events=api.events(t),weight=api.weight(t),r=api.radar(t),flags=[],checks=[];
  if(!p)return {status:'NO POSITION',flags:['Бумага отсутствует в сохранённом портфеле'],checks:[]};
  if(weight>30)flags.push('Концентрация '+fmt(weight)+'% — выше контрольного порога 30%.');
  if(events.some(e=>e.status!=='verified'))checks.push('Есть событие без подтверждённого источника.');
  if(!verified)checks.push('Влияние события не подтверждено первоисточником.');
  if(impact==='negative')flags.push('В сценарии задано негативное влияние; необходим пересмотр тезиса.');
  if(impact==='positive')checks.push('Позитивное событие само по себе не отменяет лимиты риска.');
  let status='WATCH';
  if(impact==='negative'&&verified)status='REVIEW RISK';
  else if(impact==='positive'&&verified&&weight<=30)status='REVIEW ENTRY';
  else if(!verified)status='VERIFY FIRST';
  return {status,flags,checks,weight,radar:r?.action||'Нет плана'};
 }
 function init(){
  const root=document.getElementById('decisionEngine'),select=document.getElementById('companyTicker');
  if(!root||!select||!D||!api)return;
  root.innerHTML='<article class="intelEvent"><h2>Decision Engine · сценарная проверка</h2><p>Выберите предполагаемое влияние события и подтвердите, что проверили первоисточник. Движок не читает новости автоматически и не отправляет заявки брокеру.</p><div class="riskInputs"><label>Влияние события<select id="engineImpact"><option value="unknown">Неизвестно</option><option value="negative">Негативное</option><option value="neutral">Нейтральное</option><option value="positive">Позитивное</option></select></label><label>Источник<select id="engineVerified"><option value="no">Не проверен</option><option value="yes">Проверен вручную</option></select></label></div><div id="engineOutput" aria-live="polite"></div></article><article class="intelEvent"><h2>История решений</h2><div id="engineHistory"></div></article>';
  const impact=document.getElementById('engineImpact'),verified=document.getElementById('engineVerified'),out=document.getElementById('engineOutput'),log=document.getElementById('engineHistory');
  function render(){
   const t=select.value,result=assess(t,impact.value,verified.value==='yes'),rows=history.filter(x=>x.ticker===t);
   out.innerHTML='<div class="intelDecision"><b>Контрольный статус: '+esc(result.status)+'</b><p>Радар (сохранённый план): '+esc(result.radar||'—')+'</p><p>Снимок портфеля: '+esc(D.meta.updated)+' · не онлайн.</p></div>'+
    (result.flags.length?'<p><b>Риски:</b></p><ul>'+result.flags.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
    (result.checks.length?'<p><b>Что проверить:</b></p><ul>'+result.checks.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':'')+
    '<small>Это чек-лист для самостоятельной проверки, не рекомендация купить или продать.</small>';
   log.innerHTML=rows.length?rows.map(x=>'<div class="intelDecision"><b>'+esc(x.date)+' · '+esc(x.action)+'</b><p>'+esc(x.reason)+'</p><small>'+esc(x.result)+'</small></div>').join(''):'<p>Решений по этой компании пока не зафиксировано.</p>';
  }
  [select,impact,verified].forEach(x=>x.addEventListener('change',render));render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 window.RAZGON_DECISION_ENGINE={assess};
})();
