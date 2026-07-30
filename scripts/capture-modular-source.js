const fs=require('fs');
const path=require('path');

const root=process.cwd();
const siteDir=path.join(root,'site');
const sourceDir=path.join(root,'src','app');
const generatedDir=path.join(sourceDir,'generated');
const siteAssetsDir=path.join(siteDir,'app-assets');
const htmlPath=path.join(siteDir,'index.html');

if(!fs.existsSync(htmlPath))throw new Error('Built site/index.html is missing');
let html=fs.readFileSync(htmlPath,'utf8');
if(!html.includes('VFitnessApp'))throw new Error('The built React app was not found before modular capture');

fs.rmSync(sourceDir,{recursive:true,force:true});
fs.rmSync(siteAssetsDir,{recursive:true,force:true});
fs.mkdirSync(path.join(generatedDir,'scripts'),{recursive:true});
fs.mkdirSync(path.join(generatedDir,'styles'),{recursive:true});
fs.mkdirSync(path.join(sourceDir,'root-assets'),{recursive:true});
fs.mkdirSync(path.join(siteAssetsDir,'scripts'),{recursive:true});
fs.mkdirSync(path.join(siteAssetsDir,'styles'),{recursive:true});

const names=new Set();
function safeName(value,fallback,extension){
  let base=String(value||fallback).toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/^-+|-+$/g,'')||fallback;
  let name=base+extension;
  let counter=2;
  while(names.has(name)){name=base+'-'+counter+extension;counter++;}
  names.add(name);
  return name;
}
function idFromAttrs(attrs){
  const match=String(attrs||'').match(/\bid\s*=\s*(["'])(.*?)\1/i);
  return match?match[2]:'';
}
function attrFrom(attrs,name){
  const pattern=new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`,'i');
  const match=String(attrs||'').match(pattern);
  return match?match[2]:'';
}
function writeGenerated(kind,fileName,body){
  const sourcePath=path.join(generatedDir,kind,fileName);
  const sitePath=path.join(siteAssetsDir,kind,fileName);
  fs.writeFileSync(sourcePath,body);
  fs.writeFileSync(sitePath,body);
}

let styleCount=0;
html=html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/gi,function(full,attrs,body){
  if(!body.trim())return '';
  styleCount++;
  const fileName=safeName(idFromAttrs(attrs),'inline-style-'+styleCount,'.css');
  writeGenerated('styles',fileName,'/* Captured from the verified VFitness production shell. */\n'+body.trim()+'\n');
  const media=attrFrom(attrs,'media');
  const id=idFromAttrs(attrs);
  return '<link rel="stylesheet" href="/app-assets/styles/'+fileName+'"'+(id?' id="'+id+'"':'')+(media?' media="'+media+'"':'')+'>';
});

let scriptCount=0;
let executableInline=0;
html=html.replace(/<script([^>]*)>([\s\S]*?)<\/script>/gi,function(full,attrs,body){
  if(/\bsrc\s*=/.test(attrs))return full;
  const type=attrFrom(attrs,'type').toLowerCase();
  if(type==='application/ld+json'||type==='application/json'||type==='importmap')return full;
  if(!body.trim())return full;
  if(type&&type!=='text/javascript'&&type!=='application/javascript'&&type!=='module')return full;
  scriptCount++;
  executableInline++;
  const fileName=safeName(idFromAttrs(attrs),'inline-script-'+scriptCount,'.js');
  writeGenerated('scripts',fileName,'/* Captured from the verified VFitness production shell. */\n'+body.trim()+'\n');
  const cleanedAttrs=String(attrs||'').replace(/\s*src\s*=\s*(["']).*?\1/ig,'');
  return '<script'+cleanedAttrs+' src="/app-assets/scripts/'+fileName+'"></script>';
});

const rootAssets=[
  'vfp-programs.js','vfp-programs.css','vfp-progress-runtime.js','vfp-progress-design.css',
  'vf-runtime-guard.js','vf-router.js','vf-program-state.js','vf-program-error-boundary.js',
  'vf-program-ui.js','vf-pwa-update.js','vf-design-system.css'
];
for(const fileName of rootAssets){
  const source=path.join(siteDir,fileName);
  if(!fs.existsSync(source))throw new Error('Required generated root asset is missing: '+fileName);
  fs.copyFileSync(source,path.join(sourceDir,'root-assets',fileName));
}

const banner='<!-- VFITNESS MODULAR SOURCE SHELL: generated once from a browser-tested production build. -->\n';
html=banner+html;
fs.writeFileSync(path.join(sourceDir,'index.html'),html);
fs.writeFileSync(htmlPath,html);

const report={
  generatedAt:new Date().toISOString(),
  styleFiles:styleCount,
  scriptFiles:scriptCount,
  executableInlineScriptsExternalized:executableInline,
  rootAssets:rootAssets,
  shellBytes:Buffer.byteLength(html),
  originalArchitecture:'single generated HTML document',
  productionArchitecture:'source-controlled modular HTML shell with external JavaScript and CSS'
};
fs.writeFileSync(path.join(sourceDir,'capture-report.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
