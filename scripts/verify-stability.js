const fs=require('fs');
const path=require('path');

const root=process.cwd();
const required=[
  'site/index.html',
  'site/vfp-programs.js',
  'site/vfp-programs.css',
  'site/service-worker.js',
  'site/stability-runtime.js'
];

for(const rel of required){
  const file=path.join(root,rel);
  if(!fs.existsSync(file))throw new Error('Missing required production file: '+rel);
  if(fs.statSync(file).size===0)throw new Error('Empty production file: '+rel);
}

const html=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
const programs=fs.readFileSync(path.join(root,'site/vfp-programs.js'),'utf8');
const sw=fs.readFileSync(path.join(root,'site/service-worker.js'),'utf8');

const forbidden=[
  'direct-programs-link.js',
  'apply-direct-programs-link.js'
];
for(const marker of forbidden){
  if(html.includes(marker))throw new Error('Unsafe direct Programs helper still present: '+marker);
}

const requiredProgramMarkers=[
  'function VFPProgramData',
  'function VFPProgramLibrary',
  'function VFPWorkoutPlayer',
  'function VFPProgramDashboard'
];
for(const marker of requiredProgramMarkers){
  if(!programs.includes(marker))throw new Error('Programs bundle is incomplete: '+marker);
}

if(!sw.includes("request.mode==='navigate'"))throw new Error('Service worker must use network-first document handling');
if(!sw.includes('SKIP_WAITING'))throw new Error('Service worker update flow is incomplete');

console.log('VFitness stability verification passed');
