const fs=require('fs');
const path=require('path');
const root=process.cwd();
const required=['site/index.html','site/vfp-programs.js','site/vfp-programs.css','site/vfp-progress-design.css','site/vfp-progress-runtime.js','site/vf-program-ui.js'];
for(const rel of required){
  const file=path.join(root,rel);
  if(!fs.existsSync(file))throw new Error('Missing Programs production file: '+rel);
  if(fs.statSync(file).size===0)throw new Error('Empty Programs production file: '+rel);
}

const html=fs.readFileSync(path.join(root,'site/index.html'),'utf8');
const runtime=fs.readFileSync(path.join(root,'site/vfp-progress-runtime.js'),'utf8');
const css=fs.readFileSync(path.join(root,'site/vfp-progress-design.css'),'utf8');
const programUi=fs.readFileSync(path.join(root,'site/vf-program-ui.js'),'utf8');
const appScriptsDir=path.join(root,'site','app-assets','scripts');
const appScripts=fs.readdirSync(appScriptsDir).filter(file=>file.endsWith('.js'));
const appCode=appScripts.map(file=>fs.readFileSync(path.join(appScriptsDir,file),'utf8')).join('\n');

for(const marker of ['data-vfp-programs="1"','data-vfp-progress-design="1"','data-vfp-progress-runtime="1"']){
  if(!html.includes(marker))throw new Error('Built app is missing required marker: '+marker);
}
if(!appCode.includes('ReactDOM.render'))throw new Error('Built modular app is missing ReactDOM.render');
if((html.match(/data-vfp-progress-design="1"/g)||[]).length!==1)throw new Error('Duplicate Programs design tag');
if((html.match(/data-vfp-progress-runtime="1"/g)||[]).length!==1)throw new Error('Duplicate Programs progress runtime tag');
if(runtime.includes('MutationObserver')||runtime.includes('setInterval(function(){scan'))throw new Error('Progress runtime must not observe or continuously mutate the DOM');
if(!runtime.includes('new Set')||!runtime.includes("derivedStatus:pct>=100?'completed'"))throw new Error('Progress normalization is incomplete');
if(!css.includes('prefers-reduced-motion')||!css.includes('transform:scaleX'))throw new Error('Programs motion/accessibility rules are incomplete');
for(const marker of ['Review Program','Browse Next Program','Saving Workout','restSeconds']){
  if(!programUi.includes(marker))throw new Error('Stable Programs UI is missing: '+marker);
}

for(const rel of ['site/vfp-progress-runtime.js','site/vf-program-ui.js','site/vf-program-state.js']){
  try{new Function(fs.readFileSync(path.join(root,rel),'utf8'));}
  catch(error){throw new Error(rel+' syntax error: '+error.message);}
}
for(const file of appScripts){
  try{new Function(fs.readFileSync(path.join(appScriptsDir,file),'utf8'));}
  catch(error){throw new Error('Modular app script '+file+' syntax error: '+error.message);}
}

const executableInline=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match=>{
  const attrs=match[1]||'';
  const body=(match[2]||'').trim();
  return body&&!/\bsrc\s*=/.test(attrs)&&!/application\/(?:ld\+json|json)|importmap/i.test(attrs);
});
if(executableInline.length)throw new Error('Executable inline scripts remain in modular Programs build');
console.log('VFitness Programs modular design/progress verification passed; parsed '+appScripts.length+' app scripts');
