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
var PUBLIC_LINKS=[['home','Home'],['starthere','Start Here'],['pricing','Pricing'],['trainers','Trainers'],['results','Results'],['contact','Contact']];
function Navigation(props){
 var user=props.user,isAdmin=props.isAdmin,currentPage=props.currentPage,setCurrentPage=props.setCurrentPage,theme=props.theme,toggleTheme=props.toggleTheme;
 var ms=React.useState(false),open=ms[0],setOpen=ms[1];
 window.__vf26SetPage=setCurrentPage;
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
 var more=[['locations','Locations'],['about','About']];
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
    h('p',{className:'vf26-lead'},'Every photo is a real VFitness client, shared with consent. Structure, check ins and tracking did the rest.')),
   h('div',{className:'vf26-reel-count'},h('b',{className:'vf26-condensed'},n?n:'2,000+'),h('span',null,n?'Transformations shown':'Clients served'))),
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
   h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start your transformation',icon('arrow',16,{className:'vf26-arrow'})),
   h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'results')},'See client results')),
  h('p',{className:'vf26-note'},'Results vary with consistency, nutrition and individual differences.')));
}
function TransformationShowcaseSafe(){return typeof TransformationShowcase==='function'?h(TransformationShowcase,null):null;}

function HomePage(props){
 var setCurrentPage=props.setCurrentPage;
 React.useEffect(function(){try{window.scrollTo(0,0);}catch(e){}},[]);
 var hasShowcase=typeof TransformationShowcase==='function';
 return h('main',{className:'vf26'},
  /* Hero */
  h('section',{className:'vf26-hero'},
   h('div',{className:'vf26-hero-side','aria-hidden':'true'}),
   h('div',{className:'vf26-wrap vf26-hero-grid'},
    h('div',{className:'vf26-hero-copy'},
     h('div',{className:'vf26-eyebrow vf26-enter'},h('i'),'Personal training in Nassau and online'),
     h('h1',{className:'vf26-h1 vf26-enter',style:{'--d':'40ms'}},'Train Smart.',h('span',null,'Train Elite.')),
     h('p',{className:'vf26-lead vf26-enter',style:{'--d':'100ms'}},'Structured coaching, nutrition support and weekly check ins. Every session is tracked so your next one starts where the last one left off.'),
     h('div',{className:'vf26-hero-cta vf26-enter',style:{'--d':'160ms'}},
      h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start Your Transformation',icon('arrow',16,{className:'vf26-arrow'})),
      h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'results')},'See transformations'),
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
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:8})),h('div',{className:'lbl'},'Years coaching in Nassau'))))),

  /* Transformations */
  h(TransformReel,{setCurrentPage:setCurrentPage}),

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
      h('div',{className:'k'},'Online'),h('h3',null,'Online coaching'),
      h('p',null,'Remote coaching with a written weekly plan, nutrition targets, weekly check ins and coach messaging from anywhere.'),
      h('ul',null,h('li',null,'$60 per month'),h('li',null,'Weekly check ins'),h('li',null,'Coach messaging')),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'apply')},'Apply for coaching'),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'pricing')},'See pricing'))))))),

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

  /* Pricing */
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-command'},
    h('div',{style:{position:'relative',zIndex:1,maxWidth:'42rem'}},
     h('p',{className:'vf26-kicker'},'Simple, honest pricing'),
     h('h2',{className:'vf26-h2'},'Know the cost before you commit.'),
     h('p',{className:'vf26-lead'},'No lock in contracts. You always know what you are paying for and how many sessions you have left.')),
    h('div',{className:'vf26-price-grid'},
     h('div',{className:'vf26-price'},h('div',{className:'l'},'Personal training'),h('div',{className:'v'},'$30',h('small',null,' / session and up')),h('p',null,'One on one coaching in Nassau. Semi private sessions from $22.')),
     h('div',{className:'vf26-price'},h('div',{className:'l'},'Remote coaching'),h('div',{className:'v'},'$60',h('small',null,' / month')),h('p',null,'A written weekly plan, nutrition targets and weekly check ins from anywhere.')),
     h('div',{className:'vf26-price'},h('div',{className:'l'},'Free consultation'),h('div',{className:'v'},'Free'),h('p',null,'Goals, body assessment and the right starting plan before you commit.'))),
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
   h('div',null,h('h5',null,'Train'),b('Start Here','starthere'),b('Pricing','pricing'),b('Online Coaching','apply'),b('Book a Consultation','book'),b('Client Login','login')),
   h('div',null,h('h5',null,'Company'),b('Trainers','trainers'),b('Results','results'),b('Locations','locations'),b('About','about'),b('Contact','contact')),
   h('div',null,h('h5',null,'Legal'),b('Privacy Policy','privacy'),b('Terms of Service','terms'),b('Refund and Cancellation','refund'),h('a',{href:'mailto:vfitnessbahamas@gmail.com'},'vfitnessbahamas@gmail.com'))),
  h('div',{className:'vf26-foot-base'},h('span',null,'© '+new Date().getFullYear()+' VFITNESS Training Services, Nassau, The Bahamas.'),h('span',null,'Training, programming and progress tracking.'))));
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
 return h('section',{className:'vf26-phero'+(p.center?' center':'')},
  h('div',{className:'vf26-phero-glow','aria-hidden':'true'}),
  h('div',{className:'vf26-wrap vf26-phero-in'},
   h('div',{className:'vf26-phero-copy'},
    h('div',{className:'vf26-eyebrow vf26-enter'},h('i'),p.eyebrow),
    h('h1',{className:'vf26-ph1 vf26-enter',style:{'--d':'40ms'}},p.title,p.accent?h('span',null,p.accent):null),
    p.lead?h('p',{className:'vf26-lead vf26-enter',style:{'--d':'100ms'}},p.lead):null,
    p.actions?h('div',{className:'vf26-hero-cta vf26-enter',style:{'--d':'160ms'}},p.actions):null,
    p.chips?h('div',{className:'vf26-phero-chips vf26-enter',style:{'--d':'220ms'}},p.chips.map(function(c){return h('span',{key:c[1]},icon(c[0],15),c[1]);})):null),
   p.aside?h('div',{className:'vf26-phero-aside vf26-enter',style:{'--d':'140ms'}},p.aside):null));
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
    h('p',{className:'vf26-kicker'},p.kicker||'Ready when you are'),
    h('h2',{className:'vf26-h2'},p.title||'Start with the system. Build the result.'),
    h('p',{className:'vf26-lead',style:{marginLeft:'auto',marginRight:'auto'}},p.lead||'Tell us your goal in two minutes. We will match you with a coach and a plan.')),
   h('div',{className:'vf26-cta-row',style:{justifyContent:'center'}},
    h('button',{className:'vf26-btn vf26-btn-blend',onClick:lead(setCurrentPage,p.kv||{})},'Start Your Transformation',icon('arrow',16,{className:'vf26-arrow'})),
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
   h('button',{className:'vf26-link',onClick:lead(p.setCurrentPage,{vf_lead_location:l.name})},'Train here',icon('arrow',15)));}),
  h(Reveal,{className:'vf26-loc online',delay:240},
   h('span',{className:'vf26-loc-pin'},icon('globe',20)),
   h('div',{className:'k'},'Anywhere'),h('h3',null,'Online coaching'),h('p',{className:'a'},'Train from home or any gym'),h('p',null,'A written weekly plan, nutrition targets and weekly check ins in your account.'),
   h('button',{className:'vf26-link',onClick:go(p.setCurrentPage,'apply')},'Apply for coaching',icon('arrow',15))));
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
  h(PageHero,{eyebrow:'Pricing',title:'Know the cost',accent:'before you commit.',lead:'Personal training in Nassau and online coaching. No lock in contracts, and you always know how many sessions you have left.',
   chips:[['check','No lock in contracts'],['history','Sessions tracked in your dashboard'],['shield','Secure checkout']],
   aside:h(SessionWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:scrollToId('vf26-packages')},'See session packages',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Book a free consult')]}),

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Choose your path',title:'Train in person or train online.'}),
   h('div',{className:'vf26-paths'},
    h(Reveal,{className:'vf26-path'},
     h('img',{src:'/vf26/strength-editorial-v1.webp',alt:'Athlete training with dumbbells in a Nassau gym',loading:'lazy'}),
     h('div',{className:'vf26-path-in'},h('div',{className:'k'},'In person'),h('h3',null,'Train in Nassau'),
      h('p',null,'Hands on coaching with form correction and accountability. Prices are listed below and you can book directly.'),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:scrollToId('vf26-packages')},'See in person prices')))),
    h(Reveal,{className:'vf26-path',delay:90},
     h('img',{src:'/vf26/fuel-the-fire-v1.webp',alt:'Balanced high protein meal',loading:'lazy'}),
     h('div',{className:'vf26-path-in'},h('div',{className:'k'},'Online'),h('h3',null,'Online coaching'),
      h('p',null,'Send a quick coaching inquiry so your coach can tailor the plan, check ins and nutrition targets to you.'),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'apply')},'Sign up for coaching'),h('button',{className:'vf26-btn vf26-btn-outline',onClick:scrollToId('vf26-remote')},'See remote pricing'))))))),

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

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(Reveal,{className:'vf26-command vf26-remote',id:'vf26-remote'},
    h('div',{style:{position:'relative',zIndex:1}},
     h('p',{className:'vf26-kicker'},'Remote training'),
     h('h2',{className:'vf26-h2'},'Coaching from anywhere.'),
     h('p',{className:'vf26-lead'},'Train from anywhere with remote coaching through the True Coach app, with a written plan and coach feedback every week.'),
     h('ul',{className:'vf26-ticks'},['Written weekly program','Form feedback on video','Nutrition targets','Weekly check ins'].map(function(t){return h('li',{key:t},icon('check',15),t);}))),
    h('div',{className:'vf26-remote-price'},
     h('div',{className:'v'},'$60',h('small',null,' / month')),
     h('button',{className:'vf26-btn vf26-btn-blend',onClick:function(){select({title:'Remote Training',price:60});}},'Select package',icon('arrow',16,{className:'vf26-arrow'})),
     h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'apply')},'Ask a coach first'))))),

  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'FAQ',title:'Questions before you buy.'}),h(Faq,null))),
  h(FinalCTA,{setCurrentPage:setCurrentPage}),
  typeof TrainerSelectionModal==='function'?h(TrainerSelectionModal,{isOpen:showModal,onClose:function(){setShowModal(false);},selectedPackage:selected,user:user,theme:theme}):null);
}

