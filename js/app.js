
const root=document.documentElement;let rootPointerRAF=0,rootPX=0,rootPY=0;addEventListener('pointermove',e=>{rootPX=e.clientX;rootPY=e.clientY;if(rootPointerRAF)return;rootPointerRAF=requestAnimationFrame(()=>{root.style.setProperty('--mx',rootPX+'px');root.style.setProperty('--my',rootPY+'px');rootPointerRAF=0})},{passive:true});
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');if(e.target.querySelector('#chartLine'))setTimeout(()=>document.getElementById('chartLine').style.strokeDashoffset='0',250)}}),{threshold:.13});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
document.querySelectorAll('.counter').forEach(el=>{let done=false;const o=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let to=+el.dataset.to,dec=+(el.dataset.decimals||0),suf=el.dataset.suffix||'',start=performance.now();function tick(t){let q=Math.min((t-start)/1200,1),v=to*(1-Math.pow(1-q,3));el.textContent=v.toLocaleString('ru-RU',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;if(q<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}});o.observe(el)});
document.querySelectorAll('.tilt').forEach(c=>{let raf=0,px=0,py=0;c.addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{let r=c.getBoundingClientRect(),x=px-r.left,y=py-r.top;c.style.setProperty('--cx',x+'px');c.style.setProperty('--cy',y+'px');let rx=(y/r.height-.5)*-5,ry=(x/r.width-.5)*7;c.style.transform='perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-3px)';raf=0})},{passive:true});c.addEventListener('pointerleave',()=>c.style.transform='')});

setTimeout(()=>{const b=document.getElementById('weekbar');if(b)b.style.width='8.02%'},700);
function clock(){const d=new Date(),p=n=>String(n).padStart(2,'0'),el=document.getElementById('marketClock');if(el)el.textContent=p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear()+' · '+p(d.getHours())+':'+p(d.getMinutes())}clock();setInterval(clock,30000);

const panels={
today:'<div class="modePanel"><div class="label">РЕШЕНИЕ НА ТЕКУЩЕМ СНИМКЕ</div><div class="pulseOrb"><span style="font-size:28px">◉</span></div><div class="decision">WAIT & WATCH</div><div class="decisionSub">Не создаём сделку ради выполнения цели. Следующий вход появляется только после проверки актуальной цены, новостей и риска.</div></div>',
risk:'<div class="modePanel"><div class="label">КАРТА КОНЦЕНТРАЦИИ</div><div class="metricLine"><span>Яндекс</span><div class="metricTrack"><div class="metricFill" style="width:35%"></div></div><b>≈35%</b></div><div class="metricLine"><span>Роснефть</span><div class="metricTrack"><div class="metricFill" style="width:25%"></div></div><b>≈25%</b></div><div class="metricLine"><span>Сбер-п</span><div class="metricTrack"><div class="metricFill" style="width:20%"></div></div><b>≈20%</b></div><div class="metricLine"><span>Т-Тех</span><div class="metricTrack"><div class="metricFill" style="width:9%"></div></div><b>≈9%</b></div><div class="decisionSub">Главный риск сейчас — концентрация. Поэтому новые идеи оцениваем не изолированно, а относительно уже занятого риска портфеля.</div></div>',
goal:'<div class="modePanel"><div class="label">НЕДЕЛЬНЫЙ КВЕСТ</div><div class="decision" style="margin-top:45px">40,11 <span style="color:#657080">/ 500 ₽</span></div><div style="height:18px;background:#20242d;border-radius:99px;margin:32px auto 12px;max-width:540px;overflow:hidden"><div class="metricFill" style="width:8.02%;background:linear-gradient(90deg,#ff5168,#ff8357)"></div></div><div class="decisionSub">8,02% выполнено · до жёлтой зоны 109,89 ₽ · до цели 459,89 ₽</div></div>',
compare:'<div class="modePanel"><div class="label">КОНТРОЛЬНЫЙ ЭКСПЕРИМЕНТ</div><div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:28px"><div class="signal"><div class="label">ACTIVE</div><div class="value green">+40,11 ₽</div><div class="mini">реализованный результат</div></div><div class="signal"><div class="label">HOLD</div><div class="value">База</div><div class="mini">начинаем фиксировать контрольную линию</div></div></div><div class="decisionSub" style="margin-top:28px">Когда накопим историю, здесь появится честное сравнение: что было бы, если бы мы вообще не совершали активных сделок.</div></div>'};
function setMode(k){const mc=document.getElementById('modeContent');if(!mc)return;mc.innerHTML=panels[k];document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===k))}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));if(document.getElementById('modeContent'))setMode('today');

