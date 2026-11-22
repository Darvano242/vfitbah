/* VFIT ALIGN motion runtime for vfitbah.com.
   The page already has its own scroll reveal system (.vf-reveal), so this
   runtime only adds the iOS-style nav condensing. Pressed states and button
   springs live in vfit-align.css. */
(function(){
  'use strict';
  function navState(){
    var nav=document.querySelector('nav');
    if(!nav)return;
    if(window.scrollY>8)nav.classList.add('vfa-scrolled');
    else nav.classList.remove('vfa-scrolled');
  }
  window.addEventListener('scroll',navState,{passive:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',navState);
  else setTimeout(navState,300);
})();
