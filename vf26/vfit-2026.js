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

function go(setCurrentPage,page){return function(){try{setCurrentPage(page);}catch(e){}try{window.scrollTo({top:0,behavior:'auto'});}catch(e){}};}
function lead(setCurrentPage,kv){return function(){if(typeof vfLeadPrefill==='function'){vfLeadPrefill(kv||{},setCurrentPage);}else{go(setCurrentPage,'starthere')();}};}

/* Count up for the stats strip */
function CountUp(p){var ref=React.useRef(null);var st=React.useState(reduceMotion?p.to:0);var val=st[0],setVal=st[1];
 useInView(ref,function(){if(reduceMotion){setVal(p.to);return;}var t0=null,d=1200;function step(t){if(!t0)t0=t;var k=Math.min(1,(t-t0)/d);var e=1-Math.pow(1-k,3);setVal(Math.round(p.to*e));if(k<1)requestAnimationFrame(step);}requestAnimationFrame(step);});
 return h('span',{ref:ref},val.toLocaleString('en-US'));}

/* ================= HEADER ================= */
var PUBLIC_LINKS=[['pricing','Services'],['trainers','Team'],['results','Results'],['about','Company'],['contact','Contact']];
function Navigation(props){
 var user=props.user,isAdmin=props.isAdmin,currentPage=props.currentPage,setCurrentPage=props.setCurrentPage,theme=props.theme,toggleTheme=props.toggleTheme;
 var ms=React.useState(false),open=ms[0],setOpen=ms[1];
 window.__vf26SetPage=setCurrentPage;
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
 React.useEffect(function(){if(!user)return;var t=null;function fix(){var fresh=Date.now()-signedAt.current<6000;if(currentPage==='login'||currentPage==='signup'){try{setCurrentPage(isAdmin?'admin':'dashboard');}catch(e){}}else if(isAdmin&&fresh&&currentPage==='dashboard'){try{setCurrentPage('admin');}catch(e){}}}fix();t=setTimeout(fix,2200);return function(){clearTimeout(t);};},[user,isAdmin,currentPage]);
 React.useEffect(function(){try{document.body.style.overflow=open?'hidden':'';}catch(e){}return function(){try{document.body.style.overflow='';}catch(e){}};},[open]);
 function nav(page){return function(){setOpen(false);go(setCurrentPage,page)();};}
 function logout(){setOpen(false);try{auth.signOut().then(function(){setCurrentPage('home');});}catch(e){setCurrentPage('home');}}
 var seg=h('nav',{className:'vf26-seg','aria-label':'Primary'},PUBLIC_LINKS.map(function(l){return h('button',{key:l[0],className:currentPage===l[0]?'on':'',onClick:nav(l[0]),'aria-current':currentPage===l[0]?'page':undefined},l[1]);}));
 var themeBtn=h('button',{className:'vf26-round',onClick:toggleTheme,'aria-label':theme==='dark'?'Switch to light mode':'Switch to dark mode',title:theme==='dark'?'Light mode':'Dark mode'},icon(theme==='dark'?'sun':'moon',18));
 var right;
 if(user){
  right=h('div',{className:'vf26-actions'},
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:logout},'Sign out'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:nav(isAdmin?'admin':'dashboard')},isAdmin?'Business dashboard':'Client portal'),
   h('button',{className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open},icon(open?'close':'menu',20)));
 }else{
  right=h('div',{className:'vf26-actions'},
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:nav('login')},'Client login'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:lead(setCurrentPage,{})},'Get started'),
   h('button',{className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open},icon(open?'close':'menu',20)));
 }
 var more=[];
 var memberLinks=user?(isAdmin?[['admin','Admin Dashboard'],['dashboard','My Client Portal']]:[['dashboard','Client Portal']]):[];
 var sheet=open?h('div',{className:'vf26 vf26-sheet',role:'dialog','aria-label':'Menu'},
   h('div',{className:'vf26-sheet-grid'},memberLinks.concat([['home','Home']]).concat(PUBLIC_LINKS).map(function(l,i){return h('button',{key:l[0]+i,className:currentPage===l[0]?'on':'',onClick:nav(l[0])},l[1],icon('arrow',16));})),
   h('div',{className:'vf26-sheet-cta'},user?h('button',{className:'vf26-btn vf26-btn-outline',onClick:logout},'Sign out'):[
     h('button',{key:'s',className:'vf26-btn vf26-btn-primary',onClick:function(){setOpen(false);lead(setCurrentPage,{})();}},'Get started',icon('arrow',16,{className:'vf26-arrow'})),
     h('button',{key:'l',className:'vf26-btn vf26-btn-outline',onClick:nav('login')},'Client login')])):null;
 return h(React.Fragment,null,
  h('header',{className:'vf26 vf26-header'},h('div',{className:'vf26-wrap vf26-header-in'},
   h('button',{className:'vf26-brand',onClick:nav('home'),'aria-label':'VFitness home'},h('span',{className:'vf26-brand-tile'},h('img',{src:'/vf26/vfit-app-icon.webp',alt:'',width:40,height:40})),h('span',{className:'vf26-brand-word'},'VFITNESS')),
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
var APP_PLANS=[
 {name:'Standard',mo:'14.99',yr:'164.99',tag:'Stop guessing. Follow the plan.',points:['Full VFitness training library','Workout tracking and weight memory','Automatic rest timer','Nutrition logging','Progress tools']},
 {name:'Premium',mo:'24.99',yr:'274.99',tag:'Your data guides the next decision.',featured:true,points:['Everything in Standard','Adaptive weight recommendations','Barcode nutrition scanning','Readiness and progress scans','Deeper analytics and Coach Assist']},
 {name:'Elite',mo:'30',yr:'330',tag:'The complete system plus human oversight.',points:['Everything in Premium','Priority VFitness coach review','Plan and progress questions answered','Unlimited training programs']}
];
function openApp(){try{window.open(VF_APP_URL,'_blank','noopener');}catch(e){location.href=VF_APP_URL;}}
function toOnlinePlans(setCurrentPage){return function(){go(setCurrentPage,'pricing')();setTimeout(scrollToId('vf26-remote'),400);};}
function OnlinePlans(){
 var cs=React.useState('mo'),cyc=cs[0],setCyc=cs[1];
 return h('section',{className:'vf26-section tight',id:'vf26-remote'},h('div',{className:'vf26-wrap'},
  h(SectionHead,{row:true,kicker:'Online training',title:'Train anywhere with the VFIT app.',lead:'Online training runs through the VFIT app: your program, tracking, nutrition and coaching in one place.',right:h('div',{className:'vf26-tabs',role:'tablist'},
   h('button',{role:'tab','aria-selected':cyc==='mo',className:cyc==='mo'?'on':'',onClick:function(){setCyc('mo');}},'Monthly'),
   h('button',{role:'tab','aria-selected':cyc==='yr',className:cyc==='yr'?'on':'',onClick:function(){setCyc('yr');}},'Annual'))}),
  h('div',{className:'vf26-app-grid'},APP_PLANS.map(function(pl,i){
   var save=Math.round((Number(pl.mo)*12-Number(pl.yr))*100)/100;
   return h(Reveal,{key:pl.name,className:'vf26-app-plan'+(pl.featured?' featured':''),delay:i*80},
    pl.featured?h('span',{className:'tag'},'Most popular'):null,
    h('div',{className:'nm'},pl.name),h('p',{className:'tg'},pl.tag),
    h('div',{className:'pr'},h('b',null,'$'+(cyc==='mo'?pl.mo:pl.yr)),h('small',null,cyc==='mo'?' / month':' / year')),
    h('div',{className:'sv'},cyc==='yr'&&save>0?'You save $'+save.toFixed(2).replace(/\.00$/,'')+' a year':'Cancel any time'),
    h('ul',{className:'vf26-ticks'},pl.points.map(function(t){return h('li',{key:t},icon('check',15),t);})),
    h('a',{className:'vf26-btn '+(pl.featured?'vf26-btn-blend':'vf26-btn-outline'),href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer'},'Start '+pl.name,icon('arrow',16,{className:'vf26-arrow'})));})),
  h(Reveal,{className:'vf26-command vf26-remote vf26-coach-plan'},
   h('div',{style:{position:'relative',zIndex:1}},
    h('p',{className:'vf26-kicker'},'Elite Online Coaching'),
    h('h2',{className:'vf26-h2'},'A dedicated VFitness coach, online.'),
    h('p',{className:'vf26-lead'},'Premium online coaching inside the VFIT app, capped at 20 clients per coach.'),
    h('ul',{className:'vf26-ticks'},['Custom program rebuilt every 4 weeks','One 20 minute video call per week','Written weekly review every Monday','Unlimited form checks, 48 hour turnaround','Messaging with 24 hour weekday reply'].map(function(t){return h('li',{key:t},icon('check',15),t);}))),
   h('div',{className:'vf26-remote-price'},
    h('div',{className:'v'},'$197',h('small',null,' / month')),
    h('a',{className:'vf26-btn vf26-btn-blend',href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer'},'Start Elite Coaching',icon('arrow',16,{className:'vf26-arrow'})),
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


var TEAM_ACC=['#4296f0','#5fddcc','#8869ec','#f97066'];
function TeamRow(p){
 return h('div',{className:'vf26-team4'},COACHES.map(function(c,i){var ini=c.name.split(' ').map(function(x){return x[0];}).join('');
  return h(Reveal,{key:c.name,delay:i*60},h('button',{className:'vf26-team4-card',onClick:go(p.setCurrentPage,'trainers'),style:{'--acc':TEAM_ACC[i%4]}},
   h('span',{className:'ph'},h('span',{className:'mono'},ini),h('span',{className:'sp'},c.spec[0])),
   h('b',null,c.name),h('small',null,c.role)));}));
}
function AppShowcase(p){
 var feats=[['history','Weight and rep memory','Every set is saved, so your next session starts where the last one ended.'],['timer','Guided workouts','Your program with rest timing, built by a VFitness coach.'],['scan','Nutrition tracking','Log meals and hit calorie and protein targets.'],['trend','Progress you can see','Photos, body metrics and strength trends week to week.']];
 return h('section',{className:'vf26-section tight vf26-appshow',id:'vfit-app'},h('div',{className:'vf26-wrap vf26-appshow-grid'},
  h(Reveal,{className:'vf26-appshow-copy'},
   h('p',{className:'vf26-kicker'},'The VFIT app'),
   h('h2',{className:'vf26-h2'},'Your program, in your pocket.'),
   h('p',{className:'vf26-lead'},'Train with structure anywhere. The VFIT app keeps your program, workout history, nutrition and progress in one place, with plans from $14.99 a month.'),
   h('ul',{className:'vf26-appshow-feats'},feats.map(function(f){return h('li',{key:f[1]},h('span',{className:'ic'},icon(f[0],18)),h('div',null,h('b',null,f[1]),h('p',null,f[2])));})),
   h('div',{className:'vf26-cta-row'},h('button',{className:'vf26-btn vf26-btn-outline',onClick:toOnlinePlans(p.setCurrentPage)},'Compare app plans',icon('arrow',16,{className:'vf26-arrow'})))),
  h(AppAnnounce,null)));
}

/* ================= TRANSFORMATION REEL (home) ================= */
function useGallery(){
 var gs=React.useState(null),g=gs[0],setG=gs[1];
 React.useEffect(function(){try{db.collection('gallery').get().then(function(snap){setG(snap.docs.map(function(d){return Object.assign({id:d.id},d.data());}).filter(function(x){return x.imageUrl&&x.status!=='draft'&&x.status!=='archived';}).sort(function(a,b){var da=a.createdAt&&a.createdAt.toDate?a.createdAt.toDate():new Date(0);var dbb=b.createdAt&&b.createdAt.toDate?b.createdAt.toDate():new Date(0);return dbb-da;}));}).catch(function(){setG([]);});}catch(e){setG([]);}},[]);
 return g;
}
function TransformReel(p){
 var setCurrentPage=p.setCurrentPage;
 var g=useGallery()||[];var n=g.length;
 var is=React.useState(0),idx=is[0],setIdx=is[1];
 var ps=React.useState(false),paused=ps[0],setPaused=ps[1];
 var touch=React.useRef(null);
 function next(){setIdx(function(i){return n?(i+1)%n:0;});}
 function prev(){setIdx(function(i){return n?(i-1+n)%n:0;});}
 React.useEffect(function(){if(n<2||paused||reduceMotion)return;var t=setTimeout(next,4500);return function(){clearTimeout(t);};},[n,idx,paused]);
 var cur=n?g[idx%n]:null;
 var side=[];for(var k=1;k<=4&&k<n;k++)side.push({g:g[(idx+k)%n],i:(idx+k)%n});
 var strip=n?g.concat(g):[];
 return h('section',{className:'vf26-section tight vf26-reel-sec',id:'vf-results-section'},h('div',{className:'vf26-wrap'},
  h(Reveal,{className:'vf26-head-row'},
   h('div',null,h('p',{className:'vf26-kicker'},'Real clients. Real results.'),h('h2',{className:'vf26-h2'},'Transformations built in Nassau.'),
    h('p',{className:'vf26-lead'},'Every photo is a real VFitness client, shared with consent. Structure, check ins and tracking did the rest.'))),
  cur?h('div',{className:'vf26-reel',onMouseEnter:function(){setPaused(true);},onMouseLeave:function(){setPaused(false);}},
   h('div',{className:'vf26-reel-main',onTouchStart:function(e){touch.current=e.touches[0].clientX;},onTouchEnd:function(e){if(touch.current==null)return;var d=touch.current-e.changedTouches[0].clientX;if(Math.abs(d)>50){d>0?next():prev();}touch.current=null;}},
    h('img',{key:cur.id,src:cur.imageUrl,alt:cur.title||'Client transformation',className:'vf26-photo-reveal'}),
    h('span',{className:'vf26-reel-badge'},icon('trend',14),'Real result'),
    h('div',{className:'cap'},cur.title?h('b',null,cur.title):null,cur.description?h('span',null,cur.description):null),
    h('div',{className:'ctrl'},
     h('button',{className:'vf26-round',onClick:prev,'aria-label':'Previous transformation'},icon('left',18)),
     h('span',{className:'cnt vf26-tabular'},(idx+1)+' / '+n),
     h('button',{className:'vf26-round',onClick:next,'aria-label':'Next transformation'},icon('right',18))),
    h('div',{className:'bar'},h('i',{key:idx+(paused?'p':''),className:paused||reduceMotion?'':'run'}))),
   h('div',{className:'vf26-reel-side'},side.map(function(o,k){return h('button',{key:o.g.id+'-'+k,className:'vf26-reel-thumb vf26-enter',style:{'--d':(k*70)+'ms'},onClick:function(){setIdx(o.i);},'aria-label':'Show '+(o.g.title||'transformation')},
     h('img',{src:o.g.imageUrl,alt:'',loading:'lazy'}),o.g.title?h('span',null,o.g.title):null);}))):
   h('div',{className:'vf26-reel-empty'},h(TransformationShowcaseSafe,null)),
  n>2?h('div',{className:'vf26-marquee','aria-hidden':'true'},h('div',{className:'vf26-marquee-track',style:{animationDuration:Math.max(30,n*5)+'s'}},strip.map(function(x,k){return h('img',{key:x.id+'-'+k,src:x.imageUrl,alt:'',loading:'lazy'});}))):null,
  h('div',{className:'vf26-cta-row'},
   h('button',{className:'vf26-link',onClick:go(setCurrentPage,'results')},'See all client results',icon('arrow',16))),
  h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.')));
}
function TransformationShowcaseSafe(){return typeof TransformationShowcase==='function'?h(TransformationShowcase,null):null;}

function HomePage(props){
 var setCurrentPage=props.setCurrentPage;
 React.useEffect(function(){try{window.scrollTo(0,0);}catch(e){}},[]);
 function svc(tab){return function(){go(setCurrentPage,'pricing')();setTimeout(scrollToId(tab),400);};}
 var SERVICES=[
  {k:'In person',t:'Personal training',p:'$30',u:'per session',d:'One on one coaching at three Nassau training locations with a written program and every session tracked.',a:svc('vf26-packages'),cta:'Session packages'},
  {k:'In person',t:'Semi private training',p:'$22',u:'per person, per session',d:'Train with a partner or friend under the same coaching standard, at a lower cost per session.',a:svc('vf26-packages'),cta:'Session packages'},
  {k:'Online',t:'Online training',p:'$14.99',u:'per month',d:'Programs, tracking and nutrition in the VFIT app, with Elite Online Coaching for a dedicated coach.',a:svc('vf26-remote'),cta:'Online plans'}
 ];
 var HOW3=[['Get started','Create your account and tell us your goal, schedule and preferred location.'],['Consultation','A free consultation and body assessment set your starting point and targets.'],['Train and track','Train with your coach. Sessions, payments and invoices are managed in your client portal.']];
 return h('main',{className:'vf26'},
  h('section',{className:'vf26-hero vf26-hero-corp'},
   h('div',{className:'vf26-wrap vf26-hero-grid'},
    h('div',{className:'vf26-hero-copy'},
     h('div',{className:'vf26-eyebrow vf26-enter'},h('i'),'Personal training company, Nassau, The Bahamas'),
     h('h1',{className:'vf26-h1 vf26-enter',style:{'--d':'40ms'}},'Train Smart.',h('span',null,'Train Elite.')),
     h('p',{className:'vf26-lead vf26-enter',style:{'--d':'100ms'}},'VFitness delivers structured personal training across Nassau and online coaching through the VFIT app. Clear pricing, certified coaches and every session accounted for.'),
     h('div',{className:'vf26-hero-cta vf26-enter',style:{'--d':'160ms'}},
      h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Get started',icon('arrow',16,{className:'vf26-arrow'})),
      h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'pricing')},'View services and pricing')),
     h('dl',{className:'vf26-trust vf26-enter',style:{'--d':'220ms'}},
      h('div',null,h('dt',null,'Clients served'),h('dd',null,h(CountUp,{to:2000}),'+')),
      h('div',null,h('dt',null,'Established'),h('dd',null,'2018')),
      h('div',null,h('dt',null,'Nassau locations'),h('dd',null,'3')),
      h('div',null,h('dt',null,'Certified coaches'),h('dd',null,'4')))),
    h('figure',{className:'vf26-hero-media vf26-enter',style:{'--d':'120ms'}},
     h('img',{src:'/vf26/strength-editorial-v1.webp',alt:'Client training with dumbbells in a Nassau gym overlooking the water',fetchpriority:'high'}),
     h('figcaption',{className:'vf26-hero-badge'},h('span',{className:'dot'}),h('div',null,h('b',null,'Now booking'),h('span',null,'Free consultation and body assessment')))))),

  h('section',{className:'vf26-section tight',id:'services'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{row:true,kicker:'Services',title:'Coaching built around your schedule.',right:h('button',{className:'vf26-link',onClick:go(setCurrentPage,'pricing')},'All services and pricing',icon('arrow',16))}),
   h('div',{className:'vf26-svc3'},SERVICES.map(function(x,i){return h(Reveal,{key:x.t,className:'vf26-svc3-card',delay:i*70},
    h('p',{className:'k'},x.k),h('h3',null,x.t),h('p',{className:'d'},x.d),
    h('div',{className:'pr'},h('span',null,'From'),h('b',null,x.p),h('small',null,x.u)),
    h('button',{className:'vf26-link',onClick:x.a},x.cta,icon('arrow',15)));})))),

  h(AppShowcase,{setCurrentPage:setCurrentPage}),

  h(TransformReel,{setCurrentPage:setCurrentPage}),

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap vf26-how3-wrap'},
   h(SectionHead,{kicker:'How it works',title:'Three steps to your first session.'}),
   h('ol',{className:'vf26-how3'},HOW3.map(function(s,i){return h(Reveal,{key:s[0],className:'vf26-how3-item',delay:i*80},h('span',{className:'n'},String(i+1).padStart(2,'0')),h('b',null,s[0]),h('p',null,s[1]));})))),

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{row:true,kicker:'The team',title:'Four coaches. One standard.',right:h('button',{className:'vf26-link',onClick:go(setCurrentPage,'trainers')},'Meet the team',icon('arrow',16))}),
   h(TeamRow,{setCurrentPage:setCurrentPage}))),

  h(FinalCTA,{setCurrentPage:setCurrentPage}));
}

/* ================= FOOTER ================= */
function Footer(props){
 var setCurrentPage=props.setCurrentPage||function(){};
 function b(label,page){return h('button',{key:label,onClick:go(setCurrentPage,page)},label);}
 return h('footer',{className:'vf26 vf26-footer'},h('div',{className:'vf26-wrap'},
  h('div',{className:'vf26-foot-grid'},
   h('div',null,
    h('button',{className:'vf26-brand',onClick:go(setCurrentPage,'home'),style:{padding:0}},h('span',{className:'vf26-brand-tile'},h('img',{src:'/vf26/vfit-app-icon.webp',alt:'',width:40,height:40})),h('span',{className:'vf26-brand-word'},'VFITNESS')),
    h('p',{className:'vf26-muted',style:{margin:'1rem 0 0',fontSize:'.9rem',lineHeight:1.6,maxWidth:'22rem'}},'VFITNESS Training Services. Personal training in Nassau and online coaching through the VFIT app since 2018.'),
    h('div',{className:'vf26-socials'},
     h('a',{href:'https://www.instagram.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Instagram'},icon('instagram',17)),
     h('a',{href:'https://www.facebook.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Facebook'},icon('facebook',17)),
     h('a',{href:'https://www.tiktok.com/@xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'TikTok'},icon('tiktok',17)))),
   h('div',null,h('h5',null,'Company'),b('About','about'),b('Team','trainers'),b('Results','results'),b('Contact','contact')),
   h('div',null,h('h5',null,'Clients'),b('Get started','starthere'),b('Services and pricing','pricing'),b('Client portal','login'),h('a',{href:VF_APP_URL,target:'_blank',rel:'noopener noreferrer'},'VFIT app')),
   h('div',null,h('h5',null,'Legal'),b('Privacy Policy','privacy'),b('Terms of Service','terms'),b('Refunds and Cancellations','refund'))),
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
var VF_EMAIL='vfitnessbahamas@gmail.com';
var VF_PHONE='242 454 9063',VF_TEL='tel:+12424549063';
function waLink(){try{if(typeof VF_WA_LINK!=='undefined')return VF_WA_LINK;}catch(e){}return 'https://wa.me/12424549063';}
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
    h('p',{className:'vf26-kicker'},p.kicker||'Get started'),
    h('h2',{className:'vf26-h2'},p.title||'Book your free consultation.'),
    h('p',{className:'vf26-lead',style:{marginLeft:'auto',marginRight:'auto'}},p.lead||'Create your account, tell us your goal and a coach will confirm your consultation and starting plan.')),
   h('div',{className:'vf26-cta-row',style:{justifyContent:'center'}},
    h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,p.kv||{})},'Get started',icon('arrow',16,{className:'vf26-arrow'})),
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
 return h('div',{className:'vf26-hours'},h('div',{className:'hd'},icon('clock',18),'Training hours'),
  HOURS.map(function(r){return h('div',{key:r[0],className:'row'},h('span',null,r[0]),h('b',{className:r[1]==='Closed'?'off':''},r[1]));}));
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
    h('div',{className:'info'},h('span',{className:'k'},'12 session package'),h('b',null,'1 on 1 with your coach'),
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
 return h('div',{className:'vf26-widget'},h(WidgetTop,{l:'Nassau, New Providence',r:'3 locations'}),
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
var PKG={
 one:[{sessions:1,price:30,title:'Single Session'},{sessions:4,price:120,title:'4-Session Package'},{sessions:6,price:180,title:'6-Session Package'},{sessions:8,price:221,title:'8-Session Package',discount:8},{sessions:12,price:294,title:'12-Session Package',discount:15}],
 semi:[{sessions:1,price:22,title:'Single Semi Personal Session'},{sessions:4,price:87,title:'4-Session Package'},{sessions:6,price:130,title:'6-Session Package'},{sessions:8,price:173,title:'8-Session Package',discount:8},{sessions:12,price:195,title:'12-Session Package',discount:15}]
};
function PricingPage(props){
 var user=props.user,setCurrentPage=props.setCurrentPage,theme=props.theme||'dark';
 useTop();
 var ms=React.useState(false),showModal=ms[0],setShowModal=ms[1];
 var ps=React.useState(null),selected=ps[0],setSelected=ps[1];
 var ts=React.useState('one'),tab=ts[0],setTab=ts[1];
 function select(pkg){if(!user){alert('Please sign in first to purchase a package');setCurrentPage('login');return;}setSelected(pkg);setShowModal(true);}
 var services=[
  {icon:'user',name:'1 on 1 Personal Training',who:'Fastest, fully personalised results',price:'$30',unit:'/ session',cta:'View 1 on 1',act:function(){setTab('one');scrollToId('vf26-packages')();}},
  {icon:'users',name:'Partner or Semi Private',who:'Train with a friend or partner',price:'$22',unit:'/ session',cta:'View semi private',act:function(){setTab('semi');scrollToId('vf26-packages')();}},
  {icon:'dumbbell',name:'Group Training',who:'Motivation in a small group',price:'Ask',unit:'',cta:'Enquire',act:lead(setCurrentPage,{vf_lead_type:'Group'})},
  {icon:'clipboard',name:'Free Consultation and Body Assessment',who:'First timers, goals and body scan',price:'Free',unit:'',cta:'Book free consult',act:go(setCurrentPage,'book'),hi:true}
 ];
 var list=PKG[tab];var base=list[0].price;
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Services and pricing',title:'Clear pricing.',accent:'No lock in contracts.',lead:'In person training at three Nassau locations and online coaching through the VFIT app. Pay securely online and track every session in your client portal.',
   chips:[['check','No lock in contracts'],['history','Sessions tracked in your dashboard'],['shield','Secure checkout']],
   aside:h(SessionWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:scrollToId('vf26-packages')},'See session packages',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Book a free consult')]}),

  h('section',{className:'vf26-section tight',id:'inperson'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'In person training',title:'Personal training in Nassau, The Bahamas.'}),
   h('div',{className:'vf26-svc-grid'},services.map(function(s,i){return h(Reveal,{key:s.name,className:'vf26-svc'+(s.hi?' hi':''),delay:i*70},
    h('span',{className:'vf26-icon-tile'},icon(s.icon,20)),
    h('h3',null,s.name),h('p',null,s.who),
    h('div',{className:'pr'},h('b',null,s.price),s.unit?h('small',null,s.unit):null,s.price!=='Free'&&s.price!=='Ask'?h('em',null,'from'):null),
    h('button',{className:'vf26-btn '+(s.hi?'vf26-btn-primary':'vf26-btn-outline'),onClick:s.act},s.cta));})))),

  h('section',{className:'vf26-section tight',id:'vf26-packages'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{row:true,kicker:'Session packages',title:'Buy sessions. Track every one.',right:h('div',{className:'vf26-tabs',role:'tablist'},
    h('button',{role:'tab','aria-selected':tab==='one',className:tab==='one'?'on':'',onClick:function(){setTab('one');}},'1 on 1'),
    h('button',{role:'tab','aria-selected':tab==='semi',className:tab==='semi'?'on':'',onClick:function(){setTab('semi');}},'Semi private'))}),
   h('div',{className:'vf26-pkg-grid',key:tab},list.map(function(pkg,i){var per=Math.round(pkg.price/pkg.sessions*100)/100;var save=base*pkg.sessions-pkg.price;var best=pkg.sessions===12;
    return h('div',{key:pkg.sessions,className:'vf26-pkg vf26-enter'+(best?' best':''),style:{'--d':(i*60)+'ms'}},
     best?h('span',{className:'tag'},'Best value'):(pkg.discount?h('span',{className:'tag soft'},'Save '+pkg.discount+'%'):null),
     h('div',{className:'ses'},h('b',{className:'vf26-condensed'},pkg.sessions),h('span',null,pkg.sessions===1?'session':'sessions')),
     h('div',{className:'amt'},'$'+pkg.price),
     h('div',{className:'per'},'$'+(per%1?per.toFixed(2):per)+' per session'),
     save>0?h('div',{className:'sv'},icon('check',13),'You save $'+save):h('div',{className:'sv muted'},'Pay as you go'),
     h('button',{className:'vf26-btn '+(best?'vf26-btn-blend':'vf26-btn-primary'),onClick:function(){select(pkg);}},'Select package'));})),
   h('p',{className:'vf26-note'},user?'Choose a package and pick your coach at checkout.':'Sign in or create an account to purchase. Your session balance appears in your dashboard.'))),

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
       h('div',null,h('b',{className:'vf26-condensed'},t.rating),h('span',null,'Rating')),
       h('div',null,h('b',{className:'vf26-condensed'},t.experience.replace(' years','').replace('Team coach','Team')),h('span',null,t.experience==='Team coach'?'Coach':'Years')),
       h('div',null,h('b',{className:'vf26-condensed'},t.clients||'1:1'),h('span',null,t.clients?'Clients':'Coaching'))),
      h('p',{className:'bio'},t.bio),
      h('div',{className:'sp'},t.spec.map(function(s){return h('span',{key:s,className:'vf26-chip'},s);})),
      h('div',{className:'certs'},t.certs.map(function(c){return h('span',{key:c},icon('award',14),c);})),
      h('div',{className:'acts'},
       h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{vf_lead_trainer:t.name})},'Train with '+t.first),
       h('a',{className:'vf26-btn vf26-btn-outline',href:'tel:+1'+t.phone.replace(/\D/g,''),'aria-label':'Call '+t.first},icon('phone',16),'Call'))));})))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Not sure who to pick?',title:'We will match you with the right coach.',lead:'Tell us your goal, schedule and location. We will pair you with the coach and program that fit.'}));
}

/* ================= RESULTS ================= */
var STORIES=[
 {goal:'Weight loss and body recomposition',time:'12 weeks',prog:'Total Transformation',freq:'3x weekly training',method:['Strength training','Protein target','Daily steps','Weekly check ins'],result:'Waist down, strength up, confidence transformed.',img:'/program-shred.jpg'},
 {goal:'Glute building and waist reduction',time:'8 to 12 weeks',prog:'Hourglass Method',freq:'3x weekly glute focused training',method:['Progressive overload','Glute isolation work','Nutrition structure','Photos and measurements'],result:'Rounder glutes, tighter waist, visible shape change.',img:'/program-hourglass.jpg'},
 {goal:'Muscle gain and fat loss',time:'12 weeks',prog:'Alpha Build',freq:'3x weekly strength split',method:['Chest and arms focus','Strength tracking','Fat loss support','Weekly accountability'],result:'Bigger chest and arms with a leaner stomach.',img:'/program-mass.jpg'},
 {goal:'Full lifestyle change',time:'16 weeks',prog:'Online Coaching',freq:'4x weekly from anywhere',method:['App based workout plan','Meal guidance','Weekly check ins','Trainer messaging'],result:'Consistent training and tracked progress without a trainer on site.',img:'/vf26/fuel-the-fire-v1.webp'}
];
function VFResultsPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var hasShowcase=typeof TransformationShowcase==='function';
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Client results',title:'Real methods.',accent:'Tracked results.',lead:'Every VFitness transformation follows a documented method: structured training, nutrition support, weekly check ins and progress tracking. This is how results get built.',
   chips:[['users','2,000+ clients served'],['camera','Shared with consent'],['trend','Tracked week to week']],aside:h(ProgressWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start yours',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'pricing')},'See pricing')]}),
  hasShowcase?h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Before and after',title:'Transformations from real clients.'}),
   h(Reveal,{className:'vf26-showcase'},h(TransformationShowcase,null)))):null,
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'The method',title:'What each result was built on.'}),
   h('div',{className:'vf26-story-grid'},STORIES.map(function(s,i){return h(Reveal,{key:s.prog,className:'vf26-story',delay:(i%2)*90},
    h('div',{className:'vf26-story-media'},h('img',{src:s.img,alt:s.prog,loading:'lazy',onError:function(e){e.target.style.visibility='hidden';}}),h('div',{className:'nm'},h('span',null,s.time),h('b',null,s.prog))),
    h('div',{className:'vf26-story-body'},
     h('div',{className:'vf26-story-facts'},[['Goal',s.goal],['Timeframe',s.time],['Training',s.freq],['Program',s.prog]].map(function(r){return h('div',{key:r[0]},h('span',null,r[0]),h('b',null,r[1]));})),
     h('div',{className:'sp'},s.method.map(function(m){return h('span',{key:m,className:'vf26-chip'},m);})),
     h('div',{className:'res'},icon('trend',16),s.result)));})),
   h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.'))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Your turn',title:'The next result could be yours.'}));
}