const scene=document.querySelector('.capitalScene'),coords=document.getElementById('sceneCoords');if(scene&&coords){scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/r.width*100),y=Math.round((e.clientY-r.top)/r.height*100);coords.textContent='X '+String(x).padStart(3,'0')+' · Y '+String(y).padStart(3,'0');scene.style.setProperty('--sx',x+'%');scene.style.setProperty('--sy',y+'%')})}

const infoMap={capital:['Весь портфель','≈21 237 ₽','Центральное ядро эксперимента. Все позиции связаны с общим капиталом.'],yandex:['Яндекс','2 акции · ≈35%','Крупнейшая позиция. Высокая концентрация — новые покупки требуют особенно сильного основания.'],rosneft:['Роснефть','15 акций · ≈25%','Вторая крупнейшая позиция и заметная нефтяная экспозиция.'],sber:['Сбербанк-п','15 акций · ≈20%','Крупная базовая позиция портфеля.'],t:['Т-Технологии','7 акций · ≈9%','Активная зона наблюдения: возможна частичная работа с импульсом.'],vk:['VK','5 акций · ≈3%','Небольшая спекулятивная позиция.'],vtb:['ВТБ','9 акций · ≈2%','Часть прибыли уже зафиксирована в сделке №1.']};
const cv=document.getElementById('space'),field=document.getElementById('constellation'),ci=document.getElementById('constInfo');if(cv&&field){const ctx=cv.getContext('2d');function draw(){const d=devicePixelRatio||1,r=field.getBoundingClientRect();cv.width=r.width*d;cv.height=r.height*d;ctx.scale(d,d);ctx.clearRect(0,0,r.width,r.height);const core=field.querySelector('[data-key=capital]').getBoundingClientRect(),fr=field.getBoundingClientRect(),cx=core.left-fr.left+core.width/2,cy=core.top-fr.top+core.height/2;field.querySelectorAll('.node:not(.core)').forEach(n=>{const nr=n.getBoundingClientRect(),x=nr.left-fr.left+nr.width/2,y=nr.top-fr.top+nr.height/2,g=ctx.createLinearGradient(cx,cy,x,y);g.addColorStop(0,'rgba(201,255,74,.32)');g.addColorStop(1,'rgba(101,117,255,.08)');ctx.strokeStyle=g;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo((cx+x)/2+18,(cy+y)/2-12,x,y);ctx.stroke()})}draw();addEventListener('resize',draw);field.querySelectorAll('.node').forEach(n=>{n.onmouseenter=()=>{field.querySelectorAll('.node').forEach(x=>x.classList.remove('focus'));n.classList.add('focus');let a=infoMap[n.dataset.key];ci.innerHTML='<div class="label">'+a[0]+'</div><div class="big">'+a[1]+'</div><div class="mini">'+a[2]+'</div>'};n.onmouseleave=()=>n.classList.remove('focus')})}

