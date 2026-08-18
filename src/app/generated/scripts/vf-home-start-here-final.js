/* VFITNESS public experience controller · premium upgrade */
(function(){
  'use strict';

  var AUTOPLAY_MS=4800;
  var sliderTimer=null;
  var slideIndex=0;

  function text(el){return ((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function route(){return ((location.pathname||'/')+' '+(location.hash||'')+' '+(location.search||'')).toLowerCase();}
  function bodyText(){return (document.body&&document.body.innerText)||'';}
  function pathOnly(){return (location.pathname||'/').replace(/\/+$/,'')||'/';}
  function isPublicHome(){
    var p=pathOnly();
    if(p!=='/'&&p!=='/home')return false;
    return !/ADMIN DASHBOARD|PACKAGE CONTROL|TRAINER DASHBOARD/i.test(bodyText());
  }
  function hasAny(re){return re.test(bodyText());}

  function applyContextClasses(){
    if(!document.body)return;
    var r=route(),t=bodyText();
    var isHome=isPublicHome();
    document.body.classList.toggle('vf-marketing-home',isHome);
    document.body.classList.toggle('vf-application-flow',/\/start|\/apply|application|signup|sign-up/.test(r)||(/Your Goal|Training & Lifestyle|Review and Submit/i.test(t)&&/Sign Up|Apply|Application/i.test(t)));
    document.body.classList.toggle('vf-pricing-page',/pricing|packages?/.test(r)||/PRICING|SESSION PACKAGE|CHOOSE YOUR PACKAGE/i.test(t));
    document.body.classList.toggle('vf-results-page',/results|gallery|transformations?/.test(r)||/CLIENT RESULTS|TRANSFORMATIONS|BEFORE\s*&?\s*AFTER/i.test(t));
    document.body.classList.toggle('vf-programs-page',/program/.test(r)||/ONLINE PROGRAMS|MY PROGRAMS|PROGRAM LIBRARY/i.test(t));
    document.body.classList.toggle('vf-login-page',/login|sign-in|signin/.test(r)||(/LOGIN|SIGN IN/i.test(t)&&/PASSWORD|EMAIL/i.test(t)));
    document.body.classList.toggle('vf-dashboard-page',/dashboard|client/.test(r)||/CLIENT DASHBOARD|SESSIONS REMAINING|YOUR SCHEDULE/i.test(t));
    document.body.classList.toggle('vf-workout-page',/workout|exercise/.test(r)||/Exercise\s*\d+\s*(of|\/)\s*\d+|SAVE\s*&\s*EXIT|WORKOUT SUMMARY/i.test(t));
  }

  function upgradeHeroCopy(){
    if(!isPublicHome())return;
    Array.from(document.querySelectorAll('h1')).forEach(function(h){
      var t=text(h);
      if(/Built Different\.?.*Trained Different\.?.*Results Tracked/i.test(t)||/VFITNESS Coaching Built From Real Client Work/i.test(t)){
        h.setAttribute('aria-label',"Results aren't random. They're built by a system.");
        h.innerHTML='Results aren\'t random.<br><span class="vf-blue-word">They\'re built by a system.</span>';
      }
    });
    Array.from(document.querySelectorAll('p')).forEach(function(p){
      var t=text(p);
      if(/Structured coaching for men and women across Nassau/i.test(t)||/Training, meals, check ins, and coaching we actually use/i.test(t)){
        p.textContent='Training. Nutrition. Accountability. Progress tracked. One system built around your result.';
      }
    });
  }

  function styleSystemLabel(){
    if(!isPublicHome())return;
    Array.from(document.querySelectorAll('div,p,span,h2,h3')).forEach(function(el){
      var t=text(el);
      if(t==='THE VFITNESS TRANSFORMATION SYSTEM'||t==='VFITNESS TRANSFORMATION SYSTEM'){
        el.classList.add('vf-kicker');
        var card=el.closest('section,article,.rounded-3xl,.rounded-2xl,.rounded-xl');
        if(card)card.classList.add('vf-system-card');
      }
    });
  }

  function fixHomeStartCta(){
    if(!isPublicHome())return;
    document.querySelectorAll('.mu-sticky-cta button').forEach(function(btn){
      var label=text(btn);
      if(label==='Sign Up'||label==='Start Here'||label==='Get Started'){
        btn.textContent='Start Your Transformation';
        btn.onclick=function(e){
          e.preventDefault();
          try{
            var apply=document.querySelector('[data-page="training"],[data-page="start"],[data-page="apply"]');
            if(apply)apply.click();
            else location.href='/start';
          }catch(_){location.href='/start';}
          try{window.scrollTo({top:0,behavior:'smooth'});}catch(_){ }
        };
      }
    });
  }

  function markResultsSections(){
    Array.from(document.querySelectorAll('section,article')).forEach(function(el){
      var t=text(el).slice(0,1200);
      if(/transformation|client result|before\s*&?\s*after|success stor/i.test(t)&&el.querySelector('img'))el.setAttribute('data-vf-results-section','true');
    });
  }

  function collectTransformationImages(){
    var seen=new Set(),items=[];
    Array.from(document.querySelectorAll('img')).forEach(function(img){
      var src=img.currentSrc||img.src||'';
      if(!src||seen.has(src)||/icon|logo|avatar|favicon/i.test(src))return;
      var alt=(img.getAttribute('alt')||'').toLowerCase();
      var parent=img.closest('section,article,div');
      var context=(alt+' '+text(parent).slice(0,700)).toLowerCase();
      if(!/transform|before|after|client result|progress|success stor|testimonial/.test(context))return;
      var rect=img.getBoundingClientRect();
      var w=img.naturalWidth||rect.width||0,h=img.naturalHeight||rect.height||0;
      if(w<220||h<220)return;
      seen.add(src);items.push({src:src,alt:img.alt||'VFitness client transformation'});
    });
    return items.slice(0,10);
  }

  function goToSlide(index){
    var root=document.getElementById('vf-proof-showcase');
    if(!root)return;
    var slides=root.querySelectorAll('.vf-proof-slide');
    if(!slides.length)return;
    slideIndex=(index+slides.length)%slides.length;
    var track=root.querySelector('.vf-proof-track');
    if(track)track.style.transform='translate3d(-'+(slideIndex*100)+'%,0,0)';
    root.querySelectorAll('.vf-proof-dot').forEach(function(dot,i){dot.classList.toggle('is-active',i===slideIndex);dot.setAttribute('aria-current',i===slideIndex?'true':'false');});
  }

  function stopAutoplay(){if(sliderTimer){clearInterval(sliderTimer);sliderTimer=null;}}
  function startAutoplay(){
    stopAutoplay();
    if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
    sliderTimer=setInterval(function(){goToSlide(slideIndex+1);},AUTOPLAY_MS);
  }

  function buildTransformationShowcase(){
    if(!isPublicHome()||document.getElementById('vf-proof-showcase'))return;
    var items=collectTransformationImages();
    if(items.length<2)return;
    var section=document.createElement('section');
    section.id='vf-proof-showcase';
    section.setAttribute('aria-label','VFitness client transformations');
    section.innerHTML='<div class="vf-proof-head"><div><div class="vf-proof-kicker">Real client results</div><h2>The proof is in the transformation.</h2></div><p>Real VFitness clients. Real progress. Swipe through the results, then choose how you want to train.</p></div><div class="vf-proof-viewport" tabindex="0"><div class="vf-proof-track">'+items.map(function(item){return '<figure class="vf-proof-slide"><img loading="lazy" decoding="async" src="'+item.src.replace(/"/g,'&quot;')+'" alt="'+item.alt.replace(/"/g,'&quot;')+'"></figure>';}).join('')+'</div><button class="vf-proof-arrow vf-proof-prev" type="button" aria-label="Previous transformation">‹</button><button class="vf-proof-arrow vf-proof-next" type="button" aria-label="Next transformation">›</button></div><div class="vf-proof-dots" aria-label="Transformation slides">'+items.map(function(_,i){return '<button class="vf-proof-dot'+(i===0?' is-active':'')+'" type="button" aria-label="Go to transformation '+(i+1)+'"></button>';}).join('')+'</div><div class="vf-proof-actions"><a class="vf-proof-primary" href="/start">Start Your Transformation</a><a class="vf-proof-secondary" href="/programs">Explore Online Programs</a></div>';

    var resultSection=document.querySelector('[data-vf-results-section]');
    var hero=document.querySelector('main>section,main section');
    if(resultSection&&resultSection.parentNode)resultSection.parentNode.insertBefore(section,resultSection);
    else if(hero&&hero.parentNode)hero.parentNode.insertBefore(section,hero.nextSibling);
    else document.querySelector('main,#root').appendChild(section);

    var viewport=section.querySelector('.vf-proof-viewport');
    section.querySelector('.vf-proof-prev').onclick=function(){goToSlide(slideIndex-1);startAutoplay();};
    section.querySelector('.vf-proof-next').onclick=function(){goToSlide(slideIndex+1);startAutoplay();};
    section.querySelectorAll('.vf-proof-dot').forEach(function(dot,i){dot.onclick=function(){goToSlide(i);startAutoplay();};});
    viewport.addEventListener('mouseenter',stopAutoplay);
    viewport.addEventListener('mouseleave',startAutoplay);
    viewport.addEventListener('focusin',stopAutoplay);
    viewport.addEventListener('focusout',startAutoplay);
    viewport.addEventListener('keydown',function(e){if(e.key==='ArrowLeft'){e.preventDefault();goToSlide(slideIndex-1);}if(e.key==='ArrowRight'){e.preventDefault();goToSlide(slideIndex+1);}});
    var touchX=null;
    viewport.addEventListener('touchstart',function(e){touchX=e.touches&&e.touches[0]?e.touches[0].clientX:null;stopAutoplay();},{passive:true});
    viewport.addEventListener('touchend',function(e){if(touchX===null)return;var x=e.changedTouches&&e.changedTouches[0]?e.changedTouches[0].clientX:touchX;var delta=x-touchX;if(Math.abs(delta)>45)goToSlide(slideIndex+(delta<0?1:-1));touchX=null;startAutoplay();},{passive:true});
    startAutoplay();
  }

  function hardenWorkout(){
    if(!document.body.classList.contains('vf-workout-page'))return;
    document.querySelectorAll('iframe,video,img').forEach(function(media){media.style.maxWidth='100%';if(media.tagName==='IFRAME'||media.tagName==='VIDEO')media.style.width='100%';});
    Array.from(document.querySelectorAll('*')).forEach(function(el){
      var t=text(el);
      if(/^Exercise\s*\d+\s*(of|\/)\s*\d+/i.test(t)||/^\d+%$/.test(t)){
        el.style.writingMode='horizontal-tb';el.style.textOrientation='mixed';el.style.wordBreak='normal';el.style.whiteSpace='normal';el.style.maxWidth='100%';
      }
    });
  }

  function removeAskCoach(){
    Array.from(document.querySelectorAll('button,a,[role="button"]')).forEach(function(el){
      if(/^ask coach$/i.test(text(el))){var floating=el.closest('.fixed,[style*="position: fixed"],.floating,.chat-widget')||el;floating.remove();}
    });
  }

  function run(){
    applyContextClasses();
    upgradeHeroCopy();
    styleSystemLabel();
    fixHomeStartCta();
    markResultsSections();
    buildTransformationShowcase();
    hardenWorkout();
    removeAskCoach();
  }
  function later(ms){setTimeout(run,ms);}

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){run();later(180);later(700);later(1500);});
  else{run();later(180);later(700);later(1500);}
  window.addEventListener('pageshow',function(){later(30);});
  window.addEventListener('popstate',function(){later(30);});
  window.addEventListener('hashchange',function(){later(30);});
  window.addEventListener('vf:ui-rendered',function(){later(30);later(260);});
  window.addEventListener('vf:navigation',function(){later(30);later(260);});
})();
