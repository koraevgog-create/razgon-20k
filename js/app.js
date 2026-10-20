
const root=document.documentElement;let rootPointerRAF=0,rootPX=0,rootPY=0;addEventListener('pointermove',e=>{rootPX=e.clientX;rootPY=e.clientY;if(rootPointerRAF)return;rootPointerRAF=requestAnimationFrame(()=>{root.style.setProperty('--mx',rootPX+'px');root.style.setProperty('--my',rootPY+'px');rootPointerRAF=0})},{passive:true});
const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('on');if(e.target.querySelector('#chartLine'))setTimeout(()=>document.getElementById('chartLine').style.strokeDashoffset='0',250)}}),{threshold:.13});document.querySelectorAll('.reveal').forEach(x=>obs.observe(x));
document.querySelectorAll('.counter').forEach(el=>{let done=false;const o=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!done){done=true;let to=+el.dataset.to,dec=+(el.dataset.decimals||0),suf=el.dataset.suffix||'',start=performance.now();function tick(t){let q=Math.min((t-start)/1200,1),v=to*(1-Math.pow(1-q,3));el.textContent=v.toLocaleString('ru-RU',{minimumFractionDigits:dec,maximumFractionDigits:dec})+suf;if(q<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)}});o.observe(el)});
document.querySelectorAll('.tilt').forEach(c=>{let raf=0,px=0,py=0;c.addEventListener('pointermove',e=>{px=e.clientX;py=e.clientY;if(raf)return;raf=requestAnimationFrame(()=>{let r=c.getBoundingClientRect(),x=px-r.left,y=py-r.top;c.style.setProperty('--cx',x+'px');c.style.setProperty('--cy',y+'px');let rx=(y/r.height-.5)*-5,ry=(x/r.width-.5)*7;c.style.transform='perspective(700px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateY(-3px)';raf=0})},{passive:true});c.addEventListener('pointerleave',()=>c.style.transform='')});

setTimeout(()=>{const b=document.getElementById('weekbar');if(b)b.style.width=Math.min(100,window.RAZGON_DATA?.week?.realized/window.RAZGON_DATA?.week?.target*100||0)+'%'},700);
function clock(){const d=new Date(),p=n=>String(n).padStart(2,'0'),el=document.getElementById('marketClock');if(el)el.textContent=p(d.getDate())+'.'+p(d.getMonth()+1)+'.'+d.getFullYear()+' · '+p(d.getHours())+':'+p(d.getMinutes())}clock();setInterval(clock,30000);

const RDATA=window.RAZGON_DATA||{},curWeek=RDATA.week||{},port=RDATA.portfolio||{};
const rub=n=>Number(n||0).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
const pct=n=>Number(n||0).toLocaleString('ru-RU',{maximumFractionDigits:2})+'%';
const achieved=curWeek.realized>=curWeek.target;
const panels={
 today:'<div class="modePanel"><div class="label">РЕШЕНИЕ НА ТЕКУЩЕМ СНИМКЕ</div><div class="pulseOrb">◉</div><div class="decision">WAIT & WATCH</div><div class="decisionSub">Решения принимаем после проверки текущих цен и риска. Открыт шорт SBER и используется маржинальное финансирование.</div></div>',
 risk:'<div class="modePanel"><div class="label">РИСКИ ТЕКУЩЕГО ПОРТФЕЛЯ</div><div class="decision">МАРЖА АКТИВНА</div><div class="decisionSub">Шорт Сбербанка −4 акции; использование маржинального финансирования '+rub(port.marginBorrowed)+'. Позиции OZON, YDEX, DELI и ARLIFT; кэш '+rub(port.cash)+'.</div></div>',
 goal:'<div class="modePanel"><div class="label">НЕДЕЛЬНАЯ ЦЕЛЬ</div><div class="decision" style="margin-top:45px">'+rub(curWeek.realized)+' <span style="color:#657080">/ '+rub(curWeek.target)+'</span></div><div style="height:18px;background:#20242d;border-radius:99px;margin:32px auto 12px;max-width:540px;overflow:hidden"><div class="metricFill" style="width:'+Math.min(100,Math.max(0,curWeek.realized/curWeek.target*100))+'%;background:linear-gradient(90deg,#ff5168,#ff8357)"></div></div><div class="decisionSub">'+pct(curWeek.realized/curWeek.target*100)+' выполнено · '+(achieved?'цель достигнута':'осталось '+rub(curWeek.target-curWeek.realized))+'</div></div>',
 compare:'<div class="modePanel"><div class="label">ACTIVE VS HOLD</div><div class="decision">СРАВНЕНИЕ В РАЗРАБОТКЕ</div><div class="decisionSub">Реализованный результат сделок нельзя корректно сравнивать с пассивным портфелем без сопоставимой истории покупок, продаж и денежных потоков.</div></div>'
};
function setMode(k){const mc=document.getElementById('modeContent');if(!mc)return;mc.innerHTML=panels[k];document.querySelectorAll('.mode').forEach(b=>b.classList.toggle('active',b.dataset.mode===k))}
document.querySelectorAll('.mode').forEach(b=>b.onclick=()=>setMode(b.dataset.mode));if(document.getElementById('modeContent'))setMode('today');

