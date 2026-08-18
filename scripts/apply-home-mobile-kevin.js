const fs=require('fs');
const path=require('path');

const root=process.cwd();
const htmlPath=path.join(root,'site','index.html');
const pwaPath=path.join(root,'site','vf-pwa-update.js');
const cssPath=path.join(root,'site','vf-design-system.css');

let html=fs.readFileSync(htmlPath,'utf8');
let pwa=fs.readFileSync(pwaPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');

const trainersOld="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'}];";
const trainersNew="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'},{id:'kevin_mackey',name:'Kevin Mackey'}];";
if(html.includes(trainersOld))html=html.replace(trainersOld,trainersNew);

const flagsOld="const isLanardo=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('lanardo')||user?.name?.toLowerCase().includes('lanardo'));const isChavese=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('chavese')||user?.name?.toLowerCase().includes('chavese'));// Get trainer identifier for filtering (ONLY for trainers, NOT admins)";
const flagsNew="const isLanardo=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('lanardo')||user?.name?.toLowerCase().includes('lanardo'));const isChavese=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('chavese')||user?.name?.toLowerCase().includes('chavese'));const isKevin=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('kevin')||user?.name?.toLowerCase().includes('kevin'));// Get trainer identifier for filtering (ONLY for trainers, NOT admins)";
if(html.includes(flagsOld))html=html.replace(flagsOld,flagsNew);

const filterOld="if(isLanardo){trainerFilter='Lanardo Mackey';}else if(isChavese){trainerFilter='Chavese Moss';}";
const filterNew="if(isLanardo){trainerFilter='Lanardo Mackey';}else if(isChavese){trainerFilter='Chavese Moss';}else if(isKevin){trainerFilter='Kevin Mackey';}";
if(html.includes(filterOld))html=html.replace(filterOld,filterNew);

if(!pwa.includes('function hideHomeTrainingProgramsExact()')){
  const insert=`\n  function hideHomeTrainingProgramsExact(){\n    if(!isPublicHome())return;\n    Array.from(document.querySelectorAll('h1,h2,h3,h4')).forEach(function(h){\n      if(!/^Training Programs$/i.test(text(h)))return;\n      var section=h.closest('section');\n      if(section&&/MOST POPULAR|Training Programs/i.test(text(section).slice(0,1600))){\n        section.style.display='none';\n        section.setAttribute('data-vf-home-training-programs-hidden','true');\n      }\n    });\n  }\n`;
  pwa=pwa.replace('  function markResultsSections(){',insert+'  function markResultsSections(){');
  pwa=pwa.replace('fixHomeStartCta();simplifyHome();markResultsSections();','fixHomeStartCta();simplifyHome();hideHomeTrainingProgramsExact();markResultsSections();');
}

if(!css.includes('/* VFITNESS premium mobile typography layer */')){
  css+=`\n/* VFITNESS premium mobile typography layer */\n@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');\n:root{--vf-body:'Manrope',system-ui,sans-serif;--vf-display:'Plus Jakarta Sans','Manrope',system-ui,sans-serif}\nhtml,body,#root{width:100%;max-width:100%;overflow-x:hidden!important}\nbody,button,a,input,select,textarea{font-family:var(--vf-body)!important}\nh1,h2,h3,h4,h5,h6{font-family:var(--vf-display)!important;font-weight:800!important;letter-spacing:-.04em!important}\nbutton,a,[role='button'],input,select{min-height:48px}\n@media(max-width:768px){\n  body{font-size:16px!important;line-height:1.5!important}\n  #root,main{width:100%!important;max-width:100vw!important;overflow-x:hidden!important}\n  main>section,main>div{max-width:100%!important}\n  input,select,textarea{font-size:16px!important;max-width:100%!important}\n  img,video,iframe,canvas,svg{max-width:100%!important}\n  body.vf-marketing-home h1{font-size:clamp(2.7rem,13vw,4.6rem)!important;line-height:.92!important}\n  body.vf-marketing-home h2{font-size:clamp(2rem,9vw,3.3rem)!important;line-height:.98!important}\n  #vf-proof-showcase{width:calc(100% - 20px)!important;margin-top:18px!important;padding:14px!important}\n  .vf-proof-slide,.vf-proof-slide img{min-height:350px!important;max-height:520px!important}\n  body.vf-dashboard-page [class*='grid-cols-'],body.vf-workout-page [class*='grid-cols-']{grid-template-columns:minmax(0,1fr)!important}\n  body.vf-workout-page{padding-left:12px!important;padding-right:12px!important;padding-bottom:max(140px,calc(110px + env(safe-area-inset-bottom)))!important}\n  body.vf-workout-page iframe,body.vf-workout-page video{width:100%!important;aspect-ratio:16/9!important;height:auto!important}\n}\n`;
}

fs.writeFileSync(htmlPath,html);
fs.writeFileSync(pwaPath,pwa);
fs.writeFileSync(cssPath,css);
console.log('Applied safe homepage cleanup, premium mobile typography, and Kevin trainer support');
