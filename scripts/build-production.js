const {spawnSync}=require('child_process');

const steps=[
  'scripts/build-modular-app.js',
  'scripts/build-source-modules.js',
  'scripts/version-release.js',
  'scripts/verify-vfp-progress-design.js',
  'scripts/verify-production-qa.js',
  'scripts/verify-full-refactor.js'
];

for(const step of steps){
  console.log('\n[VFitness build] '+step);
  const result=spawnSync(process.execPath,[step],{stdio:'inherit',cwd:process.cwd()});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}

console.log('\nVFitness modular production build and QA completed successfully.');
