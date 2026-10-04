const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const root = path.resolve(__dirname, '..');
const scratch = fs.mkdtempSync(path.join(os.tmpdir(), 'vfit-build-'));
try {
  for (const directory of ['site', 'scripts', 'vf26']) fs.cpSync(path.join(root, directory), path.join(scratch, directory), { recursive: true });
  const config = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
  for (const step of config.buildCommand.split(' && ')) {
    const parts = step.split(' ');
    if (parts.length !== 2 || parts[0] !== 'node') throw new Error('Unsupported build step; update verifier.');
    execFileSync(process.execPath, [parts[1]], { cwd: scratch, stdio: 'inherit' });
  }
  const html = fs.readFileSync(path.join(scratch, 'site/index.html'), 'utf8');
  execFileSync(process.execPath, ['scripts/apply-professional-hardening.js'], { cwd: scratch, stdio: 'inherit' });
  if (html !== fs.readFileSync(path.join(scratch, 'site/index.html'), 'utf8')) throw new Error('Hardening patch is not idempotent.');
  if (!html.includes('VFIT_AUTH_LIFECYCLE_20261004')) throw new Error('Auth hardening missing from build.');
  console.log('Production build and repeat hardening passed without modifying source files.');
} finally { fs.rmSync(scratch, { recursive: true, force: true }); }
