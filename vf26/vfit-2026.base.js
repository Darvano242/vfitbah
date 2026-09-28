/* VFIT 2026 site components for vfitbah.com.
   Header, homepage and footer rebuilt in the VFIT app layout. Every call to action still
   routes into the existing site flows (Start Here, Sign In, Programs, Pricing, Trainers). */
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
var PUBLIC_LINKS=[['home','Home'],['starthere','Start Here'],['workoutprograms','Programs'],['pricing','Pricing'],['trainers','Trainers'],['results','Results'],['contact','Contact']];
function Navigation(props){
 var user=props.user,isAdmin=props.isAdmin,currentPage=props.currentPage,setCurrentPage=props.setCurrentPage,theme=props.theme,toggleTheme=props.toggleTheme;
 var ms=React.useState(false),open=ms[0],setOpen=ms[1];
 React.useEffect(function(){root.setAttribute('data-vf-theme',theme==='light'?'light':'dark');try{document.querySelector('meta[name="theme-color"]')&&document.querySelector('meta[name="theme-color"]').setAttribute('content',theme==='light'?'#f5f5f9':'#0f1115');}catch(e){}},[theme]);
 React.useEffect(function(){try{document.body.classList.toggle('vf26-member',!!(user&&!isAdmin));}catch(e){}},[user,isAdmin]);
 React.useEffect(function(){setOpen(false);},[currentPage]);
 React.useEffect(function(){try{document.body.style.overflow=open?'hidden':'';}catch(e){}return function(){try{document.body.style.overflow='';}catch(e){}};},[open]);
 function nav(page){return function(){setOpen(false);go(setCurrentPage,page)();};}
 function logout(){setOpen(false);try{auth.signOut().then(function(){setCurrentPage('home');});}catch(e){setCurrentPage('home');}}
 var seg=h('nav',{className:'vf26-seg','aria-label':'Primary'},PUBLIC_LINKS.filter(function(l){return l[0]!=='starthere';}).map(function(l){return h('button',{key:l[0],className:currentPage===l[0]?'on':'',onClick:nav(l[0]),'aria-current':currentPage===l[0]?'page':undefined},l[1]);}));
 var themeBtn=h('button',{className:'vf26-round',onClick:toggleTheme,'aria-label':theme==='dark'?'Switch to light mode':'Switch to dark mode',title:theme==='dark'?'Light mode':'Dark mode'},icon(theme==='dark'?'sun':'moon',18));
 var right;
 if(user){
  right=h('div',{className:'vf26-actions'},
   h('button',{className:'vf26-round vf26-hide-sm',onClick:nav('search'),'aria-label':'Search'},icon('search',18)),
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:logout},'Log Out'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:nav(isAdmin?'admin':'dashboard')},isAdmin?'Admin':'Dashboard'),
   h('button',{className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open},icon(open?'close':'menu',20)));
 }else{
  right=h('div',{className:'vf26-actions'},
   themeBtn,
   h('button',{className:'vf26-btn vf26-btn-ghost vf26-hide-sm',onClick:nav('login')},'Log In'),
   h('button',{className:'vf26-btn vf26-btn-primary vf26-hide-sm',onClick:lead(setCurrentPage,{})},'Start Your Transformation'),
   h('button',{className:'vf26-round vf26-menu-btn',onClick:function(){setOpen(!open);},'aria-label':open?'Close menu':'Open menu','aria-expanded':open},icon(open?'close':'menu',20)));
 }
 var more=[['library','Exercise Library'],['locations','Locations'],['about','About']];
 var memberLinks=user?[[isAdmin?'admin':'dashboard',isAdmin?'Admin':'Dashboard']].concat(isAdmin?[]:[['saved','Saved'],['aichat','AI Coach']]).concat([['community','Community'],['search','Search']]):[];
 var sheet=open?h('div',{className:'vf26 vf26-sheet',role:'dialog','aria-label':'Menu'},
   h('div',{className:'vf26-sheet-grid'},memberLinks.concat(PUBLIC_LINKS).concat(more).map(function(l,i){return h('button',{key:l[0]+i,className:currentPage===l[0]?'on':'',onClick:nav(l[0])},l[1],icon('arrow',16));})),
   h('div',{className:'vf26-sheet-cta'},user?h('button',{className:'vf26-btn vf26-btn-outline',onClick:logout},'Log Out'):[
     h('button',{key:'s',className:'vf26-btn vf26-btn-primary',onClick:function(){setOpen(false);lead(setCurrentPage,{})();}},'Start Your Transformation',icon('arrow',16,{className:'vf26-arrow'})),
     h('button',{key:'l',className:'vf26-btn vf26-btn-outline',onClick:nav('login')},'Log In')])):null;
 return h(React.Fragment,null,
  h('header',{className:'vf26 vf26-header'},h('div',{className:'vf26-wrap vf26-header-in'},
   h('button',{className:'vf26-brand',onClick:nav('home'),'aria-label':'VFitness home'},h('span',{className:'vf26-brand-tile'},zap()),h('span',{className:'vf26-brand-word'},'VFITNESS')),
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
  h('div',{className:'vf26-demo-foot'},h('p',null,'Your last session becomes your next starting point.'),h('button',{className:'vf26-link',onClick:go(p.setCurrentPage,'workoutprograms')},'Find your plan',icon('arrow',16))));
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

function programList(){try{if(typeof VF_HOME_PROGRAMS!=='undefined'&&VF_HOME_PROGRAMS.length){var order=(typeof VFX_POPULAR!=='undefined'&&VFX_POPULAR)||[];var list=order.map(function(id){return VF_HOME_PROGRAMS.find(function(p){return p.id===id;});}).filter(Boolean);return (list.length?list:VF_HOME_PROGRAMS).slice(0,8);}}catch(e){}return [];}
function openProgram(id,setCurrentPage){if(typeof vfOpenProgram==='function'){vfOpenProgram(id,setCurrentPage);}else{go(setCurrentPage,'workoutprograms')();}}

var COACHES=[
 {name:'Darvano Andrews',first:'Darvano',role:'Founder and Head Coach',photo:'/vf26/darvano-andrews.webp',spec:['Physique transformation','Glute development','Muscle gain'],bio:'Founded VFitness in 2018 and has served more than 2,000 clients through personal training, coaching and fitness programs.'},
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

function HomePage(props){
 var setCurrentPage=props.setCurrentPage;
 React.useEffect(function(){try{window.scrollTo(0,0);}catch(e){}},[]);
 var programs=programList();
 var hasShowcase=typeof TransformationShowcase==='function';
 return h('main',{className:'vf26'},
  /* Hero */
  h('section',{className:'vf26-hero'},
   h('div',{className:'vf26-hero-side','aria-hidden':'true'}),
   h('div',{className:'vf26-wrap vf26-hero-grid'},
    h('div',{className:'vf26-hero-copy'},
     h('div',{className:'vf26-eyebrow vf26-enter'},h('i'),'Personal training in Nassau and online'),
     h('h1',{className:'vf26-h1 vf26-enter',style:{'--d':'40ms'}},'Walk in with a plan.',h('span',null,'Leave stronger.')),
     h('p',{className:'vf26-lead vf26-enter',style:{'--d':'100ms'}},'Structured coaching, written programs, nutrition support and weekly check ins. Every session is tracked so your next one starts where the last one left off.'),
     h('div',{className:'vf26-hero-cta vf26-enter',style:{'--d':'160ms'}},
      h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start Your Transformation',icon('arrow',16,{className:'vf26-arrow'})),
      h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'workoutprograms')},'Explore programs'),
      h('button',{className:'vf26-btn vf26-btn-ghost',onClick:go(setCurrentPage,'login')},'Client login')),
     h('div',{className:'vf26-quick vf26-enter',style:{'--d':'220ms'}},
      h('div',null,icon('history',16),'Weight memory'),
      h('div',null,icon('timer',16),'Rest timing'),
      h('div',null,icon('scan',16),'Food tracking'),
      h('div',null,icon('camera',16),'Body progress'))),
    h(DemoWorkout,{setCurrentPage:setCurrentPage}))),

  /* Stats */
  h('section',{className:'vf26-stats','aria-label':'VFitness by the numbers'},h('div',{className:'vf26-wrap'},h('div',{className:'vf26-stats-grid'},
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:2000}),h('em',null,'+')),h('div',{className:'lbl'},'Clients served')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:4})),h('div',{className:'lbl'},'Coaches, one system')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:3})),h('div',{className:'lbl'},'Nassau training locations')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:12})),h('div',{className:'lbl'},'Coach built programs'))))),

  /* Features */
  h('section',{className:'vf26-section vf26-glow-top'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-head'},
    h('p',{className:'vf26-kicker'},'The work is still yours. The guesswork is not.'),
    h('h2',{className:'vf26-h2'},'Stop losing progress between workouts.'),
    h('p',{className:'vf26-lead'},'The hard part is not finding another exercise. It is staying consistent with the right plan, remembering what you did, progressing it and knowing whether it is working. The VFIT app keeps those pieces connected for every VFitness client.')),
   h('div',{className:'vf26-feature-grid'},FEATURES.map(function(f,i){return h(FeatureCard,{key:f[2],f:f,delay:Math.min(i*45,280)});})),
   h(Reveal,{className:'vf26-steps-card'},
    h('div',{className:'vf26-head-row'},
     h('div',null,h('p',{className:'vf26-kicker violet'},'Four steps. Repeat.'),h('h3',{className:'vf26-h3'},'Do the work. Keep the data. Make the next session better.')),
     h('p',{className:'vf26-muted',style:{maxWidth:'28rem',fontSize:'.875rem',lineHeight:'1.5rem',margin:0}},'Every completed workout gives your coach more context for what you should do next.')),
    h('div',{className:'vf26-steps'},STEPS.map(function(s,i){return h(Reveal,{key:s[0],className:'vf26-step',delay:i*90},
     h('div',{className:'num'},s[0]),h('div',{className:'t'},s[1]),h('p',null,s[2]),i<STEPS.length-1?h('span',{className:'ping',style:{animationDelay:(i*.3)+'s'},'aria-hidden':'true'}):null);}))))),

  /* Programs */
  programs.length?h('section',{className:'vf26-section tight',id:'vf-online-programs'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-head-row'},
    h('div',null,h('p',{className:'vf26-kicker'},'Most popular'),h('h2',{className:'vf26-h2'},'Choose the outcome. Follow the structure.')),
    h('button',{className:'vf26-link',onClick:go(setCurrentPage,'workoutprograms')},'View all programs',icon('arrow',16))),
   h('div',{className:'vf26-prog-grid'},programs.map(function(p,i){return h(Reveal,{key:p.id,delay:Math.min(i*50,300)},
    h('button',{className:'vf26-prog',onClick:function(){openProgram(p.id,setCurrentPage);},'aria-label':p.name+', '+p.sub+', $'+p.price},
     h('div',{className:'vf26-prog-media'},
      h('img',{src:'/'+String(p.img||'').replace(/^\//,''),alt:'',loading:'lazy',onError:function(e){e.target.style.visibility='hidden';}}),
      h('span',{className:'lv'},p.level),h('span',{className:'du'},p.dur),
      h('div',{className:'nm'},h('b',null,p.name),h('span',null,p.sub))),
     h('div',{className:'vf26-prog-foot'},h('span',{className:'p'},'$'+p.price),h('span',{className:'v'},'View program',icon('arrow',14)))));})))):null,

  /* Paths */
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-head'},h('p',{className:'vf26-kicker'},'Choose your path'),h('h2',{className:'vf26-h2'},'Train here or train anywhere.')),
   h('div',{className:'vf26-paths'},
    h(Reveal,{className:'vf26-path'},
     h('img',{src:'/vf26/strength-editorial-v1.webp',alt:'Athlete training with dumbbells in a bright Nassau gym',loading:'lazy'}),
     h('div',{className:'vf26-path-in'},
      h('div',{className:'k'},'In person'),h('h3',null,'Train in Nassau'),
      h('p',null,'One on one and semi private coaching with form correction, accountability and every session tracked in your account.'),
      h('ul',null,h('li',null,'Empire Fitness'),h('li',null,'Fanta C'),h('li',null,'Royal Bahamas Police College')),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'pricing')},'See session packages'),h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{vf_lead_type:'1 on 1'})},'Book a consultation')))),
    h(Reveal,{className:'vf26-path',delay:90},
     h('img',{src:'/vf26/fuel-the-fire-v1.webp',alt:'Balanced high protein meal with vegetables',loading:'lazy'}),
     h('div',{className:'vf26-path-in'},
      h('div',{className:'k'},'Online'),h('h3',null,'Train online'),
      h('p',null,'Coach built programs and remote coaching with workouts, nutrition targets, weekly check ins and messaging from anywhere.'),
      h('ul',null,h('li',null,'Programs from $15'),h('li',null,'Weekly check ins'),h('li',null,'Coach messaging')),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'workoutprograms')},'Browse online programs'),h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{vf_lead_type:'Online'})},'Apply for coaching'))))))),

  /* Coaches */
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-head-row'},
    h('div',null,h('p',{className:'vf26-kicker'},'The coaching team'),h('h2',{className:'vf26-h2'},'Four coaches. One system.')),
    h('button',{className:'vf26-link',onClick:go(setCurrentPage,'trainers')},'Meet the full team',icon('arrow',16))),
   h('div',{className:'vf26-coach-grid'},COACHES.map(function(c,i){var initials=c.name.split(' ').map(function(x){return x[0];}).join('');return h(Reveal,{key:c.name,className:'vf26-coach',delay:i*80},
    h('div',{className:'vf26-coach-media'},c.photo?h('img',{src:c.photo,alt:c.name,loading:'lazy'}):[h('span',{key:'r',className:'ring'}),h('span',{key:'m',className:'mono'},initials)]),
    h('div',{className:'vf26-coach-body'},
     h('div',{className:'nm'},c.name),h('div',{className:'rl'},c.role),
     h('div',{className:'sp'},c.spec.map(function(s){return h('span',{key:s,className:'vf26-chip'},s);})),
     h('p',{className:'bio'},c.bio),
     h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{vf_lead_trainer:c.name})},'Train with '+c.first)));})))),

  /* Results */
  h('section',{className:'vf26-section tight',id:'vf-results-section'},h('div',{className:'vf26-wrap'},
   h('div',{className:'vf26-results'},
    h(Reveal,null,
     h('p',{className:'vf26-kicker'},'Real clients only'),
     h('h2',{className:'vf26-h2'},'Results you can point to.'),
     h('p',{className:'vf26-lead'},'Every transformation here is a real VFitness client, shared with consent and built with structure, check ins and tracking.'),
     h('div',{style:{marginTop:'1.75rem',display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'results')},'See client results',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{})},'Start yours')),
     h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.')),
    hasShowcase?h(Reveal,{className:'vf26-results-media',delay:90},h(TransformationShowcase,{compact:true})):null))),

  /* Pricing */
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-command'},
    h('div',{style:{position:'relative',zIndex:1,maxWidth:'42rem'}},
     h('p',{className:'vf26-kicker'},'Simple, honest pricing'),
     h('h2',{className:'vf26-h2'},'Know the cost before you commit.'),
     h('p',{className:'vf26-lead'},'No lock in contracts. You always know what you are paying for and how many sessions you have left.')),
    h('div',{className:'vf26-price-grid'},
     h('div',{className:'vf26-price'},h('div',{className:'l'},'Online programs'),h('div',{className:'v'},'$15',h('small',null,' and up')),h('p',null,'One time purchase. Twelve coach built programs with video guidance.')),
     h('div',{className:'vf26-price'},h('div',{className:'l'},'Coaching memberships'),h('div',{className:'v'},'$19',h('small',null,' / month and up')),h('p',null,'Tracking, programming and coaching tiers with weekly check ins.')),
     h('div',{className:'vf26-price'},h('div',{className:'l'},'In person sessions'),h('div',{className:'v'},'4 to 12',h('small',null,' sessions')),h('p',null,'Session packages in Nassau, every session logged in your dashboard.'))),
    h('div',{className:'vf26-cta-row'},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'pricing')},'View pricing',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{})},'Start Your Transformation'))))),

  /* FAQ */
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-head'},h('p',{className:'vf26-kicker'},'FAQ'),h('h2',{className:'vf26-h2'},'The questions people ask before starting.')),
   h(Faq,null))),

  /* Final CTA */
  h('section',{className:'vf26-section tight',style:{paddingTop:0}},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-command',style:{textAlign:'center'}},
    h('div',{style:{position:'relative',zIndex:1,maxWidth:'40rem',margin:'0 auto'}},
     h('p',{className:'vf26-kicker'},'Ready when you are'),
     h('h2',{className:'vf26-h2'},'Start with the system. Build the result.'),
     h('p',{className:'vf26-lead',style:{marginLeft:'auto',marginRight:'auto'}},'Tell us your goal in two minutes. We will match you with a coach and a plan.')),
    h('div',{className:'vf26-cta-row',style:{justifyContent:'center'}},h('button',{className:'vf26-btn vf26-btn-blend',onClick:lead(setCurrentPage,{})},'Start Your Transformation',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'login')},'Client login'))))));
}