const scene=document.querySelector('.capitalScene'),coords=document.getElementById('sceneCoords');if(scene&&coords){scene.addEventListener('pointermove',e=>{const r=scene.getBoundingClientRect(),x=Math.round((e.clientX-r.left)/r.width*100),y=Math.round((e.clientY-r.top)/r.height*100);coords.textContent='X '+String(x).padStart(3,'0')+' · Y '+String(y).padStart(3,'0');scene.style.setProperty('--sx',x+'%');scene.style.setProperty('--sy',y+'%')})}

const infoMap={capital:['Брокерский счёт',rub(port.total),'Реальный баланс. Подарок '+rub(port.giftExcluded)+' исключён только из расчёта доходности.'],yandex:['Яндекс','1 акция','Открытая длинная позиция.'],ozon:['Озон','1 акция','Открытая длинная позиция.'],arlift:['Арлифт','1 облигация','Облигация; требуется контроль кредитного риска.'],delimobil:['Делимобиль','1 акция','Спекулятивная позиция.'],sber:['Сбербанк','−4 акции · шорт','Маржинальная короткая позиция с неограниченным риском роста цены.']};
const cv=document.getElementById('space'),field=document.getElementById('constellation'),ci=document.getElementById('constInfo');if(cv&&field){const ctx=cv.getContext('2d');function draw(){const d=devicePixelRatio||1,r=field.getBoundingClientRect();cv.width=r.width*d;cv.height=r.height*d;ctx.scale(d,d);ctx.clearRect(0,0,r.width,r.height);const core=field.querySelector('[data-key=capital]').getBoundingClientRect(),fr=field.getBoundingClientRect(),cx=core.left-fr.left+core.width/2,cy=core.top-fr.top+core.height/2;field.querySelectorAll('.node:not(.core)').forEach(n=>{const nr=n.getBoundingClientRect(),x=nr.left-fr.left+nr.width/2,y=nr.top-fr.top+nr.height/2,g=ctx.createLinearGradient(cx,cy,x,y);g.addColorStop(0,'rgba(201,255,74,.32)');g.addColorStop(1,'rgba(101,117,255,.08)');ctx.strokeStyle=g;ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx,cy);ctx.quadraticCurveTo((cx+x)/2+18,(cy+y)/2-12,x,y);ctx.stroke()})}draw();addEventListener('resize',draw);field.querySelectorAll('.node').forEach(n=>{n.onmouseenter=()=>{field.querySelectorAll('.node').forEach(x=>x.classList.remove('focus'));n.classList.add('focus');let a=infoMap[n.dataset.key]||[n.dataset.key,'Данных нет','Сверить состав портфеля'];ci.innerHTML='<div class="label">'+a[0]+'</div><div class="big">'+a[1]+'</div><div class="mini">'+a[2]+'</div>'};n.onmouseleave=()=>n.classList.remove('focus')})}

const fs=document.getElementById('capitalFlow'),fo=document.getElementById('flowOrb');if(fs&&fo){fs.addEventListener('pointermove',e=>{const r=fs.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*100,y=(e.clientY-r.top)/r.height*100;fs.style.setProperty('--mx',x+'%');fs.style.setProperty('--my',y+'%');const dx=(x-50)*.08,dy=(y-50)*.08;fo.style.transform='translate(calc(-50% + '+dx+'px),calc(-50% + '+dy+'px))'})}

const signalData={
now:[['Счёт',rub(port.total),'По снимку брокера на '+RDATA.meta.updated],['Текущая неделя',rub(curWeek.realized),'После комиссий продаж; комиссии покупок отдельно'],['Шорт SBER','−4 акции','Контролировать маржу и обеспечение']],
risk:[['Маржинальное финансирование',rub(port.marginBorrowed),'Есть кредитное плечо'],['Шорт SBER','−4 акции','Рост котировки увеличивает убыток'],['Подарок исключён',rub(port.giftExcluded),'Не учитываем в доходности эксперимента']],
profit:[['Неделя №'+curWeek.number,rub(curWeek.realized),pct(curWeek.realized/curWeek.target*100)+' от цели'],['Цель',rub(curWeek.target),achieved?'Выполнена':'Осталось '+rub(curWeek.target-curWeek.realized)],['Учёт','После комиссий продаж','Покупки и прочие издержки отдельно']],
cash:[['Свободные рубли',rub(port.cash),'По последнему снимку'],['Маржинальное использование',rub(port.marginBorrowed),'Не путать с собственными средствами'],['Расчётный капитал',rub(port.adjustedCapital),'Баланс минус подарок']]
};
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
  realized:D.week.realized,
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
 if(pos)pos.innerHTML=D.positions.map(p=>'<div class="row"><div class="asset"><b><a href="company.html?ticker='+encodeURIComponent(p.ticker)+'">'+(window.RAZGON_COMPANY_API?.get(p.ticker)?.name||p.name)+'</a></b><small>'+p.ticker+' · '+p.qty+' шт.</small></div><div class="num">'+R.rub(p.price,p.price%1?2:0)+'</div><div class="pnl '+(p.pnlPct>=0?'green':'red')+'">'+R.pct(p.pnlPct)+'</div></div>').join('');
 const tradeHTML=t=>'<div class="trade"><div class="tradeNo">'+String(t.id).padStart(2,'0')+'</div><div><b>'+t.ticker+' · '+t.side+' '+t.qty+'</b><br><small>'+t.date+' · '+R.rub(t.price,2)+' · комиссия '+R.rub(t.commission,2)+'</small></div><div class="profit">'+(t.netProfit>=0?'+':'')+R.rub(t.netProfit,2)+'</div></div>';
 const pl=document.getElementById('portfolioTradeLog');if(pl)pl.innerHTML=D.trades.map(tradeHTML).join('');
 const tt=document.getElementById('tradesTable');if(tt)tt.innerHTML=D.trades.map(tradeHTML).join('');
 const core=document.querySelector('.node.core b');if(core)core.textContent=R.rub(D.portfolio.total,0);
 const nodeMap={yandex:'YDEX',ozon:'OZON',arlift:'ARLIFT',delimobil:'DELI',sber:'SBER'};
 Object.entries(nodeMap).forEach(([key,ticker])=>{const n=document.querySelector('.node[data-key="'+key+'"] small'),p=D.positions.find(x=>x.ticker===ticker);if(n&&p)n.textContent='≈'+Math.round(p.weight)+'%'});
})();

