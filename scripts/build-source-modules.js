const fs=require('fs');
const path=require('path');

const root=process.cwd();
const files={
  'src/services/programState.js':'site/vf-program-state.js',
  'src/services/router.js':'site/vf-router.js',
  'src/services/pwaUpdate.js':'site/vf-pwa-update.js',
  'src/services/siteUpgrade.js':'site/vf-site-upgrade.js',
  'src/features/programs/ProgramErrorBoundary.js':'site/vf-program-error-boundary.js',
  'src/features/programs/program-ui.js':'site/vf-program-ui.js',
  'src/styles/design-tokens.css':'site/vf-design-system.css'
};

for(const [source,target] of Object.entries(files)){
  const sourcePath=path.join(root,source);
  const targetPath=path.join(root,target);
  if(!fs.existsSync(sourcePath))throw new Error('Missing source module: '+source);
  fs.mkdirSync(path.dirname(targetPath),{recursive:true});
  fs.copyFileSync(sourcePath,targetPath);
  if(!fs.statSync(targetPath).size)throw new Error('Generated empty module: '+target);
  console.log('[source] '+source+' -> '+target);
}

const htmlPath=path.join(root,'site','index.html');
if(!fs.existsSync(htmlPath))throw new Error('Missing production shell: site/index.html');
let html=fs.readFileSync(htmlPath,'utf8');
const upgradeTag='<script src="/vf-site-upgrade.js?v=20260818" data-vf-site-upgrade="1"></script>';
if(!html.includes('data-vf-site-upgrade="1"')){
  if(!html.includes('</body>'))throw new Error('Production shell is missing </body>');
  html=html.replace('</body>',upgradeTag+'\n</body>');
  fs.writeFileSync(htmlPath,html);
  console.log('[source] injected /vf-site-upgrade.js into site/index.html');
}