/* ================= TRAINERS ================= */
var TRAINERS=[
 {name:'Darvano Andrews',first:'Darvano',role:'Founder and Head Coach',specialty:'Body recomposition and glute specialist',experience:'10+ years',phone:'242-454-9063',rating:'5.0',clients:'2,000+',photo:'/vf26/darvano-andrews.webp',accent:'#4296f0',bio:'Founded VFitness in 2018 and has served more than 2,000 clients. Builds shape, muscle and confidence through structured programming, progressive overload, nutrition support and accountability.',certs:['Certified Personal Trainer','Functional Movement','Nutrition Coaching'],spec:['Body recomposition','Glute development','Muscle gain']},
 {name:'Chavese Moss',first:'Chavese',role:'Senior Coach and Partnerships Lead',specialty:'Weight loss and athletic coaching',experience:'8+ years',phone:'242-525-8834',rating:'4.9',accent:'#5fddcc',bio:'Helps clients lose fat, improve performance, move better and build athletic strength through disciplined coaching. Also leads business partnerships for the team.',certs:['Strength and Conditioning','Sports Performance'],spec:['Weight loss','Body recomposition','Athletic coaching']},
 {name:'Lanardo Mackey',first:'Lanardo',role:'Senior Personal Trainer and Partnerships Lead',specialty:'Weight loss and group training',experience:'7+ years',phone:'242-818-5128',rating:'4.9',accent:'#8869ec',bio:'Helps clients lose weight, improve conditioning and stay consistent through structured group and transformation coaching.',certs:['Sports Nutrition','Performance Coaching'],spec:['Weight loss','Conditioning','Group training']},
 {name:'Kevin Mackey',first:'Kevin',role:'Coach',specialty:'Body recomposition and group training',experience:'Team coach',phone:'242-454-9063',rating:'4.9',accent:'#F97066',bio:'Helps clients build structure, improve body composition and stay consistent through group training and accountability based coaching.',certs:['Group Training','Accountability Coaching'],spec:['Beginner coaching','Body recomposition','Group training']}
];
function TrainersPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'The coaching team',title:'Four coaches.',accent:'One system.',lead:'Every VFitness coach works from the same programming, tracking and check in system, so your plan stays consistent whoever you train with.',
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
  h(HowItWorks,null),
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
  h(HowItWorks,null),
  h(FinalCTA,{setCurrentPage:setCurrentPage,kicker:'Your turn',title:'The next result could be yours.'}));
}

