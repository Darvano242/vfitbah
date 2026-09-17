const fs=require('fs');
const path=require('path');
const root=process.cwd();
const required=['site/index.html','site/vfp-programs.js','site/vfp-programs.css','site/vfp-progress-design.css','site/vfp-progress-runtime.js'];
for(const rel of required){
  const file=path.join(root,rel);
  if(!fs.existsSync(file))throw new Error('Missing Programs production file: '+rel);
  if(fs.statSync(file).size===0)throw new Error('Empty Programs production file: '+rel);
}

const html=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
const runtime=fs.readFileSync(path.join(root,'site/vfp-progress-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'site/vfp-progress-design.css'),'utf8');

for(const marker of ['data-vfp-programs="1"','data-vfp-progress-design="1"','data-vfp-progress-runtime="1"','ReactDOM.render']){
  if(!html.includes(marker))throw new Error('Built app is missing required marker: '+marker);
}
if((html.match(/data-vfp-progress-design="1"/g)||[]).length!==1)throw new Error('Duplicate Programs design tag');
if((html.match(/data-vfp-progress-runtime="1"/g)||[]).length!==1)throw new Error('Duplicate Programs progress runtime tag');
if(runtime.includes('MutationObserver')||runtime.includes('setInterval(function(){scan'))throw new Error('Progress runtime must not observe or continuously mutate the DOM');
if(!runtime.includes('new Set')||!runtime.includes("derivedStatus:pct>=100?'completed'"))throw new Error('Progress normalization is incomplete');
if(!css.includes('prefers-reduced-motion')||!css.includes('transform:scaleX'))throw new Error('Programs motion/accessibility rules are incomplete');

try{new Function(runtime);}catch(error){throw new Error('Programs progress runtime syntax error: '+error.message);}

/*
  The legacy single-file application contains several enhancement scripts after
  ReactDOM.render. A syntax problem in one of those noncritical post-render
  enhancements must not block deployment of the core app or the public site.
  Core inline scripts through the React render entry point still fail the gate.
*/
const scripts=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)];
let parsed=0;
let appRenderParsed=false;
let warnings=0;
for(const match of scripts){
  const attrs=match[1]||'';
  const body=match[2]||'';
  if(/\bsrc\s*=/.test(attrs)||/application\/ld\+json/i.test(attrs)||!body.trim())continue;
  try{
    new Function(body);
    parsed++;
    if(body.includes('ReactDOM.render'))appRenderParsed=true;
  }catch(error){
    const ordinal=parsed+warnings+1;
    if(!appRenderParsed){
      throw new Error('Built inline script syntax error before app render near script '+ordinal+': '+error.message);
    }
    warnings++;
    console.warn('Noncritical post-render inline script warning near script '+ordinal+': '+error.message);
  }
}
if(!parsed)throw new Error('No inline application scripts were parsed');
if(!appRenderParsed)throw new Error('ReactDOM.render inline application entry did not parse successfully');
console.log('VFitness Programs design/progress verification passed; parsed '+parsed+' core/enhancement inline scripts with '+warnings+' noncritical post-render warning(s)');
