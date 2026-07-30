const {spawnSync}=require('child_process');

const steps=[
  'scripts/apply-vfp-programs.js',
  'scripts/apply-vfp-progress-design.js',
  'scripts/apply-package-policy.js',
  'scripts/fix-application-submit-only.js',
  'scripts/apply-runtime-guard.js',
  'scripts/verify-vfp-progress-design.js',
  'scripts/verify-production-qa.js'
];

for(const step of steps){
  console.log('\n[VFitness build] '+step);
  const result=spawnSync(process.execPath,[step],{stdio:'inherit',cwd:process.cwd()});
  if(result.error)throw result.error;
  if(result.status!==0)process.exit(result.status||1);
}

console.log('\nVFitness production build and QA completed successfully.');
