/* VFITNESS public-home controller · preserve production app, upgrade marketing layer only. */
(function(){
  'use strict';

  function text(el){return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function isPublicHome(){
    var path=(location.pathname||'/').replace(/\/+$/,'')||'/';
    if(path!=='/' && path!=='/home') return false;
    var bodyText=(document.body&&document.body.innerText)||'';
    if(/ADMIN DASHBOARD|PACKAGE CONTROL|TRAINER DASHBOARD/i.test(bodyText)) return false;
    return true;
  }
  function isApplication(){
    var path=(location.pathname+' '+location.hash).toLowerCase();
    var bodyText=(document.body&&document.body.innerText)||'';
    return /start|apply|application|signup|sign-up/.test(path) || (/Sign Up/i.test(bodyText) && /Your Goal|Training & Lifestyle|Commitment/i.test(bodyText));
  }
  function styleSystemLabel(){
    Array.from(document.querySelectorAll('div,p,span,h2,h3')).forEach(function(el){
      var t=text(el);
      if(t==='THE VFITNESS TRANSFORMATION SYSTEM' || t==='VFITNESS TRANSFORMATION SYSTEM'){
        el.classList.add('vf-kicker');
        var card=el.closest('section,article,.rounded-3xl,.rounded-2xl,.rounded-xl');
        if(card) card.classList.add('vf-system-card');
      }
    });
  }
  function upgradeHeroCopy(){
    Array.from(document.querySelectorAll('h1')).forEach(function(h){
      var t=text(h);
      if(/Built Different\.?.*Trained Different\.?.*Results Tracked/i.test(t) || /VFITNESS Coaching Built From Real Client Work/i.test(t)){
        h.setAttribute('aria-label',"Results aren't random. They're built by a system.");
        h.innerHTML='Results aren\'t random.<br><span class="vf-blue-word">They\'re built by a system.</span>';
      }
    });
    Array.from(document.querySelectorAll('p')).forEach(function(p){
      var t=text(p);
      if(/Structured coaching for men and women across Nassau/i.test(t) || /Training, meals, check ins, and coaching we actually use/i.test(t)){
        p.textContent='Training. Nutrition. Accountability. Progress tracked. One system built around your result.';
      }
    });
  }
  function goStart(){
    try{
      var apply=document.querySelector('[data-page="training"],[data-page="start"],[data-page="apply"]');
      if(apply) apply.click();
      else location.href='/start';
    }catch(_){ location.href='/start'; }
    try{window.scrollTo({top:0,behavior:'smooth'});}catch(_){ }
  }
  function fixHomeStartCta(){
    document.querySelectorAll('.mu-sticky-cta button').forEach(function(btn){
      var label=text(btn);
      if(label==='Sign Up' || label==='Start Here'){
        btn.textContent='Start Your Transformation';
        btn.onclick=function(e){e.preventDefault();goStart();};
      }
    });
  }

  function normalizeProof(item){
    if(!item) return null;
    var before=item.beforeImageUrl||item.beforeUrl||item.before||'';
    var after=item.afterImageUrl||item.afterUrl||item.after||item.imageUrl||item.photoUrl||'';
    if(!before && !after) return null;
    return {
      before:before,
      after:after,
      name:item.name||item.clientName||'VFitness Client',
      result:item.result||item.achievement||item.title||'Real client transformation',
      quote:item.testimonial||item.quote||''
    };
  }
  function collectDomProof(){
    var out=[];
    Array.from(document.querySelectorAll('section,article,div')).forEach(function(block){
      var t=text(block);
      if(!/transformation|client result|before|after|progress photo/i.test(t)) return;
      var imgs=Array.from(block.querySelectorAll('img')).filter(function(img){return img.src && !/icon|logo|avatar/i.test((img.alt||'')+' '+img.src);});
      if(imgs.length>=2){
        out.push({before:imgs[0].src,after:imgs[1].src,name:'VFitness Client',result:'Real client transformation',quote:''});
      }else if(imgs.length===1){
        out.push({before:'',after:imgs[0].src,name:'VFitness Client',result:'Real client transformation',quote:''});
      }
    });
    var seen={};
    return out.filter(function(x){var k=x.before+'|'+x.after;if(seen[k])return false;seen[k]=1;return true;}).slice(0,12);
  }
  function loadFirestoreProof(){
    return new Promise(function(resolve){
      try{
        if(typeof db==='undefined' || !db || !db.collection) return resolve([]);
        db.collection('testimonials').where('approved','==',true).limit(20).get().then(function(snapshot){
          var items=snapshot.docs.map(function(doc){return normalizeProof(Object.assign({id:doc.id},doc.data()));}).filter(Boolean);
          resolve(items);
        }).catch(function(){resolve([]);});
      }catch(_){resolve([]);}
    });
  }
  function createTransformationSlider(items){
    if(document.getElementById('vf-transformation-proof') || !items || !items.length) return;
    var host=document.createElement('section');
    host.id='vf-transformation-proof';
    host.className='vf-proof-slider';
    host.innerHTML='<div class="vf-proof-wrap"><div class="vf-proof-head"><div><span class="vf-proof-kicker">REAL CLIENT RESULTS</span><h2>Transformations that sell the system.</h2></div><p>Real VFitness progress. Swipe through the proof, then start your own.</p></div><div class="vf-proof-stage" aria-live="polite"></div><div class="vf-proof-controls"><button type="button" class="vf-proof-prev" aria-label="Previous transformation">←</button><div class="vf-proof-dots"></div><button type="button" class="vf-proof-next" aria-label="Next transformation">→</button></div><div class="vf-proof-cta"><button type="button" class="vf-proof-start">Start Your Transformation</button></div></div>';

    var stage=host.querySelector('.vf-proof-stage');
    var dots=host.querySelector('.vf-proof-dots');
    var index=0,timer=null,startX=0;
    function esc(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
    function render(){
      var item=items[index];
      var media='';
      if(item.before && item.after){
        media='<div class="vf-ba"><figure><span>BEFORE</span><img src="'+esc(item.before)+'" alt="Before transformation photo"></figure><figure><span>AFTER</span><img src="'+esc(item.after)+'" alt="After transformation photo"></figure></div>';
      }else{
        media='<div class="vf-single-proof"><img src="'+esc(item.after||item.before)+'" alt="VFitness client transformation"></div>';
      }
      stage.innerHTML='<article class="vf-proof-card">'+media+'<div class="vf-proof-copy"><span>CLIENT '+String(index+1).padStart(2,'0')+'</span><h3>'+esc(item.result)+'</h3><p>'+esc(item.quote||'Training, nutrition and accountability — progress tracked inside the VFitness system.')+'</p><strong>'+esc(item.name)+'</strong></div></article>';
      dots.innerHTML=items.map(function(_,i){return '<button type="button" aria-label="Go to transformation '+(i+1)+'" class="'+(i===index?'active':'')+'"></button>';}).join('');
      Array.from(dots.querySelectorAll('button')).forEach(function(btn,i){btn.onclick=function(){index=i;render();restart();};});
    }
    function next(){index=(index+1)%items.length;render();}
    function prev(){index=(index-1+items.length)%items.length;render();}
    function restart(){if(timer)clearInterval(timer);if(items.length>1)timer=setInterval(next,6500);}
    host.querySelector('.vf-proof-next').onclick=function(){next();restart();};
    host.querySelector('.vf-proof-prev').onclick=function(){prev();restart();};
    host.querySelector('.vf-proof-start').onclick=goStart;
    stage.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;},{passive:true});
    stage.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45){dx<0?next():prev();restart();}},{passive:true});

    var hero=document.querySelector('main section, .vf-marketing-home main > div, #root > div > section');
    if(hero && hero.parentNode){hero.parentNode.insertBefore(host,hero.nextSibling);}else{document.body.appendChild(host);}
    render();restart();
  }
  function ensureTransformationSlider(){
    if(!isPublicHome() || document.getElementById('vf-transformation-proof')) return;
    var domProof=collectDomProof();
    if(domProof.length){createTransformationSlider(domProof);return;}
    loadFirestoreProof().then(function(items){if(items.length)createTransformationSlider(items);});
  }

  function applyContextClasses(){
    document.body.classList.toggle('vf-marketing-home',isPublicHome());
    document.body.classList.toggle('vf-application-flow',isApplication());
  }
  function run(){
    applyContextClasses();
    if(isPublicHome()){
      upgradeHeroCopy();
      styleSystemLabel();
      fixHomeStartCta();
      ensureTransformationSlider();
    }
  }
  function scheduleRun(delay){setTimeout(run,delay||0);}

  document.addEventListener('DOMContentLoaded',function(){run();scheduleRun(180);scheduleRun(700);});
  window.addEventListener('popstate',function(){scheduleRun(30);});
  window.addEventListener('hashchange',function(){scheduleRun(30);});
  window.addEventListener('vf:ui-rendered',function(){scheduleRun(30);});
  window.addEventListener('pageshow',function(){scheduleRun(30);});
  setTimeout(run,300);
})();
