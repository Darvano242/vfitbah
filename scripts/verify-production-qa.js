const fs=require('fs');
const path=require('path');

const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const count=(text,needle)=>(text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;

const required=[
  'vercel.json','scripts/build-production.js','scripts/build-modular-app.js',
  'src/app/index.html','src/app/capture-report.json',
  'site/index.html','site/sw.js','site/offline.html',
  'site/vfp-programs.js','site/vfp-programs.css','site/vfp-progress-design.css','site/vfp-progress-runtime.js',
  'site/vf-runtime-guard.js','site/vf-router.js','site/vf-program-state.js','site/vf-program-error-boundary.js',
  'site/vf-program-ui.js','site/vf-pwa-update.js','site/vf-design-system.css','api/application.js'
];
for(const rel of required){
  assert(exists(rel),'Missing production file: '+rel);
  assert(fs.statSync(path.join(root,rel)).size>0,'Empty production file: '+rel);
}

const html=read('site/index.html');
const sourceShell=read('src/app/index.html');
const report=JSON.parse(read('src/app/capture-report.json'));
const vercel=JSON.parse(read('vercel.json'));
const buildRunner=read('scripts/build-production.js');
const sw=read('site/sw.js');
const runtimeGuard=read('site/vf-runtime-guard.js');
const progressRuntime=read('site/vfp-progress-runtime.js');
const progressCss=read('site/vfp-progress-design.css');
const api=read('api/application.js');

const scriptsDir=path.join(root,'site','app-assets','scripts');
const stylesDir=path.join(root,'site','app-assets','styles');
assert(fs.existsSync(scriptsDir)&&fs.existsSync(stylesDir),'Modular application assets are missing');
const scriptFiles=fs.readdirSync(scriptsDir).filter(file=>file.endsWith('.js'));
const styleFiles=fs.readdirSync(stylesDir).filter(file=>file.endsWith('.css'));
const appCode=scriptFiles.map(file=>fs.readFileSync(path.join(scriptsDir,file),'utf8')).join('\n');
const appCss=styleFiles.map(file=>fs.readFileSync(path.join(stylesDir,file),'utf8')).join('\n');
const allRuntimeCode=[appCode,runtimeGuard,progressRuntime,read('site/vf-program-ui.js'),read('site/vf-program-state.js'),read('site/vf-router.js')].join('\n');

assert(typeof vercel.buildCommand==='string','Vercel build command is missing');
assert(vercel.buildCommand.includes('scripts/build-production.js'),'Vercel must use the production build runner');
for(const step of ['build-modular-app.js','build-source-modules.js','version-release.js','verify-vfp-progress-design.js','verify-production-qa.js','verify-full-refactor.js']){
  assert(buildRunner.includes(step),'Modular production build is missing required step: '+step);
}
for(const legacyStep of ['apply-vfp-programs.js','apply-vfp-progress-design.js','apply-package-policy.js','fix-application-submit-only.js','harden-dom-copy-observers.js','apply-core-refactor.js']){
  assert(!buildRunner.includes(legacyStep),'Legacy text replacement remains in production build: '+legacyStep);
}

assert(html.includes('VFITNESS MODULAR SOURCE SHELL'),'Built app is not using the modular source shell');
assert(sourceShell.includes('VFITNESS MODULAR SOURCE SHELL'),'Source-controlled modular shell marker is missing');
assert(report.scriptFiles===scriptFiles.length,'Captured script count does not match production assets');
assert(report.styleFiles===styleFiles.length,'Captured style count does not match production assets');
assert(html.split('\n').length<1400,'Production HTML has regressed into a monolithic document');
assert(html.includes('<div id="root">'),'React root is missing');
assert(appCode.includes('ReactDOM.render'),'React application entry point is missing');
for(const marker of ['data-vfp-programs="1"','data-vfp-progress-design="1"','data-vfp-progress-runtime="1"','data-vf-runtime-guard="1"']){
  assert(html.includes(marker),'Built shell is missing marker: '+marker);
  assert(count(html,marker)===1,'Built shell contains duplicate marker: '+marker);
}
assert(html.trim().endsWith('</html>'),'Built index.html has content after the closing HTML tag');

const executableInline=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match=>{
  const attrs=match[1]||'';
  const body=(match[2]||'').trim();
  return body&&!/\bsrc\s*=/.test(attrs)&&!/application\/(?:ld\+json|json)|importmap/i.test(attrs);
});
assert(executableInline.length===0,'Executable inline application scripts remain');
assert(!/<style\b[^>]*>[\s\S]*?\S[\s\S]*?<\/style>/i.test(html),'Inline style blocks remain in production shell');

