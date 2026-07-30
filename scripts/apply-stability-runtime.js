const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');
const tag='<script defer src="/stability-runtime.js?v=20260730"></script>';
if(!html.includes(tag)){
  if(!html.includes('</body>'))throw new Error('Missing closing body tag');
  html=html.replace('</body>',tag+'\n</body>');
}
fs.writeFileSync(file,html);
console.log('Applied isolated VFitness stability runtime');
