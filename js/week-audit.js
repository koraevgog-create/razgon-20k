/* BUILD 004.20 — end-of-week audit, values from user screenshots; no live feed */
(function(){
 const D=window.RAZGON_DATA;if(!D)return;
 const rub=(n,d=2)=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d})+' ₽';
 const signed=n=>(n>=0?'+':'−')+rub(Math.abs(n));
 const gross=D.trades.reduce((s,x)=>s+x.grossProfit,0),fees=D.trades.reduce((s,x)=>s+x.commission,0),net=gross-fees;
 const visiblePositionTotal=D.positions.reduce((s,x)=>s+x.value,0)+D.extras.filter(x=>x.ticker==='ROSN_GIFT').reduce((s,x)=>s+x.value,0);
 const discrepancy=D.portfolio.brokerage-D.portfolio.cash-visiblePositionTotal;
 const percent=net/D.week.target*100;
 function updateText(selector,text){document.querySelectorAll(selector).forEach(x=>x.textContent=text)}
 function syncLegacy(){
  const fmt=n=>Number(n).toLocaleString('ru-RU',{maximumFractionDigits:2,minimumFractionDigits:2});
  const p=percent.toFixed(2).replace('.',',')+'%';
  const text=(sel,v)=>document.querySelectorAll(sel).forEach(e=>e.textContent=v);
  text('.ringCore .money',fmt(net)+' ₽');document.querySelectorAll('.ringCore .money').forEach(e=>e.classList.remove('counter'));
  text('.ringCore .percent',p+' · ПРЕДВАРИТЕЛЬНО');
  const ring=document.getElementById('ring');if(ring){const progress=Math.max(0,Math.min(100,percent));ring.style.setProperty('--progress',progress+'%');ring.style.setProperty('--needle-angle',(progress*3.6)+'deg');ring.style.setProperty('--gauge-color',progress<30?'#fa5367':progress<70?'#f5bd47':'#93e64e');ring.setAttribute('aria-label','Прогресс недели: '+p+' из цели 500 ₽');}
  text('.floatChip.one',signed(net)+' по подтверждённым продажам');
  text('.heroMeta>div:nth-child(3) b',String(D.trades.length));
  text('.heroMeta>div:nth-child(3) span','ПОДТВЕРЖДЁННЫЕ ПРОДАЖИ');
  const heads=[...document.querySelectorAll('.sectionHead')];heads.forEach(h=>{if(h.querySelector('h2')?.textContent==='Прогресс недели'){const sub=h.querySelector('p');if(sub)sub.textContent=fmt(net)+' / '+fmt(D.week.target)+' ₽'}});
  const prog=document.querySelector('#weekbar');if(prog)prog.style.width=Math.min(100,percent)+'%';
  const mode=document.getElementById('modeContent');if(mode){const goal=mode.querySelector('.decision');if(goal&&goal.textContent.includes('403,57'))goal.innerHTML=fmt(net)+' <span style="color:#657080">/ 500 ₽</span>';const sub=mode.querySelector('.decisionSub');if(sub&&sub.textContent.includes('80,71%'))sub.textContent=p+' выполнено · до цели '+rub(D.week.target-net);}
  text('.capitalCore b',rub(D.portfolio.total,0));text('.flowOrb b',rub(D.portfolio.total,0));
  text('.satellite.sat1 b',signed(D.portfolio.pnl));text('.satellite.sat2 b',signed(net));text('.satellite.sat3 b','уточняется');
  text('.flowMetric.fm1 b',signed(D.portfolio.pnl));text('.flowMetric.fm2 b',signed(net));text('.flowMetric.fm3 b','уточняется');text('.flowMetric.fm4 b',p);
  text('.runwayStats .runwayStat:first-child b',rub(D.portfolio.total,0));
  const rw=document.querySelector('.runwayTop h3');if(rw)rw.textContent=rub(D.portfolio.contributed,0)+' → '+rub(D.portfolio.total,0);
  const rp=document.querySelector('.runwayTop .mini');if(rp)rp.textContent='+'+D.portfolio.pnlPct.toFixed(2).replace('.',',')+'% к внесённым средствам';
  const tickers=document.querySelectorAll('.systemTicker .tickerInner');tickers.forEach(t=>{t.querySelectorAll('span').forEach(sp=>{const v=sp.textContent.trim();if(v.startsWith('WEEK'))sp.innerHTML='<b>WEEK</b> '+fmt(net)+' / 500 ₽';else if(v.startsWith('DAY'))sp.innerHTML='<b>DAY</b> 7 / 7';else if(v.startsWith('REALIZED'))sp.innerHTML='<b>REALIZED</b> <i class="up">'+signed(net)+'</i>';else if(v.startsWith('CASH'))sp.innerHTML='<b>CASH</b> '+rub(D.portfolio.cash)})});
  document.querySelectorAll('.card').forEach(c=>{const label=c.querySelector('.label')?.textContent?.trim();const value=c.querySelector('.value');if(!value)return;if(label==='Стоимость')value.textContent=rub(D.portfolio.total);if(label==='Общий результат')value.textContent=signed(D.portfolio.pnl);if(label==='Свободный кэш')c.querySelector('.mini')&&(c.querySelector('.mini').textContent='последний известный снимок, требует сверки')});
  document.querySelectorAll('.card').forEach(c=>{if(c.querySelector('.label')?.textContent?.trim()==='Свободный кэш'){const v=c.querySelector('.value');if(v)v.textContent='уточняется';}});
  const info=document.querySelector('.constInfo');if(info)info.setAttribute('data-snapshot',D.meta.updated);
 }
 function init(){
  updateText('.commandStrip .cmd:nth-child(1) span[style]', 'BUILD '+D.meta.build);
  document.querySelectorAll('.commandStrip .cmd:nth-child(3)').forEach(x=>x.innerHTML='<div><span>НЕДЕЛЯ 05–11.10</span><br><strong>'+rub(net)+' / '+rub(D.week.target,0)+'</strong><br><span>ПРЕДВАРИТЕЛЬНЫЙ ИТОГ · 7/7</span></div><b>'+percent.toFixed(1).replace('.',',')+'%</b>');
  const bar=document.getElementById('weekbar');if(bar)bar.style.width=Math.min(100,percent)+'%';
  document.querySelectorAll('[data-live="week-progress"]').forEach(x=>x.textContent=percent.toFixed(2).replace('.',',')+'%');
  updateText('#analyticsUpdated','Снимок '+D.meta.updated+' · данные вручную');
  document.querySelectorAll('.weekCycle .weekValue').forEach(x=>x.innerHTML=rub(net)+' <span>/ '+rub(D.week.target,0)+'</span>');
  document.querySelectorAll('.weekCycle .weekTop .mini').forEach(x=>x.textContent='Предварительно: '+percent.toFixed(2).replace('.',',')+'% цели · осталось '+rub(D.week.target-net));
  document.querySelectorAll('.weekCycle .weekTop .state').forEach(x=>x.textContent='СВЕРКА');
  document.querySelectorAll('.weekCycle .weekTrack i').forEach(x=>x.style.width=Math.max(0,Math.min(100,percent))+'%');
  document.querySelectorAll('.weekCycle .archiveScore').forEach(x=>x.innerHTML=rub(net)+'<em>'+percent.toFixed(2).replace('.',',')+'%</em>');
  document.querySelectorAll('.weekCycle .archiveRow small').forEach(x=>x.textContent='05–11 октября · предварительный итог');
  document.querySelectorAll('.weekCycle .archiveEmpty').forEach(x=>x.textContent='Сумма рассчитана по видимым закрытым сделкам. Для окончательного недельного результата нужны все комиссии, налоги и движения средств за период.');
  document.querySelectorAll('.weekCycle .sectionHead h2').forEach(x=>x.textContent='Неделя №1 · 7 из 7 дней');
  syncLegacy();
  const host=document.querySelector('.commandStrip');if(!host)return;
  const card=document.createElement('section');card.className='weekAuditPanel';card.setAttribute('aria-label','Итоги недели');
  card.innerHTML='<div class="weekAuditHeading"><div><div class="eyebrow">WEEK 01 · 05–11 ОКТЯБРЯ 2026</div><h2>Итоги недели <small>предварительная сверка</small></h2></div><a href="trades.html">Журнал сделок →</a></div><div class="weekAuditGrid"><div><span>Продажи · валовый результат</span><b>'+signed(gross)+'</b></div><div><span>Комиссии, учтённые по продажам</span><b>−'+rub(fees)+'</b></div><div><span>Результат закрытых сделок*</span><b class="weekAuditAccent">'+signed(net)+'</b></div><div><span>Цель 500 ₽</span><b>'+percent.toFixed(2).replace('.',',')+'%</b></div><div><span>Результат к взносам · брокерский счёт</span><b>'+signed(D.portfolio.pnl)+'</b></div><div><span>Стоимость брокерского счёта</span><b>'+rub(D.portfolio.total)+'</b></div></div><div class="weekAuditProgress"><i style="width:'+Math.min(100,percent)+'%"></i></div><p>*Расчёт только по видимым закрытым сделкам. Дополнительные комиссии, пополнения и прочие операции могут менять полный недельный итог. Изменение стоимости портфеля не равно доходу за неделю.</p><p>Сверка позиций: данные по позициям и свободному кэшу взяты из более раннего снимка и отличаются от нового брокерского итога на '+signed(discrepancy)+'. Это расхождение оставлено видимым, а не скрыто подгонкой данных.</p>';
  host.insertAdjacentElement('afterend',card);
  const sections=document.querySelectorAll('.cards');sections.forEach(x=>{if(x.closest('.section')?.querySelector('h2')?.textContent==='Пульс портфеля'){const vals=x.querySelectorAll('.card .value');if(vals[0])vals[0].textContent=rub(D.portfolio.total);if(vals[1])vals[1].textContent=signed(D.portfolio.pnl);if(vals[2])vals[2].textContent=signed(net);if(vals[3])vals[3].textContent='уточняется'}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();