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
for(const needle of [...PAGE_NAMES.map(n=>'function VFLegacy'+n+'('),'function VFLegacyHomePage(','function VFLegacyNavigation(','function VFLegacyFooter(','/vf26/vfit-2026.js','/vf26/vfit-2026.css'])
  if(!html.includes(needle))throw new Error('Missing '+needle);
for(const img of ['vfit-app-icon.webp','vfit-app-icon-180.png','welcome-glute-v1.webp','darvano-andrews.webp','strength-editorial-v1.webp','fuel-the-fire-v1.webp'])
  if(!fs.existsSync(path.join(outDir,img)))throw new Error('Missing image '+img);

fs.writeFileSync(indexPath,html);
console.log('Applied VFIT 2026 app design layer ('+scripts.length+' inline scripts parsed).');
