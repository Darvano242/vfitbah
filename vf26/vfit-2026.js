/* VFIT 2026 site components for vfitbah.com.
   Header, homepage, footer and every public page rebuilt in the VFIT app layout. Every call to action still
   routes into the existing site flows (Start Here, Sign In, Pricing, Trainers, Online Coaching). */
(function(){
'use strict';
var root=document.documentElement;
root.setAttribute('data-vf26','1');
try{root.setAttribute('data-vf-theme',localStorage.getItem('vfitness-theme')==='light'?'light':'dark');}catch(e){root.setAttribute('data-vf-theme','dark');}

/* Keep the app blue as the default accent. A member's own saved accent is left alone. */
var APP_BLUE='#4296f0';
function fixAccent(){var v=(root.style.getPropertyValue('--mu-primary')||'').trim().toLowerCase();if(!v||v==='#3d7dff'){if(v!==APP_BLUE)root.style.setProperty('--mu-primary',APP_BLUE);}}
fixAccent();
try{new MutationObserver(fixAccent).observe(root,{attributes:true,attributeFilter:['style']});}catch(e){}

var reduceMotion=false;try{reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
/* ================= LOGO ENTRANCE =================
   About 1.3 s, once per browser session, homepage only. The logo comes forward out of a soft blur, a blue light
   sweeps across it, then it flies into the header position while the page (already rendered underneath) is revealed.
   It never blocks the page: the overlay ignores pointer events, any key, click or tap skips it, and there is a Skip
   button. Reduced motion, repeat visits and internal navigation open directly. No video, no audio. */
(function(){
 try{
  if(reduceMotion)return;
  var path=(location.pathname||'/').replace(/\/+$/,'')||'/';if(path!=='/')return;
  if(sessionStorage.getItem('vf_intro_seen'))return;sessionStorage.setItem('vf_intro_seen','1');
  if(!document.body||!Element.prototype.animate)return;
 }catch(e){return;}
 var ov=document.createElement('div');ov.className='vf26-intro';ov.setAttribute('aria-hidden','true');
 ov.innerHTML='<div class="vf26-intro-glow"></div><div class="vf26-intro-logo"><span class="tile"><img src="/vf26/vfit-app-icon.webp" alt="" width="80" height="80"></span><span class="word">VFITNESS</span><span class="sheen"></span></div>';
 var skip=document.createElement('button');skip.type='button';skip.className='vf26-intro-skip';skip.textContent='Skip intro';
 document.body.appendChild(ov);document.body.appendChild(skip);
 var logo=ov.querySelector('.vf26-intro-logo'),sheen=ov.querySelector('.sheen'),done=false,timers=[],anims=[];
 function finish(){if(done)return;done=true;timers.forEach(clearTimeout);anims.forEach(function(a){try{a.cancel();}catch(e){}});
  var b=document.querySelector('.vf26-header .vf26-brand');if(b)b.style.visibility='';
  ['keydown','pointerdown','wheel','touchstart'].forEach(function(ev){window.removeEventListener(ev,finish,true);});
  try{ov.remove();skip.remove();}catch(e){}}
 ['keydown','pointerdown','wheel','touchstart'].forEach(function(ev){window.addEventListener(ev,finish,{capture:true,passive:true});});
 skip.addEventListener('click',finish);
 var ease='cubic-bezier(.2,.8,.2,1)';
 anims.push(logo.animate([{opacity:0,transform:'perspective(800px) translateZ(-160px) scale(.86)',filter:'blur(10px)'},{opacity:1,transform:'perspective(800px) translateZ(0) scale(1)',filter:'blur(0)'}],{duration:560,easing:ease,fill:'forwards'}));
 anims.push(sheen.animate([{transform:'translateX(-120%) skewX(-18deg)',opacity:0},{opacity:.9,offset:.3},{transform:'translateX(260%) skewX(-18deg)',opacity:0}],{duration:420,delay:470,easing:'ease-in-out',fill:'forwards'}));
 timers.push(setTimeout(function(){
  var b=document.querySelector('.vf26-header .vf26-brand'),r=b&&b.getBoundingClientRect(),L=logo.getBoundingClientRect();
  if(!(r&&r.width))anims.push(ov.animate([{opacity:1},{opacity:0}],{duration:420,easing:'ease-out',fill:'forwards'}));
  if(r&&r.width){
   try{var wc=getComputedStyle(b.querySelector('.vf26-brand-word')).color;var w=logo.querySelector('.word');w.style.transition='color .44s ease-out';w.style.color=wc;}catch(e){}
   b.style.visibility='hidden';
   var dx=(r.left+r.width/2)-(L.left+L.width/2),dy=(r.top+r.height/2)-(L.top+L.height/2),sc=r.height/L.height;
   var fly=logo.animate([{transform:'perspective(800px) translate(0,0) scale(1)'},{transform:'perspective(800px) translate('+dx+'px,'+dy+'px) scale('+sc+')'}],{duration:440,easing:ease,fill:'forwards'});
   anims.push(fly);logo.style.opacity='1';
   ov.querySelector('.vf26-intro-glow').style.opacity='0';
   ov.style.background='transparent';
  }
  timers.push(setTimeout(finish,470));
 },880));
 timers.push(setTimeout(finish,2600));/* safety: never longer than this */
})();

var coarse=false;try{coarse=window.matchMedia('(hover: none)').matches;}catch(e){}

function h(){return React.createElement.apply(React,arguments);}
function svgEl(inner,props){return h('svg',Object.assign({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',dangerouslySetInnerHTML:{__html:inner}},props||{}));}
var I={
 arrow:'<path d="M5 12h14M13 6l6 6-6 6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6 6 0 0 0 10.5 10.5Z"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 close:'<path d="M6 6l12 12M18 6 6 18"/>',
 history:'<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l3 2"/>',
 trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',
 check:'<path d="M20 6 9 17l-5-5"/>',
 scan:'<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2M7 8v8M11 8v8M15 8v8M18 8v8"/>',
 camera:'<rect x="3" y="6.5" width="18" height="13" rx="2.5"/><path d="M8 6.5 9 4h6l1 2.5"/><circle cx="12" cy="13" r="3.4"/>',
 users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
 pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
 cal:'<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4M12 13v5M9.5 15.5h5"/>',
 left:'<path d="m15 6-6 6 6 6"/>',
 right:'<path d="m9 6 6 6-6 6"/>',
 expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
 search:'<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/>',
 facebook:'<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3Z"/>',
 tiktok:'<path d="M16 3c.4 2.6 2 4.2 4.5 4.5v3.3c-1.7 0-3.2-.5-4.5-1.4v6.3A5.7 5.7 0 1 1 10.3 10v3.4a2.4 2.4 0 1 0 2.4 2.4V3Z"/>'
};
function icon(name,size,extra){return svgEl(I[name],Object.assign({width:size||18,height:size||18},extra||{}));}
function zap(){return h('svg',{className:'vf26-zap',width:22,height:22,viewBox:'0 0 24 24','aria-hidden':'true',dangerouslySetInnerHTML:{__html:'<defs><linearGradient id="vf26zg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4296f0"/><stop offset="100%" stop-color="#8869ec"/></linearGradient></defs><path d="M13 2 5 13h6l-1 9 9-13h-6l0-7Z" fill="url(#vf26zg)"/>'}});}

/* Animated feature icons, ported from the VFIT app icon system */
var A={
 clock:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="7.5" fill="currentColor" stroke="none" opacity=".14"/><line class="hand" x1="12" y1="12" x2="12" y2="6.5"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>',
 trend:'<path d="M4 18V4" opacity=".5"/><path d="M4 18h14" opacity=".5"/><path class="draw" style="--len:26" stroke-width="2" d="M5 15l5-4 3 2 7-7"/><circle class="dot" cx="20" cy="6" r="2.4" fill="currentColor" stroke="none"/>',
 rest:'<circle cx="12" cy="13" r="8" fill="currentColor" stroke="none" opacity=".12"/><circle cx="12" cy="13" r="8"/><g class="rot90"><path d="M12 13V7"/><path d="M12 13h4"/></g><path d="M10 3h4v3h-4z"/>',
 swap:'<g class="rot180"><path d="M4 9h12M13 6l3 3-3 3"/><path d="M20 15H8M11 12l-3 3 3 3"/></g>',
 barcode:'<g stroke-width="2"><line x1="6" y1="5" x2="6" y2="19"/><line x1="10" y1="5" x2="10" y2="19"/><line x1="14" y1="5" x2="14" y2="19"/><line x1="18" y1="5" x2="18" y2="19"/></g><rect class="scan" x="4" y="6" width="16" height="2" rx="1" fill="currentColor" stroke="none"/>',
 targets:'<g class="pulse"><circle cx="12" cy="12" r="8.5" fill="currentColor" stroke="none" opacity=".12"/><circle cx="12" cy="12" r="8.5"/><path d="M9 7v10M15 7v10M12 7v10" stroke-width="1.6"/></g>',
 camera:'<rect x="3" y="6.5" width="18" height="13" rx="2.5"/><path d="M8 6.5 9 4h6l1 2.5"/><circle class="shutter" cx="12" cy="13" r="3.6" fill="currentColor" stroke="none"/><circle cx="12" cy="13" r="3.6"/>',
 scale:'<circle cx="12" cy="12" r="8.5" fill="currentColor" stroke="none" opacity=".12"/><circle cx="12" cy="12" r="8.5"/><line class="needle" x1="12" y1="12" x2="15.5" y2="8.5" stroke-width="2"/><circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none"/>',
 moon:'<g class="rock"><path d="M20 14.5A8 8 0 1 1 9.5 4a6 6 0 0 0 10.5 10.5Z" fill="currentColor" stroke="none" opacity=".16"/><path d="M20 14.5A8 8 0 1 1 9.5 4a6 6 0 0 0 10.5 10.5Z"/></g>',
 gauge:'<path d="M4 16a8 8 0 0 1 16 0"/><path d="M4 16a8 8 0 0 1 16 0" fill="currentColor" stroke="none" opacity=".12"/><line class="gauge-needle" x1="12" y1="16" x2="17" y2="9.5" stroke-width="2"/><circle cx="12" cy="16" r="1.4" fill="currentColor" stroke="none"/>',
 heartbeat:'<path class="draw" style="--len:40" stroke-width="2" d="M3 12h4l2-4 2 8 2-10 2 8 2-2h4"/>',
 dumbbell:'<g class="lift"><rect x="2.5" y="9" width="2.5" height="6" rx="1" fill="currentColor" opacity=".5"/><rect x="19" y="9" width="2.5" height="6" rx="1" fill="currentColor" opacity=".5"/><line x1="5" y1="12" x2="19" y2="12" stroke-width="2"/></g>',
 muscle:'<circle cx="12" cy="4.2" r="2"/><path d="M12 6.5v7M8 8.5l4 1 4-1M9.5 21l2.5-7.5L14.5 21"/><path class="muscle" d="M9.2 9.3c.9 1.6 2 1.9 2.8 1.9s1.9-.3 2.8-1.9" stroke-width="2.6"/>',
 calendar:'<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path class="draw check" style="--len:14" stroke-width="2" d="M9 14.5l2 2 4-4"/>'
};
var ACC={training:'#2D86E6',progression:'#7C3AED',nutrition:'#14B8A6',recovery:'#6366F1',progress:'#F97066'};
function AnimIcon(p){return h('span',{className:'vf26-itile',style:{color:p.accent}},h('svg',{className:'vf26-anim',viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:1.75,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':'true',dangerouslySetInnerHTML:{__html:A[p.name]}}));}

/* Reveal on scroll */
var io=null,ioCallbacks=new WeakMap();
function getIO(){if(io||typeof IntersectionObserver==='undefined')return io;io=new IntersectionObserver(function(entries){entries.forEach(function(en){if(en.isIntersecting){var cb=ioCallbacks.get(en.target);if(cb)cb(en.target);io.unobserve(en.target);}});},{rootMargin:'0px 0px -60px 0px',threshold:.08});return io;}
var revealSweep=(function(){var queued=false;function sweep(){queued=false;var vh=window.innerHeight||800;document.querySelectorAll('.vf26-reveal:not(.is-in)').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<vh-20&&r.bottom>-200){el.classList.add('is-in');}});}function q(){if(queued)return;queued=true;(window.requestAnimationFrame||setTimeout)(sweep);}try{window.addEventListener('scroll',q,{passive:true});window.addEventListener('resize',q);setInterval(q,1500);}catch(e){}return q;})();
function useInView(ref,cb){React.useEffect(function(){var el=ref.current;if(!el)return;var o=getIO();if(!o||reduceMotion){cb(el);return;}ioCallbacks.set(el,cb);o.observe(el);return function(){try{o.unobserve(el);}catch(e){}};},[]);}
function Reveal(p){var ref=React.useRef(null);useInView(ref,function(el){el.classList.add('is-in');});
 return h(p.as||'div',Object.assign({ref:ref,className:'vf26-reveal '+(p.className||''),style:Object.assign({'--d':(p.delay||0)+'ms'},p.style||{})},p.id?{id:p.id}:{}),p.children);}

/* Anonymous funnel events. Only a fixed event name, a random tab session id, a coaching path label, a step
   number and the traffic source are sent (to /api/track, stored in the VFIT backend). No names, contact or health
   details, no cookies. Events are batched and sent on page hide. Admin and portal pages are never tracked. */
var VF_SID=(function(){try{var s=sessionStorage.getItem('vf_sid');if(!/^[a-z0-9]{8,32}$/.test(s||'')){s=Math.random().toString(36).slice(2,12)+Date.now().toString(36);sessionStorage.setItem('vf_sid',s);}return s;}catch(e){return Math.random().toString(36).slice(2,12)+Date.now().toString(36);}})();
var VF_SRC=(function(){try{var k='vf_src',v=sessionStorage.getItem(k);if(v!==null)return v;var q=new URLSearchParams(location.search).get('utm_source')||'';
 if(!q&&document.referrer){var r=new URL(document.referrer).hostname.replace(/^www\./,'');if(r&&!/vfitbah\.com$/.test(r))q=r;}
 q=String(q).toLowerCase().replace(/[^a-z0-9.\-_]/g,'').slice(0,60);sessionStorage.setItem(k,q);return q;}catch(e){return '';}})();
var vfQueue=[],vfTimer=null;
function vfPrivatePage(){var p=location.pathname||'/';return /^\/(portal|admin|dashboard)/.test(p);}
function vfFlush(){if(vfTimer){clearTimeout(vfTimer);vfTimer=null;}if(!vfQueue.length)return;var batch=vfQueue.splice(0,10);
 var body=JSON.stringify({events:batch});
 try{if(navigator.sendBeacon&&navigator.sendBeacon('/api/track',new Blob([body],{type:'text/plain'}))){if(vfQueue.length)vfFlush();return;}}catch(e){}
 try{fetch('/api/track',{method:'POST',headers:{'Content-Type':'application/json'},body:body,keepalive:true}).catch(function(){});}catch(e){}
 if(vfQueue.length)vfFlush();}
try{document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')vfFlush();});window.addEventListener('pagehide',vfFlush);}catch(e){}
function vfTrack(name,props){try{props=props||{};var e={event:name,at:Date.now(),props:props};(window.vfEvents=window.vfEvents||[]).push(e);window.dispatchEvent(new CustomEvent('vf:track',{detail:e}));
 if(vfPrivatePage()||/^(localhost|127\.)/.test(location.hostname)&&!window.vfTrackLocal)return;
 vfQueue.push({event:name,session:VF_SID,path:props.path?String(props.path).slice(0,40):'',step:typeof props.step==='number'?props.step:undefined,source:VF_SRC});
 if(vfQueue.length>=10)vfFlush();else if(!vfTimer)vfTimer=setTimeout(vfFlush,4000);}catch(x){}}
window.vfTrack=vfTrack;
/* Real links for navigation: crawlable, open-in-new-tab works, keyboard users get link semantics.
   A plain click keeps the app's own routing. */
function navA(page,run,props,children){
 return h('a',Object.assign({href:ROUTES[page]||'/',onClick:function(e){if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;e.preventDefault();run();}},props||{}),children);
}
function go(setCurrentPage,page){return function(){try{setCurrentPage(page);}catch(e){}try{window.scrollTo({top:0,behavior:'auto'});}catch(e){}};}
function lead(setCurrentPage,kv){return function(){vfTrack('consultation_request_started',{path:(kv&&kv.vf_lead_type)||'general'});if(typeof vfLeadPrefill==='function'){vfLeadPrefill(kv||{},setCurrentPage);}else{go(setCurrentPage,'starthere')();}};}

/* Count up for the stats strip */
function CountUp(p){var ref=React.useRef(null);var st=React.useState(reduceMotion?p.to:0);var val=st[0],setVal=st[1];
 useInView(ref,function(){if(reduceMotion){setVal(p.to);return;}var t0=null,d=1200;function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/d);var e=1-Math.pow(1-k,3);setVal(Math.round(p.to*e));if(k<1)requestAnimationFrame(step);}requestAnimationFrame(step);});
 return h('span',{ref:ref},val.toLocaleString('en-US'));}

/* ================= ROUTES ================= */
/* Every page has its own address so links, refresh, Back and Forward work. The app still renders by page key;
   this keeps the address bar, history, title and description in step with it. */
var ROUTES={home:'/',pricing:'/services',trainers:'/team',results:'/results',about:'/company',contact:'/contact',starthere:'/start',
 login:'/login',signup:'/signup',book:'/consultation',apply:'/coaching-application',dashboard:'/portal',admin:'/admin',
 privacy:'/privacy',terms:'/terms',refund:'/refund-policy',pinkbeachburn:'/events/pink-beach-burn'};
var PATH_ALIASES={'/pricing':'pricing','/trainers':'trainers','/about':'about','/locations':'contact','/apply':'starthere','/join':'starthere','/register':'starthere','/starthere':'starthere','/pink-beach-burn':'pinkbeachburn','/events':'pinkbeachburn'};
var META={
 home:"Build muscle, lose body fat and follow a clear plan. Small group coaching in Nassau, plus online training through the VFIT app.",
 pricing:'Personal training, semi private and group sessions in Nassau, plus online coaching through the VFIT app. Clear package pricing with sessions tracked in your client portal.',
 trainers:'Meet the VFitness coaching team in Nassau: founder Darvano Andrews and the coaches behind every program.',
 results:'Client results built on structured training, nutrition support, weekly check ins and progress tracking.',
 about:'VFitness Training Services: Nassau personal training company since 2018, serving clients at three locations and online.',
 contact:'Contact VFitness by WhatsApp, email or phone. Training locations and hours in Nassau, The Bahamas.',
 starthere:'Tell us your goal, schedule and preferred coach. A VFitness coach reviews every application and contacts you.',
 pinkbeachburn:"PINK Beach Burn 2026: the free VFitness beach bootcamp for Breast Cancer Awareness Month at Goodman's Bay, Nassau. The story and the photos.",
 login:'Sign in to your VFitness client portal.',signup:'Create your VFitness client account.',book:'Book a free VFitness consultation and body assessment in Nassau.'
};
function pageFromPath(path){path=(path||'/').replace(/\/+$/,'')||'/';for(var k in ROUTES){if(ROUTES[k]===path)return k;}return PATH_ALIASES[path.toLowerCase()]||null;}
window.vfPageFromPath=pageFromPath;
/* After sign-in, stay on a page the person opened directly instead of jumping to the dashboard. */
window.vfKeepRoute=function(){var p=(location.pathname||'/').replace(/\/+$/,'')||'/';return !(p==='/'||p==='/login'||p==='/signup');};
function setMeta(page){
 var desc=META[page]||META.home;var url='https://www.vfitbah.com'+(ROUTES[page]||'/');
 function upd(sel,attr,val){var el=document.querySelector(sel);if(el)el.setAttribute(attr,val);}
 upd('meta[name="description"]','content',desc);upd('meta[property="og:description"]','content',desc);
 upd('meta[property="og:url"]','content',url);upd('link[rel="canonical"]','href',url);
 var t=document.title;upd('meta[property="og:title"]','content',t);
}
function useRouter(currentPage,setCurrentPage){
 var popping=React.useRef(false),first=React.useRef(true);
 React.useEffect(function(){
  function onPop(){var pg=pageFromPath(location.pathname);if(pg){popping.current=true;try{setCurrentPage(pg);}catch(e){}}}
  window.addEventListener('popstate',onPop);return function(){window.removeEventListener('popstate',onPop);};
 },[]);
 React.useEffect(function(){
  var path=ROUTES[currentPage];
  if(path&&location.pathname!==path){
   var q=location.search.replace(/([?&])page=[^&]*&?/,'$1').replace(/[?&]$/,'');
   try{if(first.current||popping.current)history.replaceState({page:currentPage},'',path+q+location.hash);else history.pushState({page:currentPage},'',path);}catch(e){}
  }
  first.current=false;popping.current=false;
  (window.requestAnimationFrame||setTimeout)(function(){setMeta(currentPage);});
  if(currentPage!=='dashboard'&&currentPage!=='admin')vfTrack('page_view',{path:String(currentPage||'home')});
  try{root.setAttribute('data-vf-area',currentPage==='dashboard'||currentPage==='admin'?'portal':'public');root.setAttribute('data-vf-page',String(currentPage||'home'));}catch(e){}
 },[currentPage]);
}

/* ================= ACCESSIBLE TABS ================= */
/* Left/Right move and select, Home/End jump, only the selected tab is in the Tab order, panels are linked. */
function TabList(p){
 var refs=React.useRef({});
 function move(e,i){var n=p.options.length,j=null;
  if(e.key==='ArrowRight')j=(i+1)%n;else if(e.key==='ArrowLeft')j=(i-1+n)%n;else if(e.key==='Home')j=0;else if(e.key==='End')j=n-1;
  if(j===null)return;e.preventDefault();var o=p.options[j];p.onChange(o.value);setTimeout(function(){var b=refs.current[o.value];b&&b.focus();},0);}
 return h('div',{className:'vf26-tabs',role:'tablist','aria-label':p.label},p.options.map(function(o,i){var on=o.value===p.value;
  return h('button',{key:o.value,ref:function(el){refs.current[o.value]=el;},type:'button',role:'tab',id:p.id+'-tab-'+o.value,'aria-selected':on,'aria-controls':p.id+'-panel',tabIndex:on?0:-1,className:on?'on':'',onClick:function(){p.onChange(o.value);},onKeyDown:function(e){move(e,i);}},o.label);}));
}
function tabPanel(id,value,props){return Object.assign({role:'tabpanel',id:id+'-panel','aria-labelledby':id+'-tab-'+value,tabIndex:0},props||{});}

/* ================= SIGN-IN INTENT ================= */
/* When an action needs an account, remember what the person was doing, explain why, and bring them back after
   sign in or sign up. Stored in sessionStorage only, and only the page, action and package size. */
var INTENT_KEY='vf_after_login';
function saveIntent(it){try{sessionStorage.setItem(INTENT_KEY,JSON.stringify(Object.assign({at:Date.now()},it)));}catch(e){}}
function peekIntent(){try{var it=JSON.parse(sessionStorage.getItem(INTENT_KEY)||'null');if(it&&Date.now()-(it.at||0)<3600000)return it;}catch(e){}if((location.pathname||'').replace(/\/+$/,'')==='/consultation')return {page:'book'};return null;}
function takeIntent(){var it=peekIntent();try{sessionStorage.removeItem(INTENT_KEY);}catch(e){}return it;}
window.vfSaveIntent=saveIntent;window.vfPeekIntent=peekIntent;window.vfTakeIntent=takeIntent;
/* Where a person lands after signing in: their unfinished action first, otherwise their workspace. */
window.vfLandingPage=function(staff){var it=peekIntent();if(it&&it.page&&it.action!=='buy')takeIntent();return it&&it.page?it.page:(staff?'admin':'dashboard');};
function needAccount(detail){try{window.dispatchEvent(new CustomEvent('vf:need-account',{detail:detail||{}}));}catch(e){}}
window.vfNeedAccount=needAccount;

/* Accessible dialog: focus moves in, Tab stays inside, Escape closes, focus returns to the opener. */
function useDialog(open,onClose,ref,extra){
 React.useEffect(function(){
  if(!open)return;var opener=document.activeElement;var el=ref.current;
  function focusables(){var list=el?[].slice.call(el.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])')).filter(function(n){return n.offsetParent!==null;}):[];var x=extra&&extra();return x?[x].concat(list):list;}
  var t=setTimeout(function(){var f=focusables();var target=extra?f[1]||f[0]:f[0];(target||el)&&(target||el).focus();},30);
  function onKey(e){if(e.key==='Escape'){e.preventDefault();onClose();return;}
   if(e.key==='Tab'){var f=focusables();if(!f.length)return;var first=f[0],last=f[f.length-1];
    if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}}
  document.addEventListener('keydown',onKey);var prev=document.body.style.overflow;document.body.style.overflow='hidden';
  return function(){clearTimeout(t);document.removeEventListener('keydown',onKey);document.body.style.overflow=prev;try{opener&&opener.focus&&opener.focus();}catch(e){}};
 },[open]);
}
function AuthPrompt(props){
 var setCurrentPage=props.setCurrentPage;
 var st=React.useState(null),req=st[0],setReq=st[1];var ref=React.useRef(null);
 React.useEffect(function(){function on(e){setReq(e.detail||{});}window.addEventListener('vf:need-account',on);return function(){window.removeEventListener('vf:need-account',on);};},[]);
 function close(){setReq(null);}
 useDialog(!!req,close,ref);
 if(!req)return null;
 function go2(page){if(req.intent)saveIntent(req.intent);setReq(null);try{setCurrentPage(page);window.scrollTo(0,0);}catch(e){}}
 return h('div',{className:'vf26 vf26-modal-back',onMouseDown:function(e){if(e.target===e.currentTarget)close();}},
  h('div',{ref:ref,className:'vf26-modal',role:'dialog','aria-modal':'true','aria-labelledby':'vf26-auth-title','aria-describedby':'vf26-auth-desc',tabIndex:-1},
   h('button',{type:'button',className:'vf26-round vf26-modal-x',onClick:close,'aria-label':'Close'},icon('close',18)),
   h('p',{className:'vf26-kicker'},'Client account'),
   h('h2',{id:'vf26-auth-title',className:'vf26-h3'},req.title||'Sign in to continue'),
   h('p',{id:'vf26-auth-desc',className:'vf26-modal-text'},(req.reason||'This needs your client account.')+' '+(req.keep||'We will bring you right back here after you sign in.')),
   h('div',{className:'vf26-modal-acts'},
    h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:function(){go2('login');}},'Sign in'),
    h('button',{type:'button',className:'vf26-btn vf26-btn-outline',onClick:function(){go2(req.signupPage||'signup');}},req.signupLabel||'Create an account'))));
}

/* ================= HEADER ================= */
var PUBLIC_LINKS=[['pricing','Services'],['trainers','Team'],['results','Results'],['about','Company'],['contact','Contact']];
function Navigation(props){
 var user=props.user,isAdmin=props.isAdmin,currentPage=props.currentPage,setCurrentPage=props.setCurrentPage,theme=props.theme,toggleTheme=props.toggleTheme;
 var ms=React.useState(false),open=ms[0],setOpen=ms[1];
 window.__vf26SetPage=setCurrentPage;
 useRouter(currentPage,setCurrentPage);
 React.useEffect(function(){root.setAttribute('data-vf-theme',theme==='light'?'light':'dark');try{document.querySelector('meta[name="theme-color"]')&&document.querySelector('meta[name="theme-color"]').setAttribute('content',theme==='light'?'#f5f5f9':'#0f1115');}catch(e){}},[theme]);
 React.useEffect(function(){try{document.body.classList.toggle('vf26-member',!!(user&&!isAdmin));}catch(e){}},[user,isAdmin]);
 React.useEffect(function(){setOpen(false);},[currentPage]);
 /* Signed in routing guard: admins and trainers belong on the admin page, and a signed in person never stays on login or signup. */
 React.useEffect(function(){try{document.body.classList.toggle('vf26-app-page',currentPage==='dashboard'||currentPage==='admin');}catch(e){}},[currentPage]);
 React.useEffect(function(){var appOnly={meals:1,workoutprograms:1,library:1,saved:1,aichat:1,community:1,sleep:1,progress:1,search:1};if(appOnly[currentPage]){try{setCurrentPage(user?'dashboard':'home');}catch(e){}}if(currentPage==='locations'){try{setCurrentPage('contact');}catch(e){}}},[currentPage,!!user]);
 var lastPage=React.useRef(currentPage);
 React.useEffect(function(){if(lastPage.current===currentPage)return;lastPage.current=currentPage;function top(){try{window.scrollTo({top:0,left:0,behavior:'instant'});}catch(e){window.scrollTo(0,0);}}top();requestAnimationFrame(top);setTimeout(top,120);},[currentPage]);
 React.useEffect(function(){if(user)return;var gated={dashboard:1,admin:1,saved:1,aichat:1,community:1};if(!gated[currentPage])return;var t=setTimeout(function(){try{if(!auth.currentUser)setCurrentPage('login');}catch(e){}},1500);return function(){clearTimeout(t);};},[user,currentPage]);
 var signedAt=React.useRef(0);
 React.useEffect(function(){signedAt.current=user?Date.now():0;},[!!user]);
 React.useEffect(function(){if(!user)return;var t=null;function fix(){var fresh=Date.now()-signedAt.current<6000;if(currentPage==='login'||currentPage==='signup'){if(window.__vfLoginWelcome)return;try{var it=peekIntent();setCurrentPage(it&&it.page?it.page:(isAdmin?'admin':'dashboard'));}catch(e){}}else if(isAdmin&&fresh&&currentPage==='dashboard'){try{setCurrentPage('admin');}catch(e){}}}fix();t=setTimeout(fix,2200);return function(){clearTimeout(t);};},[user,isAdmin,currentPage]);
 var sheetRef=React.useRef(null),menuBtnRef=React.useRef(null);
 useDialog(open,function(){setOpen(false);},sheetRef,function(){return menuBtnRef.current;});
 function nav(page){return function(){setOpen(false);go(setCurrentPage,page)();};}
 function logout(){setOpen(false);try{auth.signOut().then(function(){setCurrentPage('home');});}catch(e){setCurrentPage('home');}}
 var seg=h('nav',{className:'vf26-seg','aria-label':'Primary'},PUBLIC_LINKS.map(function(l){return navA(l[0],nav(l[0]),{key:l[0],className:currentPage===l[0]?'on':'','aria-current':currentPage===l[0]?'page':undefined},l[1]);}));
 var themeBtn=h('button',{className:'vf26-round',onClick:toggleTheme,'aria-label':theme==='dark'?'Switch to light mode':'Switch to dark mode',title:theme==='dark'?'Light mode':'Dark mode'},icon(theme==='dark'?'sun':'moon',18));
 var right;
 if(user){
  right=h('div',{className:'vf26-actions'},
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:logout},'Sign out'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:nav(isAdmin?'admin':'dashboard')},isAdmin?'Business dashboard':'Client portal'),
   h('button',{ref:menuBtnRef,type:'button',className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open,'aria-controls':'vf26-menu-sheet'},icon(open?'close':'menu',20)));
 }else{
  right=h('div',{className:'vf26-actions'},
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:nav('login')},'Client login'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:lead(setCurrentPage,{})},'Free consultation'),
   h('button',{ref:menuBtnRef,type:'button',className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open,'aria-controls':'vf26-menu-sheet'},icon(open?'close':'menu',20)));
 }
 var more=[];
 var memberLinks=user?(isAdmin?[['admin','Admin Dashboard'],['dashboard','My Client Portal']]:[['dashboard','Client Portal']]):[];
 var sheet=open?h('div',{ref:sheetRef,id:'vf26-menu-sheet',className:'vf26 vf26-sheet',role:'dialog','aria-modal':'true','aria-label':'Site menu'},
   h('div',{className:'vf26-sheet-grid'},memberLinks.concat([['home','Home']]).concat(PUBLIC_LINKS).map(function(l,i){return ROUTES[l[0]]?navA(l[0],nav(l[0]),{key:l[0]+i,className:currentPage===l[0]?'on':'','aria-current':currentPage===l[0]?'page':undefined},[l[1],icon('arrow',16,{key:'i'})]):h('button',{key:l[0]+i,className:currentPage===l[0]?'on':'',onClick:nav(l[0])},l[1],icon('arrow',16));})),
   h('div',{className:'vf26-sheet-cta'},user?h('button',{className:'vf26-btn vf26-btn-outline',onClick:logout},'Sign out'):[
     h('button',{key:'s',className:'vf26-btn vf26-btn-primary',onClick:function(){setOpen(false);lead(setCurrentPage,{})();}},'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})),
     h('button',{key:'l',className:'vf26-btn vf26-btn-outline',onClick:nav('login')},'Client login')])):null;
 return h(React.Fragment,null,
  h('a',{className:'vf26-skip',href:'#main',onClick:function(e){var m=document.querySelector('main');if(!m)return;e.preventDefault();m.setAttribute('tabindex','-1');m.focus();try{m.scrollIntoView();}catch(x){}}},'Skip to main content'),
  h(AuthPrompt,{setCurrentPage:setCurrentPage}),
  h('header',{className:'vf26 vf26-header'},h('div',{className:'vf26-wrap vf26-header-in'},
   navA('home',nav('home'),{className:'vf26-brand','aria-label':'VFitness home'},[h('span',{key:'t',className:'vf26-brand-tile'},h('img',{src:'/vf26/vfit-app-icon.webp',alt:'',width:40,height:40})),h('span',{key:'w',className:'vf26-brand-word'},'VFITNESS')]),
   seg,right)),
  sheet);
}

/* ================= HOMEPAGE ================= */
function DemoWorkout(p){
 var s=React.useState(0),pct=s[0],setPct=s[1];
 var r=React.useState(92),secs=r[0],setSecs=r[1];
 var d=React.useState(2),done=d[0],setDone=d[1];
 React.useEffect(function(){var t=setTimeout(function(){setPct(68);},350);return function(){clearTimeout(t);};},[]);
 React.useEffect(function(){if(reduceMotion)return;var t=setInterval(function(){setSecs(function(x){if(x<=1){setDone(function(n){return n>=4?2:n+1;});return 92;}return x-1;});},1000);return function(){clearInterval(t);};},[]);
 var mm=Math.floor(secs/60),ss=('0'+(secs%60)).slice(-2);
 return h('div',{className:'vf26-demo vf26-enter',style:{'--d':'180ms'}},
  h('div',{className:'vf26-demo-top'},h('span',null,'Inside VFitness'),h('span',{className:'vf26-chip'},'Example workout')),
  h('div',{className:'vf26-demo-card'},
   h('div',{className:'vf26-demo-media'},
    h('img',{src:'/vf26/welcome-glute-v1.webp',alt:'Athlete performing a barbell hip thrust in a strength gym',width:1200,height:800,className:'vf26-photo-reveal',fetchpriority:'high'}),
    h('div',null,
     h('p',{className:'k'},'Strength starts here'),
     h('h3',null,'Glute Strength'),
     h('div',{className:'vf26-prog-row'},h('span',null,'Session progress'),h('b',null,pct+'%')),
     h('div',{className:'vf26-bar',role:'progressbar','aria-valuenow':pct,'aria-valuemin':0,'aria-valuemax':100,'aria-label':'Example session progress'},h('i',{style:{width:pct+'%'}})))),
   h('div',{className:'vf26-demo-body'},
    h('div',{className:'vf26-row'},h('div',null,h('p',{style:{margin:0,fontWeight:700,fontSize:'1rem',letterSpacing:'-.02em'}},'Barbell Hip Thrust'),h('p',{className:'vf26-muted',style:{margin:'.25rem 0 0',fontSize:'.75rem'}},'4 working sets, 6 to 8 reps')),h('span',{className:'vf26-ready'},'Set '+Math.min(done+1,4)+' of 4')),
    h('div',{className:'vf26-sets','aria-hidden':'true'},[0,1,2,3].map(function(i){return h('span',{key:i,className:i<done?'done':''});})),
    h('div',{className:'vf26-tiles'},
     h('div',{className:'vf26-tile'},h('div',{className:'l'},icon('history',14),'Last time'),h('div',{className:'v vf26-tabular'},'225 ',h('small',null,'lb')),h('div',{className:'s'},'8 reps completed')),
     h('div',{className:'vf26-tile today'},h('div',{className:'l'},icon('trend',14),'Today'),h('div',{className:'v vf26-tabular'},'230 ',h('small',null,'lb')),h('div',{className:'s'},'Target 6 to 8 reps'))),
    h('div',{className:'vf26-rest'},
     h('div',{style:{display:'flex',alignItems:'center',gap:'.75rem'}},h('span',{className:'vf26-icon-tile'},icon('timer',20)),h('div',null,h('p',{className:'vf26-muted',style:{margin:0,fontSize:'.75rem'}},'Rest timer'),h('p',{style:{margin:'.1rem 0 0',fontSize:'.875rem',fontWeight:600}},'Take a breath.'))),
     h('span',{className:'t vf26-tabular','aria-live':'off'},mm+':'+ss)))),
  h('div',{className:'vf26-demo-foot'},h('p',null,'Your last session becomes your next starting point.'),h('button',{className:'vf26-link',onClick:lead(p.setCurrentPage,{})},'Find your plan',icon('arrow',16))));
}

