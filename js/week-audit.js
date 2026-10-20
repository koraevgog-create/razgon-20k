/* BUILD 004.30 — single source of truth for weekly figures and account balance. */
(function(){
'use strict';
const D=window.RAZGON_DATA;if(!D)return;
const fmt=(n,d=2)=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d})+' ₽';
const signed=n=>(n>=0?'+':'−')+fmt(Math.abs(n));
const weeks=[{number:1,from:5,to:11,period:'05–11 октября 2026'},{number:2,from:12,to:18,period:'12–18 октября 2026'},{number:3,from:19,to:25,period:'19–25 октября 2026'}];
const calc=w=>{const rows=D.trades.filter(t=>{const m=t.date.match(/^(\d{2})\.10\.2026$/);return m&&+m[1]>=w.from&&+m[1]<=w.to});const gross=rows.reduce((s,t)=>s+t.grossProfit,0),fees=rows.reduce((s,t)=>s+t.commission,0);return {...w,rows,gross,fees,net:Math.round((gross-fees)*100)/100}};
const history=weeks.map(calc),current=history.find(w=>w.number===D.week.number)||history[history.length-1],previous=history.filter(w=>w.number<current.number);
const target=D.week.target,progress=current.net/target*100,progressLabel=progress.toFixed(2).replace('.',',')+'%',day=D.week.day;
const set=(sel,v)=>document.querySelectorAll(sel).forEach(x=>x.textContent=v);
const money=fmt(current.net),total=fmt(D.portfolio.total),cash=fmt(D.portfolio.cash);
function render(){
 set('.commandStrip .cmd:first-child span[style]','BUILD '+D.meta.build);
 document.querySelectorAll('.commandStrip .cmd:nth-child(3)').forEach(x=>{x.innerHTML='<div><span>НЕДЕЛЯ №'+current.number+' · '+D.week.period.slice(0,5)+'.10</span><br><strong>'+money+' / '+fmt(target,0)+'</strong><br><span>ПРОМЕЖУТОЧНО · ДЕНЬ '+day+'/7</span></div><b>'+progress.toFixed(1).replace('.',',')+'%</b>'});
 document.querySelectorAll('.ringCore .money').forEach(x=>{x.classList.remove('counter');x.textContent=money});
 set('.ringCore .percent',progressLabel+' · ПРОМЕЖУТОЧНО');document.querySelectorAll('.ringCore .celebrate').forEach(el=>el.style.display=current.net>=target?'':'none');
 const ring=document.getElementById('ring');if(ring){const p=Math.max(0,Math.min(100,progress));ring.style.setProperty('--progress',p+'%');ring.style.setProperty('--needle-angle',p*3.6+'deg');ring.style.setProperty('--gauge-color',p<30?'#fa5367':p<80?'#f5bd47':'#93e64e');ring.setAttribute('aria-label','Неделя '+current.number+': '+progressLabel+' от цели')};
 set('.floatChip.one',signed(current.net)+' по продажам этой недели');
 const milestones=[150,400,target];const next=milestones.find(v=>v>current.net);document.querySelectorAll('.floatChip.two').forEach(el=>{el.innerHTML=next?'Следующий рубеж <b>'+fmt(next,0)+'</b>':'<b>Цель '+fmt(target,0)+' достигнута</b>'});
 set('.heroMeta>div:nth-child(3) b',String(current.rows.length));
 set('.heroMeta>div:nth-child(3) span','ПРОДАЖИ ЭТОЙ НЕДЕЛИ');
 set('[data-live="week-progress"]',progressLabel);
 const bar=document.getElementById('weekbar');if(bar)bar.style.width=Math.max(0,Math.min(100,progress))+'%';
 document.querySelectorAll('.sectionHead').forEach(h=>{if(h.querySelector('h2')?.textContent==='Прогресс недели'){const p=h.querySelector('p');if(p)p.textContent=money+' / '+fmt(target)}});
 set('#analyticsUpdated','Снимок '+D.meta.updated+' · вручную');
 set('.capitalCore b',fmt(D.portfolio.total,0));set('.flowOrb b',fmt(D.portfolio.total,0));
 set('.satellite.sat1 b',signed(D.portfolio.pnl));set('.satellite.sat2 b',signed(current.net));set('.satellite.sat3 b',cash);
 set('.flowMetric.fm1 b',signed(D.portfolio.pnl));set('.flowMetric.fm2 b',signed(current.net));set('.flowMetric.fm3 b',cash);set('.flowMetric.fm4 b',progressLabel);
 set('.runwayStats .runwayStat:first-child b',fmt(D.portfolio.total,0));
 const rw=document.querySelector('.runwayTop h3');if(rw)rw.textContent=fmt(D.portfolio.contributed,0)+' → '+total;
 const rp=document.querySelector('.runwayTop .mini');if(rp)rp.textContent='+'+D.portfolio.pnlPct.toFixed(2).replace('.',',')+'% к взносам · без подарка';
 document.querySelectorAll('.systemTicker .tickerInner span').forEach(x=>{const v=x.textContent.trim();if(v.startsWith('WEEK'))x.innerHTML='<b>WEEK</b> '+money+' / '+fmt(target,0);else if(v.startsWith('DAY'))x.innerHTML='<b>DAY</b> '+day+' / 7';else if(v.startsWith('REALIZED'))x.innerHTML='<b>REALIZED</b> '+signed(current.net);else if(v.startsWith('CASH'))x.innerHTML='<b>CASH</b> '+cash});
 document.querySelectorAll('.card').forEach(c=>{const label=c.querySelector('.label')?.textContent.trim(),v=c.querySelector('.value');if(!v)return;if(label==='Стоимость')v.textContent=total;else if(label==='Общий результат')v.textContent=signed(D.portfolio.pnl);else if(label==='Реализовано')v.textContent=signed(current.net);else if(label==='Свободный кэш')v.textContent=cash});
 const hero=document.querySelector('.heroMeta>div:nth-child(2) b');if(hero)hero.textContent='+'+D.portfolio.pnlPct.toFixed(2).replace('.',',')+'%';
 const mode=document.getElementById('modeContent');if(mode){const a=mode.querySelector('.decision');if(a)a.innerHTML=money+' <span style="color:#657080">/ '+fmt(target,0)+'</span>';const b=mode.querySelector('.decisionSub');if(b)b.textContent=progressLabel+' цели · '+(current.net>=target?'цель достигнута':'осталось '+fmt(target-current.net))};
 const cycle=document.querySelector('.weekCycle');if(cycle){
 const head=cycle.querySelector('.sectionHead h2');if(head)head.textContent='Неделя №'+current.number+' · день '+day+' из 7';
 const sub=cycle.querySelector('.sectionHead>p');if(sub)sub.textContent=current.period;
 const val=cycle.querySelector('.weekValue');if(val)val.innerHTML=money+' <span>/ '+fmt(target,0)+'</span>';
 const mini=cycle.querySelector('.weekTop .mini');if(mini)mini.textContent=progressLabel+' цели · '+(current.net>=target?'цель достигнута':'осталось '+fmt(target-current.net));
 const state=cycle.querySelector('.weekTop .state');if(state)state.textContent='ПРОМЕЖУТОЧНО';
 const track=cycle.querySelector('.weekTrack i');if(track)track.style.width=Math.max(0,Math.min(100,progress))+'%';
 const days=cycle.querySelector('.days');if(days){const names=['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];days.innerHTML=names.map((n,i)=>'<div class="day '+(i+1<day?'done':i+1===day?'today':'')+'">'+n+'<br>'+(current.from+i)+'</div>').join('')}
 const archive=cycle.querySelector('.weekArchive');if(archive){archive.innerHTML='<div class="label">ИСТОРИЯ НЕДЕЛЬ</div><h3>Завершённые недели</h3>'+previous.map(w=>'<div class="archiveRow"><div><b>Неделя №'+w.number+'</b><small>'+w.period+' · зафиксировано по видимым продажам</small></div><div class="archiveScore">'+fmt(w.net)+'<em>'+(w.net/target*100).toFixed(2).replace('.',',')+'%</em></div></div>').join('')};
 }
 const host=document.querySelector('.commandStrip');if(host){document.querySelectorAll('.weekAuditPanel').forEach(x=>x.remove());const panel=document.createElement('section');panel.className='weekAuditPanel';panel.innerHTML='<div class="weekAuditHeading"><div><div class="eyebrow">WEEK 0'+current.number+' · '+current.period.toUpperCase()+'</div><h2>Текущая неделя <small>промежуточный результат</small></h2></div><a href="trades.html">Журнал сделок →</a></div><div class="weekAuditGrid"><div><span>Прибыль продаж до комиссий</span><b>'+signed(current.gross)+'</b></div><div><span>Комиссии продаж</span><b>−'+fmt(current.fees)+'</b></div><div><span>После комиссий продаж</span><b class="weekAuditAccent">'+signed(current.net)+'</b></div><div><span>Цель недели</span><b>'+progressLabel+'</b></div><div><span>Разница с известными взносами</span><b>'+signed(D.portfolio.pnl)+'</b></div><div><span>Брокерский счёт</span><b>'+total+'</b></div></div><div class="weekAuditProgress"><i style="width:'+Math.max(0,Math.min(100,progress))+'%"></i></div><p>Учтены прибыли и комиссии закрытых продаж текущей недели. Комиссии покупок и открытие короткой позиции учитываются отдельно. Подарок 154,76 ₽ исключён из разницы с личными взносами ровно один раз; реальный брокерский баланс не изменён. Открытый шорт Сбербанка и маржинальный долг требуют отдельного контроля.</p>';host.insertAdjacentElement('afterend',panel)}
 const pulse=[...document.querySelectorAll('.section')].find(s=>s.querySelector('.sectionHead h2')?.textContent==='Пульс портфеля');if(pulse){const v=pulse.querySelectorAll('.cards .card .value');if(v[0])v[0].textContent=total;if(v[1])v[1].textContent=signed(D.portfolio.pnl);if(v[2])v[2].textContent=signed(current.net);if(v[3])v[3].textContent=cash}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',render);else render();
})();
