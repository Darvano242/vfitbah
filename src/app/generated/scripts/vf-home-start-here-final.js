/* VFITNESS public-home controller · source-controlled redesign branch. */
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
      if(/Built Different\.?.*Trained Different\.?.*Results Tracked/i.test(t)){
        h.setAttribute('aria-label',"Results aren't random. They're built by a system.");
        h.innerHTML='Results aren\'t random.<br><span class="vf-blue-word">They\'re built by a system.</span>';
      }else if(/VFITNESS Coaching Built From Real Client Work/i.test(t)){
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
  function fixHomeStartCta(){
    document.querySelectorAll('.mu-sticky-cta button').forEach(function(btn){
      var label=text(btn);
      if(label==='Sign Up' || label==='Start Here'){
        btn.textContent='Start Your Transformation';
        btn.onclick=function(e){
          e.preventDefault();
          try{
            var apply=document.querySelector('[data-page="training"],[data-page="start"],[data-page="apply"]');
            if(apply) apply.click();
            else location.href='/start';
          }catch(_){ location.href='/start'; }
          try{window.scrollTo({top:0,behavior:'smooth'});}catch(_){ }
        };
      }
    });
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
    }
  }
  function scheduleRun(delay){setTimeout(run,delay||0);}

  document.addEventListener('DOMContentLoaded',function(){
    run();
    scheduleRun(120);
    scheduleRun(500);
  });
  window.addEventListener('popstate',function(){scheduleRun(30);});
  window.addEventListener('hashchange',function(){scheduleRun(30);});
  window.addEventListener('vf:ui-rendered',function(){scheduleRun(30);});
  window.addEventListener('pageshow',function(){scheduleRun(30);});
  setTimeout(run,250);
})();