var FEATURES=[
 ['clock',ACC.training,'Workout Memory','See the weight, reps and effort from your last session the moment you open an exercise.'],
 ['trend',ACC.progression,'Progressive Overload','Your next target is built from what you actually completed and your one rep max, not a generic guess.'],
 ['rest',ACC.progression,'Automatic Rest Timing','Finish a set and the right rest period starts on its own. Add time or skip when you need to.'],
 ['muscle',ACC.training,'Muscle Map','An anatomy view lights up the exact muscles each exercise works, so every rep has a purpose.'],
 ['calendar',ACC.training,'Smart Schedule','Pick your training days, skip a day or move it, and your plan lines back up with today.'],
 ['dumbbell',ACC.training,'Exercise Guidance','Follow exercise videos, coaching cues, sets, reps and rest without leaving the workout.'],
 ['barcode',ACC.nutrition,'Barcode Food Logging','Scan packaged foods, confirm the serving and add it straight to your daily nutrition log.'],
 ['targets',ACC.nutrition,'Nutrition Targets','Track calories, protein, carbohydrates, fats, fiber and water against your daily targets.'],
 ['camera',ACC.progress,'Progress Photos and Scans','Front, side and back photos stay together, with body scans that show change over time.'],
 ['scale',ACC.progress,'Body Metrics','Follow weight trends, waist measurements and body data without judging progress from one number.'],
 ['moon',ACC.recovery,'Sleep and Recovery','Log sleep, energy, stress and soreness so your training reflects how you are recovering.'],
 ['heartbeat',ACC.progression,'Performance History','Review completed workouts, volume, personal records and exercise progress in one place.']
];
function FeatureCard(p){
 var ref=React.useRef(null);var st=React.useState(false),play=st[0],setPlay=st[1];
 useInView(ref,function(el){el.classList.add('is-in');if(coarse&&!reduceMotion){setTimeout(function(){setPlay(true);setTimeout(function(){setPlay(false);},1600);},p.delay+250);}});
 return h('div',{ref:ref,className:'vf26-reveal',style:{'--d':p.delay+'ms'}},
  h('div',{className:'vf26-feature'+(play?' vf26-play':''),onMouseEnter:function(){if(!reduceMotion)setPlay(true);},onMouseLeave:function(){setPlay(false);}},
   h(AnimIcon,{name:p.f[0],accent:p.f[1]}),
   h('h4',null,p.f[2]),
   h('p',null,p.f[3])));
}

var STEPS=[['01','Tell us your goal','Answer a few questions in Start Here and choose your coach or let us match you.'],
 ['02','Start your plan','Train in Nassau or online with a written program built around your goal.'],
 ['03','Log the work','Record weights, reps, meals, sleep and weekly check ins as you go.'],
 ['04','Come back stronger','Your history sets the next target, and your coach adjusts the plan with you.']];


var COACHES=[
 {name:'Darvano Andrews',first:'Darvano',role:'Founder and Head Coach',spec:['Physique transformation','Glute development','Muscle gain'],bio:'Founded VFitness in 2018 and leads the coaching team across personal training, coaching and fitness programs.'},
 {name:'Chavese Moss',first:'Chavese',role:'Senior Coach and Partnerships Lead',spec:['Strength training','Fat loss','Semi private sessions'],bio:'Eight years of coaching, handling client programming and business partnerships for the team.'},
 {name:'Lanardo Mackey',first:'Lanardo',role:'Senior Personal Trainer and Partnerships Lead',spec:['Strength training','Conditioning','Group training'],bio:'Six years coaching VFitness clients with a focus on consistency, technique and sustainable results.'},
 {name:'Kevin Mackey',first:'Kevin',role:'Coach',spec:['Beginner coaching','Fat loss','Accountability'],bio:'Helps new clients build confidence in the gym and stick to the plan week after week.'}
];

function Faq(){
 var s=React.useState(0),open=s[0],setOpen=s[1];
 var list=[];try{list=(typeof VF_FAQ!=='undefined'&&VF_FAQ)||[];}catch(e){}
 return h('div',{className:'vf26-faq'},list.map(function(q,i){var isOpen=open===i;return h(Reveal,{key:i,delay:Math.min(i*40,240)},
  h('div',{className:'vf26-faq-item'+(isOpen?' open':'')},
   h('button',{className:'vf26-faq-q',onClick:function(){setOpen(isOpen?-1:i);},'aria-expanded':isOpen},h('span',null,q[0]),h('span',{className:'pm'},icon('plus',16))),
   h('div',{className:'vf26-faq-a'},h('div',null,h('p',null,q[1])))));}));
}



/* ================= ONLINE TRAINING (VFIT app plans) ================= */
var VF_APP_URL='https://vfitnow.app/';window.VF_APP_URL=VF_APP_URL;
var VF_START_URL='https://vfitnow.app/start';window.VF_START_URL=VF_START_URL;
var VF_SHRED_URL='https://vfitnow.app/shred';
var APP_PLANS=[
 {name:'VFIT App',mo:'19.99',yr:'199.99',tag:'Train and eat with a plan.',points:['Full training library and workout player','Weight and rep memory with adaptive loads','Food logging, barcode scanner and macro targets','Readiness, recovery and progress scans','Analytics, challenges and community']},
 {name:'VFIT Autopilot',mo:'49.99',yr:'499.99',tag:'Your plan reviewed every morning.',featured:true,badge:'7 days free',points:['Suggested changes to calories, steps, cardio and workouts. You approve each one','Reads your weigh-ins, food, training and photos before it changes anything','Show Prep Coach with countdown and a weekly read','Ask the coach chat anything, any time','Unlimited training programs','Everything in VFIT App']},
 {name:'The 8-Week VFIT Shred',fixed:'297',per:' / 8 weeks',tag:'Coaching, a group and a guarantee.',cta:'See the Shred',href:VF_SHRED_URL,points:['8 weeks of VFIT Autopilot','Kickoff call with a VFitness coach','4 Saturday group sessions with Darvano at Empire Fitness (gym entry not included)','Weekly progress photo review','Eat Bahamian and still lose: grocery list and fish fry guide','Lose 5% of your bodyweight or your next 8 weeks are free*']}
];
function openApp(){try{window.open(VF_APP_URL,'_blank','noopener');}catch(e){location.href=VF_APP_URL;}}
function toOnlinePlans(setCurrentPage){return function(){go(setCurrentPage,'pricing')();setTimeout(scrollToId('vf26-remote'),400);};}
/* How the website, the app, Autopilot and a human coach fit together, in plain words. */
function FitTogether(){
 var rows=[
  ['globe','This website','Where you register, buy in person training packages, see your sessions and pay invoices.'],
  ['dumbbell','The VFIT app','Your workouts, food logging and progress. Use it in your phone browser at vfitnow.app today. App Store and Google Play versions are coming soon.'],
  ['spark','VFIT Autopilot (software)','Reviews your weigh ins, food and training each morning and suggests changes. Nothing changes unless you approve it.'],
  ['user','Your coach (a real person)','Elite Online Coaching and the Shred add a VFitness coach who reviews your progress, answers your questions and approves plan changes.']];
 return h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
  h(SectionHead,{kicker:'How it fits together',title:'Software does the daily tracking. People do the coaching.'}),
  h('div',{className:'vf26-fit'},rows.map(function(r,i){return h(Reveal,{key:r[1],className:'vf26-fit-item',delay:i*60},h('span',{className:'vf26-icon-tile'},icon(r[0],19)),h('div',null,h('b',null,r[1]),h('p',null,r[2])));})),
  h('p',{className:'vf26-note'},'Questions about your plan? Message us on WhatsApp at '+VF_PHONE+' or email '+VF_EMAIL+'.')));
}
function OnlinePlans(){
 var cs=React.useState('mo'),cyc=cs[0],setCyc=cs[1];
 return h('section',{className:'vf26-section tight',id:'vf26-remote'},h('div',{className:'vf26-wrap'},
  h(SectionHead,{row:true,kicker:'Online training',title:'Train anywhere with the VFIT app.',lead:'VFIT App gives you every tool. VFIT Autopilot reviews your plan every morning and suggests changes you approve. The Shred and Elite Online Coaching add a VFitness coach.',right:h(TabList,{id:'vf26-billing',label:'Billing period',value:cyc,onChange:setCyc,options:[{value:'mo',label:'Monthly'},{value:'yr',label:'Annual'}]})}),
  h('div',tabPanel('vf26-billing',cyc,{className:'vf26-app-grid'}),APP_PLANS.map(function(pl,i){
   var save=pl.fixed?0:Math.round((Number(pl.mo)*12-Number(pl.yr))*100)/100;
   return h(Reveal,{key:pl.name,className:'vf26-app-plan'+(pl.featured?' featured':''),delay:i*80},
    pl.featured?h('span',{className:'tag'},pl.badge||'Most popular'):null,
    h('div',{className:'nm'},pl.name),h('p',{className:'tg'},pl.tag),
    pl.fixed?h('div',{className:'pr'},h('b',null,'$'+pl.fixed),h('small',null,pl.per)):h('div',{className:'pr'},h('b',null,'$'+(cyc==='mo'?pl.mo:pl.yr)),h('small',null,cyc==='mo'?' / month':' / year')),
    h('div',{className:'sv'},pl.fixed?'One payment. 30 seats per group':cyc==='yr'&&save>0?'You save $'+save.toFixed(2).replace(/\.00$/,'')+' a year ('+Math.round(save/(Number(pl.mo)*12)*100)+'% vs monthly)':'Cancel any time'),
    h('ul',{className:'vf26-ticks'},pl.points.map(function(t){return h('li',{key:t},icon('check',15),t);})),
    h('a',{className:'vf26-btn '+(pl.featured?'vf26-btn-blend':'vf26-btn-outline'),href:pl.href||VF_START_URL,target:'_blank',rel:'noopener noreferrer'},pl.cta||(pl.featured?'Start 7 days free':'Build my plan'),icon('arrow',16,{className:'vf26-arrow'})));})),
  h('p',{className:'vf26-note'},'Every new VFIT account gets 7 days of VFIT Autopilot free. Cancel any time in the app. *Shred guarantee: log food 6 days and weigh in 5 mornings every week for all 8 weeks.'),
  h(Reveal,{className:'vf26-command vf26-remote vf26-coach-plan'},
   h('div',{style:{position:'relative',zIndex:1}},
    h('p',{className:'vf26-kicker'},'Elite Online Coaching'),
    h('h2',{className:'vf26-h2'},'A dedicated VFitness coach, online.'),
    h('p',{className:'vf26-lead'},'Our coaching promise, in writing. Each coach takes 20 clients at most, so every client gets the time below.'),
    h('ul',{className:'vf26-ticks'},['Custom program rebuilt every 4 weeks','Written weekly review every Monday','One 20 minute video call every week','Unlimited form checks, reviewed within 48 hours','Messages answered within 24 hours on weekdays','Another VFitness coach covers you when yours is away','VFIT Autopilot makes the daily changes. Your coach makes the calls'].map(function(t){return h('li',{key:t},icon('check',15),t);}))),
   h('div',{className:'vf26-remote-price'},
    h('div',{className:'v'},'$197',h('small',null,' / month')),
    h('a',{className:'vf26-btn vf26-btn-blend',href:'https://vfitnow.app/services/elite-online-coaching',target:'_blank',rel:'noopener noreferrer'},'Start Elite Coaching',icon('arrow',16,{className:'vf26-arrow'})),
    h('button',{className:'vf26-btn vf26-btn-outline',onClick:function(){var sp=window.__vf26SetPage;if(sp)sp('apply');try{window.scrollTo(0,0);}catch(e){}}},'Ask a coach first')))));
}


