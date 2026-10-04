const { execFileSync } = require('node:child_process');
const steps = [
  'scripts/apply-vfp-programs.js',
  'scripts/apply-vfp-progress-design.js',
  'scripts/apply-package-policy.js',
  'scripts/fix-application-submit-only.js',
  'scripts/verify-vfp-progress-design.js',
  'vf26/apply-vfit-2026-site.js',
  'scripts/apply-professional-hardening.js'
];
for (const step of steps) execFileSync(process.execPath, [step], { stdio: 'inherit' });
