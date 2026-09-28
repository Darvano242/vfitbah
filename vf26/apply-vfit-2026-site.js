// Applies the VFIT 2026 app design layer to the built site/index.html.
// Runs after the existing production build steps. Idempotent.
const fs=require('fs');
const path=require('path');
const vm=require('vm');

const root=process.cwd();
const here=__dirname;
const site=path.join(root,'site');
const indexPath=path.join(site,'index.html');
const MARK='VFIT_2026_SITE_LAYER';
const VERSION=require('crypto').createHash('md5').update(fs.readFileSync(path.join(here,'vfit-2026.js'))).update(fs.readFileSync(path.join(here,'vfit-2026.css'))).digest('hex').slice(0,10);

let html=fs.readFileSync(indexPath,'utf8');
if(html.includes(MARK)){console.log('VFIT 2026 layer already applied');process.exit(0);}

function once(from,to){
  const n=html.split(from).length-1;
  if(n!==1)throw new Error('Expected exactly one "'+from+'" but found '+n);
  html=html.replace(from,to);
}

// 1. Hand the header, homepage and footer to the new components.
once('function HomePage(','function VFLegacyHomePage(');
once('function Navigation(','function VFLegacyNavigation(');
once('function Footer(','function VFLegacyFooter(');
const PAGE_NAMES=["PricingPage", "TrainersPage", "VFResultsPage", "VFLocationsPage", "VFContactPage", "AboutPage", "LoginPage", "SignupPage", "StartHereFlow", "ApplicationPage", "WorkoutProgramsPage", "ProgramLibraryPage", "LegalPage", "PremiumTrainingDirectionPage", "DashboardPage", "GlobalSearchPage"];
for(const n of PAGE_NAMES)once('function '+n+'(','function VFLegacy'+n+'(');