/* ================= VFIT APP ANNOUNCEMENT (home hero) ================= */
var APPLE_SVG='<path fill="currentColor" d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.7 3-.7s1.8.7 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.7 0 0-2.5-1-2.5-3.7ZM14.2 5.8c.6-.8 1.1-1.9 1-2.9-.9 0-2 .6-2.7 1.4-.6.7-1.1 1.8-1 2.8 1 .1 2.1-.5 2.7-1.3Z"/>';
var PLAY_SVG='<path fill="currentColor" d="M4.2 2.6c-.2.2-.3.6-.3 1v16.8c0 .4.1.8.3 1l9.4-9.4-9.4-9.4Zm10.6 10.6 2.7 2.7-11.2 6.4 8.5-9.1Zm0-2.4L6.3 1.7l11.2 6.4-2.7 2.7Zm3.9-1.7 3 1.7c.9.5.9 1.4 0 1.9l-3 1.7-3-2.7 3-2.6Z"/>';
function StoreBadge(p){
 return h('div',{className:'vf26-store','aria-label':p.store+', coming soon'},
  h('svg',{viewBox:'0 0 24 24',width:26,height:26,'aria-hidden':'true',dangerouslySetInnerHTML:{__html:p.svg}}),
  h('div',null,h('span',null,p.top),h('b',null,p.store)),
  h('em',null,'Coming soon'));
}
function AppAnnounce(){
 return h('div',{className:'vf26-demo vf26-enter',style:{'--d':'120ms'}},
  h('div',{className:'vf26-demo-top'},h('span',null,'Introducing'),h('span',{className:'vf26-live'},h('i'),'Coming soon')),
  h('div',{className:'vf26-appcard'},
   h('div',{className:'vf26-appcard-glow','aria-hidden':'true'}),
   h('div',{className:'vf26-appcard-icon'},h('img',{src:'/vf26/vfit-app-icon.webp',alt:'VFIT app icon',width:72,height:72})),
   h('p',{className:'vf26-kicker'},'The VFIT app'),
   h('h2',{className:'vf26-appcard-title'},'Try the VFIT app today.'),
   h('p',{className:'vf26-appcard-lead'},'Your program, workout tracking, nutrition and coaching in your pocket. Coming soon to the App Store and Google Play.'),
   h('ul',{className:'vf26-ticks'},['Weight and rep memory','Automatic rest timer','Food logging and macros','Progress photos and body metrics'].map(function(t){return h('li',{key:t},icon('check',15),t);})),
   h('div',{className:'vf26-stores'},
    h(StoreBadge,{svg:APPLE_SVG,top:'Download on the',store:'App Store'}),
    h(StoreBadge,{svg:PLAY_SVG,top:'Get it on',store:'Google Play'})),
   h('a',{className:'vf26-btn vf26-btn-blend',href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer',style:{width:'100%',marginTop:'1rem'}},'Use the VFIT app on the web now',icon('arrow',16,{className:'vf26-arrow'}))));
}

/* ================= VOLT (the VFIT app character) ================= */
var VOLT_SVG='<defs><linearGradient id="vf26vt" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#3B9BFF"/><stop offset="55%" stop-color="#2D86E6"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient><linearGradient id="vf26vs" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff" stop-opacity=".55"/><stop offset="100%" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>'+
 '<g class="vt-enter"><ellipse cx="236" cy="478" rx="70" ry="9" fill="#0B1220" opacity=".18"/><g class="vt-body">'+
 '<path d="M226 408 L212 456" stroke="#1E3A8A" stroke-width="13" stroke-linecap="round"/><path d="M254 380 L262 456" stroke="#1E3A8A" stroke-width="13" stroke-linecap="round"/>'+
 '<ellipse cx="204" cy="462" rx="17" ry="8" fill="#1E3A8A"/><ellipse cx="270" cy="462" rx="17" ry="8" fill="#1E3A8A"/>'+
 '<g class="vt-arm-l"><path d="M170 262 Q132 268 112 300" stroke="#1E3A8A" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="110" cy="306" r="13" fill="#2D86E6" stroke="#1E3A8A" stroke-width="5"/></g>'+
 '<path d="M292 72 L132 292 H244 L214 440 L380 214 H268 L292 72 Z" fill="url(#vf26vt)" stroke="#1E3A8A" stroke-width="9" stroke-linejoin="round"/><path d="M286 92 L162 262 H200 L276 150 Z" fill="url(#vf26vs)"/>'+
 '<ellipse cx="232" cy="242" rx="19" ry="22" fill="#fff"/><ellipse cx="294" cy="242" rx="19" ry="22" fill="#fff"/><circle cx="236" cy="246" r="10" fill="#0B1220"/><circle cx="298" cy="246" r="10" fill="#0B1220"/><circle cx="232" cy="242" r="3.2" fill="#fff"/><circle cx="294" cy="242" r="3.2" fill="#fff"/>'+
 '<path d="M244 278 q19 16 38 0" stroke="#0B1220" stroke-width="7" stroke-linecap="round" fill="none"/><circle cx="214" cy="266" r="7" fill="#F472B6" opacity=".45"/><circle cx="312" cy="262" r="7" fill="#F472B6" opacity=".45"/>'+
 '<g class="vt-arm-r"><path d="M350 236 Q384 206 396 170" stroke="#1E3A8A" stroke-width="13" stroke-linecap="round" fill="none"/><circle cx="398" cy="162" r="13" fill="#2D86E6" stroke="#1E3A8A" stroke-width="5"/></g>'+
 '</g></g>';
function Volt(p){var size=(p&&p.size)||96;return h('svg',{className:'vf26-volt'+(p&&p.className?' '+p.className:''),viewBox:'70 40 400 460',width:size,height:Math.round(size*1.15),role:'img','aria-label':'Volt, the VFIT app character, waving hello',dangerouslySetInnerHTML:{__html:VOLT_SVG}});}
window.VF26Volt=Volt;

/* ================= APP WALKTHROUGH (real VFIT screens) ================= */
var WALKTHROUGH=[
 {src:'/vf26/wt-1-checkin.webp',step:'Check in',title:'30 seconds every morning',text:'Sleep, soreness, energy and stress. Your readiness score sets how hard today should be.'},
 {src:'/vf26/wt-2-plan.webp',step:'Plan',title:'Your coach explains the change',text:'Food, steps, cardio and training for today, with the reason in plain words.'},
 {src:'/vf26/wt-3-train.webp',step:'Train',title:'Every set guided and logged',text:'Target weight and reps from your last session, rest timer, form video and a swap if the machine is taken.'},
 {src:'/vf26/wt-4-eat.webp',step:'Eat',title:'Every meal read in seconds',text:'Log a meal and see what is left today and what to do next.'},
 {src:'/vf26/wt-5-progress.webp',step:'Progress',title:'The trend, not one weigh-in',text:'Daily weigh-ins become a 7 day average next to your plan line, so you know it is working.'}
];
function AppWalkthrough(){
 var as=React.useState(0),active=as[0],setActive=as[1];
 var ref=React.useRef(null);
 function goTo(i){var el=ref.current;var n=Math.max(0,Math.min(WALKTHROUGH.length-1,i));var c=el&&el.children[n];if(c)el.scrollTo({left:c.offsetLeft-el.offsetLeft,behavior:reduceMotion?'auto':'smooth'});setActive(n);}
 function onScroll(){var el=ref.current;if(!el||!el.children[0])return;var w=el.children[0].getBoundingClientRect().width||1;setActive(Math.max(0,Math.min(WALKTHROUGH.length-1,Math.round(el.scrollLeft/(w+16)))));}
 return h('div',{className:'vf26-walk vf26-enter',style:{'--d':'120ms'}},
  h('div',{className:'vf26-walk-top'},
   h(Volt,{size:64}),
   h('div',null,h('p',{className:'vf26-kicker'},'See the app'),h('h3',null,'Check in. Train. See progress.'),h('small',null,'Real VFIT screens with a sample member\'s data.'))),
  h('div',{className:'vf26-walk-tabs',role:'tablist','aria-label':'App walkthrough steps'},WALKTHROUGH.map(function(w,i){return h('button',{key:w.step,type:'button',role:'tab','aria-selected':active===i,className:active===i?'on':'',onClick:function(){goTo(i);}},h('span',null,i+1),w.step);})),
  h('div',{className:'vf26-walk-track',ref:ref,onScroll:onScroll,tabIndex:0,role:'region','aria-label':'App walkthrough, scroll sideways for more'},WALKTHROUGH.map(function(w,i){return h('figure',{key:w.src,className:'vf26-walk-slide'},
   h('div',{className:'vf26-phone'},h('img',{src:w.src,alt:'VFIT app screen: '+w.step,width:420,height:840,loading:i?'lazy':'eager'})),
   h('figcaption',null,h('b',null,w.title),h('span',null,w.text)));})),
  h('div',{className:'vf26-walk-ctrl'},
   h('button',{type:'button',className:'vf26-round',onClick:function(){goTo(active-1);},disabled:active===0,'aria-label':'Previous screen'},icon('left',18)),
   h('span',{className:'vf26-tabular'},(active+1)+' / '+WALKTHROUGH.length),
   h('button',{type:'button',className:'vf26-round',onClick:function(){goTo(active+1);},disabled:active===WALKTHROUGH.length-1,'aria-label':'Next screen'},icon('right',18))),
  h('div',{className:'vf26-walk-stores'},
   h(StoreBadge,{svg:APPLE_SVG,top:'Download on the',store:'App Store'}),
   h(StoreBadge,{svg:PLAY_SVG,top:'Get it on',store:'Google Play'})));
}


var TEAM_ACC=['#4296f0','#5fddcc','#8869ec','#f97066'];
function TeamRow(p){
 return h('div',{className:'vf26-team4'},COACHES.map(function(c,i){var ini=c.name.split(' ').map(function(x){return x[0];}).join('');
  return h(Reveal,{key:c.name,delay:i*60},h('button',{className:'vf26-team4-card',onClick:go(p.setCurrentPage,'trainers'),style:{'--acc':TEAM_ACC[i%4]}},
   h('span',{className:'ph'},h('span',{className:'mono'},ini),h('span',{className:'sp'},c.spec[0])),
   h('b',null,c.name),h('small',null,c.role)));}));
}
function AppShowcase(p){
 var feats=[['history','Reviewed every morning','On VFIT Autopilot the app suggests changes to calories, steps, cardio and training. Nothing changes until you approve it.'],['timer','Guided workouts','Rest timers, form videos and every set remembered for next time.'],['scan','Eat with a plan','Log meals or scan a barcode and see exactly what is left today.'],['trend','Proof it is working','Weight trend, waist, photos and strength in one place.']];
 return h('section',{className:'vf26-section tight vf26-appshow',id:'vfit-app'},h('div',{className:'vf26-wrap vf26-appshow-grid'},
  h(Reveal,{className:'vf26-appshow-copy'},
   h('p',{className:'vf26-kicker'},'The VFIT app'),
   h('h2',{className:'vf26-h2 vf26-h2-sub'},'Never guess what to eat or do again.'),
   h('p',{className:'vf26-lead'},'Tell the VFIT app your goal and date and it builds your plan in five quick steps: calories, macros, a training week and a program. Plans from $19.99 a month, with 7 days of VFIT Autopilot free.'),
   h('ul',{className:'vf26-appshow-feats'},feats.map(function(f){return h('li',{key:f[1]},h('span',{className:'ic'},icon(f[0],18)),h('div',null,h('b',null,f[1]),h('p',null,f[2])));})),
   h('div',{className:'vf26-cta-row'},
    h('a',{className:'vf26-btn vf26-btn-blend',href:VF_START_URL,target:'_blank',rel:'noopener noreferrer'},'Build my plan',icon('arrow',16,{className:'vf26-arrow'})),
    h('button',{className:'vf26-btn vf26-btn-outline',onClick:toOnlinePlans(p.setCurrentPage)},'Compare app plans',icon('arrow',16,{className:'vf26-arrow'})))),
  h(AppWalkthrough,null)));
}

/* ================= TRANSFORMATION REEL (home) ================= */
function useGallery(){
 var gs=React.useState(null),g=gs[0],setG=gs[1];
 React.useEffect(function(){try{db.collection('gallery').get().then(function(snap){setG(snap.docs.map(function(d){return Object.assign({id:d.id},d.data());}).filter(function(x){return x.imageUrl&&x.status!=='draft'&&x.status!=='archived';}).sort(function(a,b){var da=a.createdAt&&a.createdAt.toDate?a.createdAt.toDate():new Date(0);var dbb=b.createdAt&&b.createdAt.toDate?b.createdAt.toDate():new Date(0);return dbb-da;}));}).catch(function(){setG([]);});}catch(e){setG([]);}},[]);
 return g;
}
function TransformReel(p){
 var setCurrentPage=p.setCurrentPage;
 var raw=useGallery();var g=raw||[];var n=g.length;
 var is=React.useState(0),idx=is[0],setIdx=is[1];
 var ps=React.useState(false),paused=ps[0],setPaused=ps[1];
 var hs=React.useState(false),hold=hs[0],setHold=hs[1];/* hover or keyboard focus inside */
 var us=React.useState(reduceMotion),userStopped=us[0],setUserStopped=us[1];/* explicit Pause, or reduced motion */
 var touch=React.useRef(null);
 function next(){setIdx(function(i){return n?(i+1)%n:0;});}
 function prev(){setIdx(function(i){return n?(i-1+n)%n:0;});}
 var stopped=userStopped||hold||paused;
 React.useEffect(function(){if(n<2||stopped)return;var t=setTimeout(next,4500);return function(){clearTimeout(t);};},[n,idx,stopped]);
 function onKey(e){if(e.key==='ArrowRight'){e.preventDefault();setUserStopped(true);next();}else if(e.key==='ArrowLeft'){e.preventDefault();setUserStopped(true);prev();}}
 var cur=n?g[idx%n]:null;
 var side=[];for(var k=1;k<=4&&k<n;k++)side.push({g:g[(idx+k)%n],i:(idx+k)%n});
 var strip=n?g.concat(g):[];
 /* No real photos (still loading, none published or the feed failed): show nothing rather than an empty proof heading. */
 if(!n)return null;
 return h('section',{className:'vf26-section tight vf26-reel-sec',id:'vf-results-section'},h('div',{className:'vf26-wrap'},
  h(Reveal,{className:'vf26-head-row'},
   h('div',null,h('p',{className:'vf26-kicker'},'Real clients. Real results.'),h('h2',{className:'vf26-h2'},'Transformations built in Nassau.'),
    h('p',{className:'vf26-lead'},'Every photo is a real VFitness client, shared with consent. Structure, check ins and tracking did the rest.'))),
  cur?h('div',{className:'vf26-reel',role:'region','aria-roledescription':'carousel','aria-label':'Client transformations',onKeyDown:onKey,onMouseEnter:function(){setHold(true);},onMouseLeave:function(){setHold(false);},onFocus:function(){setHold(true);},onBlur:function(e){if(!e.currentTarget.contains(e.relatedTarget))setHold(false);}},
   h('div',{className:'vf26-reel-main',onTouchStart:function(e){touch.current=e.touches[0].clientX;},onTouchEnd:function(e){if(touch.current==null)return;var d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>50){d>0?next():prev();}touch.current=null;}},
    h('div',{role:'group','aria-roledescription':'slide','aria-label':(idx+1)+' of '+n+(cur.title?': '+cur.title:''),'aria-live':stopped?'polite':'off'},
     h('img',{key:cur.id,src:cur.imageUrl,alt:cur.title?'Client transformation: '+cur.title:'Client transformation '+(idx+1)+' of '+n,className:'vf26-photo-reveal'})),
    h('span',{className:'vf26-reel-badge'},icon('trend',14),'Real result'),
    h('div',{className:'cap'},cur.title?h('b',null,cur.title):null,cur.description?h('span',null,cur.description):null),
    h('div',{className:'ctrl'},
     h('button',{type:'button',className:'vf26-round',onClick:function(){setUserStopped(true);prev();},'aria-label':'Previous transformation'},icon('left',18)),
     h('span',{className:'cnt vf26-tabular','aria-hidden':'true'},(idx+1)+' / '+n),
     h('button',{type:'button',className:'vf26-round',onClick:function(){setUserStopped(true);next();},'aria-label':'Next transformation'},icon('right',18)),
     n>1?h('button',{type:'button',className:'vf26-round',onClick:function(){setUserStopped(!userStopped);},'aria-label':userStopped?'Play slideshow':'Pause slideshow','aria-pressed':userStopped},h('span',{'aria-hidden':'true',style:{fontWeight:900,fontSize:'.8rem'}},userStopped?'\u25B6':'II')):null),
    h('div',{className:'bar'},h('i',{key:idx+(stopped?'p':''),className:stopped?'':'run'}))),
   h('div',{className:'vf26-reel-side'},side.map(function(o,k){return h('button',{type:'button',key:o.g.id+'-'+k,className:'vf26-reel-thumb vf26-enter',style:{'--d':(k*70)+'ms'},onClick:function(){setUserStopped(true);setIdx(o.i);},'aria-label':'Show transformation '+(o.i+1)+' of '+n+(o.g.title?': '+o.g.title:'')},
     h('img',{src:o.g.imageUrl,alt:'',loading:'lazy'}),o.g.title?h('span',null,o.g.title):null);}))):
   h('div',{className:'vf26-reel-empty'},h(TransformationShowcaseSafe,null)),
  n>2?h('div',{className:'vf26-marquee','aria-hidden':'true'},h('div',{className:'vf26-marquee-track',style:{animationDuration:Math.max(30,n*5)+'s'}},strip.map(function(x,k){return h('img',{key:x.id+'-'+k,src:x.imageUrl,alt:'',loading:'lazy'});}))):null,
  h('div',{className:'vf26-cta-row'},
   h('button',{className:'vf26-link',onClick:go(setCurrentPage,'results')},'See all client results',icon('arrow',16))),
  h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.')));
}
function TransformationShowcaseSafe(){return typeof TransformationShowcase==='function'?h(TransformationShowcase,null):null;}


/* ================= HEADLINE SLIDER =================
   Events and offers published in the VFIT app (Admin > Announcements, "Website home slider").
   Falls back to the slides below if the app cannot be reached. */
var PROMO_API='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/promoSlides';
var PROMO_FALLBACK=[{id:'pink-beach-burn-2026',eyebrow:'Free community bootcamp',title:'PINK Beach Burn',
 body:'A free VFitness beach bootcamp for Breast Cancer Awareness Month. Warm up, beach circuit, challenge, core finisher and cooldown. Every fitness level welcome. Wear pink and bring your people.',
 imageUrl:'/vf26/pink-beach-burn-oct31.webp',imageAlt:'PINK Beach Burn flyer: Saturday October 31, 7:00 AM, Goodman\'s Bay, Nassau. Free to all.',
 eventStart:'2026-10-31T11:00:00.000Z',eventEnd:'2026-10-31T12:15:00.000Z',location:"Goodman's Bay, Nassau",
 mapsUrl:'https://www.google.com/maps/search/?api=1&query=Goodman%27s+Bay+Nassau+Bahamas',accent:'#E11D74',
 highlights:['Free to all','Drinks provided','DJ','Giveaways and prizes','Photos and video']}];
var PROMO_TZ='America/Nassau';
function promoFmt(iso,o){try{return new Intl.DateTimeFormat('en-US',Object.assign({timeZone:PROMO_TZ},o)).format(new Date(iso));}catch(e){return '';}}
function promoYmd(t){return new Intl.DateTimeFormat('en-CA',{timeZone:PROMO_TZ,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(t));}
function promoWhen(s,now){now=now||Date.now();var st=Date.parse(s.eventStart||'');if(!isFinite(st))return null;var en=Date.parse(s.eventEnd||'')||st+90*60000;
 if(now>=st&&now<=en)return 'Happening now';if(now>en)return null;var d=Math.round((Date.parse(promoYmd(st))-Date.parse(promoYmd(now)))/86400000);
 return d<=0?'Today':d===1?'Tomorrow':'In '+d+' days';}
function promoLive(s){if(!s.eventStart)return true;var en=Date.parse(s.eventEnd||s.eventStart);return !isFinite(en)||en+86400000>Date.now();}
function promoIcs(s){var st=s.eventStart,en=s.eventEnd||new Date(Date.parse(st)+75*60000).toISOString();
 function d(x){return new Date(x).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,'');}function t(x){return String(x||'').replace(/\\/g,'\\\\').replace(/([,;])/g,'\\$1').replace(/\n/g,'\\n');}
 var g='https://calendar.google.com/calendar/render?action=TEMPLATE&text='+encodeURIComponent(s.title)+'&dates='+d(st)+'/'+d(en)+'&details='+encodeURIComponent(s.body||'')+'&location='+encodeURIComponent(s.location||'');
 if(!/iPhone|iPad|Macintosh/.test(navigator.userAgent||'')){window.open(g,'_blank','noopener');return;}
 var ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//VFitness//Events//EN','BEGIN:VEVENT','UID:'+s.id+'@vfitbah.com','DTSTAMP:'+d(new Date().toISOString()),'DTSTART:'+d(st),'DTEND:'+d(en),'SUMMARY:'+t(s.title),s.location?'LOCATION:'+t(s.location):null,s.body?'DESCRIPTION:'+t(s.body):null,'BEGIN:VALARM','TRIGGER:-PT12H','ACTION:DISPLAY','DESCRIPTION:'+t(s.title),'END:VALARM','END:VEVENT','END:VCALENDAR'].filter(Boolean).join('\r\n');
 var u=URL.createObjectURL(new Blob([ics],{type:'text/calendar;charset=utf-8'}));var a=document.createElement('a');a.href=u;a.download=(s.title||'event').replace(/[^\w]+/g,'-').toLowerCase()+'.ics';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u);},4000);}
var promoCache=null;
function usePromoSlides(){
 var st=React.useState(promoCache||PROMO_FALLBACK.filter(promoLive)),slides=st[0],setSlides=st[1];
 React.useEffect(function(){if(promoCache)return;var alive=true;
  fetch(PROMO_API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({placement:'home'})})
   .then(function(r){return r.ok?r.json():null;}).then(function(j){if(!alive||!j||!Array.isArray(j.slides))return;promoCache=j.slides.filter(promoLive);setSlides(promoCache);}).catch(function(){});
  return function(){alive=false;};},[]);
 return slides;
}
function promoTrack(id,type){try{fetch(PROMO_API.replace('promoSlides','trackAnnouncement'),{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({announcementId:id,type:type}),keepalive:true}).catch(function(){});}catch(e){}}
function PromoHeadliner(){
 var slides=usePromoSlides(),s=slides[0];if(!s)return null;
 var w=promoWhen(s),date=s.eventStart?promoFmt(s.eventStart,{weekday:'short',month:'short',day:'numeric'}):null;
 return h('a',{href:'#whats-on',className:'vf26-headliner vf26-enter',style:{'--promo':s.accent||'#4296f0'},onClick:function(e){var el=document.getElementById('whats-on');if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth',block:'center'});}}},
  h('span',{className:'dot'}),h('span',{className:'t'},[w&&w!=='Today'&&w!=='Tomorrow'?date:w,s.title,s.highlights&&s.highlights[0]].filter(Boolean).join(' · ')),icon('arrow',14));
}
function PromoSlider(){
 var slides=usePromoSlides();
 var a=React.useState(0),i=a[0],setI=a[1];var b=React.useState(false),paused=b[0],setPaused=b[1];var c=React.useState(null),box=c[0],setBox=c[1];
 var ref=React.useRef(null),drag=React.useRef(null),seen=React.useRef({});
 var n=slides.length,idx=n?((i%n)+n)%n:0,s=slides[idx];
 var reduce=typeof window!=='undefined'&&window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 React.useEffect(function(){if(n<2||paused||reduce||box)return;var t=setTimeout(function(){setI(function(v){return v+1;});},7000);return function(){clearTimeout(t);};},[i,n,paused,box]);
 React.useEffect(function(){if(!s||!ref.current||seen.current[s.id]||typeof IntersectionObserver==='undefined'||/^pink-beach-burn-2026$/.test(s.id))return;
  var io=new IntersectionObserver(function(en){if(en[0].isIntersecting&&!seen.current[s.id]){seen.current[s.id]=1;promoTrack(s.id,'impression');}},{threshold:.5});io.observe(ref.current);return function(){io.disconnect();};},[s&&s.id]);
 React.useEffect(function(){if(!box)return;function k(e){if(e.key==='Escape')setBox(null);}var o=document.body.style.overflow;document.body.style.overflow='hidden';window.addEventListener('keydown',k);return function(){document.body.style.overflow=o;window.removeEventListener('keydown',k);};},[box]);
 if(!s)return null;
 var w=promoWhen(s),maps=s.mapsUrl||(s.location?'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(s.location):'');
 var hasCta=s.ctaLabel&&s.ctaUrl;
 function clk(){promoTrack(s.id,'click');}
 return h('section',{className:'vf26-section tight vf26-promo-sec',id:'whats-on'},h('div',{className:'vf26-wrap'},
  h('div',{ref:ref,className:'vf26-promo','aria-roledescription':'carousel','aria-label':"What's on at VFitness",style:{'--promo':s.accent||'#4296f0'},
    onMouseEnter:function(){setPaused(true);},onMouseLeave:function(){setPaused(false);},onFocus:function(){setPaused(true);},onBlur:function(){setPaused(false);},
    onPointerDown:function(e){drag.current={x:e.clientX,y:e.clientY};},onPointerUp:function(e){var d=drag.current;drag.current=null;if(!d||n<2)return;var dx=e.clientX-d.x,dy=e.clientY-d.y;if(Math.abs(dx)>50&&Math.abs(dx)>Math.abs(dy)*1.4)setI(function(v){return v+(dx<0?1:-1);});}},
   s.imageUrl?h('div',{className:'vf26-promo-blur','aria-hidden':'true',style:{backgroundImage:'url("'+s.imageUrl+'")'}}):null,
   h('div',{className:'vf26-promo-body',key:s.id},
    s.imageUrl?h('button',{type:'button',className:'vf26-promo-poster',onClick:function(){setBox(s);},'aria-label':'View the full '+s.title+' flyer'},
     h('img',{src:s.imageUrl,alt:s.imageAlt||s.title,loading:'lazy',decoding:'async'}),h('span',null,icon('expand',14))):null,
    h('div',{className:'vf26-promo-copy'},
     h('div',{className:'vf26-promo-top'},s.eyebrow?h('span',{className:'eb'},s.eyebrow):null,w?h('span',{className:'when'},w):null),
     h('h2',null,s.title),
     s.body?h('p',{className:'bd'},s.body):null,
     (s.eventStart||s.location)?h('ul',{className:'facts'},
      s.eventStart?h('li',null,icon('timer',16),h('span',null,h('b',null,promoFmt(s.eventStart,{weekday:'short',month:'short',day:'numeric'})),' · '+promoFmt(s.eventStart,{hour:'numeric',minute:'2-digit'}))):null,
      s.location?h('li',null,icon('pin',16),h('span',null,s.location)):null):null,
     s.highlights&&s.highlights.length?h('div',{className:'chips'},s.highlights.map(function(x){return h('span',{key:x},x);})):null,
     h('div',{className:'acts'},
      hasCta?h('a',{href:s.ctaUrl,target:'_blank',rel:'noopener noreferrer',className:'vf26-promo-btn solid',onClick:clk},s.ctaLabel,icon('arrow',15)):null,
      s.eventStart&&w?h('button',{type:'button',className:'vf26-promo-btn '+(hasCta?'ghost':'solid'),onClick:function(){clk();promoIcs(s);}},icon('cal',15),'Add to calendar'):null,
      maps?h('a',{href:maps,target:'_blank',rel:'noopener noreferrer',className:'vf26-promo-btn ghost',onClick:clk},icon('pin',15),'Directions'):null))),
   n>1?h('div',{className:'vf26-promo-nav'},
    h('div',{className:'dots',role:'tablist'},slides.map(function(x,k){return h('button',{key:x.id,type:'button',role:'tab','aria-selected':k===idx,'aria-label':'Slide '+(k+1)+': '+x.title,onClick:function(){setI(k);}},h('i',{className:k===idx?'on':''}));})),
    h('div',{className:'arr'},h('button',{type:'button','aria-label':'Previous',onClick:function(){setI(function(v){return v-1;});}},icon('left',16)),h('button',{type:'button','aria-label':'Next',onClick:function(){setI(function(v){return v+1;});}},icon('right',16)))):null),
  box?h('div',{className:'vf26-promo-box',role:'dialog','aria-modal':'true','aria-label':box.title,onClick:function(){setBox(null);}},
   h('img',{src:box.imageUrl,alt:box.imageAlt||box.title,onClick:function(e){e.stopPropagation();}}),
   h('button',{type:'button','aria-label':'Close',onClick:function(){setBox(null);}},icon('close',20))):null));
}

/* ================= COACH SCENE v2 (homepage) =================
   Original 2.5D vector scene: a VFITNESS coach watching a client walk on a treadmill.
   Characters are rigged from shaped, shaded segments (tapered limbs with muscle contours, hands, sneakers,
   profile faces). The client's feet follow a real walking cycle solved with two-bone IK: heel contact,
   weight transfer, push-off over the toe and swing recovery, with the stance foot moving at belt speed so
   nothing slides. Light comes from the upper left for every object. 12 second loop: brisk walk throughout,
   coach breathes and shifts weight, gives a small coaching gesture, later a nod.
   Static pose = the still illustration (also used for reduced motion). Editable source: docs/coach-scene/. */
var CS_VB='40 60 600 330';
function csSeg(id,len,wt,wb,fill,o){o=o||{};var bf=o.bf||0,bb=o.bb||0,r1=wt/2,r2=wb/2;
 var d='M'+(-r1)+' 0 C'+(-r1-bb)+' '+(len*.38)+' '+(-r2-bb*.5)+' '+(len*.72)+' '+(-r2)+' '+len+
  ' A'+r2+' '+r2+' 0 0 0 '+r2+' '+len+' C'+(r2+bf*.5)+' '+(len*.72)+' '+(r1+bf)+' '+(len*.38)+' '+r1+' 0 A'+r1+' '+(r1*.85)+' 0 0 0 '+(-r1)+' 0Z';
 return '<g id="'+id+'"><path d="'+d+'" fill="'+fill+'"/>'+(o.extra||'')+(o.child||'')+'</g>';}
function csDefs(){
 var g=function(id,a,b,rev){return '<linearGradient id="'+id+'" x1="'+(rev?1:0)+'" y1="0" x2="'+(rev?0:1)+'" y2="0"><stop offset="0" stop-color="'+a+'"/><stop offset=".55" stop-color="'+b+'"/><stop offset="1" stop-color="'+b+'" stop-opacity=".92"/></linearGradient>';};
 var pal={
  clSkin:['#ae7650','#83553a'],clSkinF:['#8d5d3f','#69412a'],clTop:['#e9edf2','#b9c2cc'],clTopF:['#c9d0d8','#9aa5b1'],clLeg:['#3a404a','#22262d'],clLegF:['#2c3139','#1a1d22'],
  coSkin:['#73492f','#4f311f'],coSkinF:['#5f3b26','#402717'],coTop:['#4a525d','#262a31'],coTopF:['#363c45','#1c1f24'],coLeg:['#3a4048','#15181c'],coLegF:['#2a2f36','#0f1114'],
  tm:['#6b737e','#3b4149']};
 var s='<defs>';Object.keys(pal).forEach(function(k){var rev=/^co/.test(k);s+=g('cs-'+k,pal[k][0],pal[k][1],rev);});
 s+='<radialGradient id="cs-shadow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
 s+='<linearGradient id="cs-screen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8EC9FF"/><stop offset="1" stop-color="#2f74c6"/></linearGradient>';
 s+='<linearGradient id="cs-deck" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5d646e"/><stop offset="1" stop-color="#30353c"/></linearGradient>';
 return s+'</defs>';}
function csShoe(id,upper,upperD,sole,accent){
 return '<g id="'+id+'">'+
  '<path d="M-8 0 C-9 -6 -5 -9 0 -8 L7 -7 C11 -5 15 -2 20 -1 C25 0 27 3 26 6 L26 9 L-8 9 C-10 7 -10 3 -8 0Z" fill="'+upper+'"/>'+
  '<path d="M-8 4 C-4 5 6 5 26 6 L26 9 L-8 9Z" fill="'+upperD+'" opacity=".55"/>'+
  '<path d="M3 -6 L10 -3.5 M5.5 -7 L12 -3" stroke="'+accent+'" stroke-width="1.3" stroke-linecap="round" opacity=".9"/>'+
  '<path d="M-9 8 L27 8 C28 8 28.5 10.5 27 11.5 L-8 11.5 C-10 11.5 -10.5 8 -9 8Z" fill="'+sole+'"/>'+
  '</g>';}
function csHand(skin,shade,thumbId){
 return '<g transform="translate(0,1)"><path d="M-4.6 0 C-5.4 4 -5 9 -1.5 11.5 C1.5 13 5 11 5.2 7 C5.5 3.5 4.8 1 4 0Z" fill="'+skin+'"/>'+
  '<path d="M1 9.5 C2.5 10 4 9 4.6 7" stroke="'+shade+'" stroke-width="1" fill="none" stroke-linecap="round" opacity=".7"/>'+
  '<path d="M3.6 1.5 C6.5 2.5 7.4 5 6.4 7 C5.6 7.8 4.6 7 4.4 6" fill="'+skin+'"/>'+
  (thumbId?'<path id="'+thumbId+'" d="M3 2 C4.6 -3 6.4 -6.5 7.8 -6.2 C9 -5.8 8 -2 6 2.5Z" fill="'+skin+'" opacity="0"/>':'')+'</g>';}
function csPerson(pre,o){
 var G=function(k){return 'url(#cs-'+o.k+k+')';};
 var leg=function(s){var n=s==='n',sfx=n?'':'F';
  return csSeg(pre+'-th'+s,o.L1,o.thW,o.knW,G('Leg'+sfx),{bf:o.quad,bb:o.ham,
    extra:(o.legStripe&&n?'<path d="M'+(-o.thW/2+2)+' 4 L'+(-o.knW/2+1.5)+' '+(o.L1-4)+'" stroke="#4296f0" stroke-width="2.2" stroke-linecap="round" opacity=".9"/>':''),
    child:'<g id="'+pre+'-kn'+s+'" transform="translate(0,'+o.L1+')">'+
     csSeg(pre+'-sn'+s,o.L2,o.knW-1,o.ankW,G('Leg'+sfx),{bb:o.calf,bf:.5,
      extra:(o.cuff?'<rect x="'+(-o.ankW/2-1.5)+'" y="'+(o.L2-7)+'" width="'+(o.ankW+3)+'" height="6" rx="3" fill="'+(n?'#0c0e10':'#08090a')+'"/>':'')+
       '<path d="M'+(o.knW/2-3)+' 2 C'+(o.knW/2-1)+' 6 '+(o.knW/2-1.5)+' 9 '+(o.knW/2-3.5)+' 12" stroke="#000" stroke-opacity=".18" stroke-width="1.2" fill="none"/>'})+
     '<g transform="translate(0,'+o.L2+')"><g id="'+pre+'-ft'+s+'">'+(o.sock?'<rect x="-4.5" y="-6" width="9" height="7" rx="3" fill="'+(n?o.sock:o.sockD)+'"/>':'')+
      csShoe(pre+'-shoe'+s,n?o.shoe:o.shoeD,n?o.shoeD:'#000',n?o.sole:o.soleD,o.shoeAcc)+'</g></g>'+
    '</g>'});};
 var arm=function(s){var n=s==='n',sfx=n?'':'F';
  return csSeg(pre+'-sh'+s,o.A1,o.shW,o.elW,G('Skin'+sfx),{bf:o.bicep,bb:o.tri,
    extra:'<path d="M'+(-o.shW/2-1.5)+' -3 C'+(-o.shW/2-2.5)+' '+(o.sleeve*.6)+' '+(-o.shW/2)+' '+o.sleeve+' '+(-o.shW/2+.5)+' '+o.sleeve+' L'+(o.shW/2+1)+' '+(o.sleeve-1)+' C'+(o.shW/2+2.5)+' '+(o.sleeve*.5)+' '+(o.shW/2+1.5)+' -2 '+(o.shW/2)+' -4Z" fill="'+G('Top'+sfx)+'"/>'+
     (o.sleeveBand&&n?'<path d="M'+(-o.shW/2)+' '+(o.sleeve-2.5)+' L'+(o.shW/2+1)+' '+(o.sleeve-3.5)+'" stroke="#4296f0" stroke-width="2" stroke-linecap="round"/>':''),
    child:'<g id="'+pre+'-el'+s+'" transform="translate(0,'+o.A1+')">'+csSeg(pre+'-fa'+s,o.A2,o.elW-.5,o.wrW,G('Skin'+sfx),{bf:o.fore,bb:.6,
      child:(o.watch&&n?'<rect x="'+(-o.wrW/2-1.2)+'" y="'+(o.A2-5)+'" width="'+(o.wrW+2.4)+'" height="4.5" rx="1.5" fill="#0b0c0e"/>':'')+
       '<g transform="translate(0,'+o.A2+')">'+csHand(n?o.skin:o.skinD,o.skinS,n&&o.thumb?pre+'-thumb':null)+(n?(o.prop||''):(o.propF||''))+'</g>'})+'</g>'});};
 var torso='<path d="'+o.torso+'" fill="'+G('Top')+'"/>'+(o.torsoExtra||'');
 var head='<g id="'+pre+'-hd" transform="translate('+o.neckX+','+(-o.T)+')">'+
  '<path d="M-5 4 L-5 -8 C-2 -10 3 -10 5.5 -8 L5.5 4Z" fill="'+o.skinS+'"/>'+
  '<g transform="translate(0,-9)">'+
   '<ellipse cx="0" cy="-15" rx="14" ry="15.5" fill="'+o.skin+'"/>'+
   '<path d="M8 -27 C12 -24 14.2 -20 14.4 -16.5 C14.6 -15 14.2 -14 14.6 -12.5 C16 -10 18.4 -8.4 18 -6.8 C17.6 -5.8 16 -5.8 15.2 -5.4 C15.6 -4.4 15.6 -3.6 15 -3 C15.6 -2.2 15.4 -1.2 14.6 -.4 C14.6 1.5 13.6 3.2 11.5 4.2 C8 5.6 4 5 1 2 L-2 -6Z" fill="'+o.skin+'"/>'+
   '<path d="M-2 -6 C0 -1 3 3 7 4.6 C4 5.4 1 4.6 -1 2Z" fill="'+o.skinS+'" opacity=".5"/>'+
   '<ellipse cx="-1.5" cy="-12" rx="3.2" ry="4.6" fill="'+o.skinD+'"/><path d="M-1 -15 C-2.6 -13.5 -2.6 -10.5 -1 -9" stroke="'+o.skinS+'" stroke-width="1" fill="none"/>'+
   '<path d="M9.2 -13.4 C10.4 -14.6 12.2 -14.6 13.4 -13.6 C12.2 -12.4 10.4 -12.3 9.2 -13.4Z" fill="#f4efe9"/><circle cx="12" cy="-13.5" r="1.25" fill="#1b130f"/>'+
   '<path d="M8.6 -15.2 C10.4 -16 12.4 -15.9 13.8 -14.9" stroke="'+o.lid+'" stroke-width=".9" fill="none" stroke-linecap="round"/>'+
   '<path d="M8 -18 C10 -19.2 12.6 -19.2 14.2 -18" stroke="'+o.brow+'" stroke-width="1.9" fill="none" stroke-linecap="round"/>'+
   '<path d="M17.2 -6.4 C16.4 -6 15.8 -6.3 15.6 -7" stroke="'+o.skinS+'" stroke-width=".9" fill="none" stroke-linecap="round"/>'+
   '<path d="'+o.mouth+'" stroke="'+o.lip+'" stroke-width="1.2" fill="none" stroke-linecap="round"/>'+
   o.hair+(o.beard||'')+'</g></g>';
 var tb=function(id,inner){return '<g id="'+pre+'-'+id+'" transform="translate(0,0)">'+inner+'</g>';};
 return '<g id="'+pre+'"><g id="'+pre+'-hip">'+
  '<g transform="translate(0,'+(-o.shY)+')">'+'</g>'+
  leg('f')+
  tb('tb','<g transform="translate('+o.shX+','+(-o.shY)+')">'+arm('f')+'</g>'+torso+head)+
  '<path d="'+o.pelvis+'" fill="'+G('Leg')+'"/>'+
  leg('n')+
  tb('tf','<g transform="translate('+o.shX+','+(-o.shY)+')">'+arm('n')+'</g>'+(o.torsoFront||''))+
 '</g></g>';}
function coachSceneSVG(){
 var client=csPerson('cl',{k:'cl',L1:49,L2:47,thW:22,knW:14,ankW:8.5,quad:2.5,ham:2,calf:3.2,A1:31,A2:28,shW:12.5,elW:9.2,wrW:6.6,bicep:1.2,tri:1,fore:1,sleeve:11,
  T:66,shX:1,shY:58,neckX:3,legStripe:1,sleeveBand:0,
  skin:'#9a6644',skinD:'#7d5136',skinS:'#5e3a25',lid:'#3b2418',brow:'#2a1a12',lip:'#6b3a2c',
  shoe:'#f3f4f6',shoeD:'#c9ced6',sole:'#4296f0',soleD:'#2f6fb8',shoeAcc:'#4296f0',sock:'#ffffff',sockD:'#d9dde3',
  torso:'M-11 2 C-14 -12 -13.5 -28 -12 -40 C-11 -50 -10 -58 -6 -63 C-1 -67 6 -66 9 -61 C12 -56 13.5 -49 12.5 -43 C11.5 -38 9.5 -33 9 -26 C8.6 -18 10.5 -8 11 2Z',
  torsoExtra:'<path d="M-11 2 C-11.5 -3 -11.8 -6 -11.6 -9 L10 -9 C10.1 -6 10.6 -2 11 2Z" fill="url(#cs-clLeg)"/>'+
   '<path d="M9.5 -42 C7 -37 5.5 -33 4.8 -27" stroke="#8b96a3" stroke-width="1" fill="none" opacity=".7"/><path d="M-9 -20 C-4 -18 2 -18 8 -20" stroke="#8b96a3" stroke-width=".9" fill="none" opacity=".55"/>'+
   '<path d="M-12.2 -38 C-11.6 -46 -10.5 -55 -7 -61" stroke="#4296f0" stroke-width="2.4" fill="none" stroke-linecap="round"/>',
  pelvis:'M-12 -10 C-15 -4 -14 4 -9 8 C-3 11 5 10 9.5 6 C12.5 2 12 -6 10 -10Z',
  mouth:'M13.4 -2.6 C14.2 -2 14.9 -2.2 15.3 -2.8',
  hair:'<path d="M-13 -9 C-16 -18 -12 -29 -2 -31.5 C6 -33 12 -29.5 13.6 -23 C11 -24.6 8 -25 5 -24 C2 -22.5 0 -20 -1.5 -17 C-4 -19 -7 -17 -8 -14 C-9 -12 -10 -10 -13 -9Z" fill="#1d1310"/>'+
   '<circle cx="-11" cy="-26" r="7.5" fill="#1d1310"/><path d="M-14 -28 C-12 -31 -8 -31 -6.5 -28.5" stroke="#3a2a22" stroke-width="1" fill="none"/>'+
   '<path d="M-1 -29 C4 -30 9 -28 11 -25" stroke="#3a2a22" stroke-width=".9" fill="none" opacity=".8"/>'});
 var coach=csPerson('co',{k:'co',L1:53,L2:50,thW:28,knW:17,ankW:10.5,quad:3.4,ham:2.5,calf:3.6,A1:32,A2:29,shW:17.5,elW:12,wrW:8,bicep:3.4,tri:2.8,fore:2.2,sleeve:14,
  T:72,shX:0,shY:62,neckX:3,cuff:1,sleeveBand:1,watch:1,thumb:1,
  skin:'#6b4430',skinD:'#563521',skinS:'#3d2517',lid:'#24140c',brow:'#120c09',lip:'#3e2117',
  shoe:'#eef1f4',shoeD:'#c3c9d1',sole:'#1c1f24',soleD:'#111317',shoeAcc:'#4296f0',
  torso:'M-15 2 C-18 -14 -21 -30 -21 -45 C-20.5 -56 -16 -64 -8 -68.5 C0 -72 12 -70 17 -63.5 C20.5 -58 21 -49 19 -41 C17 -35 13 -30 12 -22 C11.5 -14 13 -6 13.5 2Z',
  torsoExtra:'<path d="M14.5 -44 C11 -40 8 -38 4 -37" stroke="#15181c" stroke-width="1.2" fill="none" opacity=".6"/>'+
   '<path d="M0 -55 L5 -46 L10 -55" stroke="#4296f0" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'+
   '<path d="M-12 -20 C-5 -17 3 -17 11 -20" stroke="#15181c" stroke-width="1" fill="none" opacity=".5"/>',
  pelvis:'M-15 -10 C-18 -3 -17 5 -11 9 C-4 12 6 11 11 7 C14.5 2 14 -6 12 -10Z',
  mouth:'M13 -2.4 C14 -2.6 14.8 -2.6 15.4 -2.4',
  hair:'<path d="M-12.5 -8 C-15.5 -16 -13 -27.5 -3 -30.6 C4 -32.4 10.5 -30 13.2 -24.5 L9.6 -24 C8.4 -22 8.6 -20.6 9.4 -19.4 L7 -19.6 C5 -19.4 3.4 -18 2.4 -16.6 L1.6 -17.4 C-1.8 -18 -4.6 -16 -5.4 -13.4 C-6 -11.4 -8.6 -9 -12.5 -8Z" fill="#0d0907"/>'+
   '<path d="M-10 -22 C-6 -27 2 -29.5 9 -27" stroke="#2a201b" stroke-width="1" stroke-dasharray="1.2 1.8" fill="none" opacity=".8"/>',
  beard:'<path d="M-1.4 -8.6 C-1 -3 2 2.6 7 5 C10.6 6.4 14 4.8 14.8 .6 C15 -1 14.6 -1.6 14 -1.8 C13 -.8 11.4 -.8 10 -1.6 C8.8 -3.6 7 -4.2 5.2 -4 C3.4 -4.4 1.8 -6 1.4 -8.6Z" fill="#0d0907"/>'+
   '<path d="M11.2 -5.2 C12.6 -6 14.4 -5.8 15.6 -4.6 C14.4 -4.1 12.6 -4.2 11.2 -5.2Z" fill="#0d0907"/>'});
 var tm='<g id="tm">'+
  '<ellipse cx="268" cy="353" rx="205" ry="11" fill="url(#cs-shadow)"/>'+
  '<path d="M444 336 L462 204" stroke="url(#cs-tm)" stroke-width="13" stroke-linecap="round"/>'+
  '<path d="M440 248 L352 252" stroke="#7b838e" stroke-width="7" stroke-linecap="round"/><path d="M440 246 L352 250" stroke="#a3abb5" stroke-width="2" stroke-linecap="round" opacity=".6"/>'+
  '<g transform="rotate(-14 466 196)"><rect x="430" y="182" width="78" height="28" rx="9" fill="#353b43"/><rect x="430" y="182" width="78" height="9" rx="5" fill="#4a515a"/>'+
   '<rect x="440" y="188" width="44" height="14" rx="3.5" fill="url(#cs-screen)"/><path d="M445 198 L452 194 L458 197 L466 191 L474 193" stroke="#e8f4ff" stroke-width="1.4" fill="none" stroke-linecap="round" opacity=".9"/>'+
   '<circle cx="494" cy="195" r="3.5" fill="#8EC9FF"/></g>'+
  '<path d="M82 336 C82 328 88 324 96 324 L448 324 C458 324 466 330 466 340 L466 344 C466 349 462 352 456 352 L92 352 C86 352 82 348 82 342Z" fill="url(#cs-deck)"/>'+
  '<path d="M418 324 L458 324 C464 326 466 332 466 338 L418 338Z" fill="#4a515a"/>'+
  '<rect x="94" y="318" width="330" height="8" rx="4" fill="#15181c"/>'+
  '<line id="tm-belt" x1="98" y1="320" x2="420" y2="320" stroke="#2f353d" stroke-width="2.2" stroke-dasharray="3 9"/>'+
  '<path d="M92 342 L460 342" stroke="#000" stroke-opacity=".25" stroke-width="1.5"/>'+
  '<rect x="98" y="350" width="22" height="9" rx="3" fill="#2a2f36"/><rect x="432" y="350" width="22" height="9" rx="3" fill="#2a2f36"/>'+
  '<ellipse id="cl-fsn" cx="0" cy="318.5" rx="15" ry="2.6" fill="#000" opacity=".3"/><ellipse id="cl-fsf" cx="0" cy="318.5" rx="15" ry="2.6" fill="#000" opacity=".3"/>'+
 '</g>';
 return '<svg viewBox="'+CS_VB+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+csDefs()+tm+
  '<ellipse cx="552" cy="377" rx="38" ry="5.5" fill="url(#cs-shadow)"/>'+
  '<g id="cl-root" transform="translate(272,221)">'+client+'</g>'+
  '<g transform="translate(556,264) scale(-1,1)">'+coach+'</g>'+
 '</svg>';}
function csSmooth(a,b,t){var x=Math.max(0,Math.min(1,(t-a)/(b-a)));return x*x*(3-2*x);}
function csLerp(a,b,k){return a+(b-a)*k;}
function csEase(x){return x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;}
var CS_GAIT={T:1.12,stance:.62,S:58,ank:91.5,toe:17,lift:14};
/* ankle position (relative to the hip) and foot angle for gait phase u in [0,1) */
function csFoot(u){var G=CS_GAIT,st=G.stance,half=G.S/2,a=0,x,y;
 if(u<st){var toeX=half+G.toe-G.S*(u/st);
  if(u<.1)a=csLerp(-12,0,csEase(u/.1));else if(u>.42)a=csLerp(0,30,csEase((u-.42)/(st-.42)));
  var r=a*Math.PI/180;
  if(u<.1){x=half-G.S*(u/st);y=G.ank;}
  else{x=toeX-G.toe*Math.cos(r);y=G.ank-G.toe*Math.sin(r);}
 }else{var s=(u-st)/(1-st),r0=30*Math.PI/180,x0=-half+G.toe-G.toe*Math.cos(r0)-G.S*0, y0=G.ank-G.toe*Math.sin(r0);
  x0=(half+G.toe-G.S)-G.toe*Math.cos(r0);
  x=csLerp(x0,half,csEase(s));y=csLerp(y0,G.ank,s)-G.lift*Math.sin(Math.PI*Math.min(1,s*1.08));a=csLerp(30,-12,csEase(s));}
 return {x:x,y:y,a:a};}
function csIK(x,y,L1,L2){var d=Math.min(Math.hypot(x,y),L1+L2-.2),base=Math.atan2(x,y);
 var al=Math.acos(Math.max(-1,Math.min(1,(L1*L1+d*d-L2*L2)/(2*L1*d)))),be=Math.acos(Math.max(-1,Math.min(1,(L2*L2+d*d-L1*L1)/(2*L2*d))));
 var th=-(base+al)*180/Math.PI,kn=(al+be)*180/Math.PI;return {th:th,kn:kn};}
function makeCoachScene(root){
 var q=function(id){return root.querySelector('#'+id);};var E={};
 ['cl-hip','cl-tb','cl-tf','cl-hd','co-hip','co-tb','co-tf','co-hd','co-thumb','tm-belt','cl-fsn','cl-fsf'].forEach(function(k){E[k]=q(k);});
 ['th','kn','ft','sh','el'].forEach(function(p){['n','f'].forEach(function(s){E['cl-'+p+s]=q('cl-'+p+s);E['co-'+p+s]=q('co-'+p+s);});});
 var LOOP=12,belt=0,pointUntil=0,G=CS_GAIT,v=G.S/(G.stance*G.T);
 function rot(el,a,x,y){if(el)el.setAttribute('transform',(x!=null?'translate('+x.toFixed(2)+','+y.toFixed(2)+') ':'')+'rotate('+a.toFixed(2)+')');}
 function pose(t,now){
  var u=(t/G.T)%1,bob=1.6*(1+Math.cos(4*Math.PI*(u-.31)))/2,breath=Math.sin(t*2*Math.PI/3.6);
  E['cl-hip'].setAttribute('transform','translate(0,'+(-bob).toFixed(2)+')');
  ['n','f'].forEach(function(s){var uu=s==='n'?u:(u+.5)%1,f=csFoot(uu),ik=csIK(f.x,f.y+bob,49,47);
   rot(E['cl-th'+s],ik.th);rot(E['cl-kn'+s],ik.kn,0,49);rot(E['cl-ft'+s],f.a-(ik.th+ik.kn));
   var sw=Math.cos(2*Math.PI*uu),sh=16*sw+2,el=-(16+12*Math.max(0,-Math.cos(2*Math.PI*uu-0.5)));
   /* near arm swings with the far leg */
   var o=s==='n'?'f':'n';rot(E['cl-sh'+o],sh);rot(E['cl-el'+o],el,0,31);
   var sx=272+f.x+6,lift=G.ank-f.y;var fs=E['cl-fs'+s];if(fs){fs.setAttribute('cx',sx.toFixed(1));fs.setAttribute('opacity',(0.32*Math.max(0,1-lift/10)).toFixed(2));fs.setAttribute('rx',(15-lift*.4).toFixed(1));}});
  var lean=3+breath*.4,tw=Math.sin(4*Math.PI*u)*.6;
  rot(E['cl-tb'],lean+tw);rot(E['cl-tf'],lean+tw);rot(E['cl-hd'],-lean*.6-bob*.6+breath*.5,3,-66);
  /* coach */
  var shift=Math.sin(t*2*Math.PI/6),g=csSmooth(2.6,3.1,t)*(1-csSmooth(4.4,5,t)),nod=csSmooth(8.4,8.7,t)*(1-csSmooth(9.6,10,t));
  var pt=now&&now<pointUntil?1:0;g=Math.max(g,pt);
  rot(E['co-thn'],-3+shift*1.2);rot(E['co-knn'],4,0,53);rot(E['co-ftn'],-1-shift*1.2);
  rot(E['co-thf'],6-shift*1.2);rot(E['co-knf'],3,0,53);rot(E['co-ftf'],-9+shift*1.2);
  E['co-hip'].setAttribute('transform','translate('+(shift*.8).toFixed(2)+','+(Math.abs(shift)*.4).toFixed(2)+')');
  var tb=-2+breath*.5;rot(E['co-tb'],tb);rot(E['co-tf'],tb);
  rot(E['co-shf'],24+breath*.5);rot(E['co-elf'],-104,0,32);
  var sh=csLerp(csLerp(8,-14,nod),-52,g),el=csLerp(csLerp(-14,-112,nod),-64,g);
  rot(E['co-shn'],sh+breath*.6);rot(E['co-eln'],el,0,32);
  if(E['co-thumb'])E['co-thumb'].setAttribute('opacity',nod>.55?'1':'0');
  var nodA=nod>0?Math.sin(Math.min(1,Math.max(0,(t-8.6)/1))*Math.PI*2)*7*nod:0;
  rot(E['co-hd'],-3+nodA+breath*.4,3,-72);
  E['tm-belt'].setAttribute('stroke-dashoffset',(belt%12).toFixed(2));
 }
 var raf=0,last=0,clock=0,running=false;
 function step(now){if(!running)return;var dt=Math.min(.05,(now-last)/1000||0);last=now;clock+=dt;belt+=v*dt;pose(clock%LOOP,now);raf=requestAnimationFrame(step);}
 pose(0.18,0);
 return {play:function(){if(running)return;running=true;last=performance.now();raf=requestAnimationFrame(step);},
  pause:function(){running=false;cancelAnimationFrame(raf);},
  point:function(){pointUntil=performance.now()+1500;if(!running)pose(clock%LOOP,performance.now());},
  seek:function(t){clock=t;belt=v*t;pose(t%LOOP,0);},
  get running(){return running;}};}
/* ================= CINEMATIC LOOPS (rendered video assets) =================
   Drop-in slots for professionally rendered animation. Fill an entry when the animator delivers files to
   /vf26/cinematic/ (see docs/CINEMATIC_ASSETS.md); empty slots change nothing on the site.
   coach    replaces the drawn coach scene on the homepage
   strength adds a second scene card after it */
var VF_CINEMATIC={
 semi:null,      /* semi-private card: {full,poster,alt,chapters:[{key,label,caption,start,src,poster}]} (docs/CINEMATIC_ASSETS.md) */
 coach:null,     /* {tile:'/vf26/cinematic/coach-tile.mp4',full:'/vf26/cinematic/coach-full.mp4',poster:'/vf26/cinematic/coach-poster.webp',alt:'...'} */
 strength:null
};
window.VF_CINEMATIC=VF_CINEMATIC;
function CinematicLoop(p){
 var a=p.asset,ref=React.useRef(null),vis=React.useRef(false),userPaused=React.useRef(false);
 var ps=React.useState(false),paused=ps[0],setPaused=ps[1];var os=React.useState(false),open=os[0],setOpen=os[1];
 var ls=React.useState(false),loaded=ls[0],setLoaded=ls[1];
 function sync(){var v=ref.current;if(!v||reduceMotion)return;
  if(vis.current&&!loaded)setLoaded(true);
  if(vis.current&&!userPaused.current&&!document.hidden&&!open){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}else{try{v.pause();}catch(e){}}}
 React.useEffect(function(){var v=ref.current;if(!v)return;var io=null;
  if(typeof IntersectionObserver!=='undefined'){io=new IntersectionObserver(function(en){vis.current=en[0].isIntersecting;sync();},{threshold:.25});io.observe(v);}else{vis.current=true;sync();}
  document.addEventListener('visibilitychange',sync);return function(){io&&io.disconnect();document.removeEventListener('visibilitychange',sync);};},[]);
 React.useEffect(sync,[loaded,open]);
 function toggle(){userPaused.current=!userPaused.current;setPaused(userPaused.current);sync();}
 var dref=React.useRef(null);
 return h('figure',{className:'vfh-cine'},
  reduceMotion?h('img',{src:a.poster,alt:a.alt||'',width:a.w||1280,height:a.h||720,className:'vfh-cine-media'}):
  h('video',{ref:ref,className:'vfh-cine-media',poster:a.poster,src:loaded?a.tile:undefined,muted:true,loop:true,playsInline:true,preload:'none',width:a.w||1280,height:a.h||720,'aria-label':a.alt||undefined,onLoadedData:sync}),
  reduceMotion?null:h('button',{type:'button',className:'vfh-scene-pause',onClick:toggle,'aria-pressed':paused?'true':'false','aria-label':paused?'Play the animation':'Pause the animation'},h('span',{'aria-hidden':'true'},paused?'▶':'❚❚')),
  a.full?h('button',{type:'button',className:'vfh-cine-expand',onClick:function(){setOpen(true);},'aria-haspopup':'dialog'},icon('expand',15),'Watch full size'):null,
  open?h(CineDialog,{asset:a,onClose:function(){setOpen(false);}}):null);
}
/* Chaptered rendered video (semi-private card). The full loop plays muted while visible; captions follow the
   chapter start times. Chapter buttons switch to that chapter's own clip; Full sequence returns to the loop.
   Captions are page text below the video, never on top of it. */
function CinematicChapters(p){
 var a=p.asset,ch=a.chapters||[],ref=React.useRef(null),vis=React.useRef(false),userPaused=React.useRef(false);
 var cs=React.useState(-1),pick=cs[0],setPick=cs[1];var ls=React.useState(0),live=ls[0],setLive=ls[1];var ps=React.useState(false),paused=ps[0],setPaused=ps[1];
 var ld=React.useState(false),loaded=ld[0],setLoaded=ld[1];
 var src=pick>=0&&ch[pick].src?ch[pick].src:a.full,poster=pick>=0&&ch[pick].poster?ch[pick].poster:a.poster;
 function sync(){var v=ref.current;if(!v||reduceMotion)return;if(vis.current&&!loaded)setLoaded(true);
  if(vis.current&&!userPaused.current&&!document.hidden){var pr=v.play();if(pr&&pr.catch)pr.catch(function(){});}else{try{v.pause();}catch(e){}}}
 React.useEffect(function(){var v=ref.current;if(!v)return;var io=null;
  if(typeof IntersectionObserver!=='undefined'){io=new IntersectionObserver(function(en){vis.current=en[0].isIntersecting;sync();},{threshold:.3});io.observe(v);}else{vis.current=true;sync();}
  document.addEventListener('visibilitychange',sync);return function(){io&&io.disconnect();document.removeEventListener('visibilitychange',sync);};},[]);
 React.useEffect(sync,[loaded,src]);
 function onTime(){if(pick>=0)return;var v=ref.current;if(!v)return;var t=v.currentTime,k=-1;ch.forEach(function(c,i){if(c.start!=null&&t>=c.start)k=i;});setLive(k);}
 function choose(i){setPick(i);setLive(i);if(i>=0&&!ch[i].src){var v=ref.current;if(v&&ch[i].start!=null){try{v.currentTime=ch[i].start;}catch(e){}}}}
 function toggle(){userPaused.current=!userPaused.current;setPaused(userPaused.current);sync();}
 var cap=live>=0&&ch[live]?ch[live].caption:(a.caption||'One coach. Up to four clients. Individual guidance.');
 return h('div',{className:'vfh-chap'},
  h('figure',{className:'vfh-cine'},
   reduceMotion?h('img',{src:poster,alt:a.alt||'',width:1280,height:720,className:'vfh-cine-media'}):
   h('video',{ref:ref,key:src,className:'vfh-cine-media',poster:poster,src:loaded?src:undefined,muted:true,loop:true,playsInline:true,preload:'none',width:1280,height:720,'aria-label':a.alt||undefined,onTimeUpdate:onTime,onLoadedData:sync}),
   reduceMotion?null:h('button',{type:'button',className:'vfh-scene-pause',onClick:toggle,'aria-pressed':paused?'true':'false','aria-label':paused?'Play the animation':'Pause the animation'},h('span',{'aria-hidden':'true'},paused?'▶':'❚❚'))),
  h('p',{className:'vfh-chap-cap','aria-live':'polite'},cap),
  ch.length?h('div',{className:'vfh-chap-btns',role:'group','aria-label':'Watch a coaching moment'},
   [h('button',{key:'all',type:'button',className:'sg2-chip','aria-pressed':pick<0?'true':'false',onClick:function(){choose(-1);}},'Full sequence')].concat(ch.map(function(c,i){
    return h('button',{key:c.key,type:'button',className:'sg2-chip','aria-pressed':pick===i?'true':'false',onClick:function(){choose(i);}},c.label);}))):null);
}
function CineDialog(p){var ref=React.useRef(null);useDialog(true,p.onClose,ref);var a=p.asset;
 return h('div',{className:'vfh-dlg-back',onClick:function(e){if(e.target===e.currentTarget)p.onClose();}},
  h('div',{ref:ref,className:'vfh-dlg wide',role:'dialog','aria-modal':'true','aria-label':a.alt||'Animation'},
   h('button',{type:'button',className:'vfh-dlg-x',onClick:p.onClose,'aria-label':'Close'},icon('close',20)),
   h('div',{className:'vfh-dlg-media'},h('video',{src:a.full,poster:a.poster,controls:true,autoPlay:!reduceMotion,muted:true,loop:true,playsInline:true,width:a.w||1920,height:a.h||1080,style:{width:'100%',height:'auto',display:'block'}}))));
}

function CoachScene(){
 var ref=React.useRef(null),scene=React.useRef(null);
 var ps=React.useState(false),paused=ps[0],setPaused=ps[1];var userPaused=React.useRef(false),visible=React.useRef(false);
 function sync(){var s=scene.current;if(!s)return;if(!reduceMotion&&!userPaused.current&&visible.current&&!document.hidden)s.play();else s.pause();}
 React.useEffect(function(){
  var el=ref.current;if(!el)return;el.innerHTML=coachSceneSVG();scene.current=makeCoachScene(el);window.vfCoachScene=scene.current;
  var io=null;if(typeof IntersectionObserver!=='undefined'){io=new IntersectionObserver(function(en){visible.current=en[0].isIntersecting;sync();},{threshold:.2});io.observe(el);}else{visible.current=true;sync();}
  document.addEventListener('visibilitychange',sync);
  return function(){if(io)io.disconnect();document.removeEventListener('visibilitychange',sync);scene.current&&scene.current.pause();if(window.vfCoachScene===scene.current)window.vfCoachScene=null;};
 },[]);
 function toggle(){userPaused.current=!userPaused.current;setPaused(userPaused.current);sync();}
 return h('figure',{className:'vfh-scene-fig'},
  h('div',{ref:ref,className:'vfh-scene-art'}),
  reduceMotion?null:h('button',{type:'button',className:'vfh-scene-pause',onClick:toggle,'aria-pressed':paused?'true':'false','aria-label':paused?'Play the coaching animation':'Pause the coaching animation'},
   h('span',{'aria-hidden':'true'},paused?'▶':'❚❚')));
}
window.VF26CoachScene=CoachScene;

/* ================= SEMI-PRIVATE COACHING SCENE (homepage card) =================
   A miniature coaching session on one warm floor: four clients in a shallow semicircle around a VFITNESS
   coach, drawn with the same rig as the treadmill scene (csPerson). Depth comes from placement and scale on
   an elliptical floor. Stage 1: approved still (the coaching-begins moment). Animation follows approval. */
var SG2_VB='0 0 600 300';
var SG2_DUMB='<g transform="translate(0,7) rotate(90)"><rect x="-11" y="-2.2" width="22" height="4.4" rx="2" fill="#5b636e"/><rect x="-14" y="-6" width="5" height="12" rx="1.6" fill="#2b3037"/><rect x="9" y="-6" width="5" height="12" rx="1.6" fill="#2b3037"/></g>';
function sg2Defs(list){var s='<defs>';list.forEach(function(d){Object.keys(d.pal).forEach(function(k){var c=d.pal[k],rev=d.rev;
  s+='<linearGradient id="cs-'+d.k+k+'" x1="'+(rev?1:0)+'" y1="0" x2="'+(rev?0:1)+'" y2="0"><stop offset="0" stop-color="'+c[0]+'"/><stop offset=".55" stop-color="'+c[1]+'"/><stop offset="1" stop-color="'+c[1]+'" stop-opacity=".92"/></linearGradient>';});});
 s+='<radialGradient id="sg2-sh" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#000" stop-opacity=".55"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>';
 s+='<radialGradient id="sg2-floor" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="#e6dcc6"/><stop offset="1" stop-color="#e6dcc6" stop-opacity="0"/></radialGradient>';
 return s+'</defs>';}
var SG2_BODY={
 f:{L1:47,L2:45,thW:22,knW:14,ankW:8.5,quad:2.5,ham:2,calf:3,A1:30,A2:27,shW:12,elW:9,wrW:6.5,bicep:1.2,tri:1,fore:1,sleeve:11,T:64,shX:1,shY:56,neckX:3,
  torso:'M-11 2 C-14 -12 -13.5 -27 -12 -39 C-11 -49 -10 -56 -6 -61 C-1 -65 6 -64 9 -59 C12 -54 13.5 -47 12.5 -41 C11.5 -36 9.5 -32 9 -25 C8.6 -17 10.5 -8 11 2Z',
  pelvis:'M-12 -10 C-15 -4 -14 4 -9 8 C-3 11 5 10 9.5 6 C12.5 2 12 -6 10 -10Z',mouth:'M13.4 -2.6 C14.2 -2 14.9 -2.2 15.3 -2.8'},
 m:{L1:51,L2:48,thW:26,knW:16,ankW:10,quad:3,ham:2.4,calf:3.4,A1:31,A2:28,shW:15.5,elW:11,wrW:7.6,bicep:2.8,tri:2.4,fore:2,sleeve:13,T:70,shX:0,shY:60,neckX:3,
  torso:'M-14 2 C-17 -14 -20 -29 -20 -43 C-19.5 -54 -15 -62 -8 -66.5 C0 -70 11 -68 16 -61.5 C19.5 -56 20 -47 18 -40 C16 -34 12.5 -29 11.5 -21 C11 -13 12.5 -6 13 2Z',
  pelvis:'M-15 -10 C-18 -3 -17 5 -11 9 C-4 12 6 11 11 7 C14.5 2 14 -6 12 -10Z',mouth:'M13 -2.4 C14 -2.6 14.8 -2.6 15.4 -2.4'}};
var SG2_HAIR={
 bun:'<path d="M-13 -9 C-16 -18 -12 -29 -2 -31.5 C6 -33 12 -29.5 13.6 -23 C11 -24.6 8 -25 5 -24 C2 -22.5 0 -20 -1.5 -17 C-4 -19 -7 -17 -8 -14 C-9 -12 -10 -10 -13 -9Z" fill="#1d1310"/><circle cx="-11" cy="-26" r="7.5" fill="#1d1310"/>',
 long:'<path d="M-14 6 C-18 -6 -16 -24 -4 -31 C6 -34 13 -29 14 -22 C10 -24 6 -24 2 -22 C-1 -18 -3 -14 -4 -8 C-6 0 -8 6 -6 14 C-10 13 -13 10 -14 6Z" fill="#2a1a12"/>',
 puff:'<path d="M-13 -9 C-16 -18 -12 -29 -2 -31.5 C6 -33 12 -29.5 13.6 -23 C9 -25 4 -24 0 -21 C-4 -18 -8 -14 -13 -9Z" fill="#20130d"/><circle cx="-4" cy="-33" r="9" fill="#20130d"/>',
 fade:'<path d="M-12.5 -8 C-15.5 -16 -13 -27.5 -3 -30.6 C4 -32.4 10.5 -30 13.2 -24.5 L9.6 -24 C8.4 -22 8.6 -20.6 9.4 -19.4 L7 -19.6 C5 -19.4 3.4 -18 2.4 -16.6 L1.6 -17.4 C-1.8 -18 -4.6 -16 -5.4 -13.4 C-6 -11.4 -8.6 -9 -12.5 -8Z" fill="#0d0907"/>',
 locs:'<path d="M-13 -8 C-16 -18 -12 -29 -2 -31.5 C6 -33 12 -29.5 13.6 -23 C10 -24 6 -23.5 2 -21 C-2 -18 -6 -14 -13 -8Z" fill="#17100c"/><path d="M-12 -12 C-15 -2 -15 6 -13 12 M-9 -14 C-11 -4 -11 4 -9 10 M-6 -15 C-7.5 -7 -7.5 0 -6 6" stroke="#17100c" stroke-width="3.2" stroke-linecap="round" fill="none"/>'};
var SG2_BEARD='<path d="M-1.4 -8.6 C-1 -3 2 2.6 7 5 C10.6 6.4 14 4.8 14.8 .6 C15 -1 14.6 -1.6 14 -1.8 C13 -.8 11.4 -.8 10 -1.6 C8.8 -3.6 7 -4.2 5.2 -4 C3.4 -4.4 1.8 -6 1.4 -8.6Z" fill="#0d0907"/><path d="M11.2 -5.2 C12.6 -6 14.4 -5.8 15.6 -4.6 C14.4 -4.1 12.6 -4.2 11.2 -5.2Z" fill="#0d0907"/>';
function sg2Person(pre,body,look){var b=SG2_BODY[body],o={};for(var k in b)o[k]=b[k];for(var j in look)o[j]=look[j];o.k=pre;
 o.skinD=o.skinD||o.skin;return csPerson(pre,o);}
/* cast: x, floor y, scale, facing (1 right, -1 left), look */
var SG2_CAST=[
 {id:'s0',role:'Beginner',x:118,y:226,s:.8,dir:1,body:'f',pal:{Skin:['#a7704b','#7f5134'],SkinF:['#8b5b3d','#663f28'],Top:['#e9edf2','#b9c2cc'],TopF:['#c9d0d8','#9aa5b1'],Leg:['#4a5260','#2a2f37'],LegF:['#363c46','#1f232a']},
  look:{skin:'#9a6644',skinD:'#7d5136',skinS:'#5e3a25',lid:'#3b2418',brow:'#2a1a12',lip:'#6b3a2c',shoe:'#f3f4f6',shoeD:'#c9ced6',sole:'#9aa5b1',soleD:'#7d8794',shoeAcc:'#9aa5b1',hair:SG2_HAIR.puff,sock:'#fff',sockD:'#e5e7eb'},
  tip:'We adjust the exercise to your starting point.'},
 {id:'s1',role:'Building strength',x:196,y:268,s:.95,dir:1,body:'f',pal:{Skin:['#7b4c31','#5a3622'],SkinF:['#65402a','#4a2c1b'],Top:['#4296f0','#2f6fb8'],TopF:['#3a82d0','#285f9c'],Leg:['#2c3139','#191c21'],LegF:['#22262d','#121417']},
  look:{skin:'#6e4430',skinD:'#59351f',skinS:'#3f2516',lid:'#24140c',brow:'#160d09',lip:'#4a281c',shoe:'#f3f4f6',shoeD:'#c9ced6',sole:'#4296f0',soleD:'#2f6fb8',shoeAcc:'#4296f0',hair:SG2_HAIR.locs,sock:'#fff',sockD:'#e5e7eb'},
  tip:'We guide your technique and weight selection.'},
 {id:'s2',role:'Improving consistency',x:404,y:268,s:.95,dir:-1,body:'m',pal:{Skin:['#c08a64','#9a6a48'],SkinF:['#a47552','#7f5639'],Top:['#d7dbe0','#a9b2bd'],TopF:['#bcc3cc','#8f99a6'],Leg:['#3b414b','#22262d'],LegF:['#2d323a','#1a1d22']},
  look:{skin:'#b57f5a',skinD:'#946446',skinS:'#6f4a32',lid:'#3b2418',brow:'#2a1a12',lip:'#7a4232',shoe:'#2b3037',shoeD:'#1c2025',sole:'#f3f4f6',soleD:'#cfd4da',shoeAcc:'#9aa5b1',hair:SG2_HAIR.fade,prop:SG2_DUMB,propF:SG2_DUMB},
  tip:'You follow a structured session with your coach.'},
 {id:'s3',role:'Ready to progress',x:486,y:226,s:.8,dir:-1,body:'f',pal:{Skin:['#94613f','#6f4529'],SkinF:['#7c5034','#5c3a23'],Top:['#2f3540','#1c2027'],TopF:['#262b34','#15181d'],Leg:['#5a6372','#363c47'],LegF:['#474f5c','#2b3039']},
  look:{skin:'#8a5a3b',skinD:'#6f462d',skinS:'#52331f',lid:'#2c1a10',brow:'#1c110b',lip:'#5c3022',shoe:'#f3f4f6',shoeD:'#c9ced6',sole:'#4296f0',soleD:'#2f6fb8',shoeAcc:'#4296f0',hair:SG2_HAIR.long,sock:'#fff',sockD:'#e5e7eb'},
  tip:'We increase the challenge as your ability improves.'},
 {id:'sc',role:'Coach',coach:1,x:300,y:244,s:.9,dir:-1,body:'m',pal:{Skin:['#73492f','#4f311f'],SkinF:['#5f3b26','#402717'],Top:['#4a525d','#262a31'],TopF:['#363c45','#1c1f24'],Leg:['#3a4048','#15181c'],LegF:['#2a2f36','#0f1114']},
  look:{skin:'#6b4430',skinD:'#563521',skinS:'#3d2517',lid:'#24140c',brow:'#120c09',lip:'#3e2117',shoe:'#eef1f4',shoeD:'#c3c9d1',sole:'#1c1f24',soleD:'#111317',shoeAcc:'#4296f0',hair:SG2_HAIR.fade,beard:SG2_BEARD,cuff:1,sleeveBand:1,watch:1,thumb:1,
   torsoExtra:'<path d="M0 -55 L5 -46 L10 -55" stroke="#4296f0" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>'}}];
function sg2SVG(){var defs=SG2_CAST.map(function(c){return {k:c.id,pal:c.pal,rev:c.dir<0};});
 var s='<svg viewBox="'+SG2_VB+'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'+sg2Defs(defs);
 /* draw back to front by floor y */
 SG2_CAST.slice().sort(function(a,b){return a.y-b.y;}).forEach(function(c){
  s+='<ellipse class="sg2-ring" id="'+c.id+'-ring" cx="'+c.x+'" cy="'+(c.y+1)+'" rx="'+(46*c.s)+'" ry="'+(9*c.s)+'" fill="none" stroke="#4296f0" stroke-width="1.6" opacity="'+(c.coach?'.7':'0')+'"/>';
  s+='<ellipse cx="'+c.x+'" cy="'+(c.y+1)+'" rx="'+(34*c.s)+'" ry="'+(6*c.s)+'" fill="url(#sg2-sh)"/>';
  var hipY=-(SG2_BODY[c.body].L1+SG2_BODY[c.body].L2+11)+2;
  s+='<g id="'+c.id+'-root" transform="translate('+c.x+','+c.y+') scale('+(c.s*c.dir)+','+c.s+') translate(0,'+hipY+')">'+sg2Person(c.id,c.body,c.look)+'</g>';});
 s+='<g id="sg2-tag" opacity="0"><rect id="sg2-tagbg" x="0" y="0" width="10" height="24" rx="12" fill="#24282d" stroke="#4296f0" stroke-opacity=".7" stroke-width="1"/><text id="sg2-tagt" x="0" y="16" text-anchor="middle" font-size="12.5" font-weight="600" fill="#F2F1EC" font-family="Geist,system-ui,sans-serif"></text></g>';
 return s+'</svg>';}
function sg2Rot(el,a,x,y){if(el)el.setAttribute('transform',(x!=null?'translate('+x.toFixed(2)+','+y.toFixed(2)+') ':'')+'rotate('+a.toFixed(2)+')');}
/* apply a pose: angles in degrees; hip {x,y} offset; legs by ankle targets (IK) or angles */
function sg2Pose(root,c,P){var q=function(id){return root.querySelector('#'+c.id+'-'+id);},b=SG2_BODY[c.body];
 q('hip').setAttribute('transform','translate('+(P.hx||0).toFixed(2)+','+(P.hy||0).toFixed(2)+')');
 ['n','f'].forEach(function(s){var L=P['leg'+s]||{x:s==='n'?3:-3,y:b.L1+b.L2-.6};
  var ik=csIK(L.x-(P.hx||0),L.y-(P.hy||0),b.L1,b.L2);sg2Rot(q('th'+s),ik.th);sg2Rot(q('kn'+s),ik.kn,0,b.L1);sg2Rot(q('ft'+s),(L.a||0)-(ik.th+ik.kn));
  sg2Rot(q('sh'+s),P['sh'+s]!=null?P['sh'+s]:(s==='n'?4:-4));sg2Rot(q('el'+s),P['el'+s]!=null?P['el'+s]:-14,0,b.A1);});
 sg2Rot(q('tb'),P.tb||0);sg2Rot(q('tf'),P.tb||0);sg2Rot(q('hd'),P.hd||0,b.neckX,-b.T);
 var th=q('thumb');if(th)th.setAttribute('opacity',P.thumb?'1':'0');}
var SG2_REST={hy:0};
function sg2Squat(k){var b=SG2_BODY.f;return {hx:-16*k,hy:40*k,legn:{x:6,y:b.L1+b.L2-.6},legf:{x:-2,y:b.L1+b.L2-.6},tb:22*k,hd:-16*k,shn:csLerp(4,-82,k),shf:csLerp(-4,-78,k),eln:csLerp(-14,-8,k),elf:csLerp(-14,-8,k)};}
function sg2Curl(k){return {shn:-4,shf:4,eln:csLerp(-12,-128,k),elf:csLerp(-12,-128,1-k),tb:-1,hd:-2};}
function SemiGroupScene(){
 var ref=React.useRef(null);var ss=React.useState(1),sel=ss[0],setSel=ss[1];
 React.useEffect(function(){var el=ref.current;if(!el)return;el.querySelector('.sg2-art').innerHTML=sg2SVG();},[]);
 React.useEffect(function(){var el=ref.current;if(!el)return;var art=el.querySelector('.sg2-art');if(!art.firstChild)art.innerHTML=sg2SVG();
  var C=SG2_CAST;
  sg2Pose(art,C[0],{shn:20,shf:24,eln:-100,elf:-100,hd:2});            /* hands on hips */
  sg2Pose(art,C[1],sg2Squat(1));
  sg2Pose(art,C[2],sg2Curl(.35));
  sg2Pose(art,C[3],{shn:8,shf:-6,eln:-18,elf:-12,hd:-2,legn:{x:8,y:SG2_BODY.f.L1+SG2_BODY.f.L2-1},legf:{x:-6,y:SG2_BODY.f.L1+SG2_BODY.f.L2-1}});
  var gest=sel===1?{shn:-62,eln:-20,shf:26,elf:-100,hd:6,tb:4}:{shn:-58,eln:-24,shf:26,elf:-100,hd:4,tb:3};
  sg2Pose(art,C[4],gest);
  var coach=art.querySelector('#sc-root');var dirToward=SG2_CAST[sel].x<300?-1:1;
  coach.setAttribute('transform','translate(300,244) scale('+(.9*dirToward)+',.9) translate(0,'+(-(SG2_BODY.m.L1+SG2_BODY.m.L2+11)+2)+')');
  C.forEach(function(c,i){var r=art.querySelector('#'+c.id+'-ring');if(r&&!c.coach)r.setAttribute('opacity',i===sel?'.85':'0');});
  var tag=art.querySelector('#sg2-tag'),t=art.querySelector('#sg2-tagt'),bg=art.querySelector('#sg2-tagbg');
  var txt=sel===1?'Technique adjusted to you.':sel===2?'Progress at your level.':sel===0?'Starting point set for you.':'Challenge increased for you.';
  t.textContent=txt;var cs=SG2_CAST[sel],w=txt.length*6.9+26,cx=cs.x+(cs.x<300?-34:34),ty=Math.max(4,cs.y-cs.s*(SG2_BODY[cs.body].L1+SG2_BODY[cs.body].L2+cs.body.length*0+120)-(sel===1?-6:30));
  cx=Math.max(w/2+6,Math.min(600-w/2-6,cx));bg.setAttribute('x',(cx-w/2).toFixed(1));bg.setAttribute('width',w.toFixed(1));bg.setAttribute('y',ty);t.setAttribute('x',cx);t.setAttribute('y',ty+16.5);tag.setAttribute('opacity','1');
 },[sel]);
 var C=SG2_CAST.slice(0,4);
 return h('div',{ref:ref,className:'sg2'},
  h('div',{className:'sg2-art'}),
  h('p',{className:'sg2-cap'},'One coach. Up to four clients. Personal guidance.'),
  h('div',{className:'sg2-scen'},h('p',{className:'sg2-scen-h',id:'sg2-scen-h'},'Example coaching scenarios'),
   h('div',{className:'sg2-chips',role:'group','aria-labelledby':'sg2-scen-h'},C.map(function(c,i){return h('button',{key:c.id,type:'button',className:'sg2-chip','aria-pressed':i===sel?'true':'false',
    onMouseEnter:function(){setSel(i);},onFocus:function(){setSel(i);},onClick:function(){setSel(i);}},c.role);})),
   h('p',{className:'sg2-tip','aria-live':'polite'},C[sel].tip)));
}

/* ================= HOMEPAGE (Nov 2026 redesign) =================
   Desktop: a calm introduction panel (about a third of the width, sticky under the header) beside a composed,
   staggered gallery of six real panels. Phone: introduction, then the two ways to train, then the gallery in one
   column. Essential facts (service, starting price, gym fee) are always on the page, never only in a dialog. */
function HomeDialog(p){
 var ref=React.useRef(null);useDialog(true,p.onClose,ref);
 return h('div',{className:'vfh-dlg-back',onClick:function(e){if(e.target===e.currentTarget)p.onClose();}},
  h('div',{ref:ref,className:'vfh-dlg'+(p.wide?' wide':''),role:'dialog','aria-modal':'true','aria-labelledby':p.id+'-t'},
   h('button',{type:'button',className:'vfh-dlg-x',onClick:p.onClose,'aria-label':'Close'},icon('close',20)),
   p.media?h('div',{className:'vfh-dlg-media'},p.media):null,
   h('div',{className:'vfh-dlg-body'},
    p.label?h('p',{className:'vfh-label'},p.label):null,
    h('h2',{id:p.id+'-t',className:'vfh-dlg-h'},p.title),
    p.children,
    h('div',{className:'vfh-dlg-acts'},p.action))));
}
function HomePanel(p){
 var cls='vfh-panel vfh-'+p.k+(p.tone?' tone-'+p.tone:'');
 var inner=h(React.Fragment,null,
  p.media?h('div',{className:'vfh-media','aria-hidden':'true'},p.media):null,
  h('div',{className:'vfh-copy'},
   p.label?h('p',{className:'vfh-label'},p.label):null,
   h('h3',{className:'vfh-h'},p.title[0],p.title[1]?h('span',null,p.title[1]):null),
   p.body||null,
   h('span',{className:'vfh-go'},p.cta,icon('arrow',16,{className:'vf26-arrow'}))));
 if(p.page)return navA(p.page,p.run,{className:cls,'aria-label':p.name},inner);
 return h('button',{type:'button',className:cls,onClick:p.onOpen,'aria-label':p.name,'aria-haspopup':'dialog'},inner);
}
function HomePage(props){
 var setCurrentPage=props.setCurrentPage;
 React.useEffect(function(){try{window.scrollTo(0,0);}catch(e){}},[]);
 var ds=React.useState(null),dlg=ds[0],setDlg=ds[1];
 var gal=useGallery();var proof=(gal||[]).filter(function(x){return x.imageUrl;})[0]||null;
 function svc(id){return function(){go(setCurrentPage,'pricing')();setTimeout(scrollToId(id),400);};}
 function route(name,id){return function(){vfTrack('coaching_path_selected',{path:name});svc(id)();};}
 var consult=lead(setCurrentPage,{vf_lead_type:'Semi private'});
 var HOW3=[['Tell us your goal','A few short questions about your goal, schedule and preferred location.'],['A coach contacts you','A VFITNESS coach reviews your answers and contacts you to confirm a consultation time.'],['Start training','Your coach confirms your plan and group time before you pay. Sessions and invoices live in your client portal.']];
 var close=function(){setDlg(null);};

 var intro=h('aside',{className:'vfh-intro','aria-label':'About VFITNESS'},
  h('div',{className:'vfh-intro-top'},
   h('p',{className:'vfh-where'},icon('pin',15),'Nassau, The Bahamas'),
   navA('login',go(setCurrentPage,'login'),{className:'vfh-portal'},h(React.Fragment,null,'Client portal',icon('arrow',14)))),
  h('div',{className:'vfh-intro-main'},
   h(PromoHeadliner,null),
   h('h1',{className:'vfh-h1'},'Build strength.',h('span',null,'See your progress.')),
   h('p',{className:'vfh-lead'},'Personal attention. Small-group energy. Structured coaching in Nassau and online, with real people behind your progress.'),
   h('div',{className:'vfh-acts'},
    h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:consult,onMouseEnter:function(){window.vfCoachScene&&window.vfCoachScene.point();},onFocus:function(){window.vfCoachScene&&window.vfCoachScene.point();}},'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})),
    navA('pricing',go(setCurrentPage,'pricing'),{className:'vf26-btn vf26-btn-outline'},'See pricing')),
   h('p',{className:'vfh-fine'},'A coach contacts you to confirm a suitable time.'),
   h('dl',{className:'vfh-facts'},
    h('div',null,h('dt',null,'Clients served'),h('dd',null,'2,000+')),
    h('div',null,h('dt',null,'Coaching since'),h('dd',null,'2018')),
    h('div',null,h('dt',null,'Nassau locations'),h('dd',null,'3')))),
  h('nav',{className:'vfh-intro-nav','aria-label':'Explore'},
   [['pricing','Services'],['trainers','Team'],['results','Results'],['about','Company'],['contact','Contact']].map(function(x){return navA(x[0],go(setCurrentPage,x[0]),{key:x[0]},x[1]);})),
  h('p',{className:'vfh-legal'},
   navA('privacy',go(setCurrentPage,'privacy'),null,'Privacy'),navA('terms',go(setCurrentPage,'terms'),null,'Terms'),navA('refund',go(setCurrentPage,'refund'),null,'Refunds'),
   h('span',null,'Licensed business in The Bahamas')));

 var routes=h('section',{className:'vfh-routes','aria-labelledby':'vfh-routes-h'},
  h('h2',{id:'vfh-routes-h',className:'vfh-sec-h'},'Two ways to train'),
  h('div',{className:'vfh-route-grid'},
   h('div',{className:'vfh-route'},
    h('p',{className:'vfh-label'},'Train in Nassau'),
    h('p',{className:'vfh-route-t'},'Semi private coaching, up to 4 clients'),
    h('p',{className:'vfh-route-p'},h('b',null,'12 sessions for $195'),' per person ($16.25 a session). 60 minute sessions. Gym membership is separate. 1 on 1 by request.'),
    h('button',{type:'button',className:'vf26-link',onClick:route('Train in Nassau','vf26-packages')},'Nassau packages',icon('arrow',15))),
   h('div',{className:'vfh-route'},
    h('p',{className:'vfh-label'},'Train online'),
    h('p',{className:'vfh-route-t'},'The VFIT app, with a coach if you want one'),
    h('p',{className:'vfh-route-p'},h('b',null,'VFIT App $19.99 a month'),'. The 8-Week VFIT Shred $297 one time. Elite Online Coaching $197 a month.'),
    h('button',{type:'button',className:'vf26-link',onClick:route('Train online','vf26-remote')},'Online plans',icon('arrow',15)))));

 var img=function(src,alt,w,hgt,extra){return h('img',Object.assign({src:src,alt:alt||'',width:w,height:hgt,loading:'lazy',decoding:'async'},extra||{}));};
 var sceneSec=h('section',{className:'vfh-scene','aria-labelledby':'vfh-scene-h'},
  VF_CINEMATIC.coach?h(CinematicLoop,{asset:VF_CINEMATIC.coach}):h(CoachScene,null),
  h('div',{className:'vfh-scene-copy'},
   h('p',{className:'vfh-label'},'How coaching works'),
   h('h2',{id:'vfh-scene-h',className:'vfh-sec-h'},'A coach with you, set by set.'),
   h('p',null,'Your coach watches your form, sets your pace and adjusts the plan as you get stronger. In Nassau that happens in the room; online, your coach reviews your logged sessions in the VFIT app.')));
 var strengthSec=VF_CINEMATIC.strength?h('section',{className:'vfh-scene','aria-labelledby':'vfh-str-h'},h(CinematicLoop,{asset:VF_CINEMATIC.strength}),
  h('div',{className:'vfh-scene-copy'},h('p',{className:'vfh-label'},'Strength coaching'),h('h2',{id:'vfh-str-h',className:'vfh-sec-h'},'Technique first, then load.'),
   h('p',null,'Your coach watches every rep and gives one clear cue at a time, so you lift with control and add weight safely.'))):null;
 var semiSec=h('section',{className:'vfh-semi-sec','aria-label':'Semi-private coaching'},
   h('div',{className:'vfh-panel vfh-semi vfh-semi-dark vfh-card vf26-reveal'},h('div',{className:'vfh-copy'},
    h('div',{className:'vfh-semi-text'},h('p',{className:'vfh-label'},'Semi-private coaching'),
    h('h2',{className:'vfh-h'},'Personal coaching.',h('span',null,'Small-group energy.')),
    h('p',{className:'vfh-semi-p'},'Train with up to three others while your coach guides your technique, adjusts exercises to your level, and keeps you progressing.')),
    VF_CINEMATIC.semi?h('div',{className:'sg2'},h(CinematicChapters,{asset:VF_CINEMATIC.semi})):h(SemiGroupScene,null),
    h('div',{className:'vfh-price'},h('p',{className:'amt'},h('b',null,'$195'),h('span',null,' / 12 coached sessions')),h('p',{className:'per'},'Per person. $16.25 per session on the 12-session package.'),
     h('p',{className:'join'},'Join individually. We help find your group.'),h('p',{className:'gym'},'Gym membership is separate.')),
    h('div',{className:'vfh-semi-acts'},
     h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:consult},'Find my starting point',icon('arrow',16,{className:'vf26-arrow'})),
     h('button',{type:'button',className:'vfh-semi-more',onClick:function(){setDlg('semi');},'aria-haspopup':'dialog'},'How it works',icon('arrow',15))))));
 var gallery=h('section',{className:'vfh-gallery-sec','aria-labelledby':'vfh-gal-h'},
  h('h2',{id:'vfh-gal-h',className:'sr-only'},'Inside VFITNESS'),
  h('div',{className:'vfh-gallery'},
   h('div',{className:'vfh-col c1'},
   h(HomePanel,{k:'team',name:'Meet VFITNESS: real coaches, right here in Nassau. Open the team introduction',label:'Meet VFITNESS',title:['Real coaches.','Right here in Nassau.'],cta:'Meet the coaching team',onOpen:function(){setDlg('team');},
    media:img('/vf26/team-four-2026-sm.webp','',900,675,{srcSet:'/vf26/team-four-2026-sm.webp 900w, /vf26/team-four-2026.webp 1600w',sizes:'(min-width: 1100px) 34vw, 100vw',loading:'eager',fetchpriority:'high'})}),
   h(HomePanel,{k:'pbb',name:'Pink Beach Burn: Nassau showed up in pink. Read the story',label:'Pink Beach Burn · October 31, 2026',title:['Nassau showed up','in pink.'],cta:'Read the story',page:'pinkbeachburn',run:go(setCurrentPage,'pinkbeachburn'),
    media:img(pbbSrc(0,true),'',720,540)})),
   h('div',{className:'vfh-col c2'},
   h(HomePanel,{k:'app',name:'VFIT app: your training, your food and your progress together. Open the details',label:'VFIT app · Train online',title:['Your training. Your food.','Your progress, together.'],cta:'What the app does',onOpen:function(){setDlg('app');},
    media:h('div',{className:'vfh-phones'},img('/vf26/wt-3-train.webp','',420,840),img('/vf26/wt-4-eat.webp','',420,840),img('/vf26/wt-5-progress.webp','',420,840)),
    body:h('p',{className:'vfh-note'},'Screens show sample data.')}),
   h(HomePanel,{k:'founder',name:'Meet your head coach, Darvano Andrews, founder of VFITNESS. Meet Darvano and the team',label:'Darvano Andrews · Founder',title:['Meet your','head coach.'],cta:'Meet Darvano and the team',page:'trainers',run:go(setCurrentPage,'trainers'),
    media:img('/vf26/darvano-andrews.webp','',720,900)})),
   h(HomePanel,{k:'progress',tone:proof?null:'blue',name:'Progress you can see. Explore client results',label:'Client results',title:['Progress','you can see.'],cta:'Explore client results',page:'results',run:go(setCurrentPage,'results'),
    media:proof?img(proof.imageUrl,'',800,1000):null,
    body:proof?null:h('p',{className:'vfh-note'},'Real client photos and documented progress, published with permission.')})));

 var steps=h('section',{className:'vfh-steps','aria-labelledby':'vfh-steps-h'},
  h('h2',{id:'vfh-steps-h',className:'vfh-sec-h'},'What happens after you ask'),
  h('ol',null,HOW3.map(function(s,i){return h('li',{key:s[0]},h('span',{className:'n'},'0'+(i+1)),h('b',null,s[0]),h('p',null,s[1]));})),
  h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:consult},'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})));

 var dialog=null;
 if(dlg==='team')dialog=h(HomeDialog,{id:'vfh-d-team',onClose:close,wide:true,label:'Meet VFITNESS',title:'Real coaches. Right here in Nassau.',
  media:h('img',{src:'/vf26/team-four-2026.webp',alt:'The four VFITNESS coaches together in PINK Beach Burn shirts',width:1600,height:1200}),
  action:navA('trainers',function(){close();go(setCurrentPage,'trainers')();},{className:'vf26-btn vf26-btn-primary'},h(React.Fragment,null,'Meet the coaching team',icon('arrow',16,{className:'vf26-arrow'})))},
  h('p',null,'VFITNESS has coached clients in Nassau since 2018. Every session follows a written plan, progress is tracked, and you train with a coach who knows your goal.'),
  h('ul',{className:'vfh-people'},COACHES.map(function(c){return h('li',{key:c.name},h('b',null,c.name),h('span',null,c.role));})));
 if(dlg==='semi')dialog=h(HomeDialog,{id:'vfh-d-semi',onClose:close,label:'Semi-private coaching',title:'Your goals. Your coach. A small group beside you.',
  action:h(React.Fragment,null,h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:function(){close();consult();}},'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})),
   h('button',{type:'button',className:'vf26-link',onClick:function(){close();svc('vf26-packages')();}},'All packages and terms',icon('arrow',15)))},
  h('p',null,'Train with a VFITNESS coach in a group of up to four people. Your coach guides the session, adjusts exercises to your ability, checks your technique, and helps you progress.'),
  h('p',null,'You share the session while receiving individual guidance, and encouragement from people putting in the work alongside you.'),
  h('h3',{className:'vfh-dlg-sub'},'What you get'),
  h('dl',{className:'vfh-terms'},[
   ['A clear training plan','Arrive knowing what you are working toward.'],
   ['Coaching throughout your session','Get help with technique, exercise choices, and suitable weights.'],
   ['Training matched to your level','Start where you are and progress as you improve.'],
   ['Accountability and group support','Build consistency with a coach and familiar training partners.'],
   ['Tracked sessions','Know what you have completed and how many sessions remain.']].map(function(x){return h('div',{key:x[0]},h('dt',null,x[0]),h('dd',null,x[1]));})),
  h('p',{className:'vfh-dlg-price'},h('b',null,'12 coached sessions. $195 per person.'),' That is $16.25 per session when you purchase the 12-session package.'),
  h('p',null,'Come on your own. We will help match you with a suitable group and schedule.'),
  h('p',{className:'vfh-note'},'Gym membership is separate. Your coach confirms availability and explains package terms before you pay. Sessions are 60 minutes; packages expire 45 days after purchase, with paused time added back; sessions cancelled with less than 24 hours notice may be forfeited.'));
 if(dlg==='app')dialog=h(HomeDialog,{id:'vfh-d-app',onClose:close,wide:true,label:'VFIT app · Train online',title:'Your training. Your food. Your progress, together.',
  action:h('button',{type:'button',className:'vf26-btn vf26-btn-primary',onClick:function(){close();toOnlinePlans(setCurrentPage)();}},'Compare online plans',icon('arrow',16,{className:'vf26-arrow'}))},
  h('div',{className:'vfh-three'},
   h('div',null,h('h3',null,'App tools'),h('p',null,'Guided workouts with rest timers and every set logged, food logging against your targets, and your weigh-in trend. VFIT App from $19.99 a month.')),
   h('div',null,h('h3',null,'Automated guidance'),h('p',null,'VFIT Autopilot reviews your check-ins and suggests changes to calories, steps, cardio and training. Nothing changes until you approve it.')),
   h('div',null,h('h3',null,'Human coaching'),h('p',null,'Elite Online Coaching ($197 a month) adds a VFITNESS coach who reviews your progress and messages you in the app.'))),
  h('p',{className:'vfh-note'},'The VFIT app runs at vfitnow.app, separate from this website. App screens on this page show sample data.'));

 return h('main',{className:'vf26 vfh'},
  h('div',{className:'vfh-split'},
   intro,
   h('div',{className:'vfh-stage'},routes,sceneSec,semiSec,strengthSec,gallery,steps,h(PromoSlider,null))),
  dialog);
}

