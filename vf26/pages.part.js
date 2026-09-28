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
    h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,p.secondaryPage||'workoutprograms')},p.secondaryLabel||'Explore programs')))));
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
   h('div',{className:'k'},'Anywhere'),h('h3',null,'Online coaching'),h('p',{className:'a'},'Train from home or any gym'),h('p',null,'Written programs, nutrition targets and weekly check ins in your account.'),
   h('button',{className:'vf26-link',onClick:go(p.setCurrentPage,'workoutprograms')},'Browse programs',icon('arrow',15))));
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
      h('p',null,'Send a quick coaching inquiry so your coach can tailor the next step to you, or start with a program from $15.'),
      h('div',{style:{display:'flex',gap:'.6rem',flexWrap:'wrap'}},h('button',{className:'vf26-btn vf26-btn-primary',onClick:go(setCurrentPage,'apply')},'Sign up for coaching'),h('button',{className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'workoutprograms')},'Browse programs'))))))),

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
   h(Reveal,{className:'vf26-command vf26-remote'},
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
 {name:'Darvano Andrews',first:'Darvano',role:'Founder and Head Coach',specialty:'Body recomposition and glute specialist',experience:'10+ years',phone:'242-454-9063',programs:7,clients:'2,000+',photo:'/vf26/darvano-andrews.webp',accent:'#4296f0',bio:'Founded VFitness in 2018 and has served more than 2,000 clients. Builds shape, muscle and confidence through structured programming, progressive overload, nutrition support and accountability.',certs:['Certified Personal Trainer','Functional Movement','Nutrition Coaching'],spec:['Body recomposition','Glute development','Muscle gain']},
 {name:'Chavese Moss',first:'Chavese',role:'Senior Coach and Partnerships Lead',specialty:'Weight loss and athletic coaching',experience:'8+ years',phone:'242-525-8834',programs:4,accent:'#5fddcc',bio:'Helps clients lose fat, improve performance, move better and build athletic strength through disciplined coaching. Also leads business partnerships for the team.',certs:['Strength and Conditioning','Sports Performance'],spec:['Weight loss','Body recomposition','Athletic coaching']},
 {name:'Lanardo Mackey',first:'Lanardo',role:'Senior Personal Trainer and Partnerships Lead',specialty:'Weight loss and group training',experience:'7+ years',phone:'242-818-5128',programs:5,accent:'#8869ec',bio:'Helps clients lose weight, improve conditioning and stay consistent through structured group and transformation coaching.',certs:['Sports Nutrition','Performance Coaching'],spec:['Weight loss','Conditioning','Group training']},
 {name:'Kevin Mackey',first:'Kevin',role:'Coach',specialty:'Body recomposition and group training',experience:'Team coach',phone:'242-454-9063',programs:3,accent:'#F97066',bio:'Helps clients build structure, improve body composition and stay consistent through group training and accountability based coaching.',certs:['Group Training','Accountability Coaching'],spec:['Beginner coaching','Body recomposition','Group training']}
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
       h('div',null,h('b',{className:'vf26-condensed'},t.programs),h('span',null,'Programs')),
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
   actions:[h('button',{key:'a',className:'vf26-btn vf26-btn-primary',onClick:lead(setCurrentPage,{})},'Start yours',icon('arrow',16,{className:'vf26-arrow'})),h('button',{key:'b',className:'vf26-btn vf26-btn-outline',onClick:go(setCurrentPage,'workoutprograms')},'See the programs')]}),
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
  h(PageHero,{eyebrow:'Contact',title:'Talk to',accent:'VFitness.',lead:'Questions about coaching, packages, locations or online programs? Reach us any of these ways and a coach will get back to you.',aside:h(ChatWidget,null),
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
   h('div',{className:'vf26-stat'},h('div',{className:'n'},h(CountUp,{to:12})),h('div',{className:'lbl'},'Coach built programs'))))),
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
   h('div',{className:'vf26-auth-stat'},h('div',null,h('b',{className:'vf26-condensed'},'2,000+'),h('span',null,'Clients served')),h('div',null,h('b',{className:'vf26-condensed'},'12'),h('span',null,'Programs')),h('div',null,h('b',{className:'vf26-condensed'},'4'),h('span',null,'Coaches')))));
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
var LoginPage=shell('LoginPage','auth',{eyebrow:'Client login',title:'Welcome back.',accent:'Pick up where you left off.',lead:'Your sessions, program, meals and progress are waiting in your account.',points:['Session balance and bookings','Your program and workout history','Meals, check ins and progress photos']});
var SignupPage=shell('SignupPage','auth',{eyebrow:'Create your account',title:'Start with the system.',accent:'Build the result.',lead:'One account for your programs, sessions, nutrition and coach support.',points:['Buy programs and session packages','Track workouts, meals and sleep','Weekly check ins with your coach']});
var StartHereFlow=shell('StartHereFlow','auth',{eyebrow:'Start here',title:'Tell us your goal.',accent:'We will match the plan.',lead:'Two minutes. A VFitness coach reviews every answer and reaches out with the right coach, location and program.',points:['Personal training in Nassau','Online coaching and programs','Free consultation for first timers']});
var ApplicationPage=shell('ApplicationPage','auth',{eyebrow:'Online coaching',title:'Apply for coaching.',accent:'From anywhere.',lead:'Tell us about your goals and schedule. A coach reviews your application and gets back to you with next steps.',points:['Written weekly program','Nutrition targets and meal guidance','Weekly check ins and coach messaging']});
var WorkoutProgramsPage=shell('WorkoutProgramsPage','store',{eyebrow:'Online programs',title:'Choose the outcome.',accent:'Follow the structure.',lead:'Coach built programs with video guidance, progression and tracking in your account. One time purchase, yours to keep.',chips:[['dumbbell','Coach built programs'],['check','One time purchase'],['trend','Progress tracked in your account']]});
var ProgramLibraryPage=shell('ProgramLibraryPage','store',{eyebrow:'Program library',title:'Find the plan',accent:'that fits how you train.',lead:'Search by goal, level and where you train. Every program comes with structure, progression and tracking.',chips:[['search','Search and filter'],['dumbbell','Home and gym plans'],['star','Rated by clients']]});
var LegalPage=shell('LegalPage','doc');
var PremiumTrainingDirectionPage=shell('PremiumTrainingDirectionPage','store');
var DashboardPage=shell('DashboardPage','member');
var GlobalSearchPage=shell('GlobalSearchPage','member');

var PAGES={PricingPage:PricingPage,TrainersPage:TrainersPage,VFResultsPage:VFResultsPage,VFLocationsPage:VFLocationsPage,VFContactPage:VFContactPage,AboutPage:AboutPage,
 LoginPage:LoginPage,SignupPage:SignupPage,StartHereFlow:StartHereFlow,ApplicationPage:ApplicationPage,WorkoutProgramsPage:WorkoutProgramsPage,ProgramLibraryPage:ProgramLibraryPage,
 LegalPage:LegalPage,PremiumTrainingDirectionPage:PremiumTrainingDirectionPage,DashboardPage:DashboardPage,GlobalSearchPage:GlobalSearchPage};
Object.keys(PAGES).forEach(function(k){window[k]=PAGES[k];});