// 2. App palette: move legacy hard coded colours onto the VFIT app colours.
const colorMap=[
  [/#3d7dff/gi,'#4296f0'],[/#6f5bff/gi,'#8869ec'],[/#2dd4bf/gi,'#5fddcc'],[/#5eead4/gi,'#7fe6d8'],
  [/#9cc0ff/gi,'#7bb6f4'],[/#050608/gi,'#0f1115'],[/#070809/gi,'#0f1115'],[/#08090a/gi,'#0f1115'],
  [/#05070b/gi,'#0f1115'],[/#050505/gi,'#0f1115'],[/#0a0c10/gi,'#191b1f'],[/#0c0e10/gi,'#13161a'],
  [/rgba\(\s*61\s*,\s*125\s*,\s*255\s*,/g,'rgba(66,150,240,'],
  [/rgba\(\s*111\s*,\s*91\s*,\s*255\s*,/g,'rgba(136,105,236,'],
  [/rgba\(\s*45\s*,\s*212\s*,\s*191\s*,/g,'rgba(95,221,204,'],
  [/'Bricolage Grotesque'/g,"'Geist'"],[/'Instrument Sans'/g,"'Geist'"]
];
for(const [re,to] of colorMap)html=html.replace(re,to);

// 3. Public copy matches the app: clients served, not transformations.
const copy=[
  ['500+ clients trained in Nassau with real accountability and results.','2,000+ clients served with real accountability and results.'],
  ['500+ clients trained in Nassau with real results.','2,000+ clients served with real results.'],
  ["t:'500+ Clients Trained'","t:'2,000+ Clients Served'"],
  ['["500+","Clients Trained","Real people coached through the VFITNESS system since 2018."]','["2,000+","Clients Served","Real people coached through the VFITNESS system since 2018."]'],
  ['VH("div",{className:"vfx-giant"},"500+"),\n  VH("div",{className:"text-2xl sm:text-3xl font-black text-white mb-3",style:{letterSpacing:\'-0.02em\'}},"Transformations")','VH("div",{className:"vfx-giant"},"2,000+"),\n  VH("div",{className:"text-2xl sm:text-3xl font-black text-white mb-3",style:{letterSpacing:\'-0.02em\'}},"Clients Served")'],
  ['role:"VFITNESS Coach",spec:["Weight Loss","Body Recomposition","Group Training"]','role:"Senior Personal Trainer and Partnerships Lead",spec:["Weight Loss","Body Recomposition","Group Training"]'],
  ['role:"VFITNESS Coach",spec:["Weight Loss","Body Recomposition","Athletic Coaching"]','role:"Senior Coach and Partnerships Lead",spec:["Weight Loss","Body Recomposition","Athletic Coaching"]'],
  ['role:"Founder and Lead Coach"','role:"Founder and Head Coach"'],
  ['role:"Founder & Lead Coach"','role:"Founder & Head Coach"'],
  ['{name:"Lanardo Mackey",role:"VFITNESS Coach"','{name:"Lanardo Mackey",role:"Senior Personal Trainer & Partnerships Lead"'],
  ['{name:"Chavese Moss",role:"VFITNESS Coach"','{name:"Chavese Moss",role:"Senior Coach & Partnerships Lead"'],
  ['transformations:500,','transformations:2000,'],
  [".transformations,\"+\"),/*#__PURE__*/React.createElement(\"div\",{className:\"text-xs\",style:{color:'var(--mu-text-mute)'}},\"Transformations\")",".transformations.toLocaleString('en-US'),\"+\"),/*#__PURE__*/React.createElement(\"div\",{className:\"text-xs\",style:{color:'var(--mu-text-mute)'}},\"Clients Served\")"],
  ['className:"grid md:grid-cols-3 gap-5"},trainers.map(','className:"grid sm:grid-cols-2 xl:grid-cols-4 gap-5"},trainers.map(']
];
for(const [a,b] of copy){if(html.includes(a))html=html.split(a).join(b);}

// 4. Fonts, theme boot and the design layer in the head; components before the app script.
const fontHref='https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Geist:wght@100..900&family=Geist+Mono:wght@400..700&display=swap';
const head=`
    <!-- ${MARK} -->
    <link rel="stylesheet" href="${fontHref}">
    <script>(function(){var r=document.documentElement;r.setAttribute('data-vf26','1');try{r.setAttribute('data-vf-theme',localStorage.getItem('vfitness-theme')==='light'?'light':'dark');}catch(e){r.setAttribute('data-vf-theme','dark');}})();</script>
    <link rel="stylesheet" href="/vf26/vfit-2026.css?v=${VERSION}" data-vf26-css>
    <link rel="icon" type="image/png" href="/vf26/vfit-app-icon-180.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/vf26/vfit-app-icon-180.png">
`;
const headClose=html.indexOf('</head>');
if(headClose<0)throw new Error('No </head>');
html=html.slice(0,headClose)+head+html.slice(headClose);

// The design layer must win over style blocks that sit later in the body, so it is linked again at the very end.
const bodyClose=html.lastIndexOf('</body>');
if(bodyClose<0)throw new Error('No </body>');
html=html.slice(0,bodyClose)+`<link rel="stylesheet" href="/vf26/vfit-2026.css?v=${VERSION}" data-vf26-css-late>\n`+html.slice(bodyClose);

// Components must be defined before the main application script renders.
const anchor='<script src="/vfp-programs.js';
const ai=html.indexOf(anchor);
if(ai<0)throw new Error('Could not find the app script anchor');
html=html.slice(0,ai)+`<script src="/vf26/vfit-2026.js?v=${VERSION}"></script>\n    `+html.slice(ai);

// 5a. Site title
const OLD_TITLE="VFITNESS Bahamas | Nassau's Premium Body Transformation System";
const NEW_TITLE="VFITNESS | Train Smart. Train Elite.";
html=html.split('<title>'+OLD_TITLE+'</title>').join('<title>'+NEW_TITLE+'</title>');
html=html.split('content="'+OLD_TITLE+'"').join('content="'+NEW_TITLE+'"');
html=html.split('home:"'+OLD_TITLE+'"').join('home:"'+NEW_TITLE+'"');
if(!html.includes('<title>'+NEW_TITLE+'</title>'))throw new Error('Title not updated');


// 5b. Kevin Mackey joins the trainer lists (package assignment, booking and trainer filtering).
once("const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'}];",
     "const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'},{id:'kevin_mackey',name:'Kevin Mackey'}];");
once("const trainers=[{id:'darvano',name:'Darvano Andrews'},{id:'chavese',name:'Chavese Moss'},{id:'lanardo',name:'Lanardo Mackey'}]",
     "const trainers=[{id:'darvano',name:'Darvano Andrews'},{id:'chavese',name:'Chavese Moss'},{id:'lanardo',name:'Lanardo Mackey'},{id:'kevin',name:'Kevin Mackey'}]");
once("if(isLanardo){trainerFilter='Lanardo Mackey';}else if(isChavese){trainerFilter='Chavese Moss';}",
     "if(isLanardo){trainerFilter='Lanardo Mackey';}else if(isChavese){trainerFilter='Chavese Moss';}else if(user?.role==='trainer'&&((user?.email||'').toLowerCase().includes('kevin')||(user?.name||'').toLowerCase().includes('kevin'))){trainerFilter='Kevin Mackey';}");

// 5c. Package Control cards in the app design.
{
  const start="let barColor='from-green-500 to-emerald-500';";
  const end="};// DRILL-IN: show one trainer's packages";
  const b=html.indexOf(end), a=b<0?-1:html.lastIndexOf(start,b);
  if(a<0||b<0||html.indexOf(end,b+1)>=0||b-a>9000)throw new Error('Package card block not found');
  const card=`const tone=remaining<=2?'low':remaining<=5?'mid':'ok';const paused=pkg.status==='paused';const created=pkg.createdAt?.toDate?.()?.toLocaleDateString()||pkg.purchaseDate?.toDate?.()?.toLocaleDateString()||'N/A';const RC=React.createElement;const who=client?.name||pkg.clientName||'Unknown Client';const pct=Math.max(0,Math.min(100,percentage));
return RC("article",{key:pkg.id,className:"vf26-pc"+(paused?" is-paused":"")},
 RC("header",{className:"vf26-pc-head"},
  RC("span",{className:"vf26-pc-avatar"},String(who).trim().split(/\\s+/).map(w=>w.charAt(0)).join('').slice(0,2).toUpperCase()),
  RC("div",{className:"vf26-pc-id"},RC("h3",null,who),RC("p",null,pkg.packageName||pkg.title||(total+'-Session Package'))),
  RC("span",{className:"vf26-pc-left tone-"+tone},RC("b",null,remaining),RC("small",null,"left"))),
 paused?RC("div",{className:"vf26-pc-flag"},RC(Ico,{name:"pause",size:13}),"Package paused"):null,
 RC("div",{className:"vf26-pc-meter"},
  RC("div",{className:"vf26-pc-bar"},RC("i",{className:"tone-"+tone,style:{width:Math.max(3,pct)+'%'}})),
  RC("div",{className:"vf26-pc-count"},RC("span",null,RC("b",null,completed)," of ",total," sessions completed"),RC("span",null,Math.round(pct),"%"))),
 RC("div",{className:"vf26-pc-fields"},
  RC("label",{className:"vf26-pc-field"},RC("span",null,"Assigned trainer"),
   RC("select",{value:pkg.assignedTrainerId||pkg.assignedById||getPackageTrainerIdByName(pkg.assignedTrainerName||pkg.assignedBy)||'',onChange:e=>assignPackageTrainer(pkg,e.target.value)},PACKAGE_ASSIGN_TRAINERS.map(t=>RC("option",{key:t.id,value:t.id},t.name)))),
  RC("label",{className:"vf26-pc-field"},RC("span",null,"Discount %"),
   RC("input",{type:"number",min:0,max:100,defaultValue:discountPct,onBlur:e=>updatePackageDiscount(pkg,e.target.value)}))),
 RC("div",{className:"vf26-pc-bill"},
  RC("div",null,RC("span",null,"Base"),RC("b",null,"$",money(baseAmount))),
  RC("div",null,RC("span",null,"Discount"),RC("b",null,"-$",money(discountAmount))),
  RC("div",{className:"total"},RC("span",null,"Charge"),RC("b",null,"$",money(finalAmount)))),
 RC("div",{className:"vf26-pc-main"},
  RC("button",{type:"button",onClick:()=>adjustSessions(pkg.id,-1,pkg),className:"vf26-pc-btn primary"},RC(Ico,{name:"check",size:16}),"Log session"),
  RC("button",{type:"button",onClick:()=>adjustSessions(pkg.id,1,pkg),className:"vf26-pc-btn"},RC(Ico,{name:"plus",size:16}),"Add session")),
 RC("div",{className:"vf26-pc-tools"},
  RC("button",{type:"button",onClick:()=>togglePackagePause(pkg),className:"vf26-pc-tool"+(paused?" on":"")},RC(Ico,{name:paused?'play':'pause',size:15}),paused?'Resume':'Pause'),
  RC("button",{type:"button",onClick:()=>toggleAutoRenewal(pkg),className:"vf26-pc-tool"+(pkg.autoRenewalEnabled?" on":"")},RC(Ico,{name:pkg.autoRenewalEnabled?"refresh-cw":"repeat",size:15}),pkg.autoRenewalEnabled?'Auto renew on':'Auto renew'),
  RC("button",{type:"button",onClick:()=>downloadPackageInvoice(pkg,client),className:"vf26-pc-tool"},RC(Ico,{name:"file-text",size:15}),"Invoice")),
 RC("footer",{className:"vf26-pc-foot"},"Created ",created));`;
  html=html.slice(0,a)+card+html.slice(b);
  once(`className:"flex items-center gap-2 mb-5 px-4 py-2 rounded-xl font-semibold",style:{background:'var(--mu-surface)',border:'1px solid var(--mu-border)',color:'var(--mu-text-dim)'}},/*#__PURE__*/React.createElement(Ico,{name:"arrow-left",size:16})," All trainers")`,
       `className:"vf26-pc-back"},/*#__PURE__*/React.createElement(Ico,{name:"arrow-left",size:16}),"All trainers")`);
  once(`React.createElement("div",{className:"flex items-center gap-3 mb-5"},/*#__PURE__*/React.createElement(Ico3D,{name:"user",variant:"primary",tile:46,size:23}),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("h3",{className:"text-xl font-black text-white"},selectedTrainer)`,
       `React.createElement("div",{className:"vf26-pc-group"},React.createElement("span",{className:"vf26-pc-gavatar"},String(selectedTrainer||'?').trim().split(/\\s+/).map(w=>w.charAt(0)).join('').slice(0,2).toUpperCase()),/*#__PURE__*/React.createElement("div",null,/*#__PURE__*/React.createElement("h3",null,selectedTrainer)`);
  once(`className:"grid md:grid-cols-2 gap-4"},list.map(renderCard))`,`className:"vf26-pc-grid"},list.map(renderCard))`);
  once(`className:"text-left p-5 rounded-2xl transition-all hover:-translate-y-0.5",style:{background:'var(--mu-surface)',border:'1px solid var(--mu-border)'}}`,`className:"vf26-pc-trainer"}`);
  once(`(name||'?').charAt(0).toUpperCase())`,`String(name||'?').trim().split(/\\s+/).map(w=>w.charAt(0)).join('').slice(0,2).toUpperCase())`);
}


// 5d. Sign in must never fall back to a signed out blank page.
//     A missing profile document is created as a client profile; a failed profile read keeps the person signed in.
once("auth.onAuthStateChanged(async user=>{if(user){try{// Get user role and data\nconst userDoc=await db.collection('users').doc(user.uid).get();const userData=userDoc.data();",
     "auth.onAuthStateChanged(async user=>{if(user){try{let userDoc=null;try{userDoc=await db.collection('users').doc(user.uid).get();}catch(readErr){console.warn('Profile read failed, retrying',readErr);await new Promise(r=>setTimeout(r,1200));userDoc=await db.collection('users').doc(user.uid).get();}let userData=userDoc&&userDoc.data();if(!userData){userData={email:user.email||'',name:user.displayName||(user.email||'').split('@')[0],role:'client',onboardingCompleted:false};try{await db.collection('users').doc(user.uid).set(Object.assign({},userData,{createdAt:firebase.firestore.FieldValue.serverTimestamp()}),{merge:true});}catch(createErr){console.warn('Profile create failed',createErr);}}");
once("}}catch(error){console.error('Error loading user data:',error);setUser(null);setIsAdmin(false);}}else{setUser(null);setIsAdmin(false);}setLoading(false);",
     "}}catch(error){console.error('Error loading user data:',error);setUser(prev=>prev&&prev.uid===user.uid?prev:{uid:user.uid,email:user.email,displayName:user.displayName,name:user.displayName||(user.email||'').split('@')[0],role:'client'});setCurrentPage(p=>p==='login'||p==='signup'?'dashboard':p);}}else{setUser(null);setIsAdmin(false);}setLoading(false);");


// 5e. Member and coach workspaces in the app layout.
for(const n of ['SessionMeter','Ico3D','RealTimeClock'])once('function '+n+'(','function VFLegacy'+n+'(');
function after(marker,from,to){
  const st=html.indexOf(marker);if(st<0)throw new Error('Missing '+marker);
  const i=html.indexOf(from,st);if(i<0||i-st>300000)throw new Error('Missing "'+from.slice(0,60)+'" after '+marker);
  html=html.slice(0,i)+to+html.slice(i+from.length);
}
function range(marker,from,until,to){
  const st=html.indexOf(marker);const i=html.indexOf(from,st);const j=html.indexOf(until,i);
  if(st<0||i<0||j<0||j-i>20000)throw new Error('Range not found: '+from.slice(0,50));
  html=html.slice(0,i)+to+html.slice(j);
}
{
  const TAIL=`.map(tab=>/*#__PURE__*/React.createElement("button",{key:tab.id,onClick:()=>setActiveTab(tab.id),className:"px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2",style:activeTab===tab.id?{background:'linear-gradient(120deg,#4296f0,#8869ec)',color:'#fff',boxShadow:'0 10px 30px -8px rgba(66,150,240,.6)',transform:'translateY(-1px)'}:{background:'var(--mu-surface)',color:'var(--mu-text-dim)',border:'1px solid var(--mu-border)'}},/*#__PURE__*/React.createElement(Ico,{name:tab.icon,size:17,color:activeTab===tab.id?'#fff':'var(--mu-primary)'}),tab.label)))`;
  const HEAD='/*#__PURE__*/React.createElement("div",{className:"flex flex-wrap gap-2 mb-8 mu-tabscroll"},';
  const D='function VFLegacyDashboardPage(', A='function AdminPage({user})';
  // client
  after(D,'min-h-screen pt-32 pb-20 px-4 ','vf26-ws ');
  after(D,'{className:"max-w-7xl mx-auto"}','{className:"vf26-ws-grid"}');
  range(D,'/*#__PURE__*/React.createElement("div",{className:"relative rounded-3xl overflow-hidden mb-8 mu-pop"',HEAD,'React.createElement(VF26MemberHead,{user:user,packages:packages,newAssignments:newAssignments}),');
  after(D,HEAD,"React.createElement(VF26Tabs,{kind:'client',user:user,active:activeTab,onChange:setActiveTab,items:");
  after(D,TAIL,'})');
  // coach / admin
  after(A,'min-h-screen bg-black pt-32 pb-20 px-4','vf26-ws vf26-ws-admin');
  after(A,'{className:"max-w-7xl mx-auto"}','{className:"vf26-ws-grid"}');
  range(A,'/*#__PURE__*/React.createElement("div",{className:"mb-8 mu-pop"}','/*#__PURE__*/React.createElement("div",{className:"mb-8 rounded-2xl mu-pop-2 overflow-hidden"','React.createElement(VF26AdminHead,{user:user}),');
  after(A,HEAD,"React.createElement(VF26Tabs,{kind:'admin',user:user,active:activeTab,onChange:setActiveTab,items:");
  after(A,TAIL,'})');
}


// 5f. Image uploads: Firebase Storage for this project rejects the site origin (CORS), which left uploads spinning.
//     Images now go to the VFitness file host first, with the old inline fallback kept.
once("async function uploadImageToStorage(file,folder='gallery'){const compressedDataUrl=await compressImage(file);if(storage){",
     "async function uploadImageToStorage(file,folder='gallery'){const compressedDataUrl=await compressImage(file);try{if(window.vfHostUpload){return await window.vfHostUpload(compressedDataUrl,folder+'-'+(file.name||'image'));}}catch(hostErr){console.warn('File host upload failed, trying Storage',hostErr);}if(storage&&!window.vfSkipStorage){");
once("publishLocal(dataUrl,'Image preview loaded. Uploading public version in the background...');if(!storage){",
     "publishLocal(dataUrl,'Image preview loaded. Uploading public version in the background...');try{if(window.vfHostUpload){const hosted=await window.vfHostUpload(dataUrl,'homepage-'+(file.name||'image'));publishLocal(hosted,'Image uploaded. Save to publish it for every visitor.');setUploading(false);if(e&&e.target)e.target.value='';return;}}catch(hostErr){console.warn('File host upload failed',hostErr);}if(!storage){");


// 5g. Site scope: registration, sessions, payments and business management. Training, nutrition,
//     sleep and progress tracking live in the VFIT app, so they are removed from the site.
{
  const D='function VFLegacyDashboardPage(', A='function AdminPage({user})';
  after(D,"const[activeTab,setActiveTab]=useState(initialTab);",
    "const[activeTab,setActiveTab]=useState(initialTab);useEffect(()=>{if(!['overview','sessions','invoices','coach','chat'].includes(activeTab))setActiveTab(activeTab==='chat'?'coach':'overview');},[activeTab]);");
  range(D,`activeTab==='overview'&&React.createElement("div",{className:"space-y-5"}`,",activeTab==='success'",
    "activeTab==='overview'&&React.createElement(VF26ClientOverview,{user:user,packages:packages,appointments:appointments,setActiveTab:setActiveTab,onLogSession:logClientGymSession})");
  after(A,"const[activeTab,setActiveTab]=useState('clients');",
    "const[activeTab,setActiveTab]=useState('clients');useEffect(()=>{if(['workouts','mealplans','checkins','buttonqa'].includes(activeTab))setActiveTab('clients');},[activeTab]);");
  once(`[{label:'Home',icon:'home',go:()=>{setDashboardTab('overview');setCurrentPage('dashboard');},active:currentPage==='dashboard'},{label:'Train',icon:'dumbbell',go:()=>setCurrentPage('workoutprograms'),active:currentPage==='workoutprograms'||currentPage==='library'},{label:'Nutrition',icon:'utensils',go:()=>setCurrentPage('meals'),active:currentPage==='meals'},{label:'Progress',icon:'trending-up',go:()=>{setDashboardTab('progress');setCurrentPage('dashboard');},active:false},{label:'Messages',icon:'message-circle',go:()=>{setDashboardTab('chat');setCurrentPage('dashboard');},active:false}]`,
    `[{label:'Home',icon:'home',go:()=>{setDashboardTab('overview');setCurrentPage('dashboard');},active:currentPage==='dashboard'&&dashboardTab==='overview'},{label:'Sessions',icon:'calendar',go:()=>{setDashboardTab('sessions');setCurrentPage('dashboard');},active:currentPage==='dashboard'&&dashboardTab==='sessions'},{label:'Invoices',icon:'receipt',go:()=>{setDashboardTab('invoices');setCurrentPage('dashboard');},active:currentPage==='dashboard'&&dashboardTab==='invoices'},{label:'Messages',icon:'message-circle',go:()=>{setDashboardTab('coach');setCurrentPage('dashboard');},active:currentPage==='dashboard'&&(dashboardTab==='coach'||dashboardTab==='chat')},{label:'VFIT App',icon:'smartphone',go:()=>{try{window.open(window.VF_APP_URL||'https://vfit-core-flow.base44.app/membership','_blank','noopener');}catch(e){}},active:false}]`);
}


// 5h. Professional checkout and quieter pages.
once('function TestimonialSlider(','function VFLegacyTestimonialSlider(');
range('function TrainerSelectionModal(','if(!isOpen)return null;return','}// WORKOUT PACKAGES INTERFACE (CLIENT VIEW)',
  "if(!isOpen)return null;return React.createElement(VF26Checkout,{trainers:trainers,selectedTrainer:selectedTrainer,loading:loading,showPayPal:showPayPal,paypalRef:paypalRef,selectedPackage:selectedPackage,onClose:onClose,onSelect:handleSelectTrainer,onBack:()=>{setShowPayPal(false);setSelectedTrainer(null);}});");

once(`React.createElement("div",{className:"min-h-screen bg-black flex items-center justify-center"},/*#__PURE__*/React.createElement("div",{className:"text-4xl font-black text-cyan-400"},"Loading..."))`,
     `React.createElement("div",{className:"vf26-boot"},React.createElement("img",{src:"/vf26/vfit-app-icon.webp",alt:"",width:56,height:56}),React.createElement("span",{className:"vf26-boot-bar"}))`);
// Plain language in alerts and confirms: no emoji.
{
  const EMOJI=/(?:[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2702}-\u{2705}\u{2708}-\u{2712}\u{2716}-\u{27BF}\u{2B50}\u{2B55}\u{231A}\u{231B}\u{23E9}-\u{23FA}]\u{FE0F}?\s?)/gu;
  html=html.replace(/<script(?![^>]*\bsrc=)([^>]*)>([\s\S]*?)<\/script>/g,(m,attrs,code)=>(/type="application\/ld\+json"/.test(attrs)?m:'<script'+attrs+'>'+code.replace(EMOJI,'')+'</script>'));
}

// 5. Theme colour meta
html=html.replace(/<meta name="theme-color" content="[^"]*">/,'<meta name="theme-color" content="#0f1115">');

// 6. Copy assets.
const outDir=path.join(site,'vf26');
fs.mkdirSync(outDir,{recursive:true});
for(const f of fs.readdirSync(here)){
  if(/\.(css|js|webp|jpg|png)$/i.test(f)&&f!=='apply-vfit-2026-site.js'&&f!=='devserver.js'&&f!=='build.js'&&!/\.(part|base)\./.test(f))fs.copyFileSync(path.join(here,f),path.join(outDir,f));
}

// 7. Verify: every inline script and the component file must parse.
const scripts=[...html.matchAll(/<script(?![^>]*\bsrc=)(?![^>]*type="application\/ld\+json")[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
scripts.forEach((code,i)=>{try{new vm.Script(code,{filename:'inline-'+i+'.js'});}catch(e){throw new Error('Inline script '+i+' failed to parse: '+e.message);}});
new vm.Script(fs.readFileSync(path.join(outDir,'vfit-2026.js'),'utf8'),{filename:'vfit-2026.js'});
for(const needle of ["{id:'kevin_mackey',name:'Kevin Mackey'}",'className:"vf26-pc"','React.createElement(VF26Tabs,{kind:\'admin\'','React.createElement(VF26MemberHead,',...PAGE_NAMES.map(n=>'function VFLegacy'+n+'('),'function VFLegacyHomePage(','function VFLegacyNavigation(','function VFLegacyFooter(','/vf26/vfit-2026.js','/vf26/vfit-2026.css'])
  if(!html.includes(needle))throw new Error('Missing '+needle);
for(const img of ['vfit-app-icon.webp','vfit-app-icon-180.png','welcome-glute-v1.webp','darvano-andrews.webp','strength-editorial-v1.webp','fuel-the-fire-v1.webp'])
  if(!fs.existsSync(path.join(outDir,img)))throw new Error('Missing image '+img);

fs.writeFileSync(indexPath,html);
console.log('Applied VFIT 2026 app design layer ('+scripts.length+' inline scripts parsed).');