/* ================= FOOTER ================= */
function Footer(props){
 var setCurrentPage=props.setCurrentPage||function(){};
 function b(label,page){return ROUTES[page]?navA(page,go(setCurrentPage,page),{key:label},label):h('button',{key:label,onClick:go(setCurrentPage,page)},label);}
 return h('footer',{className:'vf26 vf26-footer'},h('div',{className:'vf26-wrap'},
  h('div',{className:'vf26-foot-grid'},
   h('div',null,
    h('button',{className:'vf26-brand',onClick:go(setCurrentPage,'home'),style:{padding:0}},h('span',{className:'vf26-brand-tile'},h('img',{src:'/vf26/vfit-app-icon.webp',alt:'',width:40,height:40})),h('span',{className:'vf26-brand-word'},'VFITNESS')),
    h('p',{className:'vf26-muted',style:{margin:'1rem 0 0',fontSize:'.9rem',lineHeight:1.6,maxWidth:'22rem'}},'VFITNESS Training Services. Personal training in Nassau and online coaching through the VFIT app since 2018.'),
    h('div',{className:'vf26-socials'},
     h('a',{href:'https://www.instagram.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Instagram'},icon('instagram',17)),
     h('a',{href:'https://www.facebook.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Facebook'},icon('facebook',17)),
     h('a',{href:'https://www.tiktok.com/@xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'TikTok'},icon('tiktok',17)))),
   h('div',null,h('h2',{className:'vf26-foot-h'},'Company'),b('About','about'),b('Team','trainers'),b('Results','results'),b('Contact','contact')),
   h('div',null,h('h2',{className:'vf26-foot-h'},'Clients'),b('Get started','starthere'),b('Services and pricing','pricing'),b('Client portal','login'),h('a',{href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer'},'VFIT app')),
   h('div',null,h('h2',{className:'vf26-foot-h'},'Legal'),b('Privacy Policy','privacy'),b('Terms of Service','terms'),b('Refunds and Cancellations','refund'))),
  h('p',{className:'vf26-foot-licence'},icon('shield',15),'Licensed business in The Bahamas. Business Licence No. '+VF_LICENCE.no+', issued under the '+VF_LICENCE.act+', valid through '+VF_LICENCE.until+'.'),
  h('div',{className:'vf26-foot-base'},h('span',null,'© '+new Date().getFullYear()+' VFITNESS Training Services. Nassau, The Bahamas.'),h('span',null,h('a',{href:'mailto:'+VF_EMAIL},VF_EMAIL),' · ',h('a',{href:VF_TEL},VF_PHONE)))));
}

/* ================= SHARED PAGE PARTS ================= */
Object.assign(I,{
 phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/>',
 chat:'<path d="M21 11.5a8.4 8.4 0 0 1-12.3 7.5L3 21l2-5.3A8.4 8.4 0 1 1 21 11.5Z"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 star:'<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3l-5.6 2.9 1.1-6.2L3 9.6l6.2-.9Z"/>',
 dumbbell:'<path d="M6.5 6.5v11M17.5 6.5v11M3 9.5v5M21 9.5v5M6.5 12h11"/>',
 globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
 clipboard:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 12l2 2 4-4"/>',
 left:'<path d="m15 18-6-6 6-6"/>',
 right:'<path d="m9 18 6-6-6-6"/>',
 award:'<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 8 5-3 5 3-1.5-8"/>',
 shield:'<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
 spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/>',
 expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>'
});
var VF_EMAIL='vfitnessbah@gmail.com';
var VF_LICENCE={no:'20121990',act:'Business Licence Act, 2023',by:'Ministry of Finance, Department of Inland Revenue',until:'December 31, 2026'};
var VF_PHONE='242 454 9063',VF_TEL='tel:+12424549063';
function waLink(ctx){try{if(typeof window.vfWa==='function')return window.vfWa(ctx||'contact');}catch(e){}return 'https://wa.me/12424549063';}
function useTop(){React.useEffect(function(){try{window.scrollTo(0,0);}catch(e){}},[]);}
function scrollToId(id){return function(){var el=document.getElementById(id);if(el){var y=el.getBoundingClientRect().top+window.pageYOffset-96;window.scrollTo({top:y,behavior:reduceMotion?'auto':'smooth'});}};}

function PageHero(p){
 return h('section',{className:'vf26-phero vf26-phero-corp'+(p.center?' center':'')+(p.media?' has-media':'')},
  h('div',{className:'vf26-phero-glow','aria-hidden':'true'}),
  h('div',{className:'vf26-wrap vf26-phero-in'},
   h('div',{className:'vf26-phero-copy'},
    h('div',{className:'vf26-eyebrow vf26-enter'},h('i'),p.eyebrow),
    h('h1',{className:'vf26-ph1 vf26-enter',style:{'--d':'40ms'}},p.title,p.accent?h('span',null,p.accent):null),
    p.lead?h('p',{className:'vf26-lead vf26-enter',style:{'--d':'100ms'}},p.lead):null,
    p.actions?h('div',{className:'vf26-hero-cta vf26-enter',style:{'--d':'160ms'}},p.actions):null,
    null),
   p.media?h('figure',{className:'vf26-phero-media vf26-enter',style:{'--d':'140ms'}},p.media):null));
}
function SectionHead(p){
 return h(Reveal,{className:p.row?'vf26-head-row':'vf26-head'},
  h('div',null,h('p',{className:'vf26-kicker'+(p.violet?' violet':'')},p.kicker),h('h2',{className:'vf26-h2'},p.title),p.lead?h('p',{className:'vf26-lead'},p.lead):null),
  p.right||null);
}
function FinalCTA(p){
 var setCurrentPage=p.setCurrentPage;
 return h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
  h(Reveal,{className:'vf26-command',style:{textAlign:'center'}},
   h('div',{style:{position:'relative',zIndex:1,maxWidth:'40rem',margin:'0 auto'}},
    h('p',{className:'vf26-kicker'},p.kicker||'Free consultation'),
    h('h2',{className:'vf26-h2'},p.title||'Book your free consultation.'),
    h('p',{className:'vf26-lead',style:{marginLeft:'auto',marginRight:'auto'}},p.lead||'Create your account, tell us your goal and a coach will confirm your consultation and starting plan.')),
   h('div',{className:'vf26-cta-row',style:{justifyContent:'center'}},
    h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,p.kv||{})},p.primaryLabel||'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})),
    h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,p.secondaryPage||'pricing')},p.secondaryLabel||'See pricing')))));
}
var HOW=[['Apply','Tell us your goal in the Start Here flow. It takes about two minutes.'],['Consultation','We talk through goals, schedule, injuries and the right starting point.'],['Goal assessment','Baseline measurements, photos and targets are recorded in your account.'],['Program match','You are matched to the right program, coach and location.'],['Start training','Structured sessions begin and every session is logged.'],['Weekly tracking','Check ins, photos and adjustments keep the results moving.']];
function HowItWorks(){
 return h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
  h(SectionHead,{kicker:'How it works',title:'Six steps. Zero guesswork.'}),
  h('div',{className:'vf26-how'},HOW.map(function(s,i){return h(Reveal,{key:s[0],className:'vf26-how-item',delay:Math.min(i*60,300)},
   h('span',{className:'n'},String(i+1).padStart(2,'0')),h('div',null,h('b',null,s[0]),h('p',null,s[1])));}))));
}
var LOCS=[
 {name:'Empire Fitness',area:'Prince Charles Drive, Seagrape Plaza',note:'One on one and semi private coaching.'},
 {name:'Fanta C Fitness',area:'Nassau, New Providence',note:'Personal training and small group sessions.'},
 {name:'Royal Bahamas Police College',area:'Thompson Boulevard',note:'Strength and conditioning coaching.'}
];
var HOURS=[['Monday to Friday','6:00 AM to 8:00 PM'],['Saturday','8:00 AM to 4:00 PM'],['Sunday','Closed']];
function LocationCards(p){
 return h('div',{className:'vf26-loc-grid'},
  LOCS.map(function(l,i){return h(Reveal,{key:l.name,className:'vf26-loc',delay:i*80},
   h('span',{className:'vf26-loc-pin'},icon('pin',20),h('i',{'aria-hidden':'true'})),
   h('div',{className:'k'},'Nassau'),h('h3',null,l.name),h('p',{className:'a'},l.area),h('p',null,l.note),
   h('button',{className:'vf26-link',onClick:lead(p.setCurrentPage,{vf_lead_location:l.name})},'Train here',icon('arrow',15)));}));
}
function HoursCard(){
 return h('div',{className:'vf26-hours'},h('div',{className:'hd'},icon('clock',18),'VFITNESS coaching hours'),
  HOURS.map(function(r){return h('div',{key:r[0],className:'row'},h('span',null,r[0]),h('b',{className:r[1]==='Closed'?'off':''},r[1]));}),
  h('p',{className:'vf26-hours-note'},'When our coaches train clients. Each gym sets its own opening hours, and gym membership is separate.'));
}