/* BUILD 004.32 — interactive history charts from verified snapshots and trade ledger */
(()=>{
 const D=window.RAZGON_DATA;if(!D)return;
 const rub=n=>Number(n||0).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
 const signed=n=>(n>=0?'+':'−')+rub(Math.abs(n));
 const iso=d=>d.split('.').reverse().join('-');
 const short=d=>d.slice(0,5);
 const esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const snaps=(D.snapshots||[]).slice().sort((a,b)=>iso(a.date).localeCompare(iso(b.date)));
 const transactions=D.trades||[];
 const weeks=[{n:1,start:'05.10.2026',end:'11.10.2026'},{n:2,start:'12.10.2026',end:'18.10.2026'},{n:3,start:'19.10.2026',end:'25.10.2026'}];
 const dates=(from,to)=>{const a=new Date(iso(from)+'T12:00:00Z'),b=new Date(iso(to)+'T12:00:00Z'),out=[];for(let d=new Date(a);d<=b;d.setUTCDate(d.getUTCDate()+1))out.push(String(d.getUTCDate()).padStart(2,'0')+'.'+String(d.getUTCMonth()+1).padStart(2,'0')+'.'+d.getUTCFullYear());return out};
 function chart(host,rows,opts={}){
  if(!host)return;
  const width=760,height=260,left=66,right=24,top=25,bottom=42;
  if(!rows.length){host.textContent='Пока нет подтверждённых данных.';return}
  const vals=rows.map(r=>r.value),lo=Math.min(...vals),hi=Math.max(...vals),pad=Math.max((hi-lo)*.15,opts.money?70:30),min=opts.zeroBaseline?Math.min(0,lo):Math.min(...vals)-pad,max=opts.zeroBaseline?hi+pad:Math.max(...vals)+pad;
  const x=i=>left+(rows.length===1?0.5:i/(rows.length-1))*(width-left-right);
  const y=v=>top+(max-v)/Math.max(1,max-min)*(height-top-bottom);
  const pts=rows.map((r,i)=>({x:x(i),y:y(r.value),r}));
  const path=pts.map((p,i)=>(i?'L':'M')+p.x.toFixed(2)+' '+p.y.toFixed(2)).join(' ');
  const grid=[0,.25,.5,.75,1].map(t=>{const v=max-t*(max-min),yy=top+t*(height-top-bottom);return '<line x1="'+left+'" x2="'+(width-right)+'" y1="'+yy+'" y2="'+yy+'" stroke="#343d45" stroke-opacity=".5"/><text x="'+(left-7)+'" y="'+(yy+4)+'" text-anchor="end" fill="#88949e" font-size="11">'+Math.round(v).toLocaleString('ru-RU')+'</text>'}).join('');
  host.innerHTML='<svg viewBox="0 0 '+width+' '+height+'" role="img" aria-label="'+esc(opts.title||'График')+'" style="width:100%;height:auto;display:block;overflow:visible">'+grid+'<path d="'+path+'" fill="none" stroke="#c9ff4a" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>'+pts.map((p,i)=>'<g class="historyPoint" data-idx="'+i+'" tabindex="0" role="button" aria-label="'+esc(p.r.label+' '+rub(p.r.value))+'"><circle cx="'+p.x+'" cy="'+p.y+'" r="15" fill="transparent"/><circle cx="'+p.x+'" cy="'+p.y+'" r="5.5" fill="#c9ff4a" stroke="#101820" stroke-width="2"/></g>').join('')+pts.filter((p,i)=>rows.length<=8||i%Math.ceil(rows.length/7)===0||i===rows.length-1).map(p=>'<text x="'+p.x+'" y="'+(height-10)+'" text-anchor="middle" fill="#aab3bc" font-size="11">'+esc(p.r.axis||p.r.label)+'</text>').join('')+'</svg>';
  const detail=opts.detail;
  function show(i){const p=pts[i];if(!p)return;host.querySelectorAll('.historyPoint').forEach((el,j)=>{const c=el.querySelector('circle:last-child');c.setAttribute('r',j===i?'8':'5.5');c.setAttribute('fill',j===i?'#fff':'#c9ff4a')});if(detail)detail.innerHTML='<b>'+esc(p.r.label)+'</b><strong>'+rub(p.r.value)+'</strong><span>'+esc(p.r.note||'')+'</span>'}
  host.querySelectorAll('.historyPoint').forEach((el,i)=>{el.addEventListener('mouseenter',()=>show(i));el.addEventListener('focus',()=>show(i));el.addEventListener('click',()=>show(i));el.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();show(i)}})});
  show(rows.length-1);
 }
 function equityRows(mode){
  if(mode==='snapshots')return snaps.map((s,i)=>({label:s.date+' · '+s.time,value:s.total,axis:short(s.date),note:(i?'Изменение с прошлого снимка: '+signed(s.total-snaps[i-1].total)+'. ':'')+'Подтверждённый снимок брокера. Расчётный капитал без подарка: '+rub(s.total-(iso(s.date)>='2026-10-14'?D.portfolio.giftExcluded:0))}));
  const all=dates(snaps[0].date,snaps.at(-1).date);
  if(mode==='days')return all.filter(d=>snaps.some(s=>s.date===d)).map(d=>{const s=snaps.find(v=>v.date===d);return {label:d,value:s.total,axis:short(d),note:'Подтверждённый снимок '+s.time+'. На остальные даты данных нет.'}});
  return weeks.map(w=>{const ss=snaps.filter(s=>iso(s.date)>=iso(w.start)&&iso(s.date)<=iso(w.end));const last=ss.at(-1);return last?{label:'Неделя №'+w.n+' · '+last.date,value:last.total,axis:'№'+w.n,note:'Последний доступный снимок за неделю; не обязательно баланс на её закрытие.'}:null}).filter(Boolean);
 }
 const equityHost=document.getElementById('equityChart');
 if(equityHost){
  const old=equityHost.querySelector('svg');if(old)old.remove();const empty=equityHost.querySelector('#equityEmpty');if(empty)empty.remove();
  const detail=document.getElementById('equityDetail');
  const render=mode=>{chart(equityHost,equityRows(mode),{title:'История капитала',detail,money:true});document.querySelectorAll('[data-history-mode]').forEach(b=>b.classList.toggle('active',b.dataset.historyMode===mode))};
  document.querySelectorAll('[data-history-mode]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.historyMode)));
  render('snapshots');
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v};
  set('snapshotCount',snaps.length+' подтверждённых снимка');
  set('equityStart','Первый · '+snaps[0].date+' · '+rub(snaps[0].total));
  set('equityLast','Последний · '+snaps.at(-1).date+' · '+rub(snaps.at(-1).total));
  set('equityChange',signed(snaps.at(-1).total-snaps[0].total));
 }
 const strategy=document.getElementById('strategyHistoryChart');if(strategy)chart(strategy,equityRows('snapshots'),{title:'История капитала по снимкам',detail:document.getElementById('strategyHistoryDetail'),money:true});
 const history=document.getElementById('tradeHistoryChart');
 if(history){
  const all=dates('05.10.2026','20.10.2026');
  const rows=all.map(d=>{const t=transactions.filter(v=>v.date===d);const gross=t.reduce((a,v)=>a+v.grossProfit,0),fees=t.reduce((a,v)=>a+v.commission,0);return {label:d,value:Math.round((gross-fees)*100)/100,axis:short(d),note:t.length?t.length+' закрытых продаж; прибыль до комиссий '+rub(gross)+', комиссии '+rub(fees):'Закрытых продаж в журнале нет'}});
  history.innerHTML='<div class="historyControls"><button class="historyBtn active" data-trade-mode="days">Дни</button><button class="historyBtn" data-trade-mode="weeks">Недели</button></div><div id="tradeGraph"></div><div class="historyDetail" id="tradeDetail"></div>';
  const graph=history.querySelector('#tradeGraph'),detail=history.querySelector('#tradeDetail');
  const weekly=weeks.map(w=>{const t=transactions.filter(v=>iso(v.date)>=iso(w.start)&&iso(v.date)<=iso(w.end));const gross=t.reduce((a,v)=>a+v.grossProfit,0),fees=t.reduce((a,v)=>a+v.commission,0);return {label:'Неделя №'+w.n+' · '+w.start.slice(0,5)+'–'+w.end.slice(0,5),axis:'№'+w.n,value:Math.round((gross-fees)*100)/100,note:t.length+' закрытых продаж; комиссии продаж '+rub(fees)}}); 
  const render=mode=>{chart(graph,mode==='days'?rows:weekly,{title:'Прибыль закрытых продаж',detail,zeroBaseline:true});history.querySelectorAll('[data-trade-mode]').forEach(b=>b.classList.toggle('active',b.dataset.tradeMode===mode))};
  history.querySelectorAll('[data-trade-mode]').forEach(b=>b.addEventListener('click',()=>render(b.dataset.tradeMode)));render('weeks');
 }
})();
/* BUILD 004.07 — Trading Radar renderer */
(()=>{const R=window.RAZGON,D=R&&R.data,grid=document.getElementById('radarGrid');if(!D||!grid)return;const items=[...(D.radar||[])].sort((a,b)=>a.priority-b.priority);grid.innerHTML=items.map((x,i)=>'<article class="radarCard '+(i===0?'hot':'')+'"><div class="radarHead"><div><div class="radarTicker"><a href="company.html?ticker='+encodeURIComponent(x.ticker)+'">'+x.ticker+'</a></div><div class="radarName">'+x.name+'</div></div><span class="radarStatus">'+x.status+'</span></div><div class="radarAction"><div><span>ДЕЙСТВИЕ</span><b>'+x.action+'</b></div><div class="radarZone"><span>ЗОНА / РАЗМЕР</span><b>'+x.zone+'</b><small>'+x.size+'</small></div></div><div class="radarFields"><div class="radarField"><span>ТРИГГЕР</span><b>'+x.trigger+'</b></div><div class="radarField"><span>ОТМЕНА</span><b>'+x.invalidation+'</b></div><div class="radarField"><span>КАТАЛИЗАТОР</span><b>'+x.catalyst+'</b></div></div></article>').join('');const active=items.filter(x=>x.status==='WATCH').length;document.getElementById('radarActive').textContent=active;document.getElementById('radarNext').textContent=items[0]?.ticker+' · '+items[0]?.action;const bar=document.getElementById('radarWeekBar');if(bar)requestAnimationFrame(()=>bar.style.width=Math.min(100,D.computed.weekProgress)+'%')})();

