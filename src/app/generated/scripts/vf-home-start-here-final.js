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
  function clickPage(names){
    for(var i=0;i<names.length;i++){
      var el=document.querySelector('[data-page="'+names[i]+'"]');
      if(el){el.click();try{window.scrollTo({top:0,behavior:'smooth'});}catch(_){}return true;}
    }
    return false;
  }
  function goStart(){
    try{if(!clickPage(['training','start','apply','signup'])) location.href='/start';}
    catch(_){location.href='/start';}
  }
  function goPrograms(){
    try{if(!clickPage(['programs','online-programs','online'])) location.href='/programs';}
    catch(_){location.href='/programs';}
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
  function ensureConversionBand(){
    if(document.getElementById('vf-conversion-band') || !isPublicHome()) return;
    var host=document.createElement('section');
    host.id='vf-conversion-band';
    host.className='vf-conversion-band';
    host.innerHTML='<div class="vf-conversion-wrap"><div><span>PERSONAL TRAINING</span><strong>Coach-led</strong></div><div><span>ONLINE PROGRAMS</span><strong>Train anywhere</strong></div><div><span>PROGRESS</span><strong>Tracked inside VFitness</strong></div><div><span>ACCOUNTABILITY</span><strong>Built into the system</strong></div></div>';
    var hero=document.querySelector('main section, #root > div > section');
    if(hero&&hero.parentNode)hero.parentNode.insertBefore(host,hero.nextSibling);
  }

  function normalizeProof(item){
    if(!item) return null;
    var before=item.beforeImageUrl||item.beforeUrl||item.before||'';
    var after=item.afterImageUrl||item.afterUrl||item.after||item.imageUrl||item.photoUrl||'';
    if(!before && !after) return null;
    return {before:before,after:after,name:item.name||item.clientName||'VFitness Client',result:item.result||item.achievement||item.title||'Real client transformation',quote:item.testimonial||item.quote||''};
  }
  function collectDomProof(){
    var out=[];
    Array.from(document.querySelectorAll('section,article,div')).forEach(function(block){
      if(block.id==='vf-transformation-proof')return;
      var t=text(block);
      if(!/transformation|client result|before|after|progress photo/i.test(t)) return;
      var imgs=Array.from(block.querySelectorAll('img')).filter(function(img){return img.src && !/icon|logo|avatar/i.test((img.alt||'')+' '+img.src);});
      if(imgs.length>=2)out.push({before:imgs[0].src,after:imgs[1].src,name:'VFitness Client',result:'Real client transformation',quote:''});
      else if(imgs.length===1)out.push({before:'',after:imgs[0].src,name:'VFitness Client',result:'Real client transformation',quote:''});
    });
    var seen={};
    return out.filter(function(x){var k=x.before+'|'+x.after;if(seen[k])return false;seen[k]=1;return true;}).slice(0,12);
  }
  function loadFirestoreProof(){
    return new Promise(function(resolve){
      try{
        if(typeof db==='undefined'||!db||!db.collection)return resolve([]);
        db.collection('testimonials').where('approved','==',true).limit(20).get().then(function(snapshot){
          resolve(snapshot.docs.map(function(doc){return normalizeProof(Object.assign({id:doc.id},doc.data()));}).filter(Boolean));
        }).catch(function(){resolve([]);});
      }catch(_){resolve([]);}
    });
  }
  function createTransformationSlider(items){
    if(document.getElementById('vf-transformation-proof')||!items||!items.length)return;
    var host=document.createElement('section');
    host.id='vf-transformation-proof';
    host.className='vf-proof-slider';
    host.innerHTML='<div class="vf-proof-wrap"><div class="vf-proof-head"><div><span class="vf-proof-kicker">REAL CLIENT RESULTS</span><h2>The proof comes before the pitch.</h2></div><p>Swipe through real VFitness progress, then choose how you want to train.</p></div><div class="vf-proof-stage" tabindex="0" aria-label="Client transformation slideshow" aria-live="polite"></div><div class="vf-proof-controls"><button type="button" class="vf-proof-prev" aria-label="Previous transformation">←</button><div class="vf-proof-dots"></div><button type="button" class="vf-proof-next" aria-label="Next transformation">→</button></div><div class="vf-proof-cta"><button type="button" class="vf-proof-start">Start Your Transformation</button><button type="button" class="vf-proof-programs">Explore Online Programs</button></div></div>';
    var stage=host.querySelector('.vf-proof-stage'),dots=host.querySelector('.vf-proof-dots');
    var index=0,timer=null,startX=0,paused=false;
    function esc(s){var d=document.createElement('div');d.textContent=s||'';return d.innerHTML;}
    function render(){
      var item=items[index],media='';
      if(item.before&&item.after){
        media='<div class="vf-ba"><figure><span>BEFORE</span><img loading="lazy" decoding="async" src="'+esc(item.before)+'" alt="Before transformation photo"></figure><figure><span>AFTER</span><img loading="lazy" decoding="async" src="'+esc(item.after)+'" alt="After transformation photo"></figure></div>';
      }else media='<div class="vf-single-proof"><img loading="lazy" decoding="async" src="'+esc(item.after||item.before)+'" alt="VFitness client transformation"></div>';
      stage.innerHTML='<article class="vf-proof-card">'+media+'<div class="vf-proof-copy"><span>CLIENT '+String(index+1).padStart(2,'0')+' / '+String(items.length).padStart(2,'0')+'</span><h3>'+esc(item.result)+'</h3><p>'+esc(item.quote||'Training, nutrition and accountability — progress tracked inside the VFitness system.')+'</p><strong>'+esc(item.name)+'</strong></div></article>';
      dots.innerHTML=items.map(function(_,i){return '<button type="button" aria-label="Go to transformation '+(i+1)+'" class="'+(i===index?'active':'')+'"></button>';}).join('');
      Array.from(dots.querySelectorAll('button')).forEach(function(btn,i){btn.onclick=function(){index=i;render();restart();};});
    }
    function next(){index=(index+1)%items.length;render();}
    function prev(){index=(index-1+items.length)%items.length;render();}
    function restart(){if(timer)clearInterval(timer);if(items.length>1&&!paused&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches)timer=setInterval(next,6500);}
    host.querySelector('.vf-proof-next').onclick=function(){next();restart();};
    host.querySelector('.vf-proof-prev').onclick=function(){prev();restart();};
    host.querySelector('.vf-proof-start').onclick=goStart;
    host.querySelector('.vf-proof-programs').onclick=goPrograms;
    stage.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;},{passive:true});
    stage.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45){dx<0?next():prev();restart();}},{passive:true});
    stage.addEventListener('keydown',function(e){if(e.key==='ArrowRight'){next();restart();}if(e.key==='ArrowLeft'){prev();restart();}});
    host.addEventListener('mouseenter',function(){paused=true;restart();});
    host.addEventListener('mouseleave',function(){paused=false;restart();});
    host.addEventListener('focusin',function(){paused=true;restart();});
    host.addEventListener('focusout',function(){paused=false;restart();});
    var band=document.getElementById('vf-conversion-band');
    if(band&&band.parentNode)band.parentNode.insertBefore(host,band.nextSibling);else{var hero=document.querySelector('main section, #root > div > section');if(hero&&hero.parentNode)hero.parentNode.insertBefore(host,hero.nextSibling);else document.body.appendChild(host);}
    render();restart();
  }
  function ensureTransformationSlider(){
    if(!isPublicHome()||document.getElementById('vf-transformation-proof'))return;
    var domProof=collectDomProof();
    if(domProof.length){createTransformationSlider(domProof);return;}
    loadFirestoreProof().then(function(items){if(items.length)createTransformationSlider(items);});
  }
  function ensureGoalChooser(){
    if(!isPublicHome()||document.getElementById('vf-goal-chooser'))return;
    var host=document.createElement('section');
    host.id='vf-goal-chooser';host.className='vf-goal-chooser';
    host.innerHTML='<div class="vf-goal-wrap"><div class="vf-goal-head"><span>CHOOSE YOUR PATH</span><h2>Start with the result you want.</h2><p>VFitness should make the next step obvious. Pick your goal and we will route you into the right coaching or program path.</p></div><div class="vf-goal-grid"><button type="button" data-goal="fat"><span>01</span><strong>Lose Fat</strong><small>Structured training + nutrition</small></button><button type="button" data-goal="muscle"><span>02</span><strong>Build Muscle</strong><small>Progressive strength + hypertrophy</small></button><button type="button" data-goal="glutes"><span>03</span><strong>Build Glutes</strong><small>Targeted lower-body progression</small></button><button type="button" data-goal="online"><span>04</span><strong>Train Online</strong><small>Programs you can follow anywhere</small></button></div></div>';
    host.querySelectorAll('button').forEach(function(btn){btn.onclick=function(){if(btn.getAttribute('data-goal')==='online')goPrograms();else goStart();};});
    var proof=document.getElementById('vf-transformation-proof');
    if(proof&&proof.parentNode)proof.parentNode.insertBefore(host,proof.nextSibling);else document.body.appendChild(host);
  }
  function applyContextClasses(){document.body.classList.toggle('vf-marketing-home',isPublicHome());document.body.classList.toggle('vf-application-flow',isApplication());}
  function run(){
    applyContextClasses();
    if(isPublicHome()){
      upgradeHeroCopy();styleSystemLabel();fixHomeStartCta();ensureConversionBand();ensureTransformationSlider();ensureGoalChooser();
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