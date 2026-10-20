/* History explorer · uses only confirmed snapshots and recorded closed trades. */
(()=>{const D=window.RAZGON_DATA;if(!D)return;
const iso=s=>{const [d,m,y]=s.split('.');return y+'-'+m+'-'+d};
const money=n=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
const fmt=s=>new Date(s+'T12:00:00').toLocaleDateString('ru-RU',{day:'2-digit',month:'short',year:'numeric'});
const monday=s=>{const d=new Date(s+'T12:00:00');d.setDate(d.getDate()-(d.getDay()+6)%7);return d.toISOString().slice(0,10)};
const snaps=(window.RAZGON_HISTORY?.snapshots||D.snapshots||[]).map(s=>({...s,key:iso(s.date)})).sort((a,b)=>a.key.localeCompare(b.key));
const trades=(D.trades||[]).filter(t=>t.side==='SELL').map(t=>({...t,key:iso(t.date)}));
function attach(hostId,kind){const host=document.getElementById(hostId);if(!host)return;
const wrap=document.createElement('section');wrap.className='hx';wrap.innerHTML='<div class="hx-controls"><label>Период <select class="hx-range"><option value="all">Всё время</option><option value="7">7 дней</option><option value="30">30 дней</option><option value="90">90 дней</option><option value="custom">Свои даты</option></select></label><label>Группировка <select class="hx-group"><option value="day">Дни</option><option value="week">Недели</option></select></label><label>От <input class="hx-from" type="date"></label><label>До <input class="hx-to" type="date"></label></div><div class="hx-status" aria-live="polite"></div><div class="hx-scroll"><svg class="hx-svg" viewBox="0 0 920 330" role="img" aria-label="Интерактивный график истории"></svg></div><div class="hx-detail" aria-live="polite">Наведите на точку или нажмите на неё</div><div class="hx-table"></div>';
host.replaceChildren(wrap);
const $=s=>wrap.querySelector(s),range=$('.hx-range'),group=$('.hx-group'),from=$('.hx-from'),to=$('.hx-to'),svg=$('.hx-svg'),detail=$('.hx-detail'),status=$('.hx-status');
const keys=kind==='capital'?snaps.map(s=>s.key):trades.map(t=>t.key);
if(!keys.length){status.textContent='Подтверждённых данных пока нет';return}
const first=keys.reduce((a,b)=>a<b?a:b),last=keys.reduce((a,b)=>a>b?a:b);from.value=first;to.value=last;from.min=first;from.max=last;to.min=first;to.max=last;
function render(){const end=range.value==='custom'?to.value:last;let start=range.value==='custom'?from.value:first;
if(range.value!=='all'&&range.value!=='custom'){const d=new Date(end+'T12:00:00');d.setDate(d.getDate()-Number(range.value)+1);start=d.toISOString().slice(0,10)}
if(start>end){status.textContent='Дата начала должна быть не позже даты окончания';svg.replaceChildren();return}
let rows=[];
if(kind==='capital'){const chosen=snaps.filter(s=>s.key>=start&&s.key<=end);
const buckets=new Map();chosen.forEach(s=>{const k=group.value==='week'?monday(s.key):s.key;const prior=buckets.get(k);if(!prior||s.key>prior.key||(s.key===prior.key&&s.time>prior.time))buckets.set(k,s)});
rows=[...buckets].sort((a,b)=>a[0].localeCompare(b[0])).map(([k,s])=>({key:k,value:s.total,description:'Снимок '+s.date+' в '+s.time+'; капитал без подарка: '+money(s.total-(s.key>='2026-10-14'?D.portfolio.giftExcluded:0))}));
}else{const buckets=new Map();trades.filter(t=>t.key>=start&&t.key<=end).forEach(t=>{const k=group.value==='week'?monday(t.key):t.key;const a=buckets.get(k)||{key:k,value:0,count:0,fees:0};a.value+=t.netProfit;a.count++;a.fees+=t.commission;buckets.set(k,a)});
rows=[...buckets.values()].sort((a,b)=>a.key.localeCompare(b.key)).map(r=>({...r,description:r.count+' закрытых продаж; комиссии продаж '+money(r.fees)}))}
status.textContent=rows.length?(kind==='capital'?'Подтверждённые снимки: ':'Периоды с закрытыми продажами: ')+rows.length+'. Отсутствующие значения не восстанавливаются искусственно.':'За выбранный период подтверждённых точек нет.';
if(!rows.length){svg.replaceChildren();detail.textContent='Выберите другой период';$('.hx-table').replaceChildren();return}
const values=rows.map(r=>r.value),min=Math.min(...values,0),max=Math.max(...values),pad=Math.max((max-min)*.12,1),low=kind==='capital'?Math.min(...values)-pad:min-pad,high=max+pad;
const x=i=>65+(rows.length===1?0.5:i/(rows.length-1))*820,y=v=>25+(high-v)/(high-low)*245;
const NS='http://www.w3.org/2000/svg';const node=(tag,attrs,parent=svg)=>{const e=document.createElementNS(NS,tag);Object.entries(attrs).forEach(([k,v])=>e.setAttribute(k,String(v)));parent.appendChild(e);return e};svg.replaceChildren();
for(let i=0;i<=4;i++){const v=low+(high-low)*i,yy=y(v);node('line',{x1:65,x2:885,y1:yy,y2:yy,stroke:'#45505c','stroke-opacity':'.5'});const t=node('text',{x:58,y:yy+4,fill:'#a7b0ba','font-size':11,'text-anchor':'end'});t.textContent=Math.round(v).toLocaleString('ru-RU')}
node('path',{d:rows.map((r,i)=>(i?'L':'M')+x(i)+' '+y(r.value)).join(' '),fill:'none',stroke:'#c9ff4a','stroke-width':3,'stroke-linecap':'round'});
const select=i=>{const r=rows[i],prev=rows[i-1];detail.textContent=fmt(r.key)+' · '+money(r.value)+(prev?' · изменение '+money(r.value-prev.value):'')+' · '+r.description};
rows.forEach((r,i)=>{const c=node('circle',{cx:x(i),cy:y(r.value),r:7,fill:'#c9ff4a',stroke:'#121820','stroke-width':2,tabindex:0,role:'button','aria-label':fmt(r.key)+' '+money(r.value)});c.addEventListener('pointerenter',()=>select(i));c.addEventListener('focus',()=>select(i));c.addEventListener('click',()=>select(i));c.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();select(i)}});if(rows.length<=12||i%Math.ceil(rows.length/10)===0||i===rows.length-1){const t=node('text',{x:x(i),y:307,fill:'#a7b0ba','font-size':11,'text-anchor':'middle'});t.textContent=r.key.slice(5).split('-').reverse().join('.')}});select(rows.length-1);
const table=document.createElement('details');const summary=document.createElement('summary');summary.textContent='Таблица значений ('+rows.length+')';table.appendChild(summary);const tb=document.createElement('table');tb.innerHTML='<thead><tr><th>Период</th><th>Значение</th><th>Источник</th></tr></thead>';const body=document.createElement('tbody');rows.forEach(r=>{const tr=document.createElement('tr');[fmt(r.key),money(r.value),r.description].forEach(v=>{const td=document.createElement('td');td.textContent=v;tr.appendChild(td)});body.appendChild(tr)});tb.appendChild(body);table.appendChild(tb);$('.hx-table').replaceChildren(table);
}
range.addEventListener('change',()=>{const custom=range.value==='custom';from.disabled=!custom;to.disabled=!custom;render()});group.addEventListener('change',render);from.addEventListener('change',render);to.addEventListener('change',render);from.disabled=true;to.disabled=true;render();
}
attach('equityChart','capital');attach('tradeHistoryChart','trade');attach('strategyHistoryChart','capital');
})();