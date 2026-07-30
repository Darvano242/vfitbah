const fs=require('fs');
const path=require('path');

const root=process.cwd();
const sourceDir=path.join(root,'src','app');
const siteDir=path.join(root,'site');

function copyDirectory(source,target){
  if(!fs.existsSync(source))throw new Error('Missing source directory: '+path.relative(root,source));
  fs.mkdirSync(target,{recursive:true});
  for(const entry of fs.readdirSync(source,{withFileTypes:true})){
    const from=path.join(source,entry.name);
    const to=path.join(target,entry.name);
    if(entry.isDirectory())copyDirectory(from,to);
    else fs.copyFileSync(from,to);
  }
}

const shell=path.join(sourceDir,'index.html');
if(!fs.existsSync(shell))throw new Error('Modular app shell is missing');
const html=fs.readFileSync(shell,'utf8');
if(!html.includes('VFITNESS MODULAR SOURCE SHELL'))throw new Error('Modular app shell marker is missing');

fs.mkdirSync(siteDir,{recursive:true});
fs.writeFileSync(path.join(siteDir,'index.html'),html);
fs.rmSync(path.join(siteDir,'app-assets'),{recursive:true,force:true});
copyDirectory(path.join(sourceDir,'generated'),path.join(siteDir,'app-assets'));
copyDirectory(path.join(sourceDir,'root-assets'),siteDir);

console.log('Built VFitness production directly from source-controlled modular assets');