const fs=document.getElementById('capitalFlow'),fo=document.getElementById('flowOrb');if(fs&&fo){fs.addEventListener('pointermove',e=>{const r=fs.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;fs.style.setProperty('--mx',x+'%');fs.style.setProperty('--my',y+'%');const dx=(x-50)*.08,dy=(y-50)*.08;fo.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))'})}

const signalData={now:[['T-Технологии','Наблюдаем','Зона потенциальной частичной фиксации при сильном импульсе.'],['ВТБ','После продажи','9 акций остаются в позиции; обратный вход только при привлекательной коррекции.'],['Портфель','Без суеты','Не открываем сделку только ради недельной цели.']],risk:[['Концентрация','YDEX ≈35%','Крупнейшая позиция ограничивает агрессивное добавление.'],['Нефть','ROSN ≈25%','Новый нефтяной актив усилит секторный риск.'],['Кэш','≈5%','Манёвренность сейчас ограничена.']],profit:[['Сделка №1','+40,11 ₽','Первый реализованный результат активной стратегии.'],['Цель недели','8,02%','459,89 ₽ остаётся до недельной миссии.'],['Правило','Комиссия важна','Мелкие движения не должны съедаться издержками.']],cash:[['Свободно','≈1 150 ₽','Оценка после частичной продажи ВТБ.'],['Резерв','Небольшой','Новые покупки должны конкурировать за ограниченный кэш.'],['Маржа','Выключена','Разгон идёт без кредитного плеча.']]};
function renderSignal(k){const b=document.getElementById('signalBody');if(!b)return;b.innerHTML=signalData[k].map(x=>'<div class="signalCard"><span>'+x[0]+'</span><b>'+x[1]+'</b><p>'+x[2]+'</p></div>').join('')}
renderSignal('now');document.querySelectorAll('.signalTab').forEach(btn=>btn.onclick=()=>{document.querySelectorAll('.signalTab').forEach(x=>x.classList.remove('active'));btn.classList.add('active');renderSignal(btn.dataset.signal)});
const mm=document.getElementById('missionMain');if(mm)mm.addEventListener('pointermove',e=>{const r=mm.getBoundingClientRect();mm.style.setProperty('--px',((e.clientX-r.left)/r.width*100)+'%');mm.style.setProperty('--py',((e.clientY-r.top)/r.height*100)+'%')});

(()=>{
 const canvas=document.getElementById('capitalMesh'),ctx=canvas&&canvas.getContext('2d'),halo=document.getElementById('cursorHalo');
 if(!canvas||!ctx)return;
 let w=0,h=0,dpr=1,mx=-9999,my=-9999,tx=-9999,ty=-9999,scrollY=window.scrollY,pts=[],lastFrame=0,scrolling=false,scrollTimer=0;
 const palette=['rgba(201,255,74,','rgba(255,196,72,','rgba(113,132,255,'];
 function resize(){dpr=Math.min(devicePixelRatio||1,1.5);w=innerWidth;h=innerHeight;canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';ctx.setTransform(dpr,0,0,dpr,0,0);const count=Math.max(34,Math.min(64,Math.floor(w*h/26000)));pts=Array.from({length:count},(_,i)=>({x:Math.random()*w,y:Math.random()*h,vx:(Math.random()-.5)*.12,vy:(Math.random()-.5)*.1,r:Math.random()*1.25+.35,c:i%9===0?1:i%13===0?2:0,phase:Math.random()*6.28}))}
 addEventListener('resize',resize);resize();
 addEventListener('pointermove',e=>{tx=e.clientX;ty=e.clientY;if(halo){halo.style.transform='translate3d('+(tx-180)+'px,'+(ty-180)+'px,0)';halo.style.opacity='1'}},{passive:true});
 addEventListener('pointerleave',()=>{tx=ty=-9999;if(halo)halo.style.opacity='0'});
 addEventListener('scroll',()=>{scrollY=window.scrollY;scrolling=true;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>scrolling=false,120)},{passive:true});
 function frame(t){
  if(document.hidden||scrolling){requestAnimationFrame(frame);return} if(t-lastFrame<40){requestAnimationFrame(frame);return} lastFrame=t;
  mx+=(tx-mx)*.075;my+=(ty-my)*.075;ctx.clearRect(0,0,w,h);
  const sy=(scrollY*.018)%h;
  for(let p of pts){
   p.x+=p.vx;p.y+=p.vy;
   if(p.x<-30)p.x=w+30;if(p.x>w+30)p.x=-30;if(p.y<-30)p.y=h+30;if(p.y>h+30)p.y=-30;
   const dx=p.x-mx,dy=p.y-my,dist=Math.hypot(dx,dy);
   if(dist<220&&dist>1){const force=(220-dist)/220*.52;p.x+=dx/dist*force;p.y+=dy/dist*force}
  }
  for(let i=0;i<pts.length;i++){const a=pts[i];for(let j=i+1;j<pts.length;j++){const b=pts[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);if(d<205){const near=Math.min(Math.hypot((a.x+b.x)/2-mx,(a.y+b.y)/2-my),240);const boost=near<280?(1-near/280)*.34:0;ctx.beginPath();ctx.moveTo(a.x,a.y+sy*.12);ctx.lineTo(b.x,b.y+sy*.12);ctx.strokeStyle='rgba(202,220,154,'+(.028+(1-d/205)*.11+boost)+')';ctx.lineWidth=.55+(boost*1.8);ctx.stroke()}}}
  pts.forEach(p=>{const pulse=.45+.35*Math.sin(t*.001+p.phase),near=Math.hypot(p.x-mx,p.y-my)<260;ctx.beginPath();ctx.arc(p.x,p.y+sy*.12,p.r+(near?.65:0),0,Math.PI*2);ctx.fillStyle=palette[p.c]+(near?.42:.12*pulse)+')';ctx.fill();if(near){ctx.beginPath();ctx.arc(p.x,p.y+sy*.12,5.5,0,Math.PI*2);ctx.fillStyle=palette[p.c]+'.025)';ctx.fill()}});
  requestAnimationFrame(frame)
 }requestAnimationFrame(frame)
})();

/* BUILD 004.05 — shared data engine */
(()=>{
 const D=window.RAZGON_DATA;if(!D)return;
 const rub=(n,d=0)=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:d,maximumFractionDigits:d})+' ₽';
 const pct=n=>(n>=0?'+':'')+Number(n).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+'%';
 D.positions.forEach(p=>p.weight=D.portfolio.total?100*p.value/D.portfolio.total:0);
 D.computed={
  invested:D.positions.reduce((a,p)=>a+p.value,0),
  realized:D.trades.reduce((a,t)=>a+t.netProfit,0),
  commissions:D.trades.reduce((a,t)=>a+t.commission,0),
  weekProgress:D.week.target?100*D.week.realized/D.week.target:0,
  largest:[...D.positions].sort((a,b)=>b.value-a.value)[0]
 };
 document.documentElement.dataset.build=D.meta.build;
 document.querySelectorAll('[data-live="portfolio-total"]').forEach(x=>x.textContent=rub(D.portfolio.total,2));
 document.querySelectorAll('[data-live="portfolio-pnl"]').forEach(x=>x.textContent=rub(D.portfolio.pnl,2));
 document.querySelectorAll('[data-live="portfolio-pct"]').forEach(x=>x.textContent=pct(D.portfolio.pnlPct));
 document.querySelectorAll('[data-live="week-realized"]').forEach(x=>x.textContent=rub(D.computed.realized,2));
 document.querySelectorAll('[data-live="week-progress"]').forEach(x=>x.textContent=D.computed.weekProgress.toLocaleString('ru-RU',{maximumFractionDigits:2})+'%');
 document.querySelectorAll('[data-live="cash"]').forEach(x=>x.textContent=rub(D.portfolio.cash,2));
 window.RAZGON={data:D,rub,pct};
})();

