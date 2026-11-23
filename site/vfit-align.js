/* VFIT ALIGN motion runtime for vfitbah.com.
   The page has its own scroll reveal system (.vf-reveal); this runtime adds
   the iOS-style nav condensing and a single hero photo settle on load.
   Pressed states and button springs live in vfit-align.css. */
(function(){
  'use strict';
  var reduce=false;
  try{reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}

  /* nav condenses with material blur after 8px of scroll */
  function navState(){
    var nav=document.querySelector('nav');
    if(!nav)return;
    if(window.scrollY>8)nav.classList.add('vfa-scrolled');
    else nav.classList.remove('vfa-scrolled');
  }
  window.addEventListener('scroll',navState,{passive:true});

  /* one photo moment: the first large standalone photo settles as it enters.
     Transform-safe: only applied to img elements, never to text containers. */
  var heroDone=false,heroIO=null;
  function heroSettle(){
    if(heroDone||heroIO||reduce||!('IntersectionObserver' in window))return;
    var imgs=document.images;
    for(var i=0;i<imgs.length;i++){
      var im=imgs[i];
      if((im.src||'').indexOf('scene-')>-1)continue; /* abstract washes, nothing to settle */
      var r=im.getBoundingClientRect();
      if(r.width>=320&&r.height>=220){
        heroIO=new IntersectionObserver(function(es){
          es.forEach(function(en){
            if(en.isIntersecting&&!heroDone){
              heroDone=true;
              en.target.classList.add('vfa-photo');
              heroIO.disconnect();
            }
          });
        },{threshold:0.35});
        heroIO.observe(im);
        return;
      }
    }
  }
  function start(){
    navState();
    heroSettle();
    /* React mounts after load; try again briefly until the hero exists */
    var tries=0,iv=setInterval(function(){
      tries++;heroSettle();
      if(heroIO||heroDone||tries>20)clearInterval(iv);
    },250);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);
  else start();
})();
