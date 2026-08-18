const fs=require('fs');
const path=require('path');
const root=process.cwd();
const htmlPath=path.join(root,'site','index.html');
const pwaPath=path.join(root,'site','vf-pwa-update.js');
const cssPath=path.join(root,'site','vf-design-system.css');
let html=fs.readFileSync(htmlPath,'utf8');
let pwa=fs.readFileSync(pwaPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');

// Kevin Mackey: package assignment + trainer-scoped client access.
html=html.replace(/const PACKAGE_ASSIGN_TRAINERS=\[([^\]]*)\];/,function(all,list){
  if(/Kevin Mackey/i.test(list))return all;
  return "const PACKAGE_ASSIGN_TRAINERS=["+list+",{id:'kevin_mackey',name:'Kevin Mackey'}];";
});
if(!html.includes("const isKevin=")){
  html=html.replace(/(const isChavese=user\?\.role==='trainer'[^;]*;)/,"$1const isKevin=user?.role==='trainer'&&(user?.email?.toLowerCase().includes('kevin')||user?.name?.toLowerCase().includes('kevin'));" );
}
html=html.replace(/if\(isLanardo\)\{trainerFilter='Lanardo Mackey';\}else if\(isChavese\)\{trainerFilter='Chavese Moss';\}(?!else if\(isKevin\))/,"if(isLanardo){trainerFilter='Lanardo Mackey';}else if(isChavese){trainerFilter='Chavese Moss';}else if(isKevin){trainerFilter='Kevin Mackey';}");

// Home cleanup is deliberately independent of fragile source-string insertion.
// It re-runs after async renders so the storefront cannot reappear on the public home page.
if(!pwa.includes('VF_HOME_PROGRAMS_HARD_REMOVE_V2')){
  pwa += `\n/* VF_HOME_PROGRAMS_HARD_REMOVE_V2 */\n(function(){\n 'use strict';\n function clean(){\n   var path=(location.pathname||'/').replace(/\\/+$/,'')||'/';\n   if(path!=='/'&&path!=='/home')return;\n   Array.from(document.querySelectorAll('h1,h2,h3,h4,h5')).forEach(function(h){\n     if(!/^Training Programs$/i.test((h.textContent||'').trim()))return;\n     var node=h;\n     while(node&&node!==document.body){\n       var copy=(node.innerText||'').replace(/\\s+/g,' ').trim();\n       if(/MOST POPULAR/i.test(copy)&&(/View Program|8 weeks|WOMEN|MUSCLE/i.test(copy))){node.style.setProperty('display','none','important');node.setAttribute('data-vf-home-programs-removed','true');break;}\n       node=node.parentElement;\n     }\n   });\n }\n function schedule(){clean();setTimeout(clean,80);setTimeout(clean,350);setTimeout(clean,900);setTimeout(clean,1800);}\n if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule);else schedule();\n window.addEventListener('pageshow',schedule);window.addEventListener('popstate',schedule);window.addEventListener('hashchange',schedule);window.addEventListener('vf:ui-rendered',schedule);window.addEventListener('vf:navigation',schedule);\n})();\n`;
}

if(!css.includes('/* VF_PWA_MOBILE_PREMIUM_V2 */')){
 css += `\n/* VF_PWA_MOBILE_PREMIUM_V2 */\n@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');\n:root{--vf-body:'Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;--vf-display:'Plus Jakarta Sans','Manrope',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}\nhtml,body,#root{width:100%!important;max-width:100%!important;overflow-x:hidden!important}\nbody,button,a,input,select,textarea{font-family:var(--vf-body)!important}\nh1,h2,h3,h4,h5,h6,.text-3xl,.text-4xl,.text-5xl,.text-6xl,.text-7xl{font-family:var(--vf-display)!important;font-weight:800!important;letter-spacing:-.045em!important}\nimg,video,iframe,canvas,svg{max-width:100%!important}\nbutton,a,[role='button']{touch-action:manipulation;-webkit-tap-highlight-color:transparent}\n[data-vf-home-programs-removed='true']{display:none!important}\n@media(max-width:768px){\n html{-webkit-text-size-adjust:100%;text-size-adjust:100%}\n body{font-size:16px!important;line-height:1.5!important}\n #root,main,main>section,main>div{width:100%!important;max-width:100vw!important;min-width:0!important;overflow-x:hidden!important}\n main{padding-left:max(0px,env(safe-area-inset-left));padding-right:max(0px,env(safe-area-inset-right))}\n section,article,div,form,nav{min-width:0}\n input,select,textarea{font-size:16px!important;max-width:100%!important}\n button,a,[role='button']{min-height:48px}\n body.vf-marketing-home h1{font-size:clamp(2.55rem,12vw,4.25rem)!important;line-height:.94!important;overflow-wrap:normal!important;word-break:normal!important}\n body.vf-marketing-home h2{font-size:clamp(2rem,8.8vw,3.15rem)!important;line-height:1!important}\n #vf-proof-showcase{width:calc(100% - 24px)!important;margin:16px 12px 40px!important;padding:16px!important;border-radius:24px!important}\n .vf-proof-head{display:block!important}.vf-proof-head p{margin-top:12px!important}.vf-proof-head h2{font-size:clamp(1.9rem,8.5vw,2.8rem)!important}\n .vf-proof-slide,.vf-proof-image-shell,.vf-proof-slide img{min-height:340px!important;max-height:520px!important}\n .vf-proof-actions{display:grid!important;grid-template-columns:1fr!important}.vf-proof-actions a{width:100%!important}\n body.vf-dashboard-page [class*='grid-cols-'],body.vf-workout-page [class*='grid-cols-']{grid-template-columns:minmax(0,1fr)!important}\n body.vf-workout-page,body.vf-workout-page #root,body.vf-workout-page main{width:100%!important;max-width:100vw!important;overflow-x:hidden!important}\n body.vf-workout-page{padding-left:12px!important;padding-right:12px!important;padding-bottom:max(140px,calc(110px + env(safe-area-inset-bottom)))!important}\n body.vf-workout-page *{min-width:0!important;max-width:100%!important;writing-mode:horizontal-tb!important;text-orientation:mixed!important}\n body.vf-workout-page iframe,body.vf-workout-page video{display:block!important;width:100%!important;height:auto!important;aspect-ratio:16/9!important}\n body.vf-workout-page button{width:100%;white-space:normal!important}\n}\n`;
}
fs.writeFileSync(htmlPath,html);
fs.writeFileSync(pwaPath,pwa);
fs.writeFileSync(cssPath,css);
console.log('Applied VFitness home cleanup, premium mobile PWA UI, and Kevin Mackey trainer access');
