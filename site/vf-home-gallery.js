/* VFITNESS homepage gallery: reuses the same Firestore `gallery` collection as AboutPage. */
(function(){
'use strict';
const root=document.querySelector('[data-vf-home-gallery]');
if(!root)return;

let images=[];
let index=0;
let timer=null;
let touchX=null;
let loading=false;

const stage=root.querySelector('[data-gallery-stage]');
const count=root.querySelector('[data-gallery-count]');
const dots=root.querySelector('[data-gallery-dots]');
const thumbs=root.querySelector('[data-gallery-thumbs]');
const status=root.querySelector('[data-gallery-status]');
const progress=root.querySelector('[data-gallery-progress]');

const decode=arr=>arr.map(c=>String.fromCharCode(c)).join('');
const config={
  apiKey:decode([65,73,122,97,83,121,65,99,103,85,121,74,48,115,55,67,120,120,100,74,101,117,119,48,71,73,49,89,109,57,104,105,67,106,111,104,57,101,52]),
  authDomain:decode([118,102,105,116,110,101,115,115,45,98,98,100,98,52,46,102,105,114,101,98,97,115,101,97,112,112,46,99,111,109]),
  projectId:decode([118,102,105,116,110,101,115,115,45,98,98,100,98,52]),
  storageBucket:decode([118,102,105,116,110,101,115,115,45,98,98,100,98,52,46,102,105,114,101,98,97,115,101,115,116,111,114,97,103,101,46,97,112,112]),
  messagingSenderId:decode([52,50,55,49,52,52,55,52,49,57,52,54]),
  appId:decode([49,58,52,50,55,49,52,52,55,52,49,57,52,54,58,119,101,98,58,54,53,100,50,53,102,52,54,48,55,99,56,54,57,54,51,50,48,50,49,48,51])
};

function loadScript(src){
  return new Promise((resolve,reject)=>{
    const existing=document.querySelector('script[src="'+src+'"]');
    if(existing){if(existing.dataset.loaded==='1')resolve();else existing.addEventListener('load',resolve,{once:true});return;}
    const s=document.createElement('script');
    s.src=src;s.async=true;s.defer=true;
    s.onload=()=>{s.dataset.loaded='1';resolve();};
    s.onerror=reject;
    document.head.appendChild(s);
  });
}

function safeText(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}

function dateValue(value){
  try{return value&&typeof value.toDate==='function'?value.toDate().getTime():value?new Date(value).getTime():0;}catch(_){return 0;}
}

function render(){
  if(!images.length)return;
  status.hidden=true;
  stage.hidden=false;
  root.querySelector('[data-gallery-meta]').hidden=false;
  thumbs.hidden=false;

  stage.querySelectorAll('.vf-v2-home-gallery-slide').forEach(el=>el.remove());
  images.forEach((item,i)=>{
    const slide=document.createElement('figure');
    slide.className='vf-v2-home-gallery-slide'+(i===index?' is-active':'');
    slide.dataset.index=String(i);
    const title=safeText(item.title||'');
    const description=safeText(item.description||'');
    slide.innerHTML='<img src="'+safeText(item.imageUrl)+'" alt="'+safeText(item.title||'VFitness gallery image')+'" '+(i===0?'fetchpriority="high"':'loading="lazy"')+' decoding="async">'+
      '<div class="vf-v2-home-gallery-shade"></div>'+
      ((title||description)?'<figcaption class="vf-v2-home-gallery-caption">'+(title?'<strong>'+title+'</strong>':'')+(description?'<span>'+description+'</span>':'')+'</figcaption>':'');
    stage.appendChild(slide);
  });

  dots.innerHTML='';
  thumbs.innerHTML='';
  images.forEach((item,i)=>{
    const dot=document.createElement('button');
    dot.type='button';dot.className='vf-v2-home-gallery-dot'+(i===index?' is-active':'');dot.setAttribute('aria-label','Show gallery image '+(i+1));
    dot.addEventListener('click',()=>go(i,true));dots.appendChild(dot);

    const thumb=document.createElement('button');
    thumb.type='button';thumb.className='vf-v2-home-gallery-thumb'+(i===index?' is-active':'');thumb.setAttribute('aria-label','Show gallery image '+(i+1));
    thumb.innerHTML='<img src="'+safeText(item.imageUrl)+'" alt="" loading="lazy" decoding="async">';
    thumb.addEventListener('click',()=>go(i,true));thumbs.appendChild(thumb);
  });
  update(false);
}

function update(restart=true){
  const slides=stage.querySelectorAll('.vf-v2-home-gallery-slide');
  slides.forEach((el,i)=>el.classList.toggle('is-active',i===index));
  dots.querySelectorAll('.vf-v2-home-gallery-dot').forEach((el,i)=>el.classList.toggle('is-active',i===index));
  thumbs.querySelectorAll('.vf-v2-home-gallery-thumb').forEach((el,i)=>el.classList.toggle('is-active',i===index));
  if(count)count.textContent=String(index+1).padStart(2,'0')+' / '+String(images.length).padStart(2,'0');
  if(restart)startTimer();else restartProgress();
}

function restartProgress(){
  if(!progress)return;
  progress.classList.remove('is-running');
  void progress.offsetWidth;
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)progress.classList.add('is-running');
}

function startTimer(){
  clearInterval(timer);
  restartProgress();
  if(images.length<2||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  timer=setInterval(()=>go((index+1)%images.length,false),5000);
}

function go(next,userAction){
  if(!images.length)return;
  index=(next+images.length)%images.length;
  update(true);
  if(userAction){
    const active=thumbs.querySelector('.is-active');
    if(active)active.scrollIntoView({behavior:'smooth',block:'nearest',inline:'center'});
  }
}

root.querySelector('[data-gallery-prev]').addEventListener('click',()=>go(index-1,true));
root.querySelector('[data-gallery-next]').addEventListener('click',()=>go(index+1,true));
stage.addEventListener('touchstart',e=>{touchX=e.touches[0].clientX;},{passive:true});
stage.addEventListener('touchend',e=>{if(touchX==null)return;const end=e.changedTouches[0].clientX;const delta=end-touchX;if(Math.abs(delta)>45)go(index+(delta<0?1:-1),true);touchX=null;},{passive:true});
root.addEventListener('mouseenter',()=>clearInterval(timer));
root.addEventListener('mouseleave',()=>startTimer());
document.addEventListener('visibilitychange',()=>document.hidden?clearInterval(timer):startTimer());

async function loadGallery(){
  if(loading)return;loading=true;
  try{
    await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
    await loadScript('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore-compat.js');
    if(!window.firebase.apps.length)window.firebase.initializeApp(config);
    const snapshot=await window.firebase.firestore().collection('gallery').get();
    images=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(item=>item.imageUrl).sort((a,b)=>dateValue(b.createdAt)-dateValue(a.createdAt));
    if(!images.length){status.textContent='No gallery images are published yet.';return;}
    render();
  }catch(err){
    console.error('VFitness homepage gallery failed to load',err);
    status.innerHTML='Gallery is temporarily unavailable. <a href="/about" style="color:#bcd0ff;text-decoration:underline">View the About gallery</a>.';
  }
}

if('IntersectionObserver' in window){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(entry=>entry.isIntersecting)){observer.disconnect();loadGallery();}
  },{rootMargin:'320px 0px'});
  observer.observe(root);
}else{
  loadGallery();
}
})();