/* BUILD 004.08 — Risk Engine */
(()=>{const D=window.RAZGON_DATA,el=document.getElementById('riskTicker');if(!D||!el)return;
const ids=['riskSide','riskEntry','riskStop','riskTarget','riskQty','riskFee'];const get=id=>document.getElementById(id),rub=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2,minimumFractionDigits:2})+' ₽';
el.innerHTML=D.positions.map(p=>'<option value="'+p.ticker+'">'+p.name+' ('+p.ticker+')</option>').join('');
function defaults(){const p=D.positions.find(x=>x.ticker===el.value);if(!p)return;get('riskEntry').value=p.price;get('riskStop').value=(p.price*.97).toFixed(2);get('riskTarget').value=(p.price*1.06).toFixed(2);get('riskQty').value=1;calc()}
function calc(){const p=D.positions.find(x=>x.ticker===el.value),side=get('riskSide').value,entry=+get('riskEntry').value,stop=+get('riskStop').value,target=+get('riskTarget').value,qty=+get('riskQty').value,fee=+get('riskFee').value/100,out=get('riskOutput');
if(!p||![entry,stop,target,qty,fee].every(Number.isFinite)||entry<=0||stop<=0||target<=0||qty<1||!Number.isInteger(qty)||fee<0){out.textContent='Введите корректные положительные цены и целое количество.';return}
if(side==='buy'&&!(stop<entry&&target>entry)){out.textContent='Для покупки стоп должен быть ниже входа, а цель — выше.';return}
if(side==='sell'&&!(stop>entry&&target<entry)){out.textContent='Для продажи имеющейся позиции используйте режим оценки движения после продажи: стоп выше цены продажи, цель ниже.';return}
const nominal=entry*qty,available=side==='buy'?D.portfolio.cash:p.qty,limit=side==='buy'?nominal*(1+fee)<=available:qty<=available;
const risk=(Math.abs(entry-stop)+fee*(entry+stop))*qty,reward=(Math.abs(target-entry)-fee*(entry+target))*qty,rr=risk>0?reward/risk:0;
const portfolioWeight=nominal/D.portfolio.total*100;
out.innerHTML='<div><span>Объём</span><b>'+rub(nominal)+'</b></div><div><span>Макс. плановый убыток*</span><b>'+rub(risk)+'</b></div><div><span>Потенциал после комиссий*</span><b>'+rub(reward)+'</b></div><div><span>Risk / Reward</span><b>'+rr.toFixed(2)+'</b></div><div><span>Доля от капитала</span><b>'+portfolioWeight.toFixed(1)+'%</b></div><div><span>Проверка лимита</span><b class="'+(limit?'green':'red')+'">'+(limit?'В пределах доступного':'Превышен доступный объём')+'</b></div>';
}
el.addEventListener('change',defaults);get('riskSide').addEventListener('change',()=>{const p=D.positions.find(x=>x.ticker===el.value);get('riskStop').value=(p.price*(get('riskSide').value==='buy'?.97:1.03)).toFixed(2);get('riskTarget').value=(p.price*(get('riskSide').value==='buy'?1.06:.94)).toFixed(2);calc()});ids.filter(x=>x!=='riskSide').forEach(id=>get(id).addEventListener('input',calc));defaults();
})();