/* ---------- App style hero widgets ---------- */
function Ring(p){var r=34,c=2*Math.PI*r;var ref=React.useRef(null);var st=React.useState(reduceMotion?1:0),k=st[0],setK=st[1];
 useInView(ref,function(){setTimeout(function(){setK(1);},120);});
 return h('svg',{ref:ref,className:'vf26-ring',viewBox:'0 0 80 80',width:p.size||120,height:p.size||120,'aria-hidden':'true'},
  h('circle',{cx:40,cy:40,r:r,fill:'none',stroke:'var(--vf-border)',strokeWidth:7}),
  h('circle',{cx:40,cy:40,r:r,fill:'none',stroke:'url(#vf26rg)',strokeWidth:7,strokeLinecap:'round',strokeDasharray:c,transform:'rotate(-90 40 40)',style:{strokeDashoffset:c*(1-p.value*k),transition:'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)'}}),
  h('defs',null,h('linearGradient',{id:'vf26rg',x1:0,y1:0,x2:1,y2:1},h('stop',{offset:'0%',stopColor:'#4296f0'}),h('stop',{offset:'100%',stopColor:'#8869ec'}))));}
function WidgetTop(p){return h('div',{className:'vf26-demo-top'},h('span',null,p.l),h('span',{className:'vf26-live'},h('i'),p.r||'Example view'));}
function SessionWidget(){
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'Your account'}),
  h('div',{className:'vf26-wcard'},
   h('div',{className:'vf26-sess'},
    h('div',{className:'dial'},h(Ring,{value:8/12,size:128}),h('div',{className:'mid'},h('b',{className:'vf26-condensed'},'8'),h('span',null,'of 12 left'))),
    h('div',{className:'info'},h('span',{className:'k'},'12 session package'),h('b',null,'Semi private with your coach'),
     h('div',{className:'vf26-bar'},h('i',{style:{width:'66%'}})),h('span',{className:'s'},'4 sessions completed and logged'))),
   h('div',{className:'vf26-wrows'},
    h('div',null,h('span',{className:'vf26-icon-tile'},icon('clock',18)),h('div',null,h('b',null,'Next session'),h('span',null,'Thursday, 6:00 AM')),h('em',null,'Booked')),
    h('div',null,h('span',{className:'vf26-icon-tile'},icon('trend',18)),h('div',null,h('b',null,'Last workout'),h('span',null,'Lower body, 14 sets logged')),h('em',{className:'up'},'+5 lb')),
    h('div',null,h('span',{className:'vf26-icon-tile'},icon('check',18)),h('div',null,h('b',null,'Weekly check in'),h('span',null,'Submitted Sunday')),h('em',null,'Done')))));
}
function CoachWidget(){
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'The coaching team',r:'4 coaches'}),
  h('div',{className:'vf26-wcard vf26-coachw'},
   h('div',{className:'ph'},h('img',{src:'/vf26/darvano-andrews.webp',alt:'Darvano Andrews'}),h('div',{className:'cap'},h('span',null,'Founder and Head Coach'),h('b',null,'Darvano Andrews'))),
   h('div',{className:'team'},TRAINERS.slice(1).map(function(t,i){return h('div',{key:t.name,className:'m vf26-enter',style:{'--acc':t.accent,'--d':(300+i*120)+'ms'}},h('span',{className:'av'},t.name.split(' ').map(function(x){return x[0];}).join('')),h('div',null,h('b',null,t.name),h('span',null,t.role)));}))));
}
function ProgressWidget(){
 var ref=React.useRef(null);useInView(ref,function(el){el.classList.add('is-in');});
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'Progress in your account'}),
  h('div',{className:'vf26-wcard'},
   h('div',{className:'vf26-chart-head'},h('div',null,h('span',null,'Waist measurement'),h('b',{className:'vf26-condensed'},'12 weeks')),h('em',null,icon('trend',14),'Trending down')),
   h('svg',{ref:ref,className:'vf26-chart',viewBox:'0 0 300 120',preserveAspectRatio:'none','aria-hidden':'true',dangerouslySetInnerHTML:{__html:'<defs><linearGradient id="vf26cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#4296f0" stop-opacity=".35"/><stop offset="100%" stop-color="#4296f0" stop-opacity="0"/></linearGradient></defs><g stroke="currentColor" opacity=".12"><line x1="0" y1="30" x2="300" y2="30"/><line x1="0" y1="60" x2="300" y2="60"/><line x1="0" y1="90" x2="300" y2="90"/></g><path class="area" d="M0 22 L27 26 L55 31 L82 36 L109 40 L136 48 L164 55 L191 60 L218 68 L245 74 L273 80 L300 86 L300 120 L0 120Z" fill="url(#vf26cg)"/><path class="line" d="M0 22 L27 26 L55 31 L82 36 L109 40 L136 48 L164 55 L191 60 L218 68 L245 74 L273 80 L300 86" fill="none" stroke="#4296f0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><circle class="pt" cx="300" cy="86" r="5" fill="#4296f0"/>'}}),
   h('div',{className:'vf26-mini-stats',style:{marginTop:'1rem'}},
    h('div',null,h('b',{className:'vf26-condensed'},'36'),h('span',null,'Workouts')),
    h('div',null,h('b',{className:'vf26-condensed'},'12'),h('span',null,'Check ins')),
    h('div',null,h('b',{className:'vf26-condensed'},'24'),h('span',null,'Photos')))));
}
function MapWidget(){
 var pins=[{n:'Empire Fitness',x:62,y:58},{n:'Fanta C Fitness',x:38,y:44},{n:'Police College',x:74,y:36}];
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'Nassau, New Providence',r:'Illustration, not to scale'}),
  h('div',{className:'vf26-wcard vf26-mapw'},
   h('div',{className:'map','aria-hidden':'true'},h('div',{className:'land'}),pins.map(function(p,i){return h('span',{key:p.n,className:'pin',style:{left:p.x+'%',top:p.y+'%','--d':(i*400)+'ms'}},h('i'),h('b',null,p.n));})),
   h('div',{className:'vf26-wrows'},LOCS.map(function(l){return h('div',{key:l.name},h('span',{className:'vf26-icon-tile'},icon('pin',18)),h('div',null,h('b',null,l.name),h('span',null,l.area)));}))));
}
function ChatWidget(){
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'Coach messaging'}),
  h('div',{className:'vf26-wcard vf26-chatw'},
   h('div',{className:'b in vf26-enter',style:{'--d':'200ms'}},'Hi Coach, I want to lose 15 lb and tone up. Where do I start?'),
   h('div',{className:'b out vf26-enter',style:{'--d':'700ms'}},'Great goal. Book a free consult and body assessment, then we will match your plan and location.'),
   h('div',{className:'b in vf26-enter',style:{'--d':'1200ms'}},'Booked for Thursday morning.'),
   h('div',{className:'typing vf26-enter',style:{'--d':'1600ms'}},h('i'),h('i'),h('i'))));
}

/* ================= PRICING ================= */
/* Savings are always computed from the package price against buying the same number of single sessions. */
function money(n){var r=Math.round(n*100)/100;return r%1?r.toFixed(2):String(r);}
// Savings are shown only when they are meaningful (5% or more). A $1 difference on a package is rounding, not a deal.
var MIN_SAVE_PCT=5;
function pkgSavings(pkg,single){var full=single*pkg.sessions;var amount=Math.round((full-pkg.price)*100)/100;var pct=amount>0?Math.round(amount/full*1000)/10:0;if(pct<MIN_SAVE_PCT){amount=0;pct=0;}
 return {per:Math.round(pkg.price/pkg.sessions*100)/100,amount:amount>0?amount:0,pct:pct,pctLabel:(pct>=10?Math.round(pct):pct)+'%'};}
window.vfPkgSavings=pkgSavings;
var PKG={
 one:[{sessions:1,price:30,title:'Single Session'},{sessions:4,price:120,title:'4-Session Package'},{sessions:6,price:180,title:'6-Session Package'},{sessions:8,price:221,title:'8-Session Package'},{sessions:12,price:294,title:'12-Session Package'}],
 semi:[{sessions:1,price:22,title:'Single Semi Personal Session'},{sessions:4,price:87,title:'4-Session Package'},{sessions:6,price:130,title:'6-Session Package'},{sessions:8,price:173,title:'8-Session Package'},{sessions:12,price:195,title:'12-Session Package'}]
};
/* Semi private, defined in full next to the packages. */
function SemiTerms(){
 var t=[['Join on your own','You do not need a partner. We match you with a group whose goals and times fit yours.'],
  ['Small groups','Up to 4 clients per session, with one VFitness coach.'],
  ['60 minute sessions','A written plan for every session, with adjustments for you inside the group.'],
  ['Packages','Prices are per person: 1 session $22, 4 for $87, 6 for $130, 8 for $173 or 12 for $195 ($16.25 a session). A package is a block of sessions, not a monthly membership.'],
  ['Training times','Tell us the days and times that suit you. Your coach confirms a recurring group slot before you pay. A preferred time is not a booked slot.'],
  ['Package expiry','Packages expire 45 days after purchase. If your coach pauses your package for travel or injury, the paused time is added back. Ask your coach about make up sessions.'],
  ['Cancellations','Sessions cancelled with less than 24 hours notice may be forfeited.'],
  ['Gym access','A gym membership is not included. Your package covers your coaching only, and we walk you through training location options at your consultation.']];
 return h('div',{className:'vf26-semi'},h('h3',null,'How semi private works'),
  h('dl',null,t.map(function(x){return h('div',{key:x[0]},h('dt',null,x[0]),h('dd',null,x[1]));})));
}
/* Legacy forms place a <label> next to its field without linking them. Link them so screen readers announce
   the field name and tapping the label focuses the field. Only fields with no accessible name are touched. */
(function(){var n=0,queued=false;
 function named(f){if(f.getAttribute('aria-label')||f.getAttribute('aria-labelledby')||f.closest('label'))return true;if(f.id){try{if(document.querySelector('label[for="'+CSS.escape(f.id)+'"]'))return true;}catch(e){}}return false;}
 function near(f){var el=f.previousElementSibling;if(el&&el.tagName==='LABEL')return el;var p=f.parentElement;if(p&&p.children.length<=3){el=p.previousElementSibling;if(el&&el.tagName==='LABEL')return el;var l=p.querySelector(':scope > label');if(l)return l;}return null;}
 function link(){queued=false;if(!document.getElementById('main')){var mn=document.querySelector('main');if(mn&&!mn.id)mn.id='main';}document.querySelectorAll('input:not([type=hidden]):not([type=submit]):not([type=button]),select,textarea').forEach(function(f){
  if(named(f))return;var l=near(f);if(l&&!l.htmlFor){if(!f.id)f.id='vf-f'+(++n);l.htmlFor=f.id;}else if(!l&&f.placeholder){f.setAttribute('aria-label',f.placeholder);}});}
 function q(){if(queued)return;queued=true;setTimeout(link,120);}
 try{new MutationObserver(q).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}q();
})();

/* ================= SEMI PRIVATE GROUPS ================= */
/* Real group times from the VFIT backend (/api/groups). Each group has at most 4 places; the server hands out places
   one at a time, so two people can never take the last one. A held place is confirmed by the coach before payment. */
function vfGroupsApi(action,extra,needToken){
 function send(tok){var b=Object.assign({action:action},extra||{});if(tok)b.idToken=tok;
  return fetch('/api/groups',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(b)}).then(function(r){return r.json().catch(function(){return {ok:false,error:'The schedule is not available right now.'};}).then(function(j){if(!j||j.ok!==true)throw new Error((j&&j.error)||'The schedule is not available right now.');return j;});});}
 if(!needToken)return send(null);
 var u=null;try{u=window.firebase&&firebase.auth().currentUser;}catch(e){}
 if(!u)return Promise.reject(new Error('Please sign in to your VFitness account first.'));
 return u.getIdToken().then(send);
}
var DAY_NAMES={Mon:'Monday',Tue:'Tuesday',Wed:'Wednesday',Thu:'Thursday',Fri:'Friday',Sat:'Saturday',Sun:'Sunday'};
function daysLabel(d){d=d||[];if(!d.length)return '';if(d.length===1)return DAY_NAMES[d[0]]||d[0];return d.join(', ').replace(/, ([^,]*)$/,' and $1');}
function PlaceDots(p){var out=[];for(var i=0;i<p.cap;i++)out.push(h('span',{key:i,className:'dot'+(i<p.cap-p.left?' on':'')}));return h('span',{className:'vf26-dots','aria-hidden':'true'},out);}
function SemiGroups(props){
 var user=props.user,setCurrentPage=props.setCurrentPage;
 var st=React.useState({loading:true,error:'',groups:[]}),data=st[0],setData=st[1];
 var ms=React.useState({places:{},waiting:{}}),mine=ms[0],setMine=ms[1];
 var bs=React.useState(''),busy=bs[0],setBusy=bs[1];
 var ns=React.useState({id:'',text:'',bad:false}),note=ns[0],setNote=ns[1];
 function load(){setData(function(d){return Object.assign({},d,{loading:true,error:''});});
  return vfGroupsApi('list').then(function(j){setData({loading:false,error:'',groups:j.groups||[]});}).catch(function(e){setData({loading:false,error:e.message,groups:[]});});}
 function loadMine(){if(!user)return Promise.resolve(setMine({places:{},waiting:{}}));
  return vfGroupsApi('mine',null,true).then(function(j){var pl={},wt={};(j.places||[]).forEach(function(x){pl[x.groupId]=x.state;});(j.waiting||[]).forEach(function(g){wt[g]=true;});setMine({places:pl,waiting:wt});}).catch(function(){});}
 function reserve(g){
  if(!user){needAccount({title:'Sign in to hold a place',reason:'Places are held on your client account so your coach can confirm the time with you.',keep:'You come back to this group and we hold your place if one is still free.',intent:{page:'pricing',action:'group',groupId:g.id}});return;}
  setBusy(g.id);setNote({id:'',text:'',bad:false});
  vfGroupsApi('reserve',{groupId:g.id},true).then(function(j){
   if(j.waitlisted){vfTrack('group_waitlist_joined',{path:'semi private'});setNote({id:g.id,text:'This group is full. You are number '+j.position+' on the waitlist. If a place opens, it is held for you and we contact you.',bad:false});}
   else{vfTrack('group_place_reserved',{path:'semi private'});setNote({id:g.id,text:j.already?'You already hold a place in this group.':'Place held. Your coach contacts you to confirm the time before you pay for a package.',bad:false});}
   return Promise.all([load(),loadMine()]);
  }).catch(function(e){setNote({id:g.id,text:e.message,bad:true});}).then(function(){setBusy('');});
 }
 function leave(g,wasWaiting){
  if(!window.confirm(wasWaiting?'Leave the waitlist for this group?':'Give up your place in this group? Someone on the waitlist may take it.'))return;
  setBusy(g.id);vfGroupsApi('leave',{groupId:g.id},true).then(function(){setNote({id:g.id,text:wasWaiting?'You left the waitlist.':'Your place is free again.',bad:false});return Promise.all([load(),loadMine()]);})
  .catch(function(e){setNote({id:g.id,text:e.message,bad:true});}).then(function(){setBusy('');});
 }
 React.useEffect(function(){load();},[]);
 React.useEffect(function(){loadMine().then(function(){
  if(!user)return;var it=peekIntent();if(!it||it.page!=='pricing'||it.action!=='group')return;takeIntent();
  vfGroupsApi('list').then(function(j){var g=(j.groups||[]).filter(function(x){return x.id===it.groupId;})[0];if(g){scrollToId('vf26-groups')();reserve(g);}});
 });},[!!user]);
 var body;
 if(data.loading&&!data.groups.length)body=h('p',{className:'vf26-groups-msg',role:'status'},'Loading group times...');
 else if(data.error)body=h('div',{className:'vf26-groups-msg bad',role:'alert'},h('p',null,'We could not load group times. '+data.error),h('button',{className:'vf26-btn vf26-btn-outline',onClick:load},'Try again'));
 else if(!data.groups.length)body=h('div',{className:'vf26-groups-msg'},h('p',null,'No group times are listed right now. Request a consultation and we match you with a group that fits your goals and schedule.'),
  h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{vf_lead_type:'Semi private'})},'Request my free consultation'));
 else body=h('ul',{className:'vf26-groups'},data.groups.map(function(g){
  var state=mine.places[g.id],waiting=mine.waiting[g.id];var when=daysLabel(g.weekdays)+' at '+g.timeLabel;
  var status=state==='confirmed'?'Your place is confirmed':state?'Place held for you':waiting?'You are on the waitlist':g.full?'Full, waitlist open':(g.placesLeft===1?'1 place left':g.placesLeft+' places left');
  var act=state||waiting?h('button',{className:'vf26-btn vf26-btn-outline',disabled:busy===g.id,'aria-busy':busy===g.id?'true':undefined,onClick:function(){leave(g,!state);}},state?'Give up my place':'Leave the waitlist')
   :h('button',{className:'vf26-btn '+(g.full?'vf26-btn-outline':'vf26-btn-primary'),disabled:busy===g.id,'aria-busy':busy===g.id?'true':undefined,onClick:function(){reserve(g);},'aria-label':(g.full?'Join the waitlist for ':'Hold a place in ')+(g.title||when)},busy===g.id?'One moment...':g.full?'Join the waitlist':'Hold a place');
  return h('li',{key:g.id,className:'vf26-group'+(state||waiting?' mine':'')},
   h('div',{className:'top'},h('h4',null,g.title||when),h('span',{className:'st'+(g.full&&!state?' full':'')},h(PlaceDots,{cap:g.capacity,left:g.placesLeft}),status)),
   h('dl',null,g.title?h('div',null,h('dt',null,'When'),h('dd',null,when)):null,
    h('div',null,h('dt',null,'Length'),h('dd',null,(g.durationMin||60)+' minutes')),
    h('div',null,h('dt',null,'Coach'),h('dd',null,g.trainerName)),
    h('div',null,h('dt',null,'Location'),h('dd',null,g.locationName)),
    g.level?h('div',null,h('dt',null,'Level'),h('dd',null,g.level)):null,
    h('div',null,h('dt',null,'Group size'),h('dd',null,'Up to '+g.capacity+' clients'))),
   act,
   h('p',{className:'vf26-group-note'+(note.id===g.id&&note.bad?' bad':''),'aria-live':'polite'},note.id===g.id?note.text:''));
 }));
 return h('div',{className:'vf26-groups-wrap',id:'vf26-groups'},
  h('h3',null,'Group times with places'),
  h('p',{className:'vf26-groups-lead'},'Each group has up to 4 clients. Holding a place is free. Your coach confirms the time with you, then you choose a package.'),
  body);
}
window.VF26SemiGroups=SemiGroups;

/* Admin: create groups and manage who holds each place. Same server rules as the public page. */
var WEEK=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
var EMPTY_GROUP={id:'',title:'',trainerName:'',locationName:'',weekdays:[],startTime:'06:00',durationMin:60,capacity:4,level:'',status:'open',notes:''};
function AdminGroups(){
 var st=React.useState({loading:true,error:'',groups:[]}),data=st[0],setData=st[1];
 var fs=React.useState(null),form=fs[0],setForm=fs[1];
 var ms=React.useState({text:'',bad:false}),msg=ms[0],setMsg=ms[1];
 var bs=React.useState(false),busy=bs[0],setBusy=bs[1];
 function load(){setData(function(d){return Object.assign({},d,{loading:true,error:''});});
  return vfGroupsApi('adminList',null,true).then(function(j){setData({loading:false,error:'',groups:j.groups||[]});}).catch(function(e){setData({loading:false,error:e.message,groups:[]});});}
 React.useEffect(function(){load();},[]);
 function run(action,extra,done){setBusy(true);setMsg({text:'',bad:false});
  return vfGroupsApi(action,extra,true).then(function(j){setMsg({text:j.note||done,bad:!!j.note});return load();}).catch(function(e){setMsg({text:e.message,bad:true});}).then(function(){setBusy(false);});}
 function set(k,v){setForm(function(f){var n=Object.assign({},f);n[k]=v;return n;});}
 function toggleDay(d){setForm(function(f){var w=f.weekdays.indexOf(d)>=0?f.weekdays.filter(function(x){return x!==d;}):f.weekdays.concat([d]);return Object.assign({},f,{weekdays:w});});}
 function save(e){e.preventDefault();run('adminSave',{group:form},form.id?'Group updated.':'Group created.').then(function(){setForm(null);});}
 function field(label,key,input){return h('label',{className:'vf26-adm-field'},h('span',null,label),input);}
 var editor=form?h('form',{className:'vf26-adm-form',onSubmit:save,'aria-label':form.id?'Edit group':'New group'},
  h('h3',null,form.id?'Edit group':'New group'),
  h('div',{className:'grid'},
   field('Name (optional)','title',h('input',{value:form.title,maxLength:60,placeholder:'Early strength',onChange:function(e){set('title',e.target.value);}})),
   field('Coach','trainerName',h('input',{value:form.trainerName,maxLength:80,required:true,onChange:function(e){set('trainerName',e.target.value);}})),
   field('Location','locationName',h('input',{value:form.locationName,maxLength:80,required:true,onChange:function(e){set('locationName',e.target.value);}})),
   field('Start time','startTime',h('input',{type:'time',value:form.startTime,required:true,onChange:function(e){set('startTime',e.target.value);}})),
   field('Length','durationMin',h('select',{value:form.durationMin,onChange:function(e){set('durationMin',Number(e.target.value));}},[45,60,75,90].map(function(m){return h('option',{key:m,value:m},m+' minutes');}))),
   field('Places (max 4)','capacity',h('select',{value:form.capacity,onChange:function(e){set('capacity',Number(e.target.value));}},[1,2,3,4].map(function(n){return h('option',{key:n,value:n},n);}))),
   field('Level (optional)','level',h('input',{value:form.level,maxLength:80,placeholder:'All levels',onChange:function(e){set('level',e.target.value);}})),
   field('Status','status',h('select',{value:form.status,onChange:function(e){set('status',e.target.value);}},h('option',{value:'open'},'Open (on website)'),h('option',{value:'closed'},'Closed (hidden)'),h('option',{value:'archived'},'Archived')))),
  h('fieldset',{className:'vf26-adm-days'},h('legend',null,'Days'),WEEK.map(function(d){var on=form.weekdays.indexOf(d)>=0;return h('label',{key:d,className:'vf26-chipbox'+(on?' on':'')},h('input',{type:'checkbox',checked:on,onChange:function(){toggleDay(d);}}),DAY_NAMES[d]);})),
  field('Private notes (admins only)','notes',h('textarea',{value:form.notes,maxLength:500,rows:2,onChange:function(e){set('notes',e.target.value);}})),
  h('div',{className:'acts'},h('button',{type:'submit',className:'vf26-btn vf26-btn-primary',disabled:busy,'aria-busy':busy?'true':undefined},busy?'Saving...':'Save group'),h('button',{type:'button',className:'vf26-btn vf26-btn-outline',onClick:function(){setForm(null);}},'Cancel'))):null;
 return h('section',{className:'vf26-adm-groups','aria-labelledby':'vf26-adm-groups-h'},
  h('div',{className:'head'},h('div',null,h('h2',{id:'vf26-adm-groups-h'},'Semi private groups'),h('p',null,'Up to 4 places per group. Open groups show on the Services page. People hold a place from the website; confirm them once the time is agreed.')),
   form?null:h('button',{className:'vf26-btn vf26-btn-primary',onClick:function(){setForm(Object.assign({},EMPTY_GROUP));}},'New group')),
  h('p',{className:'vf26-adm-msg'+(msg.bad?' bad':''),role:'status','aria-live':'polite'},msg.text),
  editor,
  data.loading&&!data.groups.length?h('p',{role:'status'},'Loading groups...'):
  data.error?h('div',{role:'alert',className:'vf26-adm-msg bad'},h('p',null,'Could not load groups. '+data.error),h('button',{className:'vf26-btn vf26-btn-outline',onClick:load},'Try again')):
  !data.groups.length?h('p',null,'No groups yet. Create the first one with New group.'):
  h('div',{className:'vf26-adm-list'},data.groups.map(function(g){var when=daysLabel(g.weekdays)+' at '+g.timeLabel;
   return h('article',{key:g.id,className:'vf26-adm-card'},
    h('header',null,h('div',null,h('h3',null,g.title||when),h('p',null,(g.title?when+' · ':'')+g.durationMin+' min · '+g.trainerName+' · '+g.locationName+(g.level?' · '+g.level:''))),
     h('span',{className:'pill '+g.status},g.status==='open'?'Open':'Closed'),
     h('button',{className:'vf26-btn vf26-btn-outline',onClick:function(){setForm({id:g.id,title:g.title,trainerName:g.trainerName,locationName:g.locationName,weekdays:g.weekdays,startTime:g.startTime,durationMin:g.durationMin,capacity:g.capacity,level:g.level,status:g.status,notes:g.notes});try{window.scrollTo({top:0});}catch(e){}}},'Edit')),
    g.notes?h('p',{className:'notes'},g.notes):null,
    h('table',null,h('caption',{className:'sr-only'},'Places in '+(g.title||when)),
     h('thead',null,h('tr',null,h('th',{scope:'col'},'Place'),h('th',{scope:'col'},'Client'),h('th',{scope:'col'},'Status'),h('th',{scope:'col'},h('span',{className:'sr-only'},'Actions')))),
     h('tbody',null,g.seats.map(function(s){return h('tr',{key:s.id},h('td',null,s.seat),
      h('td',null,s.state==='free'?h('span',{className:'mute'},'Free'):h('span',null,s.name||'No name',s.email?h('small',null,' ',s.email):null)),
      h('td',null,s.state==='free'?'':s.state==='confirmed'?'Confirmed':'Held'),
      h('td',{className:'acts'},h('div',null,s.state==='held'?h('button',{className:'vf26-btn vf26-btn-primary sm',disabled:busy,onClick:function(){run('adminConfirm',{seatId:s.id},'Place confirmed.');}},'Confirm'):null,
       s.state!=='free'?h('button',{className:'vf26-btn vf26-btn-outline sm',disabled:busy,onClick:function(){if(window.confirm('Release place '+s.seat+' held by '+(s.name||'this client')+'? The next person on the waitlist gets it.'))run('adminRelease',{seatId:s.id},'Place released.');}},'Release'):null)));}))),
    g.waitlist.length?h('div',{className:'wait'},h('h4',null,'Waitlist ('+g.waitlist.length+')'),h('ol',null,g.waitlist.map(function(w){return h('li',{key:w.id},h('span',null,w.name||'No name',w.email?h('small',null,' ',w.email):null),
     h('button',{className:'vf26-btn vf26-btn-outline sm',disabled:busy,onClick:function(){run('adminRemoveWait',{waitId:w.id},'Removed from the waitlist.');}},'Remove'));}))):null);})));
}
window.VF26AdminGroups=AdminGroups;

