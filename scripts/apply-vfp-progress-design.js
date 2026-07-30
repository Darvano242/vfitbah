const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const programScript='<script src="/vfp-programs.js?v=20260719"></script>';
const designCss='<link rel="stylesheet" href="/vfp-progress-design.css?v=20260730" data-vfp-progress-design="1">';
const progressRuntime='<script src="/vfp-progress-runtime.js?v=20260730" data-vfp-progress-runtime="1"></script>';

if(!html.includes(programScript))throw new Error('Programs bundle was not injected before the progress design');
if(!html.includes('data-vfp-progress-design="1"')){
  html=html.replace(programScript,programScript+'\n    '+designCss+'\n    '+progressRuntime);
}
if((html.match(/data-vfp-progress-design="1"/g)||[]).length!==1)throw new Error('Programs design was injected more than once');
if((html.match(/data-vfp-progress-runtime="1"/g)||[]).length!==1)throw new Error('Programs progress runtime was injected more than once');

fs.writeFileSync(file,html);
console.log('Applied isolated VFitness Programs design and progress runtime');