/* ================= LOCATIONS ================= */
function VFLocationsPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Locations',title:'Train with VFitness',accent:'across Nassau.',lead:'We are not limited to one building. VFitness brings the coaching system, trainers, tracking and accountability to trusted training locations across Nassau, and online to anywhere.',
   chips:[['pin','3 Nassau locations'],['globe','Online anywhere'],['clock','Open six days a week']],aside:h(MapWidget,null),
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start Here',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'contact')},'Contact us')]}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Where we train',title:'Pick the gym that suits your day.'}),
   h(LocationCards,{setCurrentPage:setCurrentPage}),
   h(Reveal,{className:'vf26-loc-foot'},h(HoursCard,null),
    h('div',{className:'vf26-panel vf26-loc-note'},h('span',{className:'vf26-icon-tile'},icon('chat',20)),h('div',null,h('b',null,'Not sure which location?'),h('p',null,'Tell us where you live or work and when you can train. We will suggest the best fit.')),
     h('button',{className:'vf26-btn vf26-btn-outline',onClick:lead(setCurrentPage,{})},'Ask us'))))),
  h(HowItWorks,null),
  h(FinalCTA,{setCurrentPage:setCurrentPage}));
}

/* ================= CONTACT ================= */
function VFContactPage(props){
 var setCurrentPage=props.setCurrentPage;useTop();
 var cards=[
  {ic:'chat',t:'Message on WhatsApp',d:'Fastest response. Coaching questions, packages and bookings.',v:'Open WhatsApp',href:waLink(),ext:true,acc:'#25D366'},
  {ic:'mail',t:'Email VFitness',d:'Applications, invoices and general questions.',v:VF_EMAIL,href:'mailto:'+VF_EMAIL,acc:'#4296f0'},
  {ic:'phone',t:'Call or text',d:'Reach the VFitness line directly.',v:VF_PHONE,href:VF_TEL,acc:'#8869ec'}
 ];
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'Contact',title:'Talk to',accent:'VFitness.',lead:'Questions about coaching, packages, locations or online coaching? Reach us any of these ways and a coach will get back to you.',aside:h(ChatWidget,null),
   actions:[h('a',{key:'a',className:'vf26-btn vf26-btn-primary',href:VF_TEL},icon('phone',16),'Call '+VF_PHONE),h('a',{key:'b',className:'vf26-btn vf26-btn-outline',href:'mailto:'+VF_EMAIL},icon('mail',16),'Email us')]}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h('div',{className:'vf26-contact-grid'},cards.map(function(c,i){return h(Reveal,{key:c.t,delay:i*80},
    h('a',{className:'vf26-contact',href:c.href,target:c.ext?'_blank':undefined,rel:c.ext?'noopener noreferrer':undefined,style:{'--acc':c.acc}},
     h('span',{className:'ic'},icon(c.ic,22)),h('h3',null,c.t),h('p',null,c.d),h('span',{className:'v'},c.v,icon('arrow',15))));})),
   h('div',{className:'vf26-contact-split'},
    h(Reveal,{className:'vf26-panel vf26-contact-start'},h('p',{className:'vf26-kicker'},'Ready to start?'),h('h3',{className:'vf26-h3',style:{fontSize:'1.6rem'}},'Skip the back and forth.'),
     h('p',{className:'vf26-muted'},'Answer a few questions in Start Here and a coach will reach out with the right plan, location and package.'),
     h('div',{className:'vf26-cta-row'},h('button',{className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start Here',icon('arrow',16,{className:'vf26-arrow'})),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'book')},'Book a free consult'))),
    h(Reveal,{delay:90},h(HoursCard,null))))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Locations',title:'Where we train.'}),h(LocationCards,{setCurrentPage:setCurrentPage}))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'FAQ',title:'Common questions.'}),h(Faq,null))));
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
 var values=[['targets',ACC.nutrition,'Structure over guesswork','Every client gets a written plan with clear targets, not a random workout of the day.'],
  ['heartbeat',ACC.progression,'Tracked, not remembered','Weights, reps, meals, sleep and check ins are logged so progress is measured.'],
  ['calendar',ACC.training,'Accountability every week','Weekly check ins keep you consistent and let your coach adjust the plan with you.'],
  ['muscle',ACC.progress,'Built in The Bahamas','A Nassau coaching team that knows the gyms, the schedules and the lifestyle here.']];
 return h('main',{className:'vf26 vf26-page'},
  h(PageHero,{eyebrow:'About VFitness',title:'Built from real coaching.',accent:'Since 2018.',lead:'VFitness is a Nassau personal training company with complete fitness management. Book sessions, follow your program, track meals and reach your goals with expert guidance, in person or online.',
   chips:[['users','2,000+ clients served'],['award','Founded 2018'],['pin','Nassau, The Bahamas']],
   aside:h(Gallery,null)}),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'What we believe',title:'The work is yours. The system is ours.'}),
   h('div',{className:'vf26-feature-grid four'},values.map(function(f,i){return h(FeatureCard,{key:f[2],f:f,delay:i*60});})))),
  h('section',{className:'vf26-stats','aria-label':'VFitness by the numbers'},h('div',{className:'vf26-wrap'},h('div',{className:'vf26-stats-grid'},
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:2000}),h('em',null,'+')),h('div',{className:'lbl'},'Clients served')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:2018})),h('div',{className:'lbl'},'Founded')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:4})),h('div',{className:'lbl'},'Coaches')),
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:3})),h('div',{className:'lbl'},'Nassau training locations'))))),
  h('section',{className:'vf26-section tight'},h('div',{className:'vf26-wrap'},
   h(SectionHead,{kicker:'Visit or reach out',title:'Find us in Nassau.'}),
   h('div',{className:'vf26-contact-split'},
    h(Reveal,{className:'vf26-panel vf26-about-contact'},
     h('a',{href:VF_TEL},h('span',{className:'vf26-icon-tile'},icon('phone',18)),h('div',null,h('span',null,'Phone'),h('b',null,VF_PHONE))),
     h('a',{href:'mailto:'+VF_EMAIL},h('span',{className:'vf26-icon-tile'},icon('mail',18)),h('div',null,h('span',null,'Email'),h('b',null,VF_EMAIL))),
     LOCS.slice(0,3).map(function(l){return h('div',{key:l.name,className:'r'},h('span',{className:'vf26-icon-tile'},icon('pin',18)),h('div',null,h('span',null,l.name),h('b',null,l.area)));})),
    h(Reveal,{delay:90},h(HoursCard,null))))),
  h(FinalCTA,{setCurrentPage:setCurrentPage,secondaryPage:'trainers',secondaryLabel:'Meet the coaches'}));
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
var LoginPage=shell('LoginPage','auth',{eyebrow:'Client login',title:'Welcome back.',accent:'Pick up where you left off.',lead:'Your sessions, program, meals and progress are waiting in your account.',points:['Session balance and bookings','Your program and workout history','Meals, check ins and progress photos']});
var SignupPage=shell('SignupPage','auth',{eyebrow:'Create your account',title:'Start with the system.',accent:'Build the result.',lead:'One account for your sessions, nutrition and coach support.',points:['Buy and track session packages','Track workouts, meals and sleep','Weekly check ins with your coach']});
var StartHereFlow=shell('StartHereFlow','auth',{eyebrow:'Start here',title:'Tell us your goal.',accent:'We will match the plan.',lead:'Two minutes. A VFitness coach reviews every answer and reaches out with the right coach, location and plan.',points:['Personal training in Nassau','Online coaching from anywhere','Free consultation for first timers']});
var ApplicationPage=shell('ApplicationPage','auth',{eyebrow:'Online coaching',title:'Apply for coaching.',accent:'From anywhere.',lead:'Tell us about your goals and schedule. A coach reviews your application and gets back to you with next steps.',points:['Written weekly program','Nutrition targets and meal guidance','Weekly check ins and coach messaging']});
var WorkoutProgramsPage=membersOnly('WorkoutProgramsPage');
var ProgramLibraryPage=membersOnly('ProgramLibraryPage');
var LegalPage=shell('LegalPage','doc');
var PremiumTrainingDirectionPage=shell('PremiumTrainingDirectionPage','store');
var DashboardPage=shell('DashboardPage','member');
var GlobalSearchPage=shell('GlobalSearchPage','member');

var PAGES={PricingPage:PricingPage,TrainersPage:TrainersPage,VFResultsPage:VFResultsPage,VFLocationsPage:VFLocationsPage,VFContactPage:VFContactPage,AboutPage:AboutPage,
 LoginPage:LoginPage,SignupPage:SignupPage,StartHereFlow:StartHereFlow,ApplicationPage:ApplicationPage,WorkoutProgramsPage:WorkoutProgramsPage,ProgramLibraryPage:ProgramLibraryPage,
 LegalPage:LegalPage,PremiumTrainingDirectionPage:PremiumTrainingDirectionPage,DashboardPage:DashboardPage,GlobalSearchPage:GlobalSearchPage};
Object.keys(PAGES).forEach(function(k){window[k]=PAGES[k];});

window.VF26={Navigation:Navigation,HomePage:HomePage,Footer:Footer,pages:PAGES};
window.Navigation=Navigation;window.HomePage=HomePage;window.Footer=Footer;
})();
