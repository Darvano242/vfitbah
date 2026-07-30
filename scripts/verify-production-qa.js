const fs=require('fs');
const path=require('path');

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const count=(text,needle)=>(text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;

const required=[
  'vercel.json',
  'scripts/build-production.js',
  'site/index.html',
  'site/sw.js',
  'site/offline.html',
  'site/vfp-programs.js',
  'site/vfp-programs.css',
  'site/vfp-progress-design.css',
  'site/vfp-progress-runtime.js',
  'site/vf-runtime-guard.js',
  'api/application.js'
];
for(const rel of required){
  assert(exists(rel),'Missing production file: '+rel);
  assert(fs.statSync(path.join(root,rel)).size>0,'Empty production file: '+rel);
}

const html=read('site/index.html');
const vercel=JSON.parse(read('vercel.json'));
const buildRunner=read('scripts/build-production.js');
const sw=read('site/sw.js');
const runtimeGuard=read('site/vf-runtime-guard.js');
const progressRuntime=read('site/vfp-progress-runtime.js');
const progressCss=read('site/vfp-progress-design.css');
const api=read('api/application.js');

// Build and shell integrity.
assert(typeof vercel.buildCommand==='string','Vercel build command is missing');
assert(vercel.buildCommand.includes('scripts/build-production.js'),'Vercel must use the compact production build runner');
for(const step of [
  'apply-vfp-programs.js',
  'apply-vfp-progress-design.js',
  'apply-package-policy.js',
  'fix-application-submit-only.js',
  'apply-runtime-guard.js',
  'verify-vfp-progress-design.js',
  'verify-production-qa.js'
])assert(buildRunner.includes(step),'Production build runner is missing required step: '+step);

for(const marker of ['<div id="root">','ReactDOM.render','data-vfp-programs="1"','data-vfp-progress-design="1"','data-vfp-progress-runtime="1"','data-vf-runtime-guard="1"']){
  assert(html.includes(marker),'Built app is missing marker: '+marker);
}
assert(count(html,'data-vf-runtime-guard="1"')===1,'Runtime diagnostics were injected more than once');
assert(count(html,'data-vfp-progress-design="1"')===1,'Programs design was injected more than once');
assert(count(html,'data-vfp-progress-runtime="1"')===1,'Programs progress runtime was injected more than once');
assert(html.trim().endsWith('</html>'),'Built index.html has content after the closing HTML tag');
assert(count(html,'<script')===count(html,'</script>'),'Built index.html has an unmatched script tag');

// Guided Start Here application delivery must have three independent paths.
const startHereStart=html.indexOf('function StartHereFlow(');
const startHereEnd=html.indexOf('// ============================================\n// RESULTS / LOCATIONS / CONTACT PAGES',startHereStart);
assert(startHereStart>=0&&startHereEnd>startHereStart,'Start Here component boundaries were not found');
const startHere=html.slice(startHereStart,startHereEnd);
for(const marker of ["fetch('/api/application'","db.collection('coachingApplications')","db.collection('publicCoachingApplications')",'vfitSubmitNetlifyApplication','Guided hidden-form fallback failed:']){
  assert(startHere.includes(marker),'Start Here delivery is missing: '+marker);
}
assert(html.includes('name="coaching-application"'),'Hidden application form is missing');
for(const marker of ["required = ['applicationId', 'name', 'phone', 'goal']",'formsubmit.co/ajax/vfitnessbahamas@gmail.com','return res.status(200).json({ ok: true']){
  assert(api.includes(marker),'Application API is missing: '+marker);
}

// Programs and progress correctness.
for(const marker of ['new Set','derivedStatus','remaining','thisWeek','completed']){
  assert(progressRuntime.includes(marker),'Programs progress runtime is missing: '+marker);
}
assert(!progressRuntime.includes('MutationObserver'),'Programs progress runtime must not observe the DOM');
assert(!runtimeGuard.includes('MutationObserver'),'Runtime diagnostics must not mutate or observe the DOM');
assert(progressCss.includes('prefers-reduced-motion'),'Programs design must honor reduced motion');
assert(progressCss.includes('transform:scaleX'),'Programs progress animation must use transforms');

// Package policy and revenue history.
for(const marker of ["expiryDays:45","const togglePackagePause=async pkg=>","'Resume Package':'Pause Package'",'packageAuditLog']){
  assert(html.includes(marker),'Package policy is missing: '+marker);
}
for(const marker of ["db.collection('revenueLedger')",'invoice_backfill','Completed packages no longer erase past months']){
  assert(html.includes(marker),'Revenue ledger is missing: '+marker);
}

// PWA cache safety. HTML and code must remain network-first.
assert(sw.includes("cache:'no-store'"),'Service worker does not force fresh code/navigation');
assert(sw.includes("url.pathname.startsWith('/api/')"),'Service worker must exclude API requests');
assert(sw.includes("keys.filter(key=>key.startsWith(CACHE_PREFIX)"),'Service worker does not clear older VFitness caches');
const staticBlock=sw.slice(sw.indexOf('const STATIC_ASSETS'),sw.indexOf('];',sw.indexOf('const STATIC_ASSETS'))+2);
assert(!staticBlock.includes("'/'")&&!staticBlock.includes("'/index.html'"),'Service worker must not precache the app HTML shell');

// Runtime diagnostics safety and usefulness.
for(const marker of ['clientErrors','app_not_mounted','VFitnessDiagnostics','unhandledrejection']){
  assert(runtimeGuard.includes(marker),'Runtime diagnostics are missing: '+marker);
}

// Parse all first-party JavaScript and every inline application script.
for(const rel of ['scripts/build-production.js','site/vfp-programs.js','site/vfp-progress-runtime.js','site/vf-runtime-guard.js','site/sw.js','api/application.js']){
  try{new Function(read(rel));}
  catch(error){throw new Error(rel+' syntax error: '+error.message);}
}

const inlineScripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
let parsedInline=0;
for(const match of inlineScripts){
  const attrs=match[1]||'';
  const body=match[2]||'';
  if(/\bsrc\s*=/.test(attrs)||/application\/ld\+json/i.test(attrs)||!body.trim())continue;
  try{new Function(body);parsedInline++;}
  catch(error){throw new Error('Inline app script '+(parsedInline+1)+' syntax error: '+error.message);}
}
assert(parsedInline>0,'No inline application scripts were parsed');

console.log(JSON.stringify({
  ok:true,
  checks:{
    buildRunner:true,
    shell:true,
    applications:true,
    programs:true,
    packages:true,
    revenue:true,
    serviceWorker:true,
    diagnostics:true,
    inlineScriptsParsed:parsedInline
  }
},null,2));
