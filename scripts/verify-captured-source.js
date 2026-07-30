const fs=require('fs');
const path=require('path');

const root=process.cwd();
const sourceDir=path.join(root,'src','app');
const shell=fs.readFileSync(path.join(sourceDir,'index.html'),'utf8');
const report=JSON.parse(fs.readFileSync(path.join(sourceDir,'capture-report.json'),'utf8'));
const assert=(condition,message)=>{if(!condition)throw new Error(message);};

assert(shell.includes('VFITNESS MODULAR SOURCE SHELL'),'Modular shell marker is missing');
assert(shell.includes('/app-assets/scripts/'),'External script assets are missing from the shell');
assert(shell.includes('/app-assets/styles/'),'External style assets are missing from the shell');
assert(!shell.includes('MutationObserver'),'A legacy DOM observer remains in the captured shell');
assert(report.scriptFiles>=5,'Too few inline scripts were externalized');
assert(report.styleFiles>=5,'Too few inline styles were externalized');
assert(shell.split('\n').length<1400,'The modular shell is still carrying too much inline application code');

const executableInline=[...shell.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].filter(match=>{
  const attrs=match[1]||'';
  const body=(match[2]||'').trim();
  if(!body||/\bsrc\s*=/.test(attrs))return false;
  return !/application\/(?:ld\+json|json)|importmap/i.test(attrs);
});
assert(executableInline.length===0,'Executable inline scripts remain in the modular shell');
assert(!/<style\b[^>]*>[\s\S]*?\S[\s\S]*?<\/style>/i.test(shell),'Inline style blocks remain in the modular shell');

const scriptsDir=path.join(sourceDir,'generated','scripts');
const scripts=fs.readdirSync(scriptsDir).filter(file=>file.endsWith('.js'));
let appFound=false;
for(const file of scripts){
  const content=fs.readFileSync(path.join(scriptsDir,file),'utf8');
  if(content.includes('function VFitnessApp'))appFound=true;
  try{new Function(content);}
  catch(error){throw new Error(file+' syntax error: '+error.message);}
}
assert(appFound,'VFitnessApp was not captured in an external source module');

for(const file of report.rootAssets){
  const asset=path.join(sourceDir,'root-assets',file);
  assert(fs.existsSync(asset)&&fs.statSync(asset).size>0,'Missing captured root asset: '+file);
}

console.log(JSON.stringify({ok:true,shellLines:shell.split('\n').length,scriptFiles:report.scriptFiles,styleFiles:report.styleFiles},null,2));
