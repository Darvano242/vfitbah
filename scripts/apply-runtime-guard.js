const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const marker='    <script>\nconst{useState,useEffect,useRef}=React;';
const tag='    <script src="/vf-runtime-guard.js?v=20260730" data-vf-runtime-guard="1"></script>\n';

if(!html.includes(marker))throw new Error('Main React application marker not found for runtime guard');
if(!html.includes('data-vf-runtime-guard="1"'))html=html.replace(marker,tag+marker);
if((html.match(/data-vf-runtime-guard="1"/g)||[]).length!==1)throw new Error('Runtime guard was injected more than once');

fs.writeFileSync(file,html);
console.log('Applied isolated VFitness runtime diagnostics');
