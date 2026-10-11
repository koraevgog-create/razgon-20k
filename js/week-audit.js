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
 function init(){
  updateText('.commandStrip .cmd:nth-child(1) span[style]', 'BUILD '+D.meta.build);
  document.querySelectorAll('.commandStrip .cmd:nth-child(3)').forEach(x=>x.innerHTML='<div><span>НЕДЕЛЯ 05–11.10</span><br><strong>'+rub(net)+' / '+rub(D.week.target,0)+'</strong><br><span>ПРЕДВАРИТЕЛЬНЫЙ ИТОГ · 7/7</span></div><b>'+percent.toFixed(1).replace('.',',')+'%</b>');
  updateText('#analyticsUpdated','Снимок '+D.meta.updated+' · данные вручную');
  document.querySelectorAll('.weekCycle .weekValue').forEach(x=>x.innerHTML=rub(net)+' <span>/ '+rub(D.week.target,0)+'</span>');
  document.querySelectorAll('.weekCycle .weekTop .mini').forEach(x=>x.textContent='Предварительно: '+percent.toFixed(2).replace('.',',')+'% цели · осталось '+rub(D.week.target-net));
  document.querySelectorAll('.weekCycle .weekTop .state').forEach(x=>x.textContent='СВЕРКА');
  document.querySelectorAll('.weekCycle .weekTrack i').forEach(x=>x.style.width=Math.max(0,Math.min(100,percent))+'%');
  document.querySelectorAll('.weekCycle .archiveScore').forEach(x=>x.innerHTML=rub(net)+'<em>'+percent.toFixed(2).replace('.',',')+'%</em>');
  document.querySelectorAll('.weekCycle .archiveRow small').forEach(x=>x.textContent='05–11 октября · предварительный итог');
  document.querySelectorAll('.weekCycle .archiveEmpty').forEach(x=>x.textContent='Сумма рассчитана по видимым закрытым сделкам. Для окончательного недельного результата нужны все комиссии, налоги и движения средств за период.');
  document.querySelectorAll('.weekCycle .sectionHead h2').forEach(x=>x.textContent='Неделя №1 · 7 из 7 дней');
  const host=document.querySelector('.commandStrip');if(!host)return;
  const card=document.createElement('section');card.className='weekAuditPanel';card.setAttribute('aria-label','Итоги недели');
  card.innerHTML='<div class="weekAuditHeading"><div><div class="eyebrow">WEEK 01 · 05–11 ОКТЯБРЯ 2026</div><h2>Итоги недели <small>предварительная сверка</small></h2></div><a href="trades.html">Журнал сделок →</a></div><div class="weekAuditGrid"><div><span>Продажи · валовый результат</span><b>'+signed(gross)+'</b></div><div><span>Комиссии, учтённые по продажам</span><b>−'+rub(fees)+'</b></div><div><span>Результат закрытых сделок*</span><b class="weekAuditAccent">'+signed(net)+'</b></div><div><span>Цель 500 ₽</span><b>'+percent.toFixed(2).replace('.',',')+'%</b></div><div><span>Общий P&L брокера · всё время</span><b>'+signed(D.portfolio.pnl)+'</b></div><div><span>Стоимость всех счетов</span><b>'+rub(D.portfolio.total)+'</b></div></div><div class="weekAuditProgress"><i style="width:'+Math.min(100,percent)+'%"></i></div><p>*Расчёт только по видимым закрытым сделкам. Дополнительные комиссии, пополнения и прочие операции могут менять полный недельный итог. Изменение стоимости портфеля не равно доходу за неделю.</p><p>Сверка позиций: сумма показанных активов и свободных денег отличается от брокерского итога на '+signed(discrepancy)+'. Это расхождение оставлено видимым, а не скрыто подгонкой данных.</p>';
  host.insertAdjacentElement('afterend',card);
  const sections=document.querySelectorAll('.cards');sections.forEach(x=>{if(x.closest('.section')?.querySelector('h2')?.textContent==='Пульс портфеля'){const vals=x.querySelectorAll('.card .value');if(vals[0])vals[0].textContent=rub(D.portfolio.total);if(vals[1])vals[1].textContent=signed(D.portfolio.pnl);if(vals[2])vals[2].textContent=signed(net);if(vals[3])vals[3].textContent=rub(D.portfolio.cash)}});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();