function PricingPage(props){
 var user=props.user,setCurrentPage=props.setCurrentPage,theme=props.theme||'dark';
 useTop();
 var ms=React.useState(false),showModal=ms[0],setShowModal=ms[1];
 var ps=React.useState(null),selected=ps[0],setSelected=ps[1];
 var ts=React.useState('semi'),tab=ts[0],setTab=ts[1];
 function select(pkg){if(!user){needAccount({title:'Sign in to buy this package',reason:'Packages are added to your client account, so your sessions, bookings and receipts stay in one place.',keep:'Your '+pkg.sessions+' session package stays selected and checkout opens when you are back.',intent:{page:'pricing',action:'buy',tab:tab,sessions:pkg.sessions}});return;}vfTrack('package_checkout_started',{path:tab+' '+pkg.sessions});setSelected(pkg);setShowModal(true);}
 React.useEffect(function(){if(!user)return;var it=peekIntent();if(!it||it.page!=='pricing'||it.action!=='buy')return;takeIntent();var l=PKG[it.tab]||PKG.one;var pkg=l.filter(function(p){return p.sessions===it.sessions;})[0];if(!pkg)return;setTab(it.tab in PKG?it.tab:'one');setSelected(pkg);setShowModal(true);setTimeout(scrollToId('vf26-packages'),300);},[!!user]);
 var services=[
  {icon:'users',name:'Semi Private Training',who:'Recommended. Join on your own and we match you with a group of up to 4.',price:'$16.25',unit:'/ session on 12',cta:'View semi private',act:function(){setTab('semi');scrollToId('vf26-packages')();},hi:true},
  {icon:'user',name:'1 on 1 Coaching',who:'By request. Ask about coach availability at your consultation.',price:'By request',unit:'',cta:'Ask about 1 on 1',act:lead(setCurrentPage,{vf_lead_type:'1 on 1 by request'})},
  {icon:'dumbbell',name:'Group Training',who:'Motivation in a small group',price:'Ask',unit:'',cta:'Enquire',act:lead(setCurrentPage,{vf_lead_type:'Group'})},
  {icon:'clipboard',name:'Free Consultation and Body Assessment',who:'First timers, goals and body scan',price:'Free',unit:'',cta:'Request my free consultation',act:go(setCurrentPage,'book')}
 ];
 var list=PKG[tab];var base=list[0].price;var bestPkg=list.reduce(function(a,p){return p.price/p.sessions<a.price/a.sessions?p:a;},list[0]);if(bestPkg===list[0])bestPkg=null;
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Services and pricing',title:'Clear pricing.',accent:'No lock in contracts.',lead:'In person training at three Nassau locations and online coaching through the VFIT app. Pay securely online and track every session in your client portal.',
   chips:[['check','No lock in contracts'],['history','Sessions tracked in your dashboard'],['shield','Secure checkout']],
   aside:h(SessionWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:scrollToId('vf26-packages')},'See session packages',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Request my free consultation')]}),

  h('section',{className:'vf26-section tight vfh vfh-cats','aria-label':'Choose how to train'},h('div',{className:'vf26-wrap'},h('div',{className:'vfh-route-grid'},
   h('div',{className:'vfh-route'},h('p',{className:'vfh-label'},'Train in Nassau'),h('p',{className:'vfh-route-t'},'Semi private coaching, up to 4 clients'),
    h('p',{className:'vfh-route-p'},h('b',null,'12 sessions for $195'),' per person ($16.25 a session). 60 minute sessions. Gym membership is separate.'),
    h('button',{type:'button',className:'vf26-link',onClick:function(){vfTrack('coaching_path_selected',{path:'Train in Nassau'});setTab('semi');scrollToId('vf26-packages')();}},'Nassau packages',icon('arrow',15))),
   h('div',{className:'vfh-route'},h('p',{className:'vfh-label'},'Train online'),h('p',{className:'vfh-route-t'},'The VFIT app, with a coach if you want one'),
    h('p',{className:'vfh-route-p'},h('b',null,'From $19.99 a month'),'. Online coaching with a VFITNESS coach from $197 a month.'),
    h('button',{type:'button',className:'vf26-link',onClick:function(){vfTrack('coaching_path_selected',{path:'Train online'});scrollToId('vf26-remote')();}},'Online plans',icon('arrow',15)))))),

  h('section',{className:'vf26-section tight',id:'inperson'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'In person training',title:'Personal training in Nassau, The Bahamas.'}),
   h('div',{className:'vf26-svc-grid'},services.map(function(s,i){return h(Reveal,{key:s.name,className:'vf26-svc'+(s.hi?' hi':''),delay:i*70},
    h('span',{className:'vf26-icon-tile'},icon(s.icon,20)),
    h('h3',null,s.name),h('p',null,s.who),
    h('div',{className:'pr'},h('b',null,s.price),s.unit?h('small',null,s.unit):null,s.price!=='Free'&&s.price!=='Ask'&&s.price!=='By request'?h('em',null,'from'):null),
    h('button',{className:'vf26-btn '+(s.hi?'vf26-btn-primary':'vf26-btn-outline'),onClick:s.act},s.cta));})))),

  h('section',{className:'vf26-section tight',id:'vf26-packages'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{row:true,kicker:'Semi private packages',title:'12 sessions for $195 per person.',lead:'Small groups of up to 4, 60 minute sessions. Gym membership is separate. Buy a block of sessions and track every one in your client portal. 1 on 1 coaching is by request.',right:tab==='one'?h(TabList,{id:'vf26-pkgtabs',label:'Training type',value:tab,onChange:setTab,options:[{value:'semi',label:'Semi private'},{value:'one',label:'1 on 1'}]}):null}),
   h('div',tabPanel('vf26-pkgtabs',tab,{className:'vf26-pkg-grid',key:tab}),list.map(function(pkg,i){var s=pkgSavings(pkg,base);var per=s.per;var save=s.amount;var best=pkg===bestPkg;
    return h('div',{key:pkg.sessions,className:'vf26-pkg vf26-enter'+(best?' best':''),style:{'--d':(i*60)+'ms'}},
     best?h('span',{className:'tag'},'Best value'+(s.pct?' · save '+s.pctLabel:'')):(s.pct>0?h('span',{className:'tag soft'},'Save '+s.pctLabel):null),
     h('div',{className:'ses'},h('b',{className:'vf26-condensed'},pkg.sessions),h('span',null,pkg.sessions===1?'session':'sessions')),
     h('div',{className:'amt'},'$'+pkg.price),
     h('div',{className:'per'},'$'+(per%1?per.toFixed(2):per)+' per session'),
     save>0?h('div',{className:'sv'},icon('check',13),'You save $'+money(save)+' vs single sessions'):h('div',{className:'sv muted'},pkg.sessions===1?'Pay as you go':'Prepaid. Use within 45 days.'),
     h('button',{className:'vf26-btn '+(best?'vf26-btn-blend':'vf26-btn-primary'),onClick:function(){select(pkg);}},'Select package'));})),
   tab==='semi'?h(SemiGroups,{user:user,setCurrentPage:setCurrentPage}):null,
   tab==='semi'?h(SemiTerms,null):null,
   h('p',{className:'vf26-note'},user?'Choose a package and pick your coach at checkout.':'Sign in or create an account to purchase. Your session balance appears in your dashboard.'))),

  h(FitTogether,null),
  h(OnlinePlans,null),

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'FAQ',title:'Questions before you buy.'}),h(Faq,null))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,secondaryPage:'contact',secondaryLabel:'Contact us'}),
  typeof TrainerSelectionModal==='function'?h(TrainerSelectionModal,{isOpen:showModal,onClose:function(){setShowModal(false);},selectedPackage:selected,user:user,theme:theme}):null);
}

/* ================= TRAINERS ================= */
var TRAINERS=[
 {name:'Darvano Andrews',first:'Darvano',role:'Founder and Head Coach',photo:'/vf26/darvano-andrews.webp',specialty:'Body recomposition and glute specialist',experience:'10+ years',phone:'242-454-9063',rating:'5.0',accent:'#4296f0',bio:'Founded VFitness in 2018. Builds shape, muscle and confidence through structured programming, progressive overload, nutrition support and accountability.',certs:['Certified Personal Trainer','Functional Movement','Nutrition Coaching'],spec:['Body recomposition','Glute development','Muscle gain']},
 {name:'Chavese Moss',first:'Chavese',role:'Senior Coach and Partnerships Lead',specialty:'Weight loss and athletic coaching',experience:'8+ years',phone:'242-525-8834',rating:'4.9',accent:'#5fddcc',bio:'Helps clients lose fat, improve performance, move better and build athletic strength through disciplined coaching. Also leads business partnerships for the team.',certs:['Strength and Conditioning','Sports Performance'],spec:['Weight loss','Body recomposition','Athletic coaching']},
 {name:'Lanardo Mackey',first:'Lanardo',role:'Senior Personal Trainer and Partnerships Lead',specialty:'Weight loss and group training',experience:'7+ years',phone:'242-818-5128',rating:'4.9',accent:'#8869ec',bio:'Helps clients lose weight, improve conditioning and stay consistent through structured group and transformation coaching.',certs:['Sports Nutrition','Performance Coaching'],spec:['Weight loss','Conditioning','Group training']},
 {name:'Kevin Mackey',first:'Kevin',role:'Coach',specialty:'Body recomposition and group training',experience:'Team coach',phone:'242-454-9063',rating:'4.9',accent:'#F97066',bio:'Helps clients build structure, improve body composition and stay consistent through group training and accountability based coaching.',certs:['Group Training','Accountability Coaching'],spec:['Beginner coaching','Body recomposition','Group training']}
];
function TrainersPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Team',title:'Leadership and',accent:'coaching team.',lead:'Every VFitness coach works from the same programming, tracking and check in system, so your plan stays consistent whoever you train with.',
   chips:[['users','2,000+ clients served'],['pin','3 Nassau locations'],['globe','Online coaching']],aside:h(CoachWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Get matched with a coach',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'pricing')},'See pricing')]}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h('div',{className:'vf26-trainer-grid'},TRAINERS.map(function(t,i){var initials=t.name.split(' ').map(function(x){return x[0];}).join('');
    return h(Reveal,{key:t.name,className:'vf26-trainer',delay:i*80,style:{'--acc':t.accent}},
     h('div',{className:'vf26-trainer-media'},t.photo?h('img',{src:t.photo,alt:t.name,loading:'lazy'}):[h('span',{key:'r',className:'ring'}),h('span',{key:'m',className:'mono'},initials)],
      h('span',{className:'badge'},t.experience)),
     h('div',{className:'vf26-trainer-body'},
      h('div',{className:'nm'},t.name),h('div',{className:'rl'},t.role),
      h('p',{className:'spc'},t.specialty),
      h('div',{className:'vf26-mini-stats'},
       h('div',null,h('b',{className:'vf26-condensed'},t.experience.replace(' years','').replace('Team coach','Team')),h('span',null,t.experience==='Team coach'?'Coach':'Years')),
       h('div',null,h('b',{className:'vf26-condensed'},t.clients||'1:1'),h('span',null,t.clients?'Clients':'Coaching'))),
      h('p',{className:'bio'},t.bio),
      h('div',{className:'sp'},t.spec.map(function(s){return h('span',{key:s,className:'vf26-chip'},s);})),
      h('div',{className:'certs'},t.certs.map(function(c){return h('span',{key:c},icon('award',14),c);})),
      h('div',{className:'acts'},
       h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{vf_lead_trainer:t.name})},'Train with '+t.first),
       h('a',{className:'vf26-btn vf26-btn-outline',href:'tel:+1'+t.phone.replace(/\D/g,''),'aria-label':'Call '+t.first},icon('phone',16),'Call'))));})))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},h('p',{className:'vf26-note'},'Choosing a coach is a preference, not a booking. We confirm availability with you, and if your first choice is full we offer another coach or time.'))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Not sure who to pick?',title:'We will match you with the right coach.',lead:'Tell us your goal, schedule and location. We will pair you with the coach and program that fit.'}));
}

/* ================= RESULTS ================= */
var STORIES=[
 {goal:'Weight loss and body recomposition',time:'12 weeks',prog:'Total Transformation',freq:'3x weekly training',method:['Strength training','Protein target','Daily steps','Weekly check ins'],result:'Waist down, strength up, confidence transformed.',img:'/program-shred.jpg'},
 {goal:'Glute building and waist reduction',time:'8 to 12 weeks',prog:'Hourglass Method',freq:'3x weekly glute focused training',method:['Progressive overload','Glute isolation work','Nutrition structure','Photos and measurements'],result:'Rounder glutes, tighter waist, visible shape change.',img:'/program-hourglass.jpg'},
 {goal:'Muscle gain and fat loss',time:'12 weeks',prog:'Alpha Build',freq:'3x weekly strength split',method:['Chest and arms focus','Strength tracking','Fat loss support','Weekly accountability'],result:'Bigger chest and arms with a leaner stomach.',img:'/program-mass.jpg'},
 {goal:'Full lifestyle change',time:'16 weeks',prog:'Online Coaching',freq:'4x weekly from anywhere',method:['App based workout plan','Meal guidance','Weekly check ins','Trainer messaging'],result:'Consistent training and tracked progress without a trainer on site.',img:'/vf26/fuel-the-fire-v1.webp'}
];
/* ================= THE VFITNESS JOURNEY (results page) =================
   Story viewer for the published gallery (Firestore "gallery"). Shows only what each entry actually has:
   the photo exactly as uploaded (never cropped, never altered), the service, and any story fields an admin
   filled in (displayName, goal, approach, duration, frequency, quote; description is the documented progress).
   Manual by default; optional Play pauses on interaction, off screen and in background tabs. */
function vfjService(g){var t=((g.category||'')+' '+(g.title||'')+' '+(g.description||'')).toLowerCase();
 if(/semi/.test(t))return {k:'semi',l:'Semi-private coaching',cta:'Explore semi-private coaching',id:'vf26-packages'};
 if(/1\s*on\s*1|1on1|one on one|personal training/.test(t))return {k:'one',l:'1 on 1 coaching',cta:'Ask about 1 on 1 coaching',id:'inperson'};
 if(/online|remote/.test(t))return {k:'online',l:'Online coaching',cta:'See online plans',id:'vf26-remote'};
 if(/boot ?camp|program/.test(t))return {k:'program',l:'Training program',cta:'See online plans',id:'vf26-remote'};
 return {k:'other',l:'VFITNESS coaching',cta:'Find my starting point',id:null};}
function vfjGoal(g){var t=((g.goal||'')+' '+(g.description||'')+' '+(g.title||'')).toLowerCase();
 if(/gain|muscle|bulk/.test(t))return 'gain';if(/loss|lbs down|lose|weight loss|leaner|slimmer/.test(t))return 'loss';return null;}
function vfjClean(s){s=String(s||'').trim();if(!s)return '';if(s===s.toUpperCase()&&/[A-Z]{3}/.test(s))s=s.charAt(0)+s.slice(1).toLowerCase();return s;}
function useResultStories(){
 var st=React.useState(null),list=st[0],set=st[1];
 React.useEffect(function(){try{db.collection('gallery').get().then(function(snap){
  set(snap.docs.map(function(d){return Object.assign({id:d.id},d.data());}).filter(function(x){return x.imageUrl&&x.status!=='draft'&&x.status!=='archived';})
   .sort(function(a,b){var da=a.createdAt&&a.createdAt.toDate?a.createdAt.toDate():0,db_=b.createdAt&&b.createdAt.toDate?b.createdAt.toDate():0;return db_-da;}));
 }).catch(function(){set([]);});}catch(e){set([]);}},[]);
 return list;}
function VFResultsJourney(props){
 var setCurrentPage=props.setCurrentPage,all=useResultStories();
 var fs=React.useState('all'),filter=fs[0],setFilter=fs[1];
 var is=React.useState(0),idx=is[0],setIdx=is[1];
 var ps=React.useState(false),playing=ps[0],setPlaying=ps[1];
 var ts=React.useState(0),tick=ts[0],setTick=ts[1];/* bumps on every change to replay the entrance */
 var os=React.useState(false),full=os[0],setFull=os[1];
 var root=React.useRef(null),strip=React.useRef(null),frame=React.useRef(null),vis=React.useRef(true),touch=React.useRef(null);
 var items=(all||[]).map(function(g,i){return Object.assign({},g,{n:i,svc:vfjService(g),goalK:vfjGoal(g)});});
 var FILTERS=[['all','All'],['semi','Semi-private'],['one','1 on 1'],['online','Online'],['program','Programs'],['gain','Muscle gain'],['loss','Fat loss']].filter(function(f){
  return f[0]==='all'||items.some(function(x){return x.svc.k===f[0]||x.goalK===f[0];});});
 var list=items.filter(function(x){return filter==='all'||x.svc.k===filter||x.goalK===filter;});
 var n=list.length,i=n?((idx%n)+n)%n:0,cur=list[i];
 function goTo(k,user){if(!n)return;if(user)setPlaying(false);setIdx(((k%n)+n)%n);setTick(function(t){return t+1;});}
 React.useEffect(function(){if(!cur)return;var nx=list[(i+1)%n];if(nx){var im=new Image();im.src=nx.imageUrl;}
  var el=strip.current&&strip.current.querySelector('[aria-current="true"]');if(el){try{el.scrollIntoView({block:'nearest',inline:'center',behavior:reduceMotion?'auto':'smooth'});}catch(e){}}},[i,filter,n]);
 React.useEffect(function(){if(!playing||!n)return;var t=setTimeout(function(){if(vis.current&&!document.hidden)goTo(i+1);},9000);return function(){clearTimeout(t);};},[playing,i,n,tick]);
 React.useEffect(function(){var el=root.current;if(!el||typeof IntersectionObserver==='undefined')return;var io=new IntersectionObserver(function(en){vis.current=en[0].isIntersecting;if(!vis.current)setPlaying(false);},{threshold:.2});io.observe(el);
  function hid(){if(document.hidden)setPlaying(false);}document.addEventListener('visibilitychange',hid);return function(){io.disconnect();document.removeEventListener('visibilitychange',hid);};},[!!all]);
 function onKey(e){if(e.target&&/input|textarea|select/i.test(e.target.tagName))return;if(e.key==='ArrowRight'){e.preventDefault();goTo(i+1,true);}else if(e.key==='ArrowLeft'){e.preventDefault();goTo(i-1,true);}}
 function tilt(e){if(reduceMotion||coarse)return;var f=frame.current;if(!f)return;var r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
  f.style.setProperty('--mx',(x*100).toFixed(1)+'%');f.style.setProperty('--my',(y*100).toFixed(1)+'%');f.style.setProperty('--rx',((.5-y)*3).toFixed(2)+'deg');f.style.setProperty('--ry',((x-.5)*3).toFixed(2)+'deg');}
 function untilt(){var f=frame.current;if(!f)return;f.style.setProperty('--rx','0deg');f.style.setProperty('--ry','0deg');}
 if(all===null)return h('div',{className:'vfj vfj-loading',role:'status'},h('p',null,'Loading client results...'));
 if(!items.length)return null;
 var pad=function(v){return (v<10?'0':'')+v;};
 var label=function(x){var t=vfjClean(x.title);if(t&&/before|after|training|trainer|coaching|client|program|results?$/i.test(t))t='';return vfjClean(x.displayName)||t||('Client story '+pad(x.n+1));};
 var chapters=cur?[['The goal',vfjClean(cur.goal)],['The approach',vfjClean(cur.approach)],['The progress',vfjClean(cur.description)]].filter(function(c){return c[1];}):[];
 var facts=cur?[['Training period',vfjClean(cur.duration)],['Sessions per week',vfjClean(cur.frequency)]].filter(function(c){return c[1];}):[];
 var cta=cur&&cur.svc.id?function(){go(setCurrentPage,'pricing')();var id=cur.svc.id;setTimeout(scrollToId(id),400);}:lead(setCurrentPage,{});
 return h('div',{ref:root,className:'vfj',role:'region','aria-roledescription':'carousel','aria-label':'Client stories',onKeyDown:onKey},
  FILTERS.length>2?h('div',{className:'vfj-filters',role:'group','aria-label':'Filter client stories'},FILTERS.map(function(f){return h('button',{key:f[0],type:'button',className:'vf26-chip vfj-filter','aria-pressed':filter===f[0]?'true':'false',
   onClick:function(){setFilter(f[0]);setIdx(0);setPlaying(false);setTick(function(t){return t+1;});}},f[1]);})):null,
  cur?h('div',{className:'vfj-main'},
   h('div',{className:'vfj-stage',onTouchStart:function(e){touch.current=e.touches[0].clientX;},onTouchEnd:function(e){if(touch.current==null)return;var d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>50)goTo(d>0?i+1:i-1,true);touch.current=null;}},
    h('div',{className:'vfj-deck','aria-hidden':'true'},h('span',null),h('span',null)),
    h('div',{ref:frame,className:'vfj-frame',onPointerMove:tilt,onPointerLeave:untilt},
     h('img',{key:cur.id+'-'+tick,src:cur.imageUrl,alt:'Client transformation '+(i+1)+' of '+n+': '+cur.svc.l+(vfjClean(cur.description)?'. '+vfjClean(cur.description):''),className:'vfj-img',decoding:'async'}),
     h('span',{className:'vfj-badge'},icon('camera',13),'Real client, shared with consent'),
     h('button',{type:'button',className:'vfj-open',onClick:function(){setPlaying(false);setFull(true);},'aria-haspopup':'dialog'},icon('expand',14),'Open full image'))),
   h('div',{className:'vfj-story',key:'s'+cur.id+'-'+tick,'aria-live':playing?'off':'polite'},
    h('p',{className:'vfj-count vf26-tabular'},pad(i+1)+' / '+pad(n)),
    h('p',{className:'vfj-svc'},cur.svc.l),
    h('h3',{className:'vfj-h'},label(cur)),
    chapters.length?h('dl',{className:'vfj-ch'},chapters.map(function(c,k){return h('div',{key:c[0],style:{'--k':k}},h('dt',null,c[0]),h('dd',null,c[1]));})):
     h('p',{className:'vfj-none'},'Photo shared with the client’s consent. Ask us about the program behind this result.'),
    facts.length?h('div',{className:'vfj-facts'},facts.map(function(f,k){return h('div',{key:f[0],style:{'--k':k+chapters.length}},h('span',null,f[0]),h('b',null,f[1]));})):null,
    vfjClean(cur.quote)?h('blockquote',{className:'vfj-quote'},'“'+vfjClean(cur.quote)+'”'):null,
    h('button',{type:'button',className:'vf26-btn vf26-btn-primary vfj-cta',onClick:cta},cur.svc.cta,icon('arrow',16,{className:'vf26-arrow'})),
    h('div',{className:'vfj-nav'},
     h('button',{type:'button',className:'vf26-round',onClick:function(){goTo(i-1,true);},'aria-label':'Previous story'},icon('left',18)),
     h('button',{type:'button',className:'vf26-round',onClick:function(){goTo(i+1,true);},'aria-label':'Next story'},icon('right',18)),
     reduceMotion||n<2?null:h('button',{type:'button',className:'vfj-play','aria-pressed':playing?'true':'false',onClick:function(){setPlaying(!playing);}},playing?'Pause':'Play')))):null,
  h('div',{ref:strip,className:'vfj-strip',role:'list','aria-label':'All client stories'},list.map(function(x,k){return h('div',{key:x.id,role:'listitem'},
   h('button',{type:'button',className:'vfj-thumb','aria-current':k===i?'true':'false','aria-label':'Story '+(k+1)+' of '+n+': '+x.svc.l,onClick:function(){goTo(k,true);}},
    h('img',{src:x.imageUrl,alt:'',loading:'lazy',decoding:'async'}),h('span',{className:'t'},h('b',null,label(x)),h('small',null,x.svc.l))));})),
  full&&cur?h(VFJFull,{item:cur,onClose:function(){setFull(false);}}):null,
  h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences. Details are shown only where the client’s records support them.'));
}
function VFJFull(p){var ref=React.useRef(null);useDialog(true,p.onClose,ref);
 return h('div',{className:'vfh-dlg-back',onClick:function(e){if(e.target===e.currentTarget)p.onClose();}},
  h('div',{ref:ref,className:'vfj-full',role:'dialog','aria-modal':'true','aria-label':'Full image: '+p.item.svc.l},
   h('button',{type:'button',className:'vfh-dlg-x',onClick:p.onClose,'aria-label':'Close'},icon('close',20)),
   h('img',{src:p.item.imageUrl,alt:'Client transformation, full image'})));}
window.VFResultsJourney=VFResultsJourney;

/* Admin: story details for a gallery result (shown on the results page journey). Only fill what the client's
   records and consent support; empty fields are simply not shown. */
var VFJ_FIELDS=[['displayName','Client display name or approved label','e.g. Kayla, or leave empty for "Client story"'],['goal','The goal','What the client wanted, in their words'],
 ['approach','The approach','Service, training frequency and coaching approach'],['description','The progress','Documented outcome'],['duration','Training period','e.g. 12 weeks'],
 ['frequency','Sessions per week','e.g. 3'],['quote','Client statement (approved)','Their own words, with permission']];
function VF26StoryEditButton(p){var os=React.useState(false),open=os[0],setOpen=os[1];
 return h(React.Fragment,null,h('button',{type:'button',className:'vfj-edit-btn',onClick:function(){setOpen(true);}},'Story details'),
  open?h(VFJStoryEditor,{image:p.image,onClose:function(){setOpen(false);},onSaved:p.onSaved}):null);}
function VFJStoryEditor(p){var ref=React.useRef(null);useDialog(true,p.onClose,ref);var im=p.image||{};
 var init={category:im.category||''};VFJ_FIELDS.forEach(function(f){init[f[0]]=im[f[0]]||'';});
 var vs=React.useState(init),v=vs[0],setV=vs[1];var ss=React.useState(''),msg=ss[0],setMsg=ss[1];var bs=React.useState(false),busy=bs[0],setBusy=bs[1];
 function set(k,x){setV(function(o){var n=Object.assign({},o);n[k]=x;return n;});}
 function save(e){e.preventDefault();setBusy(true);setMsg('');var up={};Object.keys(v).forEach(function(k){up[k]=String(v[k]||'').trim().slice(0,600);});
  db.collection('gallery').doc(im.id).update(up).then(function(){setMsg('Saved.');p.onSaved&&p.onSaved();setTimeout(p.onClose,500);}).catch(function(err){setMsg('Could not save: '+(err.message||err));}).then(function(){setBusy(false);});}
 return h('div',{className:'vfh-dlg-back',onClick:function(e){if(e.target===e.currentTarget)p.onClose();}},
  h('form',{ref:ref,className:'vfh-dlg vfj-ed',role:'dialog','aria-modal':'true','aria-label':'Story details',onSubmit:save},
   h('button',{type:'button',className:'vfh-dlg-x',onClick:p.onClose,'aria-label':'Close'},icon('close',20)),
   h('div',{className:'vfh-dlg-body'},
    h('h2',{className:'vfh-dlg-h'},'Story details'),
    h('p',null,'Shown on the Results page. Only enter what the client’s records and consent support. Empty fields are not shown.'),
    h('label',{className:'vf26-adm-field'},h('span',null,'Service'),h('select',{value:v.category,onChange:function(e){set('category',e.target.value);}},
     [['','Work it out from the title'],['semi private','Semi-private coaching'],['1 on 1','1 on 1 coaching'],['online','Online coaching'],['program','Training program']].map(function(o){return h('option',{key:o[0],value:o[0]},o[1]);}))),
    VFJ_FIELDS.map(function(f){var long=/goal|approach|description|quote/.test(f[0]);return h('label',{key:f[0],className:'vf26-adm-field'},h('span',null,f[1]),
     h(long?'textarea':'input',{value:v[f[0]],rows:long?2:undefined,maxLength:600,placeholder:f[2],onChange:function(e){set(f[0],e.target.value);}}));}),
    h('p',{className:'vf26-adm-msg'+(/Could not/.test(msg)?' bad':''),role:'status'},msg),
    h('div',{className:'vfh-dlg-acts'},h('button',{type:'submit',className:'vf26-btn vf26-btn-primary',disabled:busy},busy?'Saving...':'Save story'),h('button',{type:'button',className:'vf26-btn vf26-btn-outline',onClick:p.onClose},'Cancel')))));}
window.VF26StoryEditButton=VF26StoryEditButton;

function VFResultsPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var hasShowcase=typeof TransformationShowcase==='function';
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Client results',title:'Real methods.',accent:'Tracked results.',lead:'Every VFitness transformation follows a documented method: structured training, nutrition support, weekly check ins and progress tracking. This is how results get built.',
   chips:[['users','2,000+ clients served'],['camera','Shared with consent'],['trend','Tracked week to week']],aside:h(ProgressWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start yours',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'pricing')},'See pricing')]}),
  h('section',{className:'vf26-section tight',id:'journey'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'The VFITNESS journey',title:'Real clients. Their progress.',lead:'Every photo is an original, shared with the client\u2019s consent. Pick a story, use the arrows or swipe.'}),
   h(VFResultsJourney,{setCurrentPage:setCurrentPage}))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Program examples',title:'How our programs are structured.',lead:'These describe how each program is built. They are examples, not individual client results. Real client photos are shown above.'}),
   h('div',{className:'vf26-story-grid'},STORIES.map(function(s,i){return h(Reveal,{key:s.prog,className:'vf26-story',delay:(i%2)*90},
    h('div',{className:'vf26-story-media'},h('img',{src:s.img,alt:s.prog,loading:'lazy',onError:function(e){e.target.style.visibility='hidden';}}),h('div',{className:'nm'},h('span',null,s.time),h('b',null,s.prog))),
    h('div',{className:'vf26-story-body'},
     h('div',{className:'vf26-story-facts'},[['Goal',s.goal],['Timeframe',s.time],['Training',s.freq],['Program',s.prog]].map(function(r){return h('div',{key:r[0]},h('span',null,r[0]),h('b',null,r[1]));})),
     h('div',{className:'sp'},s.method.map(function(m){return h('span',{key:m,className:'vf26-chip'},m);})),
     h('div',{className:'res'},icon('trend',16),h('span',null,h('b',null,'Program aim: '),s.result))));})),
   h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.'))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Your turn',title:'The next result could be yours.'}));
}