/* BUILD 004.05 — generated portfolio & trade views */
(()=>{
 const R=window.RAZGON,D=R&&R.data;if(!D)return;
 const pos=document.getElementById('positionsTable');
 if(pos)pos.innerHTML=D.positions.map(p=>'<div class="row"><div class="asset"><b>'+p.name+'</b><small>'+p.ticker+' · '+p.qty+' шт.</small></div><div class="num">'+R.rub(p.price,p.price%1?2:0)+'</div><div class="pnl '+(p.pnlPct>=0?'green':'red')+'">'+R.pct(p.pnlPct)+'</div></div>').join('');
 const tradeHTML=t=>'<div class="trade"><div class="tradeNo">'+String(t.id).padStart(2,'0')+'</div><div><b>'+t.ticker+' · '+t.side+' '+t.qty+'</b><br><small>'+t.date+' · '+R.rub(t.price,2)+' · комиссия '+R.rub(t.commission,2)+'</small></div><div class="profit">'+(t.netProfit>=0?'+':'')+R.rub(t.netProfit,2)+'</div></div>';
 const pl=document.getElementById('portfolioTradeLog');if(pl)pl.innerHTML=D.trades.map(tradeHTML).join('');
 const tt=document.getElementById('tradesTable');if(tt)tt.innerHTML=D.trades.map(tradeHTML).join('');
 const core=document.querySelector('.node.core b');if(core)core.textContent=R.rub(D.portfolio.total,0);
 const nodeMap={yandex:'YDEX',rosneft:'ROSN',sber:'SBERP',t:'T',vk:'VKCO',vtb:'VTBR'};
 Object.entries(nodeMap).forEach(([key,ticker])=>{const n=document.querySelector('.node[data-key="'+key+'"] small'),p=D.positions.find(x=>x.ticker===ticker);if(n&&p)n.textContent='≈'+Math.round(p.weight)+'%'});
})();

