/* VF_APP_IDENTITY_20260917
   Small runtime layer for theme preference, entrance motion and numeric roll.
   No framework dependency. Safe for the static public shell and legacy app shell.
*/
(function(){
  'use strict';
  var ROOT=document.documentElement;
  var STORAGE='vfitness-theme';
  var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function systemTheme(){
    return window.matchMedia&&window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';
  }
  function storedTheme(){
    try{return localStorage.getItem(STORAGE)||'system';}catch(e){return 'system';}
  }
  function resolvedTheme(pref){return pref==='system'?systemTheme():pref;}
  function applyTheme(pref){
    var resolved=resolvedTheme(pref);
    ROOT.classList.remove('light','dark');
    ROOT.classList.add(resolved);
    ROOT.style.colorScheme=resolved;
    ROOT.dataset.vfThemePreference=pref;
    document.querySelectorAll('.vf-identity-theme-toggle').forEach(function(btn){
      btn.dataset.mode=pref;
      btn.setAttribute('aria-label','Theme: '+pref+'. Activate to change theme.');
      btn.innerHTML=themeIcon(pref);
    });
  }
  function themeIcon(pref){
    if(pref==='light')return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
    if(pref==='system')return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>';
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/></svg>';
  }
  function cycleTheme(){
    var current=storedTheme();
    var next=current==='dark'?'light':current==='light'?'system':'dark';
    try{if(next==='system')localStorage.removeItem(STORAGE);else localStorage.setItem(STORAGE,next);}catch(e){}
    applyTheme(next);
  }
  function mountThemeToggle(){
    var nav=document.querySelector('.vf-v2-navin');
    if(!nav||nav.querySelector('.vf-identity-theme-toggle'))return;
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='vf-identity-theme-toggle';
    btn.addEventListener('click',cycleTheme);
    var account=nav.querySelector('.vf-v2-account');
    var menu=nav.querySelector('.vf-v2-menu');
    nav.insertBefore(btn,account||menu||null);
    applyTheme(storedTheme());
  }

  function revealMotion(){
    var sections=Array.prototype.slice.call(document.querySelectorAll('.vf-v2-section,.vf-v2-proofbar,#vf-proof-showcase'));
    var cards=Array.prototype.slice.call(document.querySelectorAll('.vf-v2-card,.vfp-card,.mu-program-card'));
    sections.forEach(function(el){el.classList.add('vf-identity-reveal');});
    cards.forEach(function(el,i){
      el.classList.add('vf-identity-card');
      el.style.transitionDelay=Math.min((i%8)*40,280)+'ms';
    });
    if(reduce||!('IntersectionObserver'in window)){
      sections.concat(cards).forEach(function(el){el.classList.add('is-visible');});
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target);}
      });
    },{threshold:.08,rootMargin:'0px 0px -5% 0px'});
    sections.concat(cards).forEach(function(el){io.observe(el);});
  }

  function parseStat(text){
    var match=String(text||'').trim().match(/^([0-9][0-9,]*(?:\.[0-9]+)?)(.*)$/);
    if(!match)return null;
    return {number:Number(match[1].replace(/,/g,'')),suffix:match[2]||'',decimals:(match[1].split('.')[1]||'').length};
  }
  function rollOne(el){
    if(el.dataset.vfRolled==='1')return;
    var parsed=parseStat(el.textContent);
    if(!parsed)return;
    el.dataset.vfRolled='1';
    if(reduce){return;}
    var target=parsed.number,start=performance.now(),duration=800;
    function format(n){return n.toLocaleString('en-US',{minimumFractionDigits:parsed.decimals,maximumFractionDigits:parsed.decimals})+parsed.suffix;}
    function tick(now){
      var t=Math.min(1,(now-start)/duration);
      var eased=1-Math.pow(1-t,3);
      el.textContent=format(target*eased);
      if(t<1)requestAnimationFrame(tick);else el.textContent=format(target);
    }
    requestAnimationFrame(tick);
  }
  function numericRoll(){
    var stats=Array.prototype.slice.call(document.querySelectorAll('.vf-v2-proofstat strong,[data-vf-roll]'));
    if(!stats.length)return;
    if(reduce||!('IntersectionObserver'in window)){stats.forEach(rollOne);return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(entry){if(entry.isIntersecting){rollOne(entry.target);io.unobserve(entry.target);}});
    },{threshold:.6});
    stats.forEach(function(el){io.observe(el);});
  }

  function init(){
    applyTheme(storedTheme());
    mountThemeToggle();
    revealMotion();
    numericRoll();
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();

  if(window.matchMedia){
    var media=window.matchMedia('(prefers-color-scheme: light)');
    var handler=function(){if(storedTheme()==='system')applyTheme('system');};
    if(media.addEventListener)media.addEventListener('change',handler);else if(media.addListener)media.addListener(handler);
  }

  /* Legacy React shell can rerender large portions of the DOM. Reapply only lightweight enhancements. */
  window.addEventListener('vf:ui-rendered',function(){setTimeout(function(){mountThemeToggle();numericRoll();},50);});
})();