/* BUILD 004.09 — Portfolio Risk Overview */
(()=>{const D=window.RAZGON_DATA,root=document.getElementById('riskDash');if(!D||!root)return;
const total=D.portfolio.total,fmt=n=>n.toLocaleString('ru-RU',{maximumFractionDigits:2})+' ₽';
const sectors={YDEX:'Технологии',VKCO:'Технологии',T:'Финансы',SBERP:'Финансы',VTBR:'Финансы',ROSN:'Нефть и газ'};
const sectorValues={},rows=[...D.positions,...(D.extras||[]).filter(x=>x.ticker==='ROSN_GIFT')];let known=0;
for(const p of rows){const sec=sectors[p.ticker]||(p.ticker==='ROSN_GIFT'?'Нефть и газ':'Прочее');sectorValues[sec]=(sectorValues[sec]||0)+p.value;known+=p.value}
const weights=rows.map(p=>({...p,weight:100*p.value/total})).sort((a,b)=>b.weight-a.weight);
const top=weights[0],top3=weights.slice(0,3).reduce((a,p)=>a+p.weight,0),cash=100*D.portfolio.cash/total,stress=rows.reduce((a,p)=>a+p.value*.1,0);
root.innerHTML=[['Крупнейшая позиция',top.name+' · '+top.weight.toFixed(1)+'%'],['Три крупнейшие',top3.toFixed(1)+'%'],['Свободный кэш',cash.toFixed(1)+'%'],['Падение акций на 10%','−'+fmt(stress)]].map(x=>'<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join('');
const sec=document.getElementById('riskSector');sec.innerHTML=Object.entries(sectorValues).sort((a,b)=>b[1]-a[1]).map(([name,val])=>'<div class="riskSectorRow"><span>'+name+'</span><div><i style="width:'+Math.min(100,val/total*100)+'%"></i></div><b>'+(val/total*100).toFixed(1)+'%</b></div>').join('');
const alerts=[];if(top.weight>30)alerts.push('Концентрация: '+top.name+' занимает '+top.weight.toFixed(1)+'% портфеля (контрольный порог 30%).');if(top3>70)alerts.push('Три крупнейшие позиции занимают '+top3.toFixed(1)+'% капитала (контрольный порог 70%).');for(const [name,val] of Object.entries(sectorValues)){if(val/total>0.4)alerts.push('Отраслевой риск: '+name+' — '+(val/total*100).toFixed(1)+'% портфеля.')}document.getElementById('riskAlerts').innerHTML=alerts.map(t=>'<p>⚠ '+t+'</p>').join('')||'<p>Концентрации выше контрольных порогов не обнаружены.</p>';
})();

/* BUILD 004.10 — interactive portfolio risk laboratory */
(()=>{const D=window.RAZGON_DATA,root=document.getElementById('labTicker');if(!D||!root)return;
const el=id=>document.getElementById(id),money=n=>n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
const sector={YDEX:'Технологии',VKCO:'Технологии',T:'Финансы',SBERP:'Финансы',VTBR:'Финансы',ROSN:'Нефть и газ',ROSN_GIFT:'Нефть и газ'};
const original=[...D.positions,...(D.extras||[]).filter(p=>p.ticker==='ROSN_GIFT')];const total=D.portfolio.total;
root.innerHTML=D.positions.map(p=>'<option value="'+p.ticker+'">'+p.name+'</option>').join('');
function limits(){const c=+el('labCompany').value,s=+el('labSector').value,t=+el('labTrade').value,drop=+el('labStress').value,out=el('labLimitsResult');if(!(c>=1&&c<=100&&s>=1&&s<=100&&t>0&&t<=20)){out.textContent='Проверьте значения лимитов.';return}
const max=Math.max(...original.map(p=>p.value/total*100)),by={};original.forEach(p=>by[sector[p.ticker]]=(by[sector[p.ticker]]||0)+p.value);const maxSector=Math.max(...Object.values(by))/total*100,exposure=original.reduce((sum,p)=>sum+p.value,0);
out.innerHTML='<div><span>Лимит компании</span><b>'+(max>c?'Превышен: ':'В норме: ')+max.toFixed(1)+'%</b></div><div><span>Лимит отрасли</span><b>'+(maxSector>s?'Превышен: ':'В норме: ')+maxSector.toFixed(1)+'%</b></div><div><span>Бюджет риска на сделку</span><b>'+money(total*t/100)+'</b></div><div><span>Стресс '+drop+'%</span><b>−'+money(exposure*drop/100)+'</b></div>'}
function simulate(){const p=D.positions.find(x=>x.ticker===root.value),qty=+el('labQty').value,price=+el('labPrice').value,buy=el('labSide').value==='buy',out=el('labWhatResult');if(!p||!Number.isInteger(qty)||qty<1||!Number.isFinite(price)||price<=0){out.textContent='Укажите корректную цену и целое количество.';return}
const amount=qty*price;if(buy&&amount>D.portfolio.cash+1e-8){out.textContent='Недостаточно свободных денег: требуется '+money(amount)+', доступно '+money(D.portfolio.cash)+'.';return}if(!buy&&qty>p.qty){out.textContent='Нельзя продать '+qty+' шт.: имеется '+p.qty+'.';return}
const positions=original.map(x=>({...x}));const target=positions.find(x=>x.ticker===p.ticker);target.value+=(buy?1:-1)*amount;const cash=D.portfolio.cash+(buy?-1:1)*amount;const sectorTotals={};positions.forEach(x=>sectorTotals[sector[x.ticker]]=(sectorTotals[sector[x.ticker]]||0)+x.value);
const before=p.value/total*100,after=target.value/total*100,largest=Math.max(...positions.map(x=>x.value/total*100));const maxSector=Math.max(...Object.values(sectorTotals))/total*100;const c=+el('labCompany').value,s=+el('labSector').value;
const cards=[['Доля '+p.ticker,before.toFixed(1)+'% → '+after.toFixed(1)+'%'],['Свободные деньги',money(cash)],['Макс. доля компании',largest.toFixed(1)+'% '+(largest>c?'⚠':'✓')],['Макс. доля отрасли',maxSector.toFixed(1)+'% '+(maxSector>s?'⚠':'✓')]];
if(!buy){const avgCost=(p.value-p.pnl)/p.qty;const gross=(price-avgCost)*qty;const feeRate=.003;const fee=amount*feeRate;const net=gross-fee;const percent=avgCost>0?net/(avgCost*qty)*100:0;cards.push(['Средняя цена покупки',money(avgCost)],['Валовая прибыль / убыток',(gross>=0?'+':'')+money(gross)],['Комиссия продажи (оценка 0,30%)','−'+money(fee)],['Фиксируем после комиссии',(net>=0?'+':'')+money(net)+' ('+(percent>=0?'+':'')+percent.toFixed(2)+'%)'],['Остаток позиции',(p.qty-qty)+' шт.']);}
else{const avgCost=(p.value-p.pnl)/p.qty;const newAvg=(avgCost*p.qty+amount)/(p.qty+qty);cards.push(['Средняя цена после покупки',money(newAvg)],['Прибыль от покупки','Не фиксируется']);}
out.innerHTML=cards.map(x=>'<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join('');
}
root.addEventListener('change',()=>{el('labPrice').value=D.positions.find(x=>x.ticker===root.value).price;simulate()});
['labCompany','labSector','labTrade','labStress'].forEach(id=>el(id).addEventListener('input',()=>{limits();simulate()}));
['labSide','labQty','labPrice'].forEach(id=>el(id).addEventListener('input',simulate));
el('labPrice').value=D.positions[0].price;limits();simulate();
})();

/* BUILD 004.12 — trade preflight, no orders */
(()=>{const D=window.RAZGON_DATA,select=document.getElementById('gateTicker');if(!D||!select)return;
const e=id=>document.getElementById(id),fmt=n=>n.toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
select.innerHTML=D.positions.map(p=>'<option value="'+p.ticker+'">'+p.name+'</option>').join('');
function update(){const p=D.positions.find(x=>x.ticker===select.value),side=e('gateSide').value,price=+e('gatePrice').value,qty=+e('gateQty').value,fee=+e('gateFee').value/100,move=+e('gateMove').value/100,limit=+e('gateLimit').value,out=e('gateOutput');
if(!p||!(price>0)||!Number.isInteger(qty)||qty<1||!Number.isFinite(fee)||fee<0||fee>=1||!Number.isFinite(move)||move<0||!Number.isFinite(limit)||limit<1||limit>100){out.textContent='Проверьте параметры сделки.';return}
const nominal=price*qty,commission=nominal*fee,avg=(p.value-p.pnl)/p.qty,oldShare=p.value/D.portfolio.total*100;
const cards=[],warnings=[];let newValue,newTotal,newCash;
if(side==='buy'){const exit=price*(1+move),roundFees=nominal*fee+exit*qty*fee,net=(exit-price)*qty-roundFees,breakeven=price*(1+fee)/(1-fee),need=nominal*(1+fee);
newValue=p.value+nominal;newTotal=D.portfolio.total-commission;newCash=D.portfolio.cash-need;
cards.push(['Оборот покупки',fmt(nominal)],['Комиссия входа',fmt(commission)],['Безубыточность продажи',fmt(breakeven)+' (+'+((breakeven/price-1)*100).toFixed(3)+'%)'],['Результат при росте '+(move*100).toFixed(1)+'%',(net>=0?'+':'')+fmt(net)],['Доступные деньги после',fmt(newCash)]);
if(newCash<0)warnings.push('Недостаточно свободного кэша с учётом комиссии.');if(net<=0)warnings.push('Заданное движение не покрывает комиссии.');
}else{if(qty>p.qty){out.textContent='Недостаточно акций для продажи: доступно '+p.qty+' шт.';return}
const gross=(price-avg)*qty,net=gross-commission;newValue=p.value-nominal;newTotal=D.portfolio.total-commission;newCash=D.portfolio.cash+nominal-commission;
cards.push(['Средняя себестоимость',fmt(avg)],['Валовый результат',(gross>=0?'+':'')+fmt(gross)],['Комиссия продажи',fmt(commission)],['Фиксируем после комиссии',(net>=0?'+':'')+fmt(net)],['Доступные деньги после',fmt(newCash)]);
}
const weight=newValue/newTotal*100;cards.push(['Доля компании',oldShare.toFixed(1)+'% → '+weight.toFixed(1)+'%']);if(weight>limit)warnings.push('Доля выбранной компании превышает лимит '+limit+'%.');
const sector={YDEX:'Технологии',VKCO:'Технологии',T:'Финансы',SBERP:'Финансы',VTBR:'Финансы',ROSN:'Нефть и газ'};
const sec=sector[p.ticker];let sectorVal=D.positions.filter(x=>sector[x.ticker]===sec).reduce((sum,x)=>sum+x.value,0);if(sec==='Нефть и газ')sectorVal+=(D.extras||[]).filter(x=>x.ticker==='ROSN_GIFT').reduce((sum,x)=>sum+x.value,0);
sectorVal+=(side==='buy'?1:-1)*nominal;cards.push(['Доля отрасли после',(sectorVal/newTotal*100).toFixed(1)+'%']);if(sectorVal/newTotal>0.4)warnings.push('Доля отрасли превышает ориентир 40%.');
out.innerHTML=cards.map(x=>'<div><span>'+x[0]+'</span><b>'+x[1]+'</b></div>').join('')+'<div style="grid-column:1/-1"><span>Итог проверки</span><b>'+(warnings.length?warnings.join(' · '):'Ограничения пройдены; это не рекомендация совершать сделку.')+'</b></div>';
}
select.addEventListener('change',()=>{e('gatePrice').value=D.positions.find(x=>x.ticker===select.value).price;update()});
['gateSide','gatePrice','gateQty','gateFee','gateMove','gateLimit'].forEach(id=>e(id).addEventListener('input',update));
e('gatePrice').value=D.positions[0].price;update();
})();

/* LEVEL 07 BUILD 004.13 — verified-event journal */
(()=>{const D=window.RAZGON_DATA,root=document.getElementById('intelEvents');if(!D||!root)return;
const ticker=document.getElementById('intelTicker'),priority=document.getElementById('intelPriority');ticker.innerHTML+=[...new Set((D.events||[]).map(x=>x.ticker))].map(x=>'<option value="'+x+'">'+x+'</option>').join('');
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function render(){const rows=(D.events||[]).filter(x=>(ticker.value==='all'||x.ticker===ticker.value)&&(priority.value==='all'||x.priority===priority.value));root.innerHTML=rows.length?rows.map(x=>'<article class="intelEvent"><div class="intelMeta"><b><a href="company.html?ticker='+encodeURIComponent(x.ticker)+'">'+esc(x.ticker)+'</a></b><span>'+esc(x.date)+'</span><span>'+esc(x.priority==='high'?'Высокий приоритет':x.priority==='medium'?'Средний приоритет':'Низкий приоритет')+'</span></div><h2>'+esc(x.title)+'</h2><p>'+esc(x.summary)+'</p><div class="intelStatus">'+(x.status==='verified'?'Источник проверен':'⚠ Требует проверки источника')+' · '+(x.impact==='negative'?'Негативное влияние':x.impact==='positive'?'Позитивное влияние':'Влияние неопределённо')+'</div><div class="intelDecision"><b>Решение:</b> '+esc(x.decision)+'</div>'+(x.sourceUrl?'<a href="'+esc(x.sourceUrl)+'" target="_blank" rel="noopener noreferrer">Первоисточник ↗</a>':'<small>Ссылка на подтверждённый источник пока отсутствует</small>')+'</article>').join(''):'<p>Событий с такими фильтрами нет.</p>'}
ticker.addEventListener('change',render);priority.addEventListener('change',render);render();
})();

/* LEVEL 07 · BUILD 004.15 — Company Intelligence */
(()=>{const api=window.RAZGON_COMPANY_API,select=document.getElementById('companyTicker'),root=document.getElementById('companyDetail'),D=window.RAZGON_DATA;if(!api||!select||!root||!D)return;
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const rub=n=>Number(n).toLocaleString('ru-RU',{minimumFractionDigits:2,maximumFractionDigits:2})+' ₽';
const list=a=>'<ul>'+a.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>';
const entries=api.all();select.innerHTML=entries.map(x=>'<option value="'+esc(x.ticker)+'">'+esc(x.name)+' · '+esc(x.ticker)+'</option>').join('');
const requested=new URLSearchParams(location.search).get('ticker');if(api.get(requested))select.value=requested.toUpperCase();
function render(){const t=select.value,c=api.get(t),p=api.position(t),r=api.radar(t),events=api.events(t),cost=p&&p.qty?(p.value-p.pnl)/p.qty:0;
root.innerHTML='<article class="intelEvent"><div class="intelMeta"><b>'+esc(t)+'</b><span>'+esc(c.sector)+'</span><span>'+esc(c.style)+'</span><span>Горизонт: '+esc(c.horizon)+'</span></div><h2>'+esc(c.name)+'</h2><p>'+esc(c.thesis)+'</p>'+(p?'<div class="intelDecision"><b>Позиция:</b> '+p.qty+' шт. · '+rub(p.value)+' · средняя '+rub(cost)+' · результат '+(p.pnl>=0?'+':'')+rub(p.pnl)+' ('+Number(p.pnlPct).toFixed(2)+'%) · доля '+api.weight(t).toFixed(1)+'%</div>':'<p>Нет позиции в сохранённом портфеле.</p>')+'<p class="mini">Портфель: снимок '+esc(D.meta.updated)+'. Не онлайн-котировка.</p></article>'+
'<article class="intelEvent"><h2>Решение и торговый план</h2><div class="intelStatus">'+esc(r?r.status:'Нет оценки')+' · '+esc(r?r.action:'Нет действия')+'</div><p><b>Условие:</b> '+esc(r?r.trigger:'Не задано')+'</p><p><b>Отмена:</b> '+esc(r?r.invalidation:'Не задана')+'</p><p><b>Зона:</b> '+esc(r?r.zone:'Не задана')+'</p><a href="radar.html">Открыть Радар ↗</a></article>'+
'<article class="intelEvent"><h2>Риски и условия пересмотра</h2><b>Риски</b>'+list(c.risks)+'<b>Для возможной покупки</b>'+list(c.buy)+'<b>Для сокращения</b>'+list(c.reduce)+'</article>'+
'<article class="intelEvent"><h2>События компании · '+events.length+'</h2>'+(events.length?events.map(x=>'<div class="intelDecision"><b>'+esc(x.date)+' · '+esc(x.title)+'</b><p>'+esc(x.summary)+'</p><small>'+(x.status==='verified'?'Проверено':'Требует проверки')+'</small></div>').join(''):'<p>Подтверждённых событий пока не внесено. Отсутствие записей не означает отсутствие новостей.</p>')+'<a href="intelligence.html">Открыть журнал событий ↗</a></article>';
}select.addEventListener('change',()=>{history.replaceState(null,'','company.html?ticker='+encodeURIComponent(select.value));render()});render();
})();