/* BUILD 004.05 — real snapshot analytics */
(()=>{
 const R=window.RAZGON,D=R&&R.data;if(!D||!document.getElementById('equityChart'))return;
 const snaps=D.snapshots||[], C=D.computed;
 const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v};
 set('analyticsUpdated','Последний снимок · '+(snaps.at(-1)?.date||D.meta.updated));
 set('analyticsRealized',(C.realized>=0?'+':'')+R.rub(C.realized,2));
 const unreal=D.portfolio.pnl-C.realized;set('analyticsUnrealized',(unreal>=0?'+':'')+R.rub(unreal,2));
 set('analyticsFees',R.rub(C.commissions,2));set('analyticsTrades',D.trades.length);
 set('activeResult',(C.realized>=0?'+':'')+R.rub(C.realized,2));
 set('snapshotCount',snaps.length+' '+(snaps.length===1?'снимок':'снимков'));
 if(!snaps.length)return;
 const start=snaps[0],last=snaps.at(-1),delta=last.total-start.total;
 set('equityStart','Старт · '+start.date+' · '+R.rub(start.total,2));
 set('equityLast','Последний · '+last.date+' · '+R.rub(last.total,2));
 set('equityChange',(delta>=0?'+':'')+R.rub(delta,2));
 const line=document.getElementById('equityLine'),area=document.getElementById('equityArea'),dots=document.getElementById('equityDots'),empty=document.getElementById('equityEmpty');
 const vals=snaps.map(x=>x.total),min=Math.min(...vals),max=Math.max(...vals),span=Math.max(max-min,Math.max(max*.01,100));
 const pts=snaps.map((x,i)=>{const px=snaps.length===1?350:24+i*(652/(snaps.length-1));const py=220-((x.total-(min-span*.15))/(span*1.3))*170;return [px,Math.max(28,Math.min(228,py))]});
 if(snaps.length>1){const d=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');line.setAttribute('d',d);area.setAttribute('d',d+' L'+pts.at(-1)[0]+' 245 L'+pts[0][0]+' 245 Z');empty.style.display='none'}else{line.setAttribute('d','');area.setAttribute('d','')}
 dots.innerHTML=pts.map((p,i)=>'<circle class="equityDot" cx="'+p[0]+'" cy="'+p[1]+'" r="5"><title>'+snaps[i].date+' · '+R.rub(snaps[i].total,2)+'</title></circle>').join('');
 if(snaps.length<2)set('equityChange','История началась');
})();
