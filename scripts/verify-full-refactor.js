const fs=require('fs');
const path=require('path');
const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const count=(text,needle)=>(text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;

const sourceFiles=[
  'src/app/index.html','src/app/capture-report.json',
  'src/services/programState.js','src/services/router.js','src/services/pwaUpdate.js',
  'src/features/programs/ProgramErrorBoundary.js','src/features/programs/program-ui.js','src/styles/design-tokens.css'
];
const generatedFiles=[
  'site/index.html','site/vf-program-state.js','site/vf-router.js','site/vf-pwa-update.js',
  'site/vf-program-error-boundary.js','site/vf-program-ui.js','site/vf-design-system.css'
];
for(const rel of sourceFiles.concat(generatedFiles)){
  assert(exists(rel),'Missing refactor file: '+rel);
  assert(fs.statSync(path.join(root,rel)).size>0,'Empty refactor file: '+rel);
}

const html=read('site/index.html');
const sourceShell=read('src/app/index.html');
const report=JSON.parse(read('src/app/capture-report.json'));
const core=read('site/vf-program-state.js');
const router=read('site/vf-router.js');
const ui=read('site/vf-program-ui.js');
const boundary=read('site/vf-program-error-boundary.js');
const pwa=read('site/vf-pwa-update.js');
const css=read('site/vf-design-system.css');
const build=read('scripts/build-production.js');
const scriptsDir=path.join(root,'site','app-assets','scripts');
const appScripts=fs.readdirSync(scriptsDir).filter(file=>file.endsWith('.js'));
const appCode=appScripts.map(file=>fs.readFileSync(path.join(scriptsDir,file),'utf8')).join('\n');
const completeCode=[html,appCode,core,router,ui,boundary,pwa].join('\n');

assert(sourceShell.includes('VFITNESS MODULAR SOURCE SHELL'),'Source-controlled modular shell marker is missing');
assert(html.includes('VFITNESS MODULAR SOURCE SHELL'),'Production does not use the modular shell');
assert(html.split('\n').length<1400,'Production HTML is still monolithic');
assert(report.scriptFiles===appScripts.length,'Captured source and production script counts differ');
assert(count(html,'data-vf-source-modules="1"')===1,'Source modules must be included exactly once');
for(const asset of ['/vf-router.js','/vf-program-state.js','/vf-program-error-boundary.js','/vf-program-ui.js','/vf-pwa-update.js','/vf-design-system.css']){
  assert(html.includes(asset),'Built HTML is missing '+asset);
}
assert(html.indexOf('/vfp-programs.js')<html.indexOf('/vf-program-ui.js'),'Stable Programs UI must load after compatibility definitions');
assert(!completeCode.includes('MutationObserver'),'Built app still contains a global MutationObserver');
assert(!completeCode.includes('window.history.back'),'Programs still uses browser history for internal navigation');
assert(appCode.includes('VFitnessProgramErrorBoundary'),'Programs error boundary is not mounted');
assert(appCode.includes('VFitnessRouter.openMyPrograms'),'Purchased Programs route is not connected');
assert(appCode.includes('VFitnessRouter.enrollmentFromLocation'),'Enrollment deep links are not connected');
assert(!sourceShell.includes('family=Geist')&&!sourceShell.includes('family=Inter'),'Legacy mixed font request remains');
assert(sourceShell.includes('family=Bricolage+Grotesque')&&sourceShell.includes('family=Instrument+Sans'),'Authoritative typography request is missing');
assert(sourceShell.includes('href="/start"'),'Fallback Start Here route is incorrect');

for(const marker of ['runTransaction','completionSchema','completedWorkoutsV2','completedAt','legacyCompletedWorkouts','synchronizeStatus'])assert(core.includes(marker),'Program state service is missing '+marker);
for(const marker of ["'/programs'","'/my-programs'","'/program/'",'popstate','vf:routechange'])assert(router.includes(marker),'Router is missing '+marker);
for(const marker of ['restSeconds','Saving Workout','localStorage.removeItem(sessionKey)','Browse Next Program','Review Program'])assert(ui.includes(marker),'Programs UI is missing '+marker);
assert(ui.indexOf('localStorage.removeItem(sessionKey)')>ui.indexOf('await props.onComplete'),'Local workout log is cleared before remote completion succeeds');
for(const marker of ['program_runtime_error','Try Again','Return to Programs','Contact Support','reference'])assert(boundary.includes(marker),'Programs boundary is missing '+marker);
for(const marker of ['A new VFitness update is ready.','SKIP_WAITING','controllerchange','Update Now'])assert(pwa.includes(marker),'PWA update flow is missing '+marker);
for(const marker of ['--vf-bg','--vf-surface','prefers-reduced-motion','hover:none','transform 120ms'])assert(css.includes(marker),'Design system is missing '+marker);

for(const step of ['build-modular-app.js','build-source-modules.js','version-release.js','verify-full-refactor.js'])assert(build.includes(step),'Modular production build is missing '+step);
for(const legacyStep of ['apply-vfp-programs.js','apply-vfp-progress-design.js','apply-package-policy.js','fix-application-submit-only.js','harden-dom-copy-observers.js','apply-core-refactor.js'])assert(!build.includes(legacyStep),'Legacy patch step remains active: '+legacyStep);

const executableInline=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match=>{
  const attrs=match[1]||'';
  const body=(match[2]||'').trim();
  return body&&!/\bsrc\s*=/.test(attrs)&&!/application\/(?:ld\+json|json)|importmap/i.test(attrs);
});
assert(executableInline.length===0,'Executable code remains inline in production HTML');

for(const rel of sourceFiles.filter(file=>file.endsWith('.js')).concat(generatedFiles.filter(file=>file.endsWith('.js')))){
  try{new Function(read(rel));}
  catch(error){throw new Error(rel+' syntax error: '+error.message);}
}
for(const file of appScripts){
  try{new Function(fs.readFileSync(path.join(scriptsDir,file),'utf8'));}
  catch(error){throw new Error('Modular app script '+file+' syntax error: '+error.message);}
}

console.log(JSON.stringify({
  ok:true,
  checks:{
    modularSource:true,monolithicHtmlRemoved:true,textReplacementBuildRemoved:true,
    transactions:true,routing:true,errorBoundary:true,observersRemoved:true,
    pwaUpdate:true,designSystem:true,publicAndPurchasedPrograms:true
  },
  shellLines:html.split('\n').length,
  externalScripts:appScripts.length,
  externalStyles:report.styleFiles
},null,2));
