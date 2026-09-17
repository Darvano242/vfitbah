const fs=require('fs');
const path=require('path');

const root=process.cwd();
const siteDir=path.join(root,'site');
const cssSource=path.join(root,'src','styles','vfit-app-identity-2026.css');
const publicCssSource=path.join(root,'src','styles','vfit-public-overhaul-2026.css');
const jsSource=path.join(root,'src','services','vfitIdentity2026.js');
const cssTarget=path.join(siteDir,'vfit-app-identity-2026.css');
const publicCssTarget=path.join(siteDir,'vfit-public-overhaul-2026.css');
const jsTarget=path.join(siteDir,'vfit-app-identity-2026.js');
const homePath=path.join(siteDir,'home.html');
const appPath=path.join(siteDir,'index.html');
const MARK='VF_APP_IDENTITY_20260917';
const PUBLIC_MARK='VFIT_PUBLIC_OVERHAUL_20260917';
const fontHref='https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@600;700;800&family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&display=swap';

for(const file of [cssSource,publicCssSource,jsSource,homePath,appPath]){
  if(!fs.existsSync(file))throw new Error('Missing identity build input: '+path.relative(root,file));
}

const css=fs.readFileSync(cssSource,'utf8');
const publicCss=fs.readFileSync(publicCssSource,'utf8');
const js=fs.readFileSync(jsSource,'utf8');
fs.copyFileSync(cssSource,cssTarget);
fs.copyFileSync(publicCssSource,publicCssTarget);
fs.copyFileSync(jsSource,jsTarget);

function insertBeforeFirst(html,needle,insertion){
  const index=html.indexOf(needle);
  if(index<0)throw new Error('Missing closing '+needle+' while applying VFIT identity');
  return html.slice(0,index)+insertion+html.slice(index);
}

function insertBeforeLast(html,needle,insertion){
  const index=html.lastIndexOf(needle);
  if(index<0)throw new Error('Missing closing '+needle+' while applying VFIT identity');
  return html.slice(0,index)+insertion+html.slice(index);
}

function inject(file,isHome){
  let html=fs.readFileSync(file,'utf8');
  if(!html.includes('data-vfit-app-fonts="20260917"')){
    html=insertBeforeFirst(html,'</head>',`  <link data-vfit-app-fonts="20260917" rel="stylesheet" href="${fontHref}">\n`);
  }

  if(!html.includes('data-vfit-app-identity-inline="20260917"')){
    const safeCss=css.replace(/<\/style/gi,'<\\/style');
    html=insertBeforeFirst(html,'</head>',`  <style data-vfit-app-identity-inline="20260917">\n${safeCss}\n  </style>\n`);
  }

  if(isHome && !html.includes('data-vfit-public-overhaul-inline="20260917"')){
    const safePublicCss=publicCss.replace(/<\/style/gi,'<\\/style');
    html=insertBeforeFirst(html,'</head>',`  <style data-vfit-public-overhaul-inline="20260917">\n${safePublicCss}\n  </style>\n`);
  }

  if(!html.includes('data-vfit-app-identity="20260917"')){
    html=insertBeforeFirst(html,'</head>','  <link data-vfit-app-identity="20260917" rel="stylesheet" href="/vfit-app-identity-2026.css">\n');
  }
  if(isHome && !html.includes('data-vfit-public-overhaul="20260917"')){
    html=insertBeforeFirst(html,'</head>','  <link data-vfit-public-overhaul="20260917" rel="stylesheet" href="/vfit-public-overhaul-2026.css">\n');
  }

  if(!html.includes('data-vfit-app-motion="20260917"')){
    html=insertBeforeLast(html,'</body>','  <script data-vfit-app-motion="20260917" defer src="/vfit-app-identity-2026.js"></script>\n');
  }

  if(!html.includes('data-vfit-build="identity-20260917"')){
    html=insertBeforeFirst(html,'</head>','  <meta data-vfit-build="identity-20260917" name="vfit-build" content="identity-20260917">\n');
  }

  if(!html.includes('data-vfit-app-identity-inline="20260917"')||!html.includes('data-vfit-app-motion="20260917"')){
    throw new Error('Identity injection failed for '+path.basename(file));
  }
  if(isHome && !html.includes('data-vfit-public-overhaul-inline="20260917"')){
    throw new Error('Public overhaul injection failed for '+path.basename(file));
  }
  fs.writeFileSync(file,html);
}

inject(homePath,true);
inject(appPath,false);

if(!css.includes(MARK)||!js.includes(MARK))throw new Error('Identity marker missing from generated assets');
if(!publicCss.includes(PUBLIC_MARK))throw new Error('Public overhaul marker missing from generated assets');
if(!css.includes('--vf-reef:#00C2A8')||!css.includes("'Bebas Neue'")||!css.includes("'Barlow Condensed'"))throw new Error('VFIT identity tokens incomplete');
const builtHome=fs.readFileSync(homePath,'utf8');
const builtApp=fs.readFileSync(appPath,'utf8');
if(!builtHome.includes(fontHref)||!builtApp.includes(fontHref))throw new Error('VFIT font stack not injected');
if(!builtHome.includes('--vf-reef:#00C2A8')||!builtApp.includes('--vf-reef:#00C2A8'))throw new Error('Inline VFIT identity CSS missing from built HTML');
if(!builtHome.includes(PUBLIC_MARK)||!builtHome.includes('vf-v2-appstage'))throw new Error('Major VFIT public overhaul missing from built homepage');

console.log('Applied VFIT on-demand identity and major public homepage overhaul.');
