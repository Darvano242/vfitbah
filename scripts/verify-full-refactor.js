const fs=require('fs');
const path=require('path');
const root=process.cwd();
const read=rel=>fs.readFileSync(path.join(root,rel),'utf8');
const exists=rel=>fs.existsSync(path.join(root,rel));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};
const count=(text,needle)=>(text.match(new RegExp(needle.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'g'))||[]).length;

const sourceFiles=[
  'src/services/programState.js',
  'src/services/router.js',
  'src/services/pwaUpdate.js',
  'src/features/programs/ProgramErrorBoundary.js',
  'src/features/programs/program-ui.js',
  'src/styles/design-tokens.css'
];
const generatedFiles=[
  'site/vf-program-state.js',
  'site/vf-router.js',
  'site/vf-pwa-update.js',
  'site/vf-program-error-boundary.js',
  'site/vf-program-ui.js',
  'site/vf-design-system.css'
];
for(const rel of sourceFiles.concat(generatedFiles)){
  assert(exists(rel),'Missing refactor file: '+rel);
  assert(fs.statSync(path.join(root,rel)).size>0,'Empty refactor file: '+rel);
}

const html=read('site/index.html');
const core=read('site/vf-program-state.js');
const router=read('site/vf-router.js');
const ui=read('site/vf-program-ui.js');
const boundary=read('site/vf-program-error-boundary.js');
const pwa=read('site/vf-pwa-update.js');
const css=read('site/vf-design-system.css');
const build=read('scripts/build-production.js');

assert(count(html,'data-vf-source-modules="1"')===1,'Source modules must be injected exactly once');
for(const asset of ['/vf-router.js','/vf-program-state.js','/vf-program-error-boundary.js','/vf-program-ui.js','/vf-pwa-update.js','/vf-design-system.css'])assert(html.includes(asset),'Built HTML is missing '+asset);
assert(html.indexOf('/vfp-programs.js')<html.indexOf('/vf-program-ui.js'),'Stable Programs UI must load after the legacy compatibility definitions');
assert(!html.includes('MutationObserver'),'Built app still contains a global MutationObserver');
assert(!html.includes('window.history.back'),'Programs still uses browser history for internal navigation');
assert(html.includes('VFitnessProgramErrorBoundary'),'Programs error boundary is not mounted');
assert(html.includes('VFitnessRouter.openMyPrograms'),'Purchased Programs route is not connected');
assert(html.includes('VFitnessRouter.enrollmentFromLocation'),'Enrollment deep links are not connected');
assert(!html.includes("@import url('https://fonts.googleapis.com/css2?family=Inter"),'Legacy Inter import remains');
assert(!html.includes("@import url('https://fonts.googleapis.com/css2?family=Geist"),'Legacy Geist import remains');

for(const marker of ['runTransaction','completionSchema','completedWorkoutsV2','completedAt','legacyCompletedWorkouts','synchronizeStatus'])assert(core.includes(marker),'Program state service is missing '+marker);
for(const marker of ["'/programs'","'/my-programs'","'/program/'",'popstate','vf:routechange'])assert(router.includes(marker),'Router is missing '+marker);
for(const marker of ['restSeconds','Saving Workout','localStorage.removeItem(sessionKey)','Browse Next Program','Review Program'])assert(ui.includes(marker),'Programs UI is missing '+marker);
assert(ui.indexOf('localStorage.removeItem(sessionKey)')>ui.indexOf('await props.onComplete'),'Local workout log is cleared before remote completion succeeds');
for(const marker of ['program_runtime_error','Try Again','Return to Programs','Contact Support','reference'])assert(boundary.includes(marker),'Programs boundary is missing '+marker);
for(const marker of ['A new VFitness update is ready.','SKIP_WAITING','controllerchange','Update Now'])assert(pwa.includes(marker),'PWA update flow is missing '+marker);
for(const marker of ['--vf-bg','--vf-surface','prefers-reduced-motion','hover:none','transform 120ms'])assert(css.includes(marker),'Design system is missing '+marker);
for(const step of ['build-source-modules.js','apply-core-refactor.js','verify-full-refactor.js'])assert(build.includes(step),'Production build is missing '+step);

for(const rel of sourceFiles.filter(x=>x.endsWith('.js')).concat(generatedFiles.filter(x=>x.endsWith('.js')))){
  try{new Function(read(rel));}
  catch(error){throw new Error(rel+' syntax error: '+error.message);}
}

console.log(JSON.stringify({ok:true,checks:{sourceModules:true,transactions:true,routing:true,errorBoundary:true,observersRemoved:true,pwaUpdate:true,designSystem:true}},null,2));