/* ================= LOCATIONS ================= */
function VFLocationsPage(props){return h(VFContactPage,props);}

/* ================= CONTACT ================= */
function VFContactPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var cards=[
  {ic:'chat',t:'Message on WhatsApp',d:'Fastest response. Coaching questions, packages and bookings.',v:'Open WhatsApp',href:waLink(),ext:true,acc:'#25D366'},
  {ic:'mail',t:'Email VFitness',d:'Applications, invoices and general questions.',v:VF_EMAIL,href:'mailto:'+VF_EMAIL,acc:'#4296f0'},
  {ic:'phone',t:'Call or text',d:'Reach the VFitness line directly.',v:VF_PHONE,href:VF_TEL,acc:'#8869ec'}
 ];
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Contact',title:'Contact',accent:'VFitness.',lead:'Questions about services, packages, payments or locations. Our team responds within one business day.'}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h('div',{className:'vf26-contact-grid'},cards.map(function(c,i){return h(Reveal,{key:c.t,delay:i*80},
    h('a',{className:'vf26-contact',href:c.href,target:c.ext?'_blank':undefined,rel:c.ext?'noopener noreferrer':undefined,style:{'--acc':c.acc}},
     h('span',{className:'ic'},icon(c.ic,22)),h('h3',null,c.t),h('p',null,c.d),h('span',{className:'v'},c.v,icon('arrow',15))));})),
   h('div',{className:'vf26-contact-split'},
    h(Reveal,{className:'vf26-panel vf26-contact-start'},h('p',{className:'vf26-kicker'},'Ready to start?'),h('h3',{className:'vf26-h3',style:{fontSize:'1.6rem'}},'Skip the back and forth.'),
     h('p',{className:'vf26-muted'},'Create your account and tell us your goal. A coach will reach out with the right plan, location and package.'),
     h('div',{className:'vf26-cta-row'},h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Get started',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Book a free consult'))),
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
 var facts=[['Founded','2018'],['Coaching team','4 certified coaches'],['Clients served','2,000+'],['Locations','3 in Nassau, plus online']];
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
 return h('div',{className:'vf26-shell vf26-shell-store vf26-shell-'+p.name},
  h(PageHero,p.hero),
  h('div',{ref:ref,className:'vf26-shell-inner'},p.children));
}
function shell(name,kind,extra){
 return function(props){
  var L=legacy(name);
  if(!L)return null;
  var inner=h(L,props);
  if(kind==='auth'){
   return h('div',{className:'vf26 vf26-shell vf26-shell-auth vf26-shell-'+name},
    h('div',{className:'vf26-auth-grid'},h(AuthAside,extra),h('div',{className:'vf26-auth-main'},inner)));
  }
  if(kind==='store'&&extra){return h(StoreShell,{name:name,hero:extra},inner);}
  return h('div',{className:'vf26-shell vf26-shell-'+name+(kind?' vf26-shell-'+kind:'')},inner);
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
var StartHereFlow=shell('StartHereFlow','auth',{eyebrow:'Start here',title:'Tell us your goal.',accent:'We will match the plan.',lead:'Two minutes. A VFitness coach reviews every answer and reaches out with the right coach, location and plan.',points:['Personal training in Nassau','Online coaching from anywhere','Free consultation for first timers']});
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
   h('li',null,icon('check',14),'Questions: vfitnessbahamas@gmail.com')));
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
  h('div',{className:'vf26-tabstrip',role:'tablist',ref:stripRef},items.map(function(t){var on=t.id===active;
   return h('button',{key:t.id,type:'button',role:'tab','aria-selected':on,className:on?'on':'',onClick:pick(t.id)},LIco(t.icon,15),t.label);})));
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
var BC_ID='pink-beach-burn-2026-10-17';
var BC_SUBJECT="You're invited: PINK Beach Burn, Saturday Oct 17 at Goodman's Bay";
var BC_IMAGE='https://www.vfitbah.com/vf26/pink-beach-burn-2026.jpg';
var BC_BODY='Hi {name},\n\nIn support of Breast Cancer Awareness Month, VFitness and Empire Fitness are hosting the PINK Beach Burn Bootcamp, and you are invited.\n\nSaturday, October 17\n7:00 AM, about 60 to 75 minutes\nGoodman\'s Bay, Nassau\n\nThe morning runs through a check in and warm up, a beach circuit, a beach challenge, a core finisher, and a cooldown and stretch. Every fitness level is welcome.\n\nDrinks are provided, a DJ keeps the energy up all morning, and there will be giveaways and prizes, plus professional photos and video.\n\nIt is free to all. Bring your friends and family, and wear pink.\n\nMove. Sweat. Support. Together.\n\nSee you on the beach,\nDarvano Andrews\nVFitness Training Services';
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
 function sendTest(){var me=(p.user&&p.user.email)||'vfitnessbahamas@gmail.com';setRun({state:'test',sent:0,failed:0,total:1,msg:'Sending test to '+me+'...'});
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
 var note=f.remaining<=0?'Your package has no sessions remaining. Speak with your trainer or email '+VF_EMAIL+' to start your next package.':
  f.remaining<=3?'You have '+f.remaining+' session'+(f.remaining===1?'':'s')+' left. Speak with your trainer or email '+VF_EMAIL+' to renew so there is no gap in your training.':
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
  '<div style="padding:14px 24px;background:#f8f9fb;color:#8a93a3;font-size:12px;line-height:1.5">Questions about this statement? Email '+VF_EMAIL+'.<br>You are receiving this because you have an active VFitness package. Nassau, The Bahamas.</div></div></div>';
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
 function test(){var me=(p.user&&p.user.email)||VF_EMAIL;var x=chosen[0]||due[0]||withMail[0]||rows[0];if(!x)return;
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
   h('div',{className:'t'},h('p',{className:'vf26-kicker'},'VFIT app'),h('h3',null,'Training, nutrition and progress live in the VFIT app.'),h('p',null,'Use the same email to follow your program, log meals and track progress. App Store and Google Play releases are coming soon.')),
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
