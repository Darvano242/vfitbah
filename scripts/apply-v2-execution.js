const fs=require('fs');
const path=require('path');
const root=process.cwd();
const htmlPath=path.join(root,'site','index.html');
const pwaPath=path.join(root,'site','vf-pwa-update.js');
const cssPath=path.join(root,'site','vf-design-system.css');
let html=fs.readFileSync(htmlPath,'utf8');
let pwa=fs.readFileSync(pwaPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');
const publicRuntime=fs.readFileSync(path.join(root,'src','services','v2Execution.js'),'utf8');
const appRuntime=fs.readFileSync(path.join(root,'src','services','v2AppExecution.js'),'utf8');
const v2css=fs.readFileSync(path.join(root,'src','styles','v2-execution.css'),'utf8');
const MARK='VF_V2_EXECUTION_20260819';
const APP_MARK='VF_V2_APP_EXECUTION_20260819';

// Trainer accounts do not receive the commercial Packages tab. Numbers is already admin-only.
html=html.replace(
  "isAdmin||!['siteDesign','applications','testimonials','gallery','analytics','auditTrail','buttonqa'].includes(tab.id)",
  "isAdmin||!['siteDesign','applications','packages','testimonials','gallery','analytics','auditTrail','buttonqa'].includes(tab.id)"
);

if(!css.includes(MARK))css+='\n'+v2css+'\n';
if(!pwa.includes(MARK))pwa+='\n'+publicRuntime+'\n';
if(!pwa.includes(APP_MARK))pwa+='\n'+appRuntime+'\n';

fs.writeFileSync(htmlPath,html);
fs.writeFileSync(pwaPath,pwa);
fs.writeFileSync(cssPath,css);
console.log('Applied VFITNESS V2 execution layer.');
