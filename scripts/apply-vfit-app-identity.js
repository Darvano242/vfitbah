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
const FALLBACK_MARK='VFIT_LIVE_HOME_FALLBACK_20260917';
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

function upgradeAppFallback(html){
  if(html.includes(FALLBACK_MARK))return html;
  const fallback=`<div id="root" data-vfit-fallback="${FALLBACK_MARK}">
    <main class="vf-v2-hero" style="min-height:100svh">
      <div class="vf-v2-wrap vf-v2-heroin">
        <div class="vf-v2-hero-copy">
          <div class="vf-v2-herobadge vf-v2-eyebrow">PERSONAL TRAINING IN NASSAU AND ONLINE</div>
          <h1 class="vf-v2-h1"><span>RESULTS AREN'T</span><span>RANDOM.</span><span class="vf-v2-reef-line">THEY'RE BUILT.</span></h1>
          <p class="vf-v2-copy">Training, nutrition, accountability and progress tracking inside one coaching system built around your result.</p>
          <div class="vf-v2-heroactions"><a class="vf-v2-primary" href="/start">Start Your Transformation</a><a class="vf-v2-hero-link" href="/programs">Explore programs</a></div>
          <div class="vf-v2-proofstrip">500+ TRANSFORMATIONS · 4 COACHES · 3 NASSAU GYMS</div>
        </div>
        <div class="vf-v2-appstage" aria-label="VFIT coaching experience preview">
          <div class="vf-v2-appstage-top"><div class="vf-v2-appstage-label">VFIT COACHING SYSTEM</div><div class="vf-v2-appstage-chip">BUILT FOR DAILY USE</div></div>
          <div class="vf-v2-appstage-title">YOUR PLAN.<br>YOUR DATA.<br>YOUR COACH.</div>
          <p class="vf-v2-appstage-sub">One place to train, fuel, recover and measure the work you are putting in.</p>
          <div class="vf-v2-appstage-panel"><div class="vf-v2-appstage-grid">
            <div class="vf-v2-appstage-item"><span style="font-size:30px;color:#00C2A8">T</span><span>Train</span></div>
            <div class="vf-v2-appstage-item"><span style="font-size:30px;color:#00C2A8">F</span><span>Fuel</span></div>
            <div class="vf-v2-appstage-item"><span style="font-size:30px;color:#00C2A8">R</span><span>Recover</span></div>
            <div class="vf-v2-appstage-item"><span style="font-size:30px;color:#00C2A8">P</span><span>Progress</span></div>
          </div></div>
        </div>
      </div>
    </main>
  </div>`;
  const pattern=/<div id="root">[\s\S]*?<\/div>\s*(?=<!-- Netlify Forms fallback)/;
  if(!pattern.test(html))throw new Error('Could not locate legacy public fallback root in app shell');
  return html.replace(pattern,fallback+'\n\n    ');
}

function inject(file,withPublicOverhaul,isApp){
  let html=fs.readFileSync(file,'utf8');
  if(isApp)html=upgradeAppFallback(html);

  if(!html.includes('data-vfit-app-fonts="20260917"')){
    html=insertBeforeFirst(html,'</head>',`  <link data-vfit-app-fonts="20260917" rel="stylesheet" href="${fontHref}">\n`);
  }

  if(!html.includes('data-vfit-app-identity-inline="20260917"')){
    const safeCss=css.replace(/<\/style/gi,'<\\/style');
    html=insertBeforeFirst(html,'</head>',`  <style data-vfit-app-identity-inline="20260917">\n${safeCss}\n  </style>\n`);
  }

  if(withPublicOverhaul && !html.includes('data-vfit-public-overhaul-inline="20260917"')){
    const safePublicCss=publicCss.replace(/<\/style/gi,'<\\/style');
    html=insertBeforeFirst(html,'</head>',`  <style data-vfit-public-overhaul-inline="20260917">\n${safePublicCss}\n  </style>\n`);
  }

  if(!html.includes('data-vfit-app-identity="20260917"')){
    html=insertBeforeFirst(html,'</head>','  <link data-vfit-app-identity="20260917" rel="stylesheet" href="/vfit-app-identity-2026.css">\n');
  }
  if(withPublicOverhaul && !html.includes('data-vfit-public-overhaul="20260917"')){
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
  if(withPublicOverhaul && !html.includes('data-vfit-public-overhaul-inline="20260917"')){
    throw new Error('Public overhaul injection failed for '+path.basename(file));
  }
  if(isApp && !html.includes(FALLBACK_MARK))throw new Error('Live app fallback upgrade missing');
  fs.writeFileSync(file,html);
}

/* Both files can serve the public home route depending on Vercel project routing,
   so both receive the complete public identity layer. */
inject(homePath,true,false);
inject(appPath,true,true);

if(!css.includes(MARK)||!js.includes(MARK))throw new Error('Identity marker missing from generated assets');
if(!publicCss.includes(PUBLIC_MARK))throw new Error('Public overhaul marker missing from generated assets');
if(!css.includes('--vf-reef:#00C2A8')||!css.includes("'Bebas Neue'")||!css.includes("'Barlow Condensed'"))throw new Error('VFIT identity tokens incomplete');
const builtHome=fs.readFileSync(homePath,'utf8');
const builtApp=fs.readFileSync(appPath,'utf8');
if(!builtHome.includes(fontHref)||!builtApp.includes(fontHref))throw new Error('VFIT font stack not injected');
if(!builtHome.includes('--vf-reef:#00C2A8')||!builtApp.includes('--vf-reef:#00C2A8'))throw new Error('Inline VFIT identity CSS missing from built HTML');
if(!builtHome.includes(PUBLIC_MARK)||!builtHome.includes('vf-v2-appstage'))throw new Error('Major VFIT public overhaul missing from built homepage');
if(!builtApp.includes(PUBLIC_MARK)||!builtApp.includes(FALLBACK_MARK))throw new Error('Major VFIT public overhaul missing from live app shell');

console.log('Applied VFIT identity and public homepage overhaul to both production entry points.');
