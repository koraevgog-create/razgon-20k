/* BUILD 004.18 — локальный журнал решений. Данные остаются в этом браузере. */
(function(){
 const api=window.RAZGON_COMPANY_API,D=window.RAZGON_DATA,key='razgon20k.decisionTracker.v1';
 const escapeHTML=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const num=n=>Number(n).toLocaleString('ru-RU',{maximumFractionDigits:2});
 function read(){try{const x=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(x)?x.filter(y=>y&&typeof y.id==='string').slice(0,500):[]}catch(e){return []}}
 function write(rows){try{localStorage.setItem(key,JSON.stringify(rows));return true}catch(e){return false}}
 function init(){
  const host=document.getElementById('decisionTracker'),ticker=document.getElementById('companyTicker');if(!host||!ticker||!api||!D)return;
  host.innerHTML='<article class="intelEvent"><h2>Decision Tracker · мой журнал</h2><p>Записывайте решение, цену и причину. Запись сохраняется только в этом браузере, не в GitHub и не у брокера.</p><form id="trackerForm"><div class="riskInputs"><label>Решение<select id="trackerAction"><option>HOLD</option><option>WATCH</option><option>BUY PLAN</option><option>SELL PLAN</option><option>REVIEW</option></select></label><label>Цена на момент решения, ₽<input id="trackerPrice" type="number" min="0.01" step="0.01" required></label></div><label>Почему принимаю решение<textarea id="trackerReason" maxlength="600" rows="3" required placeholder="Причина, сценарий и условия отмены"></textarea></label><p><button type="submit">Сохранить решение</button> <span id="trackerFeedback" role="status"></span></p></form><p class="mini">Цена автоматически предлагается из сохранённого снимка, который может быть устаревшим. Перед записью укажите фактическую цену.</p></article><article class="intelEvent"><h2>Мои записи <span id="trackerCount"></span></h2><div id="trackerEntries"></div></article>';
  const form=document.getElementById('trackerForm'),price=document.getElementById('trackerPrice'),reason=document.getElementById('trackerReason'),action=document.getElementById('trackerAction'),feedback=document.getElementById('trackerFeedback'),entries=document.getElementById('trackerEntries'),count=document.getElementById('trackerCount');
  function resetPrice(){const p=api.position(ticker.value);price.value=p?Number(p.price).toFixed(2):'';price.title='Предложено по снимку '+D.meta.updated}
  function render(){
   const rows=read().filter(x=>x.ticker===ticker.value).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));count.textContent='('+rows.length+')';
   entries.innerHTML=rows.length?rows.map(x=>{const current=api.position(x.ticker),diff=current?((current.price/x.price)-1)*100:null;return '<div class="intelDecision"><b>'+escapeHTML(x.date)+' · '+escapeHTML(x.action)+'</b><p>Цена решения: '+num(x.price)+' ₽ · '+escapeHTML(x.reason)+'</p><small>'+(diff===null?'Нет цены для сравнения':'Изменение к снимку '+escapeHTML(D.meta.updated)+': '+(diff>=0?'+':'')+num(diff)+'% (не текущая доходность)')+'</small><p><button type="button" data-delete="'+escapeHTML(x.id)+'">Удалить запись</button></p></div>'}).join(''):'<p>Записей по этой компании пока нет.</p>';
  }
  form.addEventListener('submit',e=>{e.preventDefault();const v=Number(price.value),why=reason.value.trim();if(!Number.isFinite(v)||v<=0||!why){feedback.textContent='Укажите цену и причину.';return}const rows=read();rows.push({id:Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),ticker:ticker.value,action:action.value,price:v,reason:why,date:new Date().toLocaleDateString('ru-RU'),createdAt:new Date().toISOString()});if(!write(rows)){feedback.textContent='Не удалось сохранить. Проверьте настройки браузера.';return}reason.value='';feedback.textContent='Сохранено на этом устройстве.';render()});
  entries.addEventListener('click',e=>{const btn=e.target.closest('[data-delete]');if(!btn)return;const id=btn.dataset.delete;if(!confirm('Удалить эту запись?'))return;if(write(read().filter(x=>x.id!==id)))render();else feedback.textContent='Не удалось удалить запись.'});
  ticker.addEventListener('change',()=>{resetPrice();feedback.textContent='';render()});resetPrice();render();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