/* ================= FOOTER ================= */
function Footer(props){
 var setCurrentPage=props.setCurrentPage||function(){};
 function b(label,page){return h('button',{key:page,onClick:go(setCurrentPage,page)},label);}
 return h('footer',{className:'vf26 vf26-footer'},h('div',{className:'vf26-wrap'},
  h('div',{className:'vf26-foot-grid'},
   h('div',null,
    h('button',{className:'vf26-brand',onClick:go(setCurrentPage,'home'),style:{padding:0}},h('span',{className:'vf26-brand-tile'},zap()),h('span',{className:'vf26-brand-word'},'VFITNESS')),
    h('p',{className:'vf26-muted',style:{margin:'1rem 0 0',fontSize:'.9rem',lineHeight:1.6,maxWidth:'22rem'}},'Personal training in Nassau and coaching online. Built in The Bahamas from real coaching, real check ins and results we can point to.'),
    h('div',{className:'vf26-socials'},
     h('a',{href:'https://www.instagram.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Instagram'},icon('instagram',17)),
     h('a',{href:'https://www.facebook.com/xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'Facebook'},icon('facebook',17)),
     h('a',{href:'https://www.tiktok.com/@xvfitnessx',target:'_blank',rel:'noopener noreferrer','aria-label':'TikTok'},icon('tiktok',17)))),
   h('div',null,h('h5',null,'Train'),b('Start Here','starthere'),b('Programs','workoutprograms'),b('Pricing','pricing'),b('Exercise Library','library'),b('Client Login','login')),
   h('div',null,h('h5',null,'Company'),b('Trainers','trainers'),b('Results','results'),b('Locations','locations'),b('About','about'),b('Contact','contact')),
   h('div',null,h('h5',null,'Legal'),b('Privacy Policy','privacy'),b('Terms of Service','terms'),b('Refund and Cancellation','refund'),h('a',{href:'mailto:vfitnessbahamas@gmail.com'},'vfitnessbahamas@gmail.com'))),
  h('div',{className:'vf26-foot-base'},h('span',null,'© '+new Date().getFullYear()+' VFITNESS Training Services, Nassau, The Bahamas.'),h('span',null,'Training, programming and progress tracking.'))));
}

window.VF26={Navigation:Navigation,HomePage:HomePage,Footer:Footer};
window.Navigation=Navigation;window.HomePage=HomePage;window.Footer=Footer;
})();
