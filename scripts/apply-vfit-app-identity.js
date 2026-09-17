const fs=require('fs');
const path=require('path');

const root=process.cwd();
const siteDir=path.join(root,'site');
const cssSource=path.join(root,'src','styles','vfit-app-identity-2026.css');
const jsSource=path.join(root,'src','services','vfitIdentity2026.js');
const cssTarget=path.join(siteDir,'vfit-app-identity-2026.css');
const jsTarget=path.join(siteDir,'vfit-app-identity-2026.js');
const homePath=path.join(siteDir,'home.html');
const appPath=path.join(siteDir,'index.html');
const MARK='VF_APP_IDENTITY_20260917';
const fontHref='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700;800&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap';

for(const file of [cssSource,jsSource,homePath,appPath]){
  if(!fs.existsSync(file))throw new Error('Missing identity build input: '+path.relative(root,file));
}

fs.copyFileSync(cssSource,cssTarget);
fs.copyFileSync(jsSource,jsTarget);

function insertBeforeLast(html,needle,insertion){
  const index=html.lastIndexOf(needle);
  if(index<0)throw new Error('Missing closing '+needle+' while applying VFIT identity');
  return html.slice(0,index)+insertion+html.slice(index);
}

function inject(file){
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('data-vfit-app-fonts="20260917"')){
    html=insertBeforeLast(html,'</head>',`  <link data-vfit-app-fonts="20260917" rel="stylesheet" href="${fontHref}">\n`);
  }
  if(!html.includes('data-vfit-app-identity="20260917"')){
    html=insertBeforeLast(html,'</head>','  <link data-vfit-app-identity="20260917" rel="stylesheet" href="/vfit-app-identity-2026.css">\n');
  }
  if(!html.includes('data-vfit-app-motion="20260917"')){
    html=insertBeforeLast(html,'</body>','  <script data-vfit-app-motion="20260917" defer src="/vfit-app-identity-2026.js"></script>\n');
  }
  if(!html.includes('data-vfit-app-identity="20260917"')||!html.includes('data-vfit-app-motion="20260917"')){
    throw new Error('Identity injection failed for '+path.basename(file));
  }
  fs.writeFileSync(file,html);
}

inject(homePath);
inject(appPath);

const css=fs.readFileSync(cssTarget,'utf8');
const js=fs.readFileSync(jsTarget,'utf8');
if(!css.includes(MARK)||!js.includes(MARK))throw new Error('Identity marker missing from generated assets');
if(!css.includes('--vf-reef:#00C2A8')||!css.includes("'Bebas Neue'")||!css.includes("'Barlow Condensed'"))throw new Error('VFIT identity tokens incomplete');
if(!fs.readFileSync(homePath,'utf8').includes(fontHref))throw new Error('VFIT font stack not injected into home');
if(!fs.readFileSync(appPath,'utf8').includes(fontHref))throw new Error('VFIT font stack not injected into app shell');

console.log('Applied VFIT on-demand app identity to vfitbah.com build.');
