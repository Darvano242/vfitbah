(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const text=n=>(n?.textContent||'').replace(/\s+/g,' ').trim();
const icon=(name)=>({home:'<path d="M3 11.5 12 4l9 7.5V21h-6v-6H9v6H3z"/>',programs:'<path d="M6 4v16M18 4v16M3 8h6v8H3zM15 8h6v8h-6z"/>',dashboard:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',nutrition:'<path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M17 3v18M17 3c3 2 3 7 0 9"/>',profile:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>'}[name]||'');
function svg(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icon(name)}</svg>`}
function clickExisting(label){const target=$$('button,a').find(x=>text(x).toLowerCase()===label.toLowerCase()||text(x).toLowerCase().includes(label.toLowerCase()));if(target){target.click();return true}return false}
function identifyCards(root){
 const actionWords=/view program|buy|start program|enroll|learn more|get program|purchase/i;
 const candidates=$$('button,a',root).filter(x=>actionWords.test(text(x))).map(x=>x.closest('article,[class*="rounded"],[class*="card"],section,div')).filter(Boolean);
 return [...new Set(candidates)].filter(c=>text(c).length>30&&c!==root);
}
function category(card){const s=text(card).toLowerCase();if(/glute|booty|lower body/.test(s))return'glute';if(/shred|fat|weight|lean|loss/.test(s))return'fat';if(/athlet|conditioning|performance|speed/.test(s))return'athletic';if(/muscle|strength|build|arms|chest/.test(s))return'muscle';return'all'}
function enhancePrograms(){
 const root=$('#vf-online-programs');if(!root||root.dataset.vfEnhanced)return;
 root.dataset.vfEnhanced='1';root.classList.add('vf-programs-storefront');
 const original=[...root.children];
 const hero=document.createElement('section');hero.className='vf-store-hero';hero.innerHTML=`<div><div class="vf-store-kicker">VFitness Digital Training</div><h1 class="vf-store-title">Online<br>Programs</h1><p class="vf-store-copy">Train anytime, anywhere. Structured programs built for real results, with every workout available inside your VFitness dashboard.</p><button class="vf-store-cta" type="button">Explore Programs <span>→</span></button><div class="vf-store-benefits"><span>✓ Instant access</span><span>•</span><span>Train anywhere</span><span>•</span><span>Progress tracked</span></div></div>`;
 root.prepend(hero);hero.querySelector('button').onclick=()=>filters.scrollIntoView({behavior:'smooth',block:'start'});
 const filters=document.createElement('div');filters.className='vf-store-filters';filters.innerHTML=[['all','All Programs'],['fat','Fat Loss'],['muscle','Muscle Gain'],['glute','Glute Building'],['athletic','Athletic']].map(([v,l],i)=>`<button class="vf-filter${i?'':' is-active'}" data-filter="${v}">${l}</button>`).join('');hero.after(filters);
 const cards=identifyCards(root);cards.forEach(c=>{c.classList.add('vf-program-card');c.dataset.category=category(c)});
 filters.onclick=e=>{const b=e.target.closest('.vf-filter');if(!b)return;$$('.vf-filter',filters).forEach(x=>x.classList.toggle('is-active',x===b));cards.forEach(c=>c.style.display=b.dataset.filter==='all'||c.dataset.category===b.dataset.filter?'':'none')};
 const member=document.createElement('section');member.className='vf-membership-strip';member.innerHTML='<div><strong>VFITNESS ONLINE MEMBERSHIP</strong><span>Access your programs, workouts, nutrition tools and progress dashboard in one place.</span></div><button type="button">View Options →</button>';root.appendChild(member);member.querySelector('button').onclick=()=>{if(!clickExisting('membership'))hero.querySelector('button').click()};
 const nav=document.createElement('nav');nav.className='vf-store-bottom-nav';nav.innerHTML=[['home','Home'],['programs','Programs'],['dashboard','Dashboard'],['nutrition','Nutrition'],['profile','Profile']].map(([i,l])=>`<button class="vf-store-nav-btn ${i==='programs'?'is-active':''}" data-page="${l}">${svg(i)}${l}</button>`).join('');root.appendChild(nav);nav.onclick=e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.page==='Programs')window.scrollTo({top:0,behavior:'smooth'});else clickExisting(b.dataset.page)};
 original.forEach(x=>{if(x!==hero&&x!==filters&&x!==member&&x!==nav)x.classList.add('vf-store-original')});
}
function workoutRoot(){
 const nodes=$$('button,a').filter(n=>/save\s*&\s*exit/i.test(text(n)));for(const n of nodes){let p=n.parentElement;for(let i=0;p&&i<8;i++,p=p.parentElement){if(/exercise|workout/i.test(text(p))&&p.scrollHeight>400)return p}}return null;
}
function repairWorkout(){
 const root=workoutRoot();if(!root)return;if(!root.classList.contains('vf-workout-page'))root.classList.add('vf-workout-page');
 $$('*',root).forEach(el=>{const cs=getComputedStyle(el);if(cs.writingMode!=='horizontal-tb'){el.style.writingMode='horizontal-tb';el.style.textOrientation='mixed'}if(el.scrollWidth>innerWidth+20){el.style.maxWidth='100%';el.style.minWidth='0'}});
 const actions=$$('button',root).filter(b=>/save\s*&\s*exit|previous|summary/i.test(text(b)));if(actions.length){const parent=actions[0].parentElement;if(parent)parent.classList.add('vf-workout-actions')}
}
let queued=false;function run(){if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;enhancePrograms();repairWorkout();if(window.lucide)window.lucide.createIcons()})}
new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});addEventListener('resize',repairWorkout,{passive:true});addEventListener('DOMContentLoaded',run);run();
})();