/* ================= EVENT STORY: PINK BEACH BURN 2026 ================= */
var PBB={
 title:'PINK Beach Burn 2026',date:'Saturday, October 31, 2026',place:"Goodman's Bay, Nassau",
 photos:[
  ['pbb26-1-group','The PINK Beach Burn crowd in pink under the VFitness tent at Goodman\'s Bay, holding Hope, Courage, Together and Fight signs'],
  ['pbb26-2-coaches','Four VFitness coaches in PINK Beach Burn shirts in front of the VFitness tent'],
  ['pbb26-3-leading','A VFitness coach with a microphone leading the group through a dumbbell and kettlebell circuit on the grass'],
  ['pbb26-4-signs','Three participants in pink smiling and holding Courage and Strength signs by the beach'],
  ['pbb26-5-circuit','Participants working through a dumbbell circuit between orange cones while a coach watches'],
  ['pbb26-6-kettlebells','A line of participants doing kettlebell squats under the palm trees'],
  ['pbb26-7-briefing','A coach in a Stronger Together shirt briefing a group before the next round'],
  ['pbb26-8-tent','Participants in pink gathering at the VFitness Train Smart Train Elite tent before the start'],
  ['pbb26-9-friends','Three participants in pink smiling together in front of the VFitness tent'],
  ['pbb26-10-banner','Two participants and a VFitness coach in a PINK Beach Burn shirt posing by the Train Smart Train Elite banner'],
  ['pbb26-11-cones','Participants at their cones with dumbbells on the grass, the sea behind them'],
  ['pbb26-12-rows','A participant in a pink shirt doing bent-over dumbbell rows while a coach watches the group'],
  ['pbb26-13-kettlebell','The group working through a dumbbell round beside the tent, a kettlebell in the foreground'],
  ['pbb26-14-plank','Participants holding a plank together in a circle on a red mat'],
  ['pbb26-15-warmup','A VFitness coach leading a warm-up as the morning sun comes through the palms'],
  ['pbb26-16-swings','A line of participants doing kettlebell deadlifts and swings under the palm trees'],
  ['pbb26-17-dj','The DJ giving a thumbs up from the booth under the tent'],
  ['pbb26-18-goblet','A line of participants doing goblet squats and kettlebell deadlifts while a coach counts the reps'],
  ['pbb26-19-stronger','A coach in a Stronger Together shirt guiding the group through kettlebell swings'],
  ['pbb26-20-jacks','The group doing jumping jacks with a coach in front'],
  ['pbb26-21-lineup','Participants, including a young participant, lined up at their cones listening to the next round'],
  ['pbb26-22-squats','Participants doing dumbbell squats and kettlebell deadlifts while a coach checks form'],
  ['pbb26-23-crowd','The full group in pink working through kettlebell swings, coaches walking the line'],
  ['pbb26-24-finale','The group finishing a kettlebell round together under the palms']
 ],
 videos:[
  {src:'/vf26/pbb26-video-run.mp4',poster:'/vf26/pbb26-video-run-poster.webp',title:'The warm-up',desc:'The whole group jogging across the field to start the morning. 9 seconds.'},
  {src:'/vf26/pbb26-video-stations.mp4',poster:'/vf26/pbb26-video-stations-poster.webp',title:'Four stations',desc:'The four station setup, with groups rotating through each one. 33 seconds.'},
  {src:'/vf26/pbb26-video-warmup.mp4',poster:'/vf26/pbb26-video-warmup-poster.webp',title:'On the field',desc:'Coaches leading the group through the morning. 12 seconds.'},
  {src:'/vf26/pbb26-video-jacks.mp4',poster:'/vf26/pbb26-video-jacks-poster.webp',title:'Arms up',desc:'Jumping jacks with the whole group. 2 seconds.'}
 ]};
function pbbSrc(i,sm){return '/vf26/'+PBB.photos[i][0]+(sm?'-sm':'')+'.webp';}
function EventStoryCard(p){
 return h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
  h(Reveal,{className:'vf26-evcard'},
   h('button',{type:'button',className:'vf26-evcard-media',onClick:go(p.setCurrentPage,'pinkbeachburn'),'aria-label':'Read the PINK Beach Burn story'},
    h('img',{src:pbbSrc(0,true),alt:PBB.photos[0][1],loading:'lazy',decoding:'async'})),
   h('div',{className:'vf26-evcard-copy'},
    h('p',{className:'vf26-kicker'},'From the community'),
    h('h2',{className:'vf26-h2'},'Nassau showed up in pink.'),
    h('p',{className:'vf26-lead'},"PINK Beach Burn filled Goodman's Bay on Saturday, October 31 for a free bootcamp for Breast Cancer Awareness Month. Here is how the morning went."),
    h('div',{className:'vf26-evcard-thumbs','aria-hidden':'true'},[1,3,5].map(function(i){return h('img',{key:i,src:pbbSrc(i,true),alt:'',loading:'lazy',decoding:'async'});})),
    h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(p.setCurrentPage,'pinkbeachburn')},'Read the story and see the photos',icon('arrow',16,{className:'vf26-arrow'}))))));
}
function EventLightbox(p){
 var i=p.index,n=PBB.photos.length,ref=React.useRef(null);
 useDialog(true,p.onClose,ref);
 React.useEffect(function(){function k(e){if(e.key==='ArrowRight')p.onGo(1);else if(e.key==='ArrowLeft')p.onGo(-1);}
  window.addEventListener('keydown',k);return function(){window.removeEventListener('keydown',k);};},[]);
 return h('div',{ref:ref,className:'vf26-evbox',role:'dialog','aria-modal':'true','aria-label':'Photo '+(i+1)+' of '+n,onClick:function(e){if(e.target===e.currentTarget)p.onClose();}},
  h('button',{type:'button',className:'vf26-evbox-x',onClick:p.onClose,'aria-label':'Close photo'},icon('close',20)),
  h('button',{type:'button',className:'vf26-evbox-nav prev',onClick:function(){p.onGo(-1);},'aria-label':'Previous photo'},icon('arrow',20)),
  h('figure',null,h('img',{src:pbbSrc(i),alt:PBB.photos[i][1]}),h('figcaption',{'aria-live':'polite'},PBB.photos[i][1],h('span',null,(i+1)+' / '+n))),
  h('button',{type:'button',className:'vf26-evbox-nav next',onClick:function(){p.onGo(1);},'aria-label':'Next photo'},icon('arrow',20)));
}
function VFEventStoryPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var st=React.useState(null),open=st[0],setOpen=st[1];var n=PBB.photos.length;
 var WORDS=['Love','Strength','Hope','Courage','Unity','Purpose'];
 var LETTER=[
  'The rain tried to stop the show, but when God has a purpose, no obstacle can stand in the way!',
  'Today was about so much more than fitness. It was about LOVE, STRENGTH, HOPE, COURAGE, UNITY, and PURPOSE.',
  'From the bottom of my heart, THANK YOU to every single person who showed up for our Pink Beach Burn Breast Cancer Awareness Bootcamp. Despite the weather, you came out, showed love, broke a sweat, and stood together for something greater than ourselves.',
  'This event was deeply personal to me. I lost my mother to breast cancer on February 10, 2010. I witnessed firsthand the challenges, pain, and battles that come with this disease. So when I tell you that this event meant everything to me, I mean that from the deepest part of my heart.',
  'Seeing everyone come together reminded me that even though we may lose the people we love, their stories, their strength, and their legacy can continue to inspire others.',
  'To Empire Fitness, our supporters, volunteers, and everyone who contributed in any way, thank you for standing behind this cause.',
  'And to every participant who showed up, whether you came to exercise, support someone you love, honor someone you\u2019ve lost, or celebrate your own journey, YOU ARE THE REASON THIS EVENT WAS SPECIAL.',
  'Today reminded me of something powerful:',
  {q:1,t:'The weather may change our plans, but it can never change God\u2019s purpose.'},
  {q:1,t:'Mom, this one was for you.'},
  'This wasn\u2019t just a bootcamp. It was a movement. It was a community. It was a purpose fulfilled.'
 ];
 return h('main',{className:'vf26 vf26-page vf26-ev-page'},
  h(PageHero,{eyebrow:'Community event · '+PBB.date,title:'PINK Beach Burn.',accent:'Move. Sweat. Support.',
   lead:"On Saturday morning, October 31, the VFitness community filled Goodman's Bay in pink for a free beach bootcamp for Breast Cancer Awareness Month.",
   actions:[h('a',{key:'ig',className:'vf26-btn vf26-btn-primary',href:'https://www.instagram.com/xvfitnessx/',target:'_blank',rel:'noopener'},icon('instagram',16),'Follow @xvfitnessx for the next one'),
    h('button',{key:'s',className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{})},'Train with VFitness')],
   media:h('button',{type:'button',className:'vf26-ev-hero',onClick:function(){setOpen(0);},'aria-label':'View the group photo full size'},h('img',{src:pbbSrc(0),alt:PBB.photos[0][1],fetchpriority:'high'}))}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap vf26-ev-story'},
   h(Reveal,{className:'vf26-ev-text vf26-ev-letter'},
    h('p',{className:'vf26-kicker'},'PINK BEACH BURN 2026'),
    h('h2',{className:'vf26-h2'},'GOD’S PURPOSE WILL ALWAYS PREVAIL!'),
    LETTER.map(function(t,i){return h('p',{key:i,className:t.q?'q':''},t.t||t);}),
    h('div',{className:'vf26-ev-sign'},h('p',null,'With love and gratitude,'),h('b',null,'Mr. VFITNESS'),h('span',null,'PINK BEACH BURN 2026'),h('span',null,'MOVE. SWEAT. SUPPORT. TOGETHER.')),
    h('div',{className:'vf26-ev-words'},WORDS.map(function(w){return h('span',{key:w},w);})),
    h('p',{className:'vf26-ev-place'},icon('pin',15),PBB.place,' · ',PBB.date)))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Photos',title:'The morning in pictures.',lead:PBB.photos.length+' photos from the morning. Tap any photo to see it full size.'}),
   h('ul',{className:'vf26-ev-grid'},PBB.photos.map(function(ph,i){return h('li',{key:ph[0],className:i===0?'wide':''},
    h('button',{type:'button',onClick:function(){setOpen(i);},'aria-label':'View photo '+(i+1)+' of '+n+': '+ph[1]},
     h('img',{src:pbbSrc(i,true),alt:ph[1],loading:'lazy',decoding:'async'})));})))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Video',title:'See it move.',lead:'Press play to watch. The clips have no sound.'}),
   h('div',{className:'vf26-ev-videos'},PBB.videos.map(function(v){return h('figure',{key:v.src,className:'vf26-ev-video'},
    h('video',{src:v.src,poster:v.poster,controls:true,muted:true,playsInline:true,preload:'none',width:1280,height:720,'aria-label':v.title+'. '+v.desc}),
    h('figcaption',null,h('b',null,v.title),' ',v.desc));})))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Join us next time',title:'Train with the VFitness community.',lead:'Follow @xvfitnessx for our next community event, or book a free consultation and start training with a VFitness coach.'}),
  open!=null?h(EventLightbox,{index:open,onClose:function(){setOpen(null);},onGo:function(d){setOpen(function(v){return ((v+d)%n+n)%n;});}}):null);
}
window.VFEventStoryPage=VFEventStoryPage;

/* ================= LOCATIONS ================= */
function VFLocationsPage(props){return h(VFContactPage,props);}

/* ================= CONTACT ================= */
function VFContactPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var cards=[
  {ic:'chat',t:'Message on WhatsApp',d:'Fastest response. Coaching questions, packages and bookings.',v:'Open WhatsApp',href:waLink('contact'),ext:true,acc:'#25D366'},
  {ic:'mail',t:'Email VFitness',d:'Applications, invoices and general questions.',v:VF_EMAIL,href:'mailto:'+VF_EMAIL,acc:'#4296f0'},
  {ic:'phone',t:'Call or text',d:'Reach the VFitness line directly.',v:VF_PHONE,href:VF_TEL,acc:'#8869ec'}
 ];
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Contact',title:'Contact',accent:'VFitness.',lead:'Questions about services, packages, payments or locations. Our team responds within one business day.'}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h('h2',{className:'sr-only'},'Ways to reach us'),h('div',{className:'vf26-contact-grid'},cards.map(function(c,i){return h(Reveal,{key:c.t,delay:i*80},
    h('a',{className:'vf26-contact',href:c.href,target:c.ext?'_blank':undefined,rel:c.ext?'noopener noreferrer':undefined,style:{'--acc':c.acc}},
     h('span',{className:'ic'},icon(c.ic,22)),h('h3',null,c.t),h('p',null,c.d),h('span',{className:'v'},c.v,icon('arrow',15))));})),
   h('div',{className:'vf26-contact-split'},
    h(Reveal,{className:'vf26-panel vf26-contact-start'},h('p',{className:'vf26-kicker'},'Ready to start?'),h('h3',{className:'vf26-h3',style:{fontSize:'1.6rem'}},'Skip the back and forth.'),
     h('p',{className:'vf26-muted'},'Create your account and tell us your goal. A coach will reach out with the right plan, location and package.'),
     h('div',{className:'vf26-cta-row'},h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Request my free consultation',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Book a free consult'))),
    h(Reveal,{delay:90},h(HoursCard,null))))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Locations',title:'Where we train.'}),h(LocationCards,{setCurrentPage:setCurrentPage}))));
}

/* ================= ABOUT ================= */
function Gallery(){
 var gs=React.useState([]),gallery=gs[0],setGallery=gs[1];
 var is=React.useState(0),idx=is[0],setIdx=is[1];
 var ps=React.useState(false),paused=ps[0],setPaused=ps[1];
 var fs=React.useState(false),full=fs[0],setFull=fs[1];
 var touch=React.useRef(null);
 React.useEffect(function(){try{db.collection('gallery').get().then(function(snap){var imgs=snap.docs.map(function(d){return Object.assign({id:d.id},d.data());}).filter(function(x){return x.imageUrl;}).sort(function(a,b){var da=a.createdAt&&a.createdAt.toDate?a.createdAt.toDate():new Date(0);var dbb=b.createdAt&&b.createdAt.toDate?b.createdAt.toDate():new Date(0);return dbb-da;});setGallery(imgs);}).catch(function(){});}catch(e){}},[]);
 var n=gallery.length;
 function next(){setIdx(function(i){return n?(i+1)%n:0;});}
 function prev(){setIdx(function(i){return n?(i-1+n)%n:0;});}
 React.useEffect(function(){if(n<2||paused||reduceMotion)return;var t=setTimeout(next,5000);return function(){clearTimeout(t);};},[n,idx,paused]);
 React.useEffect(function(){function k(e){if(e.key==='ArrowRight')next();if(e.key==='ArrowLeft')prev();if(e.key==='Escape')setFull(false);}window.addEventListener('keydown',k);return function(){window.removeEventListener('keydown',k);};},[n]);
 if(!n)return h('div',{className:'vf26-gallery empty'},h('img',{src:'/vf26/strength-editorial-v1.webp',alt:'VFitness training session'}));
 var cur=gallery[idx]||gallery[0];
 return h('div',{className:'vf26-gallery',onMouseEnter:function(){setPaused(true);},onMouseLeave:function(){setPaused(false);}},
  h('div',{className:'vf26-gallery-main',onTouchStart:function(e){touch.current=e.touches[0].clientX;},onTouchEnd:function(e){if(touch.current==null)return;var d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>50){d>0?next():prev();}touch.current=null;}},
   h('img',{key:cur.id,src:cur.imageUrl,alt:cur.title||'VFitness gallery',className:'vf26-photo-reveal'}),
   (cur.title||cur.description)?h('div',{className:'cap'},cur.title?h('b',null,cur.title):null,cur.description?h('span',null,cur.description):null):null,
   h('div',{className:'ctrl'},
    h('button',{className:'vf26-round',onClick:prev,'aria-label':'Previous photo'},icon('left',18)),
    h('span',{className:'cnt vf26-tabular'},(idx+1)+' / '+n),
    h('button',{className:'vf26-round',onClick:next,'aria-label':'Next photo'},icon('right',18)),
    h('button',{className:'vf26-round',onClick:function(){setFull(true);},'aria-label':'View full screen'},icon('expand',16))),
   h('div',{className:'bar'},h('i',{key:idx+(paused?'p':''),className:paused||reduceMotion?'':'run'}))),
  n>1?h('div',{className:'vf26-thumbs'},gallery.map(function(g,i){return h('button',{key:g.id,className:i===idx?'on':'',onClick:function(){setIdx(i);},'aria-label':'Show photo '+(i+1)},h('img',{src:g.imageUrl,alt:'',loading:'lazy'}));})):null,
  full?h('div',{className:'vf26-lightbox',role:'dialog','aria-label':'Photo viewer',onClick:function(){setFull(false);}},
   h('img',{src:cur.imageUrl,alt:cur.title||''}),
   h('button',{className:'vf26-round x',onClick:function(){setFull(false);},'aria-label':'Close'},icon('close',18))):null);
}
function AboutPage(props){
 var setCurrentPage=props.setCurrentPage||window.__vf26SetPage||function(){};useTop();
 var values=[
  ['Structure','Every client works from a written program with clear targets, reviewed by their coach.'],
  ['Accountability','Sessions, packages and payments are recorded, so clients always know where they stand.'],
  ['Transparency','Published pricing, no lock in contracts and invoices for every package.'],
  ['Local expertise','A Nassau team that knows the gyms, the schedules and the way people live here.']];
 var facts=[['Founded','2018'],['Coaching team','4 certified coaches'],['Clients served','2,000+'],['Locations','3 in Nassau, plus online'],['Business licence','Licensed in The Bahamas']];
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Company',title:'VFITNESS',accent:'Training Services.',lead:'A Nassau coaching team delivering personal training across three locations and online coaching through the VFIT app.'}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap vf26-about2'},
   h(Reveal,{className:'vf26-about2-media'},h('img',{src:'/vf26/welcome-glute-v1.webp',alt:'A VFitness client training in a Nassau gym',loading:'lazy'})),
   h(Reveal,{className:'vf26-about2-copy',delay:80},
    h('p',{className:'vf26-kicker'},'Our story'),
    h('h2',{className:'vf26-h2'},'One team. One coaching standard.'),
    h('p',{className:'vf26-lead'},'Since 2018 VFitness has grown into a team of four certified coaches serving more than 2,000 clients. Every coach works from the same programming, tracking and client care standard, so the experience is consistent whoever you train with.'),
    h('p',{className:'vf26-muted'},'Today VFitness runs in person training at Empire Fitness, Fanta C Fitness and the Royal Bahamas Police College, and online coaching through the VFIT app. Clients register, book, pay and manage their sessions through a single client portal.'),
    h('dl',{className:'vf26-facts'},facts.map(function(f){return h('div',{key:f[0]},h('dt',null,f[0]),h('dd',null,f[1]));}))))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{row:true,kicker:'The team',title:'The coaches behind VFitness.',right:h('button',{className:'vf26-link',onClick:go(setCurrentPage,'trainers')},'Full profiles',icon('arrow',16))}),
   h(TeamRow,{setCurrentPage:setCurrentPage}))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-licence'},
    h('span',{className:'vf26-licence-ic'},icon('shield',22)),
    h('div',null,
     h('p',{className:'vf26-kicker'},'Licensed business'),
     h('h3',null,'VFITNESS is a licensed business in The Bahamas.'),
     h('p',null,'Business Licence No. '+VF_LICENCE.no+', issued by the '+VF_LICENCE.by+' under the '+VF_LICENCE.act+'. Licensed for personal training and exercise services, valid through '+VF_LICENCE.until+'.'))))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Our standards',title:'What clients can expect.'}),
   h('div',{className:'vf26-values'},values.map(function(v,i){return h(Reveal,{key:v[0],className:'vf26-value',delay:i*60},h('span',{className:'n'},String(i+1).padStart(2,'0')),h('b',null,v[0]),h('p',null,v[1]));})))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,secondaryPage:'trainers',secondaryLabel:'Meet the team'}));
}

/* ================= FUNCTIONAL PAGES: app shell around the existing flows ================= */
function legacy(name){return window['VFLegacy'+name];}
function AuthAside(p){
 return h('aside',{className:'vf26-auth-aside'},
  h('div',{className:'vf26-auth-aside-in'},
   h('div',{className:'vf26-eyebrow'},h('i'),p.eyebrow),
   h('h2',{className:'vf26-ph1',style:{fontSize:'clamp(2rem,3.4vw,3rem)'}},p.title,h('span',null,p.accent)),
   h('p',{className:'vf26-lead'},p.lead),
   h('ul',{className:'vf26-ticks'},p.points.map(function(t){return h('li',{key:t},icon('check',15),t);})),
   h('div',{className:'vf26-auth-stat'},h('div',null,h('b',{className:'vf26-condensed'},'2,000+'),h('span',null,'Clients served')),h('div',null,h('b',{className:'vf26-condensed'},'3'),h('span',null,'Locations')),h('div',null,h('b',{className:'vf26-condensed'},'4'),h('span',null,'Coaches')))));
}
function hideLegacyHero(root){
 if(!root)return;
 var hd=root.querySelector('h1, h2');if(!hd)return;
 var el=hd.parentElement,pick=null;
 while(el&&el!==root){var cls=(el.className&&el.className.baseVal===undefined)?String(el.className):'';
  if(/rounded/.test(cls)&&!el.querySelector('button,input,select,textarea')){pick=el;}
  if(el.querySelector('button,input,select,textarea'))break;
  el=el.parentElement;}
 if(pick){pick.style.display='none';pick.setAttribute('data-vf26-hidden','hero');}
}
function StoreShell(p){
 var ref=React.useRef(null);
 React.useEffect(function(){var t=[0,250,900,2000].map(function(ms){return setTimeout(function(){hideLegacyHero(ref.current);},ms);});return function(){t.forEach(clearTimeout);};},[]);
 return h('main',{className:'vf26-shell vf26-shell-store vf26-shell-'+p.name},
  h(PageHero,p.hero),
  h('div',{ref:ref,className:'vf26-shell-inner'},p.children));
}
function shell(name,kind,extra){
 return function(props){
  var L=legacy(name);
  if(!L)return null;
  var inner=h(L,props);
  if(kind==='auth'){
   return h('main',{className:'vf26 vf26-shell vf26-shell-auth vf26-shell-'+name},
    (name==='LoginPage'||name==='SignupPage')?h('h1',{className:'sr-only'},extra.title+' '+extra.accent):null,
    h('div',{className:'vf26-auth-grid'},h(AuthAside,extra),h('div',{className:'vf26-auth-main'},inner)));
  }
  if(kind==='store'&&extra){return h(StoreShell,{name:name,hero:extra},inner);}
  return h(kind==='member'?'div':'main',{className:'vf26-shell vf26-shell-'+name+(kind?' vf26-shell-'+kind:'')},inner);
 };
}
function membersOnly(name){
 var inner=shell(name,'member');
 return function(props){
  var signedIn=!!props.user;
  React.useEffect(function(){if(signedIn)return;function out(){var sp=window.__vf26SetPage;if(sp){sp('home');}try{window.scrollTo(0,0);}catch(e){}}var off=null;try{off=auth.onAuthStateChanged(function(u){if(!u)out();});}catch(e){out();}return function(){try{off&&off();}catch(e){}};},[signedIn]);
  return signedIn?h(inner,props):null;
 };
}
var LoginPage=shell('LoginPage','auth',{eyebrow:'Client portal',title:'Sign in to your',accent:'client portal.',lead:'Your sessions, bookings, invoices and trainer messages are in your client portal.',points:['Session balance and bookings','Invoices and secure payments','Messages with your trainer']});
var SignupPage=shell('SignupPage','auth',{eyebrow:'Create your account',title:'Create your',accent:'client account.',lead:'One account for your sessions, bookings and payments.',points:['Buy and track session packages','Book sessions with your trainer','Invoices and secure payments']});
var StartHereFlow=shell('StartHereFlow','auth',{eyebrow:'Start here',title:'Tell us your goal.',accent:'We will match the plan.',lead:'A few short questions. A VFitness coach reviews every answer and reaches out with the right coach, location and plan.',points:['Personal training in Nassau','Online coaching from anywhere','Free consultation for first timers']});
var ApplicationPage=shell('ApplicationPage','auth',{eyebrow:'Online coaching',title:'Apply for coaching.',accent:'From anywhere.',lead:'Tell us about your goals and schedule. A coach reviews your application and gets back to you with next steps.',points:['Written weekly program','Nutrition targets and meal guidance','Weekly check ins and coach messaging']});
var WorkoutProgramsPage=membersOnly('WorkoutProgramsPage');
var ProgramLibraryPage=membersOnly('ProgramLibraryPage');
var LegalPage=shell('LegalPage','doc');
var PremiumTrainingDirectionPage=shell('PremiumTrainingDirectionPage','store');
var DashboardPage=shell('DashboardPage','member');
var GlobalSearchPage=shell('GlobalSearchPage','member');



/* ================= IMAGE HOSTING ================= */
var VF_UPLOAD_URL='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
window.vfSkipStorage=true;
window.vfHostUpload=function(src,name){
 function toBlob(){if(src instanceof Blob)return Promise.resolve(src);return fetch(src).then(function(r){return r.blob();});}
 return toBlob().then(function(blob){
  var fd=new FormData();var clean=String(name||'image').replace(/\.[a-z0-9]+$/i,'').replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,60)||'image';
  fd.append('file',blob,clean+(blob.type==='image/png'?'.png':'.jpg'));
  var ctrl=typeof AbortController!=='undefined'?new AbortController():null;var t=setTimeout(function(){try{ctrl&&ctrl.abort();}catch(e){}},30000);
  return fetch(VF_UPLOAD_URL,{method:'POST',body:fd,signal:ctrl?ctrl.signal:undefined}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('Upload failed ('+r.status+')');return r.json();}).then(function(j){if(!j||!j.file_url)throw new Error('Upload returned no file');return j.file_url;});
 });
};


/* ================= CHECKOUT (package purchase) ================= */
function VF26Checkout(p){
 var pkg=p.selectedPackage||{},pay=p.showPayPal,sel=p.selectedTrainer;
 function isOnline(t){return !!t&&(t.email==='darvano17@gmail.com'||String(t.name||'').toLowerCase().indexOf('darvano')>=0);}
 function nice(t){var n=String(t.name||'').trim();if(/^darvano$/i.test(n))n='Darvano Andrews';if(!n)n='VFitness Trainer';return n.replace(/\b([a-z])/g,function(m){return m.toUpperCase();});}
 var seen={},list=[];(p.trainers||[]).forEach(function(t){var n=nice(t),k=n.split(' ')[0].toLowerCase();if(!t.name||seen[k])return;seen[k]=1;list.push(t);});
 list.sort(function(a,b){return (isOnline(b)?1:0)-(isOnline(a)?1:0);});
 React.useEffect(function(){function k(e){if(e.key==='Escape')p.onClose&&p.onClose();}document.addEventListener('keydown',k);var o=document.body.style.overflow;document.body.style.overflow='hidden';return function(){document.removeEventListener('keydown',k);document.body.style.overflow=o;};},[]);
 var price=Number(pkg.price||0);
 var summary=h('aside',{className:'vf26-co-sum'},
  h('p',{className:'vf26-kicker'},'Order summary'),
  h('div',{className:'row'},h('span',null,'Package'),h('b',null,pkg.title||'Training package')),
  pkg.sessions?h('div',{className:'row'},h('span',null,'Sessions'),h('b',null,pkg.sessions)):null,
  sel?h('div',{className:'row'},h('span',null,'Trainer'),h('b',null,nice(sel))):null,
  h('div',{className:'row total'},h('span',null,'Total due'),h('b',null,'$'+price.toFixed(2).replace(/\.00$/,''),h('small',null,' BSD'))),
  h('ul',{className:'vf26-co-notes'},
   h('li',null,icon('check',14),'Sessions are added to your client portal once payment is confirmed'),
   h('li',null,icon('check',14),'An invoice is available under Invoices & Payments'),
   h('li',null,icon('check',14),'Questions: vfitnessbah@gmail.com')));
 return h('div',{className:'vf26-co-overlay',role:'dialog','aria-modal':'true','aria-label':'Checkout',onClick:p.onClose},
  h('div',{className:'vf26-co',onClick:function(e){e.stopPropagation();}},
   h('header',{className:'vf26-co-head'},
    h('div',null,h('p',{className:'vf26-kicker'},'Secure checkout'),h('h2',null,pay?'Complete your payment':'Choose your trainer')),
    h('ol',{className:'vf26-co-steps'},h('li',{className:pay?'done':'on'},h('i',null,pay?icon('check',12):'1'),'Trainer'),h('li',{className:pay?'on':''},h('i',null,'2'),'Payment')),
    h('button',{type:'button',className:'vf26-co-x','aria-label':'Close',onClick:p.onClose},icon('close',18))),
   h('div',{className:'vf26-co-body'},
    h('div',{className:'vf26-co-main'},
     !pay?h(React.Fragment,null,
      h('p',{className:'vf26-co-lead'},'Select the trainer for this package. Darvano Andrews accepts secure online payment. Other trainers are paid in person at your first session.'),
      h('div',{className:'vf26-co-trainers'},list.map(function(t){var on=isOnline(t),n=nice(t);
       return h('button',{key:t.id||n,type:'button',className:'vf26-co-tr',disabled:p.loading,onClick:function(){p.onSelect&&p.onSelect(t);}},
        h('span',{className:'av'},n.split(' ').map(function(w){return w.charAt(0);}).join('').slice(0,2)),
        h('span',{className:'t'},h('b',null,n),h('small',null,on?'Online payment available':'Pay in person')),
        h('span',{className:'cta'},on?'Continue to payment':'Request package',icon('arrow',14)));})),
      p.loading?h('p',{className:'vf26-co-status'},'Submitting your request...'):null):
     h(React.Fragment,null,
      h('button',{type:'button',className:'vf26-co-back',onClick:p.onBack},icon('arrow',14,{style:{transform:'rotate(180deg)'}}),'Change trainer'),
      h('p',{className:'vf26-co-lead'},'Pay with PayPal or a debit or credit card. Payments are processed securely by PayPal; VFitness never sees your card details.'),
      h('div',{ref:p.paypalRef,className:'vf26-co-paypal'}),
      h('p',{className:'vf26-co-fine'},icon('check',13),'Encrypted payment processing by PayPal'))),
    summary)));
}
window.VF26Checkout=VF26Checkout;

/* ================= MEMBER + COACH WORKSPACE (app layout) ================= */
function LIco(name,size,extra){var C=window.Ico;return C?h(C,Object.assign({name:name,size:size||18,color:'currentColor'},extra||{})):null;}
var TONES={primary:'66,150,240',teal:'95,221,204',fire:'249,112,102',violet:'136,105,236',green:'52,199,120',gold:'245,183,59'};
function Ico3D(p){var tile=p.tile||44,t=TONES[p.variant]||TONES.primary;
 return h('span',{className:'mu-ico3d vf26-tile '+(p.className||''),style:Object.assign({width:tile,height:tile,minWidth:tile,borderRadius:Math.round(tile*0.3),display:'inline-flex',alignItems:'center',justifyContent:'center',background:'rgba('+t+',.12)',border:'1px solid rgba('+t+',.26)',color:'rgb('+t+')'},p.style||{})},LIco(p.name,p.size||22,{stroke:2}));}
function useNow(ms){var st=React.useState(new Date()),now=st[0],set=st[1];React.useEffect(function(){var t=setInterval(function(){set(new Date());},ms||1000);return function(){clearInterval(t);};},[]);return now;}
function RealTimeClock(){var now=useNow(1000);
 return h('div',{className:'vf26-clock'},icon('timer',16),h('span',null,now.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})),h('b',null,now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})));}
function firstName(u){var n=(u&&(u.name||u.displayName))||'';if(!n&&u&&u.email)n=u.email.split('@')[0];n=String(n).trim().split(/\s+/)[0]||'Athlete';return n.charAt(0).toUpperCase()+n.slice(1);}
function greeting(){var hr=new Date().getHours();return hr<12?'Good morning':hr<17?'Good afternoon':'Good evening';}
function pkgTotal(p){return p.sessionsTotal||p.sessions||((p.sessionsRemaining||0)+(p.sessionsCompleted||0));}

function VF26Tabs(p){
 var admin=p.kind==='admin',active=p.active;
 var HIDE=admin?{workouts:1,mealplans:1,checkins:1,buttonqa:1}:{workouts:1,meals:1,progress:1,checkin:1,chat:1};
 var LABEL=admin?{siteDesign:'Website',clientManagement:'Client Records',analytics:'Reports',auditTrail:'Activity Log',appointments:'Bookings'}:{overview:'Overview',sessions:'Sessions',invoices:'Invoices & Payments',coach:'Messages'};
 var ICON=admin?{}:{invoices:'receipt',coach:'message-circle'};
 var items=(p.items||[]).filter(function(t){return !HIDE[t.id];}).map(function(t){return {id:t.id,label:LABEL[t.id]||t.label,icon:ICON[t.id]||t.icon};});
 var stripRef=React.useRef(null);
 React.useEffect(function(){try{var el=stripRef.current&&stripRef.current.querySelector('.on');if(el)el.scrollIntoView({block:'nearest',inline:'center',behavior:reduceMotion?'auto':'smooth'});}catch(e){}},[active]);
 function pick(id){return function(){p.onChange&&p.onChange(id);try{var g=document.querySelector('.vf26-ws-grid');if(g&&g.getBoundingClientRect().top<0)window.scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});}catch(e){}};}
 var u=p.user||{};
 return h(React.Fragment,null,
  h('aside',{className:'vf26-rail','aria-label':admin?'Business management':'Client portal'},
   h('div',{className:'vf26-rail-card'},
    h('div',{className:'vf26-rail-id'},
     h('p',{className:'k'},admin?'Business management':'Client portal'),
     h('p',{className:'n'},firstName(u)),
     h('p',{className:'s'},admin?(u.role==='admin'?'Administrator':'Trainer'):'Client account')),
    h('nav',null,items.map(function(t,i){var on=t.id===active;
     return h(React.Fragment,{key:t.id},(admin&&(i===6||i===9))?h('div',{className:'vf26-rail-div'}):null,
      h('button',{type:'button',className:'vf26-rail-item'+(on?' on':''),'aria-current':on?'page':undefined,onClick:pick(t.id)},LIco(t.icon,16),h('span',null,t.label),on?h('i',{className:'dot'}):null));})))),
  h('nav',{className:'vf26-tabstrip','aria-label':admin?'Business management sections':'Client portal sections',ref:stripRef},items.map(function(t){var on=t.id===active;
   return h('button',{key:t.id,type:'button','aria-current':on?'page':undefined,className:on?'on':'',onClick:pick(t.id)},LIco(t.icon,15),t.label);})));
}

function VF26MemberHead(p){
 var u=p.user||{},pk=p.packages||[],now=useNow(30000);
 var left=pk.reduce(function(a,x){return a+(x.sessionsRemaining||0);},0);
 var active=pk.filter(function(x){return (x.sessionsRemaining||0)>0&&x.status!=='paused';}).length;
 var na=p.newAssignments||{};
 return h('section',{className:'vf26-today'},
  h('div',{className:'vf26-today-main'},
   h('p',{className:'vf26-kicker'},'Client portal ',h('span',null,now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}))),
   h('h1',null,greeting()+', ',h('span',null,firstName(u)+'.')),
   h('p',{className:'lead'},'Your sessions, bookings, invoices and trainer messages in one place.'),
   (na.workout||na.mealPlan)?h('div',{className:'vf26-today-new'},
     na.workout?h('span',null,LIco('dumbbell',14),'New workout program'):null,
     na.mealPlan?h('span',null,LIco('utensils',14),'New meal plan'):null):null),
  h('div',{className:'vf26-today-stats'},
   h('div',{className:'vf26-mini'},h('span',null,'Sessions'),h('b',{className:'vf26-condensed'},left)),
   h('div',{className:'vf26-mini'},h('span',null,'Packages'),h('b',{className:'vf26-condensed'},active)),
   h('div',{className:'vf26-mini'},h('span',null,'Time'),h('b',{className:'vf26-condensed'},now.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})))));
}

/* Client broadcast email. Sends one personal email per client through the site's EmailJS account,
   one at a time, and remembers who already received it so a stopped send can resume without repeats. */
