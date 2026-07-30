const fs=require('fs');
const path=require('path');

const version=(process.env.VERCEL_GIT_COMMIT_SHA||process.env.GITHUB_SHA||'refactor-20260730').slice(0,12).replace(/[^a-zA-Z0-9_-]/g,'');
const swPath=path.join(process.cwd(),'site','sw.js');
const guardPath=path.join(process.cwd(),'site','vf-runtime-guard.js');

let sw=fs.readFileSync(swPath,'utf8');
sw=sw.replace(/const CACHE_NAME=CACHE_PREFIX\+'[^']+';/,"const CACHE_NAME=CACHE_PREFIX+'shell-"+version+"';");
if(!sw.includes("shell-"+version))throw new Error('Could not version service worker cache');
fs.writeFileSync(swPath,sw);

if(fs.existsSync(guardPath)){
  let guard=fs.readFileSync(guardPath,'utf8');
  guard=guard.replace(/const BUILD='[^']+';/,"const BUILD='"+version+"';");
  fs.writeFileSync(guardPath,guard);
}
console.log('Versioned VFitness release '+version);
