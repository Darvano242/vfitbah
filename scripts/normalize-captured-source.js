const fs=require('fs');
const path=require('path');

const sourcePath=path.join(process.cwd(),'src','app','index.html');
const sitePath=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(sourcePath,'utf8');

html=html.replace(
  /<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Geist[^>]+>/i,
  '<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap" rel="stylesheet">'
);
html=html.replace('href="/programs" style="display:inline-flex;padding:14px 20px;border-radius:999px;background:#06b6d4','href="/start" style="display:inline-flex;padding:14px 20px;border-radius:999px;background:#06b6d4');
html=html.replace('font-family:Inter,system-ui,sans-serif','font-family:Instrument Sans,system-ui,sans-serif');
html=html.replace(/font-family:Inter/g,'font-family:Instrument Sans');
html=html.replace(/font-family:Geist/g,'font-family:Bricolage Grotesque');

if(!html.includes('href="/start"'))throw new Error('Fallback Start Here route was not corrected');
if(html.includes('family=Geist')||html.includes('family=Inter'))throw new Error('Legacy font request remains in modular shell');

fs.writeFileSync(sourcePath,html);
fs.writeFileSync(sitePath,html);
console.log('Normalized modular shell routing and typography');