var BC_ID='pink-beach-burn-2026-10-31';
var BC_SUBJECT="New date: PINK Beach Burn is Saturday Oct 31 at Goodman's Bay";
var BC_IMAGE='https://www.vfitbah.com/vf26/pink-beach-burn-oct31.jpg';
var BC_BODY='Hi {name},\n\nThe PINK Beach Burn Bootcamp has a new date: Saturday, October 31. In support of Breast Cancer Awareness Month, VFitness is hosting this free beach bootcamp, sponsored by Empire Fitness, and you are invited.\n\nSaturday, October 31\n7:00 AM, about 60 to 75 minutes\nGoodman\'s Bay, Nassau\n\nThe morning runs through a check in and warm up, a beach circuit, a beach challenge, a core finisher, and a cooldown and stretch. Every fitness level is welcome.\n\nDrinks are provided, a DJ keeps the energy up all morning, and there will be giveaways and prizes, plus professional photos and video.\n\nIt is free to all. Bring your friends and family, and wear pink.\n\nMove. Sweat. Support. Together.\n\nSee you on the beach,\nDarvano Andrews\nVFitness Training Services';
function bcSentLoad(){try{return JSON.parse(localStorage.getItem('vf-bc-'+BC_ID)||'[]');}catch(e){return [];}}
function bcSentSave(list){try{localStorage.setItem('vf-bc-'+BC_ID,JSON.stringify(list));}catch(e){}}
function bcSkipLoad(){try{return JSON.parse(localStorage.getItem('vf-bc-skip-'+BC_ID)||'[]');}catch(e){return [];}}
function bcSkipSave(list){try{localStorage.setItem('vf-bc-skip-'+BC_ID,JSON.stringify(list));}catch(e){}}
function VF26Broadcast(p){
 var o=React.useState(false),open=o[0],setOpen=o[1];
 var s1=React.useState(BC_SUBJECT),subject=s1[0],setSubject=s1[1];
 var s2=React.useState(BC_BODY),body=s2[0],setBody=s2[1];
 var s6=React.useState(BC_IMAGE),image=s6[0],setImage=s6[1];var s7=React.useState(false),upl=s7[0],setUpl=s7[1];
 var s3=React.useState({state:'idle',sent:0,failed:0,total:0,msg:''}),run=s3[0],setRun=s3[1];
 var s4=React.useState(bcSentLoad()),done=s4[0],setDone=s4[1];
 var stopRef=React.useRef(false),resumeRef=React.useRef(null),sendAllRef=React.useRef(null);
 var s5=React.useState(bcSkipLoad()),skipped=s5[0],setSkipped=s5[1];
 React.useEffect(function(){return function(){if(resumeRef.current)clearTimeout(resumeRef.current);};},[]);
 var seen={},recips=[];
 (p.clients||[]).forEach(function(c){var em=String(c.email||'').trim().toLowerCase();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)||seen[em])return;seen[em]=1;recips.push({email:em,name:String(c.name||'').trim()});});
 var pending=recips.filter(function(r){return done.indexOf(r.email)<0;});
 var noEmail=(p.clients||[]).filter(function(c){return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(c.email||'').trim());}).length;var toSend=pending.filter(function(r){return skipped.indexOf(r.email)<0;});
 React.useEffect(function(){if(!open)return;try{if(typeof db!=='undefined')db.collection('broadcasts').doc(BC_ID).get().then(function(d){var x=d.exists&&d.data().sent;if(x&&x.length){var m=bcSentLoad();x.forEach(function(e){if(m.indexOf(e)<0)m.push(e);});bcSentSave(m);setDone(m);}}).catch(function(){});}catch(e){}},[open]);
 function first(n){var f=(n||'').split(/\s+/)[0]||'';return f?f.charAt(0).toUpperCase()+f.slice(1):'there';}
 function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
 function toHtml(txt){var parts=esc(txt).split(/\n{2,}/).map(function(par){return '<p style="margin:0 0 16px">'+par.replace(/\[([^\]]+)\]\(((?:https?:|mailto:)[^)\s]+)\)/g,'<a href="$2" style="color:#4296f0;font-weight:700">$1</a>').replace(/(^|[^"'>\/])(https?:\/\/[^\s<"]+)/g,'$1<a href="$2" style="color:#4296f0;font-weight:700">$2</a>').replace(/\n/g,'<br>')+'</p>';}).join('');
  return '<div style="background:#f4f6fa;padding:24px 12px;font-family:Arial,Helvetica,sans-serif"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e8f0"><div style="background:#0f1115;padding:18px 24px"><span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.06em">VFITNESS</span></div>'+(image?'<img src="'+esc(image)+'" alt="" width="560" style="display:block;width:100%;max-width:560px;height:auto;border:0">':'')+'<div style="padding:24px;color:#1b1f27;font-size:15px;line-height:1.6">'+parts+'</div><div style="padding:14px 24px;background:#f8f9fb;color:#8a93a3;font-size:12px">You are receiving this because you have a VFitness client account. Nassau, The Bahamas.</div></div></div>';}
 function sendOne(r){
  var u=(typeof firebase!=='undefined'&&firebase.auth&&firebase.auth().currentUser)||null;
  if(!u)return Promise.reject(new Error('Sign in again to send email.'));
  return u.getIdToken().then(function(tok){
   return fetch('https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/clientBroadcast',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:tok,to:r.email,name:r.name||'',subject:subject,html:toHtml(body.split('{name}').join(first(r.name)))})});
  }).then(function(res){return res.json().catch(function(){return {};}).then(function(j){if(!res.ok||!j||j.ok===false){var e=new Error((j&&j.error)||('Send failed ('+res.status+')'));e.status=res.status;throw e;}return j;});});
 }
 function sendTest(){var me='vfitnessbah@gmail.com';setRun({state:'test',sent:0,failed:0,total:1,msg:'Sending test to '+me+'...'});
  sendOne({email:me,name:(p.user&&p.user.name)||'Darvano'}).then(function(){setRun({state:'idle',sent:0,failed:0,total:0,msg:'Test sent to '+me+'. Check the inbox before sending to clients.'});},function(e){setRun({state:'idle',sent:0,failed:0,total:0,msg:'Test failed: '+((e&&(e.message||e.text))||e)});});}
 function isLimit(e){var m=String((e&&(e.message||e.text))||'').toLowerCase();return m.indexOf('limit')>=0||(e&&e.status===429);}
 function sendAll(auto){
  var list=pending.filter(function(r){return skipped.indexOf(r.email)<0;});
  if(!list.length)return;
  if(!auto&&!window.confirm('Send this email to '+list.length+' clients now? This cannot be undone.'))return;
  stopRef.current=false;if(resumeRef.current){clearTimeout(resumeRef.current);resumeRef.current=null;}
  var i=0,ok=0,bad=0,sentList=done.slice(),skipList=skipped.slice();
  setRun({state:'sending',sent:0,failed:0,total:list.length,msg:''});
  function finish(msg){setRun({state:'idle',sent:ok,failed:bad,total:list.length,msg:msg});}
  function step(){
   if(stopRef.current){finish('Stopped. '+ok+' sent.');return;}
   if(i>=list.length){finish('Finished. '+ok+' sent'+(bad?', '+bad+' addresses could not receive email and were skipped':'')+'.');return;}
   var r=list[i++];
   sendOne(r).then(function(){ok++;sentList.push(r.email);bcSentSave(sentList);setDone(sentList.slice());
     try{db.collection('broadcasts').doc(BC_ID).set({subject:subject,sent:firebase.firestore.FieldValue.arrayUnion(r.email),updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(function(){});}catch(e){}
     setRun({state:'sending',sent:ok,failed:bad,total:list.length,msg:''});setTimeout(step,600);
    },function(e){
     if(isLimit(e)){
      // Hourly sending cap reached: wait, then carry on automatically from where it stopped.
      var at=new Date(Date.now()+61*60000);
      setRun({state:'waiting',sent:ok,failed:bad,total:list.length,msg:ok+' sent this round. The daily email allowance has been reached, so sending pauses and tries again automatically at '+at.toLocaleTimeString('en-US',{hour:'numeric',minute:'2-digit'})+'. Keep this tab open, or press Send again any time after that.'});
      resumeRef.current=setTimeout(function(){resumeRef.current=null;sendAllRef.current(true);},61*60000);
      return;
     }
     if(e&&(e.status===403||e.status===500||e.status===503||e.status===502&&/sender|domain|not valid|unauthori/i.test(e.message||''))){finish('Sending stopped: '+(e.message||'service error')+'. '+ok+' sent.');return;}
     // This address cannot receive email: skip it for good and move on.
     bad++;skipList.push(r.email);bcSkipSave(skipList);setSkipped(skipList.slice());console.warn('Broadcast skipped',r.email,e);
     setRun({state:'sending',sent:ok,failed:bad,total:list.length,msg:''});setTimeout(step,600);
    });
  }
  step();
 }
 sendAllRef.current=sendAll;
 var busy=run.state!=='idle';
 var btn=function(label,on,cls,dis){return h('button',{type:'button',className:'vf26-btn '+(cls||'vf26-btn-outline'),onClick:on,disabled:!!dis},label);};
 if(!open)return h('div',{className:'vf26-bc-bar'},h('div',null,h('b',null,'Email your clients'),h('span',null,recips.length+' clients with an email on file'+(done.length?' · '+done.length+' already received this email':''))),btn('Compose email',function(){setOpen(true);},'vf26-btn-primary'));
 return h('div',{className:'vf26-bc'},
  h('div',{className:'vf26-bc-head'},h('div',null,h('b',null,'Email all clients'),h('span',null,toSend.length+' of '+recips.length+' still to receive this email'+(noEmail>0?' · '+noEmail+' clients have no email on file and are left out':'')+(skipped.length?' · '+skipped.length+' addresses could not receive email':'')+'. {name} becomes each client\'s first name.')),btn('Close',function(){if(!busy)setOpen(false);},'vf26-btn-ghost',busy)),
  h('label',null,'Subject'),h('input',{type:'text',value:subject,onChange:function(e){setSubject(e.target.value);},disabled:busy}),
  h('label',null,'Message'),h('textarea',{rows:14,value:body,onChange:function(e){setBody(e.target.value);},disabled:busy}),
  h('label',null,'Image (shown at the top of the email)'),
  h('div',{className:'vf26-bc-img'},
   image?h('img',{src:image,alt:''}):h('span',null,'No image'),
   h('div',{className:'vf26-bc-imgacts'},
    h('label',{className:'vf26-btn vf26-btn-outline'+(busy||upl?' is-disabled':'')},upl?'Uploading...':(image?'Replace image':'Add image'),
     h('input',{type:'file',accept:'image/*',hidden:true,disabled:busy||upl,onChange:function(e){var f=e.target.files&&e.target.files[0];if(!f)return;setUpl(true);
      (window.vfHostUpload?window.vfHostUpload(f,'email-'+(f.name||'image')):Promise.reject(new Error('Upload unavailable'))).then(function(u){setImage(u);},function(err){window.alert('Image upload failed: '+((err&&err.message)||err));}).then(function(){setUpl(false);e.target.value='';});}})),
    image?btn('Remove image',function(){setImage('');},'vf26-btn-ghost',busy):null)),
  run.state==='sending'?h('div',{className:'vf26-bc-prog'},h('div',{className:'vf26-bc-track'},h('i',{style:{width:(run.total?Math.round((run.sent+run.failed)/run.total*100):0)+'%'}})),h('span',null,'Sending '+(run.sent+run.failed)+' of '+run.total+(run.failed?' · '+run.failed+' failed':'')+'. Keep this tab open.')):null,
  run.msg?h('p',{className:'vf26-bc-msg'},run.msg):null,
  h('div',{className:'vf26-bc-acts'},
   btn('Send test to me',sendTest,'vf26-btn-outline',busy),
   run.state==='sending'||run.state==='waiting'?btn('Stop',function(){stopRef.current=true;if(resumeRef.current){clearTimeout(resumeRef.current);resumeRef.current=null;}setRun(function(x){return {state:'idle',sent:x.sent,failed:x.failed,total:x.total,msg:'Stopped. '+x.sent+' sent. Press Send to continue with the rest.'};});},'vf26-btn-outline'):btn(toSend.length?'Send to '+toSend.length+' clients':'All clients have received it',function(){sendAll(false);},'vf26-btn-primary',run.state==='sending'||!toSend.length)));
}
window.VF26Broadcast=VF26Broadcast;

/* Monthly client statements. One button per package card, and one button that sends every client their
   statement for the month. Sent through the same verified admin function as the client broadcast.
   Each package remembers the month it was last sent, so nobody receives the same month twice by accident,
   and the sessions completed at that point, so the next statement can show the sessions used since. */
var ST_EMAIL='vfitnessbah@gmail.com';
var ST_MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
function stMonthKey(d){d=d||new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');}
function stMonthLabel(d){d=d||new Date();return ST_MONTHS[d.getMonth()]+' '+d.getFullYear();}
function stEmailOk(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(e||'').trim());}
function stEsc(t){return String(t==null?'':t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function stMoney(n){n=Number(n||0);return '$'+n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,',');}
function stFirst(n){var f=String(n||'').trim().split(/\s+/)[0]||'';return f?f.charAt(0).toUpperCase()+f.slice(1):'there';}
function stCall(fn,pkg,fb){try{var f=window[fn];if(typeof f==='function'){var v=f(pkg);if(v!=null&&!isNaN(v))return Number(v);}}catch(e){}return fb;}
function stSentThisMonth(pkg){return !!pkg&&pkg.lastStatementMonth===stMonthKey();}
function stRecipient(pkg,client){client=client||{};return {email:String(client.email||pkg.clientEmail||'').trim().toLowerCase(),name:String(client.name||pkg.clientName||'').trim()};}
function stFacts(pkg){
 var remaining=Number(pkg.sessionsRemaining||0),completed=Number(pkg.sessionsCompleted||0);
 var total=Number(pkg.sessionsTotal||pkg.sessions||remaining+completed||0);
 var base=stCall('getPackageBaseAmount',pkg,Number(pkg.basePrice||pkg.originalPrice||pkg.packagePrice||pkg.price||0));
 var disc=stCall('getPackageDiscountAmount',pkg,Number(pkg.discountAmount||0));
 var charge=stCall('getPackageFinalAmount',pkg,Math.max(0,base-disc));
 var since=null,thisMonth=stMonthKey();
 var ref=pkg.lastStatementMonth===thisMonth?pkg.prevStatementCompleted:pkg.lastStatementCompleted;
 if(ref!=null&&!isNaN(ref))since=Math.max(0,completed-Number(ref));
 return {remaining:remaining,completed:completed,total:total,base:base,disc:disc,charge:charge,since:since,
  name:String(pkg.packageName||pkg.title||(total+' Session Package')).replace(/\s*[-\u2013\u2014]\s*/g,', '),
  trainer:pkg.assignedTrainerName||pkg.assignedBy||pkg.trainerName||'VFitness',
  paid:pkg.paymentStatus==='completed',paused:pkg.status==='paused'};
}
function stHtml(pkg,r){
 var f=stFacts(pkg),mo=stMonthLabel(),today=new Date().toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'});
 function row(k,v,strong){return '<tr><td style="padding:10px 0;border-bottom:1px solid #eef1f6;color:#5b6474;font-size:14px">'+stEsc(k)+'</td><td align="right" style="padding:10px 0;border-bottom:1px solid #eef1f6;font-size:14px;color:#1b1f27;font-weight:'+(strong?'800':'600')+'">'+stEsc(v)+'</td></tr>';}
 var pct=f.total>0?Math.round(f.completed/f.total*100):0;
 var rows=row('Package',f.name)+row('Trainer',f.trainer)+row('Sessions in package',f.total)+row('Sessions completed',f.completed)+
  (f.since!=null?row('Sessions since last statement',f.since):'')+row('Sessions remaining',f.remaining,true)+
  (f.paused?row('Status','Paused'):'');
 var bill=row('Package price',stMoney(f.base))+(f.disc>0?row('Discount','-'+stMoney(f.disc)):'')+row('Package total',stMoney(f.charge),true)+(f.paid?row('Payment','Paid'):'');
 var note=f.remaining<=0?'Your package has no sessions remaining. Speak with your trainer or email '+ST_EMAIL+' to start your next package.':
  f.remaining<=3?'You have '+f.remaining+' session'+(f.remaining===1?'':'s')+' left. Speak with your trainer or email '+ST_EMAIL+' to renew so there is no gap in your training.':
  'Thank you for training with VFitness. Keep the momentum going this month.';
 return '<div style="background:#f4f6fa;padding:24px 12px;font-family:Arial,Helvetica,sans-serif"><div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e4e8f0">'+
  '<div style="background:#0f1115;padding:18px 24px"><span style="color:#ffffff;font-size:18px;font-weight:800;letter-spacing:.06em">VFITNESS</span><span style="float:right;color:#8a93a3;font-size:12px;letter-spacing:.12em;line-height:22px">STATEMENT</span></div>'+
  '<div style="padding:24px 24px 8px;color:#1b1f27;font-size:15px;line-height:1.6">'+
  '<p style="margin:0 0 4px;color:#8a93a3;font-size:12px;letter-spacing:.12em;text-transform:uppercase">'+stEsc(mo)+'</p>'+
  '<p style="margin:0 0 16px;font-size:22px;font-weight:800">Your monthly statement</p>'+
  '<p style="margin:0 0 16px">Hi '+stEsc(stFirst(r.name))+',</p>'+
  '<p style="margin:0 0 20px">Here is your VFitness package statement as of '+stEsc(today)+'.</p>'+
  '<div style="margin:0 0 8px;height:8px;background:#eef1f6;border-radius:8px;overflow:hidden"><div style="height:8px;width:'+Math.max(3,pct)+'%;background:#4296f0"></div></div>'+
  '<p style="margin:0 0 18px;font-size:13px;color:#5b6474">'+f.completed+' of '+f.total+' sessions completed ('+pct+'%)</p>'+
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px">'+rows+'</table>'+
  '<p style="margin:0 0 6px;color:#8a93a3;font-size:12px;letter-spacing:.12em;text-transform:uppercase">Billing</p>'+
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 22px">'+bill+'</table>'+
  '<p style="margin:0 0 16px">'+stEsc(note)+'</p>'+
  '<p style="margin:0 0 16px">You can view your sessions and download your invoice any time in your client portal at <a href="https://www.vfitbah.com" style="color:#4296f0;font-weight:700">vfitbah.com</a>.</p>'+
  '<p style="margin:0 0 20px">Kind regards,<br>VFitness Training Services</p></div>'+
  '<div style="padding:14px 24px;background:#f8f9fb;color:#8a93a3;font-size:12px;line-height:1.5">Questions about this statement? Email '+ST_EMAIL+'.<br>You are receiving this because you have an active VFitness package. Nassau, The Bahamas.</div></div></div>';
}
function stPost(to,name,subject,html){
 var u=(typeof firebase!=='undefined'&&firebase.auth&&firebase.auth().currentUser)||null;
 if(!u)return Promise.reject(new Error('Sign in again to send email.'));
 return u.getIdToken().then(function(tok){
  return fetch('https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/clientBroadcast',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken:tok,to:to,name:name||'',subject:subject,html:html})});
 }).then(function(res){return res.json().catch(function(){return {};}).then(function(j){if(!res.ok||!j||j.ok===false){var e=new Error((j&&j.error)||('Send failed ('+res.status+')'));e.status=res.status;throw e;}return j;});});
}
function stSubject(){return 'Your VFitness statement for '+stMonthLabel();}
// Sends one statement and records it on the package. testTo sends a copy to the admin without recording it.
function stSend(pkg,client,testTo){
 var r=stRecipient(pkg,client);
 if(testTo)return stPost(testTo,r.name,'[Test] '+stSubject(),stHtml(pkg,r));
 if(!stEmailOk(r.email))return Promise.reject(new Error((r.name||'This client')+' has no email address on file.'));
 return stPost(r.email,r.name,stSubject(),stHtml(pkg,r)).then(function(){
  var key=stMonthKey(),upd={lastStatementMonth:key,lastStatementCompleted:Number(pkg.sessionsCompleted||0),lastStatementEmail:r.email};
  if(pkg.lastStatementMonth!==key)upd.prevStatementCompleted=pkg.lastStatementCompleted!=null?pkg.lastStatementCompleted:null;
  try{upd.lastStatementAt=firebase.firestore.FieldValue.serverTimestamp();}catch(e){}
  Object.assign(pkg,upd,{lastStatementAt:new Date()});
  try{return db.collection('packages').doc(pkg.id).update(upd).catch(function(e){console.warn('Statement sent, record not saved',e);});}catch(e){}
 });
}
function stSentLabel(pkg){var d=pkg.lastStatementAt;try{d=d&&d.toDate?d.toDate():d?new Date(d):null;}catch(e){d=null;}
 return 'Statement sent'+(d&&!isNaN(d)?' '+d.toLocaleDateString('en-US',{month:'short',day:'numeric'}):'');}

// Card button: Email statement, or the date it went out this month.
function VF26StatementButton(p){
 var s=React.useState('idle'),st=s[0],set=s[1],pkg=p.pkg,client=p.client;
 var r=stRecipient(pkg,client),sent=stSentThisMonth(pkg),noMail=!stEmailOk(r.email);
 function go(){
  if(noMail){window.alert((r.name||'This client')+' has no email address on file. Add one to the client record first.');return;}
  if(sent&&!window.confirm(r.name+' already received the '+stMonthLabel()+' statement. Send it again?'))return;
  if(!sent&&!window.confirm('Email the '+stMonthLabel()+' statement to '+(r.name||r.email)+' at '+r.email+'?'))return;
  set('sending');
  stSend(pkg,client).then(function(){set('done');if(p.onSent)p.onSent();},function(e){set('idle');window.alert('Statement not sent: '+((e&&e.message)||e));});
 }
 var on=sent||st==='done';
 return h('button',{type:'button',onClick:go,disabled:st==='sending',className:'vf26-pc-tool vf26-pc-stmt'+(on?' on':'')+(noMail?' is-off':''),title:noMail?'No email on file':r.email},
  LIco(on?'mail-check':'mail',15),st==='sending'?'Sending statement...':on?stSentLabel(pkg):noMail?'No email on file':'Email statement');
}
window.VF26StatementButton=VF26StatementButton;

// Bar above the package list. Nothing is sent until the admin ticks the clients who should receive
// this month's statement and confirms. Clients already sent this month are shown and left unticked.
function VF26StatementBar(p){
 var list=p.list||[],clients=p.clients||[];
 var s=React.useState({state:'idle',sent:0,failed:0,total:0,msg:''}),run=s[0],setRun=s[1],t=React.useState(0),bump=t[1];
 var o=React.useState(false),open=o[0],setOpen=o[1],sel=React.useState({}),picked=sel[0],setPicked=sel[1];
 var q2=React.useState(''),find=q2[0],setFind=q2[1];
 var stopRef=React.useRef(false);
 function clientOf(pkg){for(var i=0;i<clients.length;i++)if(clients[i].id===pkg.clientId)return clients[i];return null;}
 var rows=list.map(function(pkg){var r=stRecipient(pkg,clientOf(pkg));return {pkg:pkg,r:r,ok:stEmailOk(r.email),sent:stSentThisMonth(pkg)};});
 var withMail=rows.filter(function(x){return x.ok;}),due=withMail.filter(function(x){return !x.sent;});
 var noMail=rows.length-withMail.length,busy=run.state!=='idle';
 var chosen=withMail.filter(function(x){return picked[x.pkg.id];});
 var needle=find.trim().toLowerCase();
 var shown=rows.filter(function(x){return !needle||(x.r.name+' '+x.r.email+' '+(x.pkg.packageName||'')).toLowerCase().indexOf(needle)>=0;});
 function toggle(id){setPicked(function(m){var n=Object.assign({},m);if(n[id])delete n[id];else n[id]=true;return n;});}
 function pickAll(listX){setPicked(function(m){var n=Object.assign({},m);listX.forEach(function(x){n[x.pkg.id]=true;});return n;});}
 function test(){var me=ST_EMAIL;var x=chosen[0]||due[0]||withMail[0]||rows[0];if(!x)return;
  setRun({state:'test',sent:0,failed:0,total:0,msg:'Sending a sample statement to '+me+'...'});
  stSend(x.pkg,clientOf(x.pkg),me).then(function(){setRun({state:'idle',sent:0,failed:0,total:0,msg:'Sample sent to '+me+' using '+(x.r.name||'a client')+'\'s package. Nothing was sent to the client.'});},function(e){setRun({state:'idle',sent:0,failed:0,total:0,msg:'Sample failed: '+((e&&e.message)||e)});});}
 function sendChosen(){
  var q=chosen.slice();if(!q.length)return;
  var resend=q.filter(function(x){return x.sent;}).length;
  if(!window.confirm('Email the '+stMonthLabel()+' statement to '+q.length+' client'+(q.length===1?'':'s')+'?\n\n'+q.map(function(x){return x.r.name||x.r.email;}).slice(0,12).join('\n')+(q.length>12?'\nand '+(q.length-12)+' more':'')+(resend?'\n\n'+resend+' of them already received it this month.':'')))return;
  stopRef.current=false;var i=0,ok=0,bad=0,errs=[];
  setRun({state:'sending',sent:0,failed:0,total:q.length,msg:''});
  function step(){
   if(stopRef.current||i>=q.length){setRun({state:'idle',sent:ok,failed:bad,total:q.length,msg:(stopRef.current?'Stopped. ':'Finished. ')+ok+' statement'+(ok===1?'':'s')+' sent'+(bad?', '+bad+' not sent ('+errs.slice(0,3).join('; ')+')':'')+'.'});setPicked({});if(p.onDone)p.onDone();return;}
   var x=q[i++];
   stSend(x.pkg,clientOf(x.pkg)).then(function(){ok++;},function(e){bad++;errs.push((x.r.name||'client')+': '+((e&&e.message)||e));
     if(e&&(e.status===403||e.status===401)){stopRef.current=true;}})
    .then(function(){bump(function(n){return n+1;});setRun({state:'sending',sent:ok,failed:bad,total:q.length,msg:''});setTimeout(step,700);});
  }
  step();
 }
 var b=function(label,on,cls,dis){return h('button',{type:'button',className:'vf26-btn '+(cls||'vf26-btn-outline'),onClick:on,disabled:!!dis},label);};
 var summary=run.state==='sending'?'Sending '+(run.sent+run.failed)+' of '+run.total+'. Keep this tab open.':
  (withMail.length-due.length)+' of '+withMail.length+' sent this month'+(noMail?' · '+noMail+' without an email on file':'');
 return h('div',{className:'vf26-bc-bar vf26-st-bar'+(open?' is-open':'')},
  h('div',{className:'vf26-st-top'},
   h('div',null,h('b',null,'Monthly statements · '+stMonthLabel()),h('span',null,summary),run.msg?h('span',{className:'vf26-st-msg'},run.msg):null),
   h('div',{className:'vf26-st-acts'},
    b('Send sample to me',test,'vf26-btn-outline',busy||!rows.length),
    open?null:b('Choose clients',function(){setOpen(true);},'vf26-btn-primary',busy||!rows.length))),
  open?h('div',{className:'vf26-st-pick'},
   h('div',{className:'vf26-st-tools'},
    h('input',{type:'search',placeholder:'Search clients',value:find,onChange:function(e){setFind(e.target.value);},disabled:busy}),
    b('Select not yet sent',function(){pickAll(due);},'vf26-btn-ghost',busy||!due.length),
    b('Clear',function(){setPicked({});},'vf26-btn-ghost',busy||!chosen.length)),
   h('ul',{className:'vf26-st-list'},shown.map(function(x){var on=!!picked[x.pkg.id];
    return h('li',{key:x.pkg.id},h('label',{className:'vf26-st-row'+(x.ok?'':' is-off')+(on?' on':'')},
     h('input',{type:'checkbox',checked:on,disabled:!x.ok||busy,onChange:function(){toggle(x.pkg.id);}}),
     h('span',{className:'vf26-st-who'},h('b',null,x.r.name||'Unnamed client'),h('small',null,x.ok?x.r.email:'No email on file')),
     h('span',{className:'vf26-st-tag'+(x.sent?' sent':'')},x.sent?stSentLabel(x.pkg).replace('Statement sent','Sent'):x.ok?'Not sent':'')));})),
   h('div',{className:'vf26-st-foot'},
    b('Close',function(){if(!busy){setOpen(false);setPicked({});setFind('');}},'vf26-btn-ghost',busy),
    run.state==='sending'?b('Stop',function(){stopRef.current=true;},'vf26-btn-outline'):
     b(chosen.length?'Send to '+chosen.length+' selected':'Select clients to send',sendChosen,'vf26-btn-primary',busy||!chosen.length))):null);
}
window.VF26StatementBar=VF26StatementBar;

function VF26AdminHead(p){
 var u=p.user||{},now=useNow(30000);
 return h('section',{className:'vf26-today vf26-today-admin'},
  h('div',{className:'vf26-today-main'},
   h('p',{className:'vf26-kicker'},'Business management ',h('span',null,now.toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'}))),
   h('h1',null,greeting()+', ',h('span',null,firstName(u)+'.')),
   h('p',{className:'lead'},'Clients, bookings, packages, payments and reporting for the whole team.')));
}

function SessionMeter(p){
 var pk=p.packages||[],onLog=p.onLogSession;
 var total=pk.reduce(function(a,x){return a+pkgTotal(x);},0);
 var left=pk.reduce(function(a,x){return a+(x.sessionsRemaining||0);},0);
 var done=pk.reduce(function(a,x){return a+(x.sessionsCompleted||0);},0);
 var pct=total>0?Math.round(left/total*100):0;
 var tone=total===0?'none':left<=2?'low':left<=5?'mid':'ok';
 var status={none:'No sessions on your account yet',low:'Running low',mid:'Getting low',ok:'You are on track'}[tone];
 function go(page){return function(){var sp=window.__vf26SetPage;if(sp)sp(page);try{window.scrollTo(0,0);}catch(e){}};}
 return h('div',{className:'vf26-meter'},
  h('div',{className:'vf26-meter-top'},
   h('div',null,h('p',{className:'vf26-kicker'},'Session balance'),h('h3',null,status)),
   h('div',{className:'vf26-meter-num tone-'+tone},h('b',{className:'vf26-condensed'},left),h('span',null,'sessions left'))),
  total>0?h('div',{className:'vf26-meter-bar'},h('i',{className:'tone-'+tone,style:{width:Math.max(3,pct)+'%'}})):null,
  total>0?h('div',{className:'vf26-meter-count'},h('span',null,done,' completed'),h('span',null,total,' total')):null,
  tone==='low'&&total>0?h('div',{className:'vf26-alertbox warn'},LIco('alert-triangle',16),h('div',null,h('b',null,'Time to renew'),h('p',null,'You have ',left,' session',left===1?'':'s',' left. Renew your package to keep your training on track.'),h('button',{type:'button',className:'vf26-btn vf26-btn-primary sm',onClick:go('pricing')},'Renew package'))):null,
  h('div',{className:'vf26-meter-list'},
   h('div',{className:'vf26-meter-head'},h('span',null,'Your packages'),h('small',null,'Tap Log session when you arrive at the gym.')),
   pk.length===0?h('div',{className:'vf26-empty'},Ico3D({name:'package',tile:44,size:20}),h('b',null,'No active package'),h('p',null,'When a package is assigned or purchased, your sessions show here.'),h('button',{type:'button',className:'vf26-btn vf26-btn-primary sm',onClick:go('pricing')},'See packages')):
   pk.map(function(x,i){var t=pkgTotal(x),c=x.sessionsCompleted||0,r=x.sessionsRemaining||0,pc=t>0?c/t*100:0,tn=r<=2?'low':r<=5?'mid':'ok';
    return h('div',{key:x.id||i,className:'vf26-meter-pkg'},
     h('div',{className:'row'},h('div',{className:'nm'},h('b',null,x.packageName||x.title||('Package '+(i+1))),h('small',null,c,' of ',t,' sessions completed')),h('span',{className:'vf26-pc-left tone-'+tn},h('b',null,r),h('small',null,'left'))),
     h('div',{className:'vf26-pc-bar'},h('i',{className:'tone-'+tn,style:{width:Math.max(3,pc)+'%'}})),
     h('button',{type:'button',disabled:r<=0,className:'vf26-btn '+(r<=0?'vf26-btn-outline':'vf26-btn-primary')+' block',onClick:function(){onLog&&onLog(x);}},r<=0?'Package complete':h(React.Fragment,null,LIco('check',16),'I am at the gym, log session')));})));
}

function fmtWhen(a){try{var d=a.date&&a.date.toDate?a.date.toDate():(a.dateString?new Date(a.dateString+'T'+(a.time||'00:00')+':00'):null);if(!d||isNaN(d))return a.dateString||'';return d.toLocaleDateString('en-US',{weekday:'short',month:'short',day:'numeric'})+(a.time?' · '+(function(t){var p=t.split(':');var hh=+p[0];return ((hh%12)||12)+':'+p[1]+(hh<12?' AM':' PM');})(a.time):'');}catch(e){return '';}}
function VF26ClientOverview(p){
 var pk=p.packages||[],ap=p.appointments||[],go=p.setActiveTab||function(){};
 var now=Date.now();
 var upcoming=ap.filter(function(a){var d=a.date&&a.date.toDate?a.date.toDate().getTime():0;return d>=now-3600000&&a.status!=='cancelled';}).sort(function(a,b){return (a.date&&a.date.toDate?a.date.toDate():0)-(b.date&&b.date.toDate?b.date.toDate():0);}).slice(0,3);
 function page(x){return function(){var sp=window.__vf26SetPage;if(sp)sp(x);try{window.scrollTo(0,0);}catch(e){}};}
 return h('div',{className:'vf26-ov'},
  h(SessionMeter,{packages:pk,onLogSession:p.onLogSession}),
  h('div',{className:'vf26-ov-grid'},
   h('section',{className:'vf26-wpanel'},
    h('div',{className:'vf26-wpanel-head'},h('div',null,h('p',{className:'vf26-kicker'},'Bookings'),h('h3',null,'Upcoming sessions')),h('button',{type:'button',className:'vf26-btn vf26-btn-outline sm',onClick:function(){go('sessions');}},'Book a session')),
    upcoming.length?h('ul',{className:'vf26-list'},upcoming.map(function(a,i){return h('li',{key:a.id||i},Ico3D({name:'calendar',tile:40,size:18}),h('div',{className:'t'},h('b',null,fmtWhen(a)),h('small',null,(a.trainerName||'VFitness trainer'))),h('span',{className:'vf26-status s-'+(a.status||'pending')},a.status==='confirmed'?'Confirmed':a.status==='completed'?'Completed':'Pending'));})):
     h('div',{className:'vf26-empty slim'},h('p',null,'No upcoming sessions. Book a time with your trainer and it will appear here.'))),
   h('section',{className:'vf26-wpanel'},
    h('div',{className:'vf26-wpanel-head'},h('div',null,h('p',{className:'vf26-kicker'},'Account'),h('h3',null,'Manage your account'))),
    h('div',{className:'vf26-acts'},
     [['receipt','Invoices & payments','View and download your invoices',function(){go('invoices');}],
      ['message-circle','Message your trainer','Questions about sessions or scheduling',function(){go('coach');}],
      ['credit-card','Buy or renew a package','Personal training and semi private packages',page('pricing')]].map(function(r){
      return h('button',{key:r[1],type:'button',className:'vf26-action',onClick:r[3]},Ico3D({name:r[0],tile:40,size:18}),h('span',{className:'t'},h('b',null,r[1]),h('small',null,r[2])),icon('arrow',16));})))),
  h('section',{className:'vf26-wpanel vf26-appband'},
   h('img',{src:'/vf26/vfit-app-icon.webp',alt:'VFIT app',width:56,height:56}),
   h('div',{className:'t'},h('p',{className:'vf26-kicker'},'VFIT app'),h('h3',null,'Training, nutrition and progress live in the VFIT app.'),h('p',null,'Use the same email to follow your program, log meals and track progress. New accounts get 7 days of VFIT Autopilot free.')),
   h('a',{className:'vf26-btn vf26-btn-primary',href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer'},'Open the VFIT app',icon('arrow',16,{className:'vf26-arrow'}))));
}
window.VF26ClientOverview=VF26ClientOverview;
window.Ico3D=Ico3D;window.RealTimeClock=RealTimeClock;window.SessionMeter=SessionMeter;
window.VF26Tabs=VF26Tabs;window.TestimonialSlider=function(){return null;};window.VF26MemberHead=VF26MemberHead;window.VF26AdminHead=VF26AdminHead;

var PAGES={PricingPage:PricingPage,TrainersPage:TrainersPage,VFResultsPage:VFResultsPage,VFLocationsPage:VFLocationsPage,VFContactPage:VFContactPage,AboutPage:AboutPage,
 LoginPage:LoginPage,SignupPage:SignupPage,StartHereFlow:StartHereFlow,ApplicationPage:ApplicationPage,WorkoutProgramsPage:WorkoutProgramsPage,ProgramLibraryPage:ProgramLibraryPage,
 LegalPage:LegalPage,PremiumTrainingDirectionPage:PremiumTrainingDirectionPage,DashboardPage:DashboardPage,GlobalSearchPage:GlobalSearchPage};
Object.keys(PAGES).forEach(function(k){window[k]=PAGES[k];});

window.VF26={Navigation:Navigation,HomePage:HomePage,Footer:Footer,pages:PAGES};
window.Navigation=Navigation;window.HomePage=HomePage;window.Footer=Footer;
})();