// Reject actual MutationObserver construction in production runtime. The previous
// string-only check produced false positives when code merely referenced the API.
const mutationObserverConstructors=(allRuntimeCode.match(/\bnew\s+MutationObserver\s*\(/g)||[]).length;
assert(mutationObserverConstructors===0,'Global DOM observers remain in production runtime: '+mutationObserverConstructors+' constructor(s) found');
assert(!allRuntimeCode.includes('window.history.back'),'Programs still uses browser history for internal navigation');

const startHereStart=appCode.indexOf('function StartHereFlow(');
const startHereEnd=appCode.indexOf('// ============================================\n// RESULTS / LOCATIONS / CONTACT PAGES',startHereStart);
assert(startHereStart>=0&&startHereEnd>startHereStart,'Start Here component boundaries were not found');
const startHere=appCode.slice(startHereStart,startHereEnd);
for(const marker of ["fetch('/api/application'","db.collection('coachingApplications')","db.collection('publicCoachingApplications')",'vfitSubmitNetlifyApplication','Guided hidden-form fallback failed:']){
  assert(startHere.includes(marker),'Start Here delivery is missing: '+marker);
}
assert(html.includes('name="coaching-application"'),'Hidden application form is missing');
for(const marker of ["required = ['applicationId', 'name', 'phone', 'goal']",'formsubmit.co/ajax/vfitnessbahamas@gmail.com','return res.status(200).json({ ok: true']){
  assert(api.includes(marker),'Application API is missing: '+marker);
}

for(const marker of ['new Set','derivedStatus','remaining','thisWeek','completed'])assert(progressRuntime.includes(marker),'Programs progress runtime is missing: '+marker);
assert(!/\bnew\s+MutationObserver\s*\(/.test(progressRuntime),'Programs progress runtime must not create DOM observers');
assert(!/\bnew\s+MutationObserver\s*\(/.test(runtimeGuard),'Runtime diagnostics must not create DOM observers');
assert(progressCss.includes('prefers-reduced-motion'),'Programs design must honor reduced motion');
assert(progressCss.includes('transform:scaleX'),'Programs progress animation must use transforms');

for(const marker of ["expiryDays:45","const togglePackagePause=async pkg=>","'Resume Package':'Pause Package'",'packageAuditLog']){
  assert(appCode.includes(marker),'Package policy is missing: '+marker);
}
for(const marker of ["db.collection('revenueLedger')",'invoice_backfill','Completed packages no longer erase past months']){
  assert(appCode.includes(marker),'Revenue ledger is missing: '+marker);
}

assert(sw.includes("cache:'no-store'"),'Service worker does not force fresh code/navigation');
assert(sw.includes("url.pathname.startsWith('/api/')"),'Service worker must exclude API requests');
assert(sw.includes("keys.filter(key=>key.startsWith(CACHE_PREFIX)"),'Service worker does not clear older VFitness caches');
const staticBlock=sw.slice(sw.indexOf('const STATIC_ASSETS'),sw.indexOf('];',sw.indexOf('const STATIC_ASSETS'))+2);
assert(!staticBlock.includes("'/'")&&!staticBlock.includes("'/index.html'"),'Service worker must not precache the app HTML shell');
for(const marker of ['clientErrors','app_not_mounted','VFitnessDiagnostics','unhandledrejection'])assert(runtimeGuard.includes(marker),'Runtime diagnostics are missing: '+marker);

for(const file of scriptFiles){
  try{new Function(fs.readFileSync(path.join(scriptsDir,file),'utf8'));}
  catch(error){throw new Error('site/app-assets/scripts/'+file+' syntax error: '+error.message);}
}
for(const rel of ['scripts/build-production.js','scripts/build-modular-app.js','site/vfp-programs.js','site/vfp-progress-runtime.js','site/vf-runtime-guard.js','site/vf-program-state.js','site/vf-router.js','site/vf-program-ui.js','site/vf-pwa-update.js','site/sw.js','api/application.js']){
  try{new Function(read(rel));}
  catch(error){throw new Error(rel+' syntax error: '+error.message);}
}

assert(appCss.length>1000,'Modular application styles were not copied');
console.log(JSON.stringify({
  ok:true,
  checks:{
    modularBuild:true,shell:true,applications:true,programs:true,packages:true,revenue:true,
    serviceWorker:true,diagnostics:true,observersRemoved:true,
    externalScriptsParsed:scriptFiles.length,externalStyles:styleFiles.length
  }
},null,2));
