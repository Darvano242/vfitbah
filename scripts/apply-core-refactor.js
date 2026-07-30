const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

function assert(condition,message){if(!condition)throw new Error(message);}
function once(text,from,to,label){
  if(text.includes(to))return text;
  assert(text.includes(from),'Missing '+label+' marker');
  return text.replace(from,to);
}
function replaceArrowFunction(text,marker,replacement){
  const start=text.indexOf(marker);
  assert(start>=0,'Missing function marker: '+marker);
  const brace=text.indexOf('{',start+marker.length);
  assert(brace>=0,'Missing function body: '+marker);
  let depth=0,quote=null,escape=false,lineComment=false,blockComment=false;
  for(let i=brace;i<text.length;i++){
    const ch=text[i],next=text[i+1];
    if(lineComment){if(ch==='\n')lineComment=false;continue;}
    if(blockComment){if(ch==='*'&&next==='/'){blockComment=false;i++;}continue;}
    if(quote){if(escape){escape=false;continue;}if(ch==='\\'){escape=true;continue;}if(ch===quote)quote=null;continue;}
    if(ch==='/'&&next==='/'){lineComment=true;i++;continue;}
    if(ch==='/'&&next==='*'){blockComment=true;i++;continue;}
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
    if(ch==='{')depth++;
    if(ch==='}'){
      depth--;
      if(depth===0)return text.slice(0,start)+replacement+text.slice(i+1);
    }
  }
  throw new Error('Unclosed function body: '+marker);
}

const appMarker='    <script>\nconst{useState,useEffect,useRef}=React;';
assert(html.includes(appMarker),'Main app marker not found');
const moduleTags=`    <link rel="stylesheet" href="/vf-design-system.css?v=20260730" data-vf-source-modules="1">\n    <script src="/vf-router.js?v=20260730"></script>\n    <script src="/vf-program-state.js?v=20260730"></script>\n    <script src="/vf-program-error-boundary.js?v=20260730"></script>\n    <script src="/vf-program-ui.js?v=20260730"></script>\n    <script src="/vf-pwa-update.js?v=20260730"></script>\n\n`;
if(!html.includes('data-vf-source-modules="1"'))html=html.replace(appMarker,moduleTags+appMarker);

const appStart='function VFitnessApp(){const[currentPage,setCurrentPage]=useState(';
const titleStart='useEffect(()=>{const vfT=';
const appIndex=html.indexOf(appStart);
const titleIndex=html.indexOf(titleStart,appIndex);
assert(appIndex>=0&&titleIndex>appIndex,'VFitnessApp route boundaries not found');
const routeInit="function VFitnessApp(){const[currentPage,setCurrentPage]=useState(()=>window.VFitnessRouter?window.VFitnessRouter.pageFromLocation():'home');";
html=html.slice(0,appIndex)+routeInit+html.slice(titleIndex);

const titleEnd="document.title=vfT[currentPage]||vfT.home;},[currentPage]);const[user,setUser]=useState(null);";
const titleEndReplacement="document.title=vfT[currentPage]||vfT.home;},[currentPage]);useEffect(()=>{if(window.VFitnessRouter)window.VFitnessRouter.syncPage(currentPage);setTimeout(()=>window.dispatchEvent(new CustomEvent('vf:ui-rendered',{detail:{page:currentPage}})),0);},[currentPage]);useEffect(()=>{const onRoute=e=>{const page=e&&e.detail&&e.detail.page;if(page&&page!==currentPage)setCurrentPage(page);};window.addEventListener('vf:routechange',onRoute);return()=>window.removeEventListener('vf:routechange',onRoute);},[currentPage]);const[user,setUser]=useState(null);";
html=once(html,titleEnd,titleEndReplacement,'route synchronization');

html=html.replace("const[activeTab,setActiveTab]=useState('all');","const[activeTab,setActiveTab]=useState(()=>window.VFitnessRouter?window.VFitnessRouter.tabFromLocation():'all');");
html=html.replace("setEnrolledPrograms(programs);","setEnrolledPrograms(programs);const vfRouteEnrollment=window.VFitnessRouter&&window.VFitnessRouter.enrollmentFromLocation();if(vfRouteEnrollment){const vfTarget=programs.find(p=>p.id===vfRouteEnrollment);if(vfTarget){setSelectedEnrollment(vfTarget);setShowWorkoutView(true);setActiveTab('purchased');}}",1);
html=html.replace(/onClick:\(\)=>setActiveTab\('all'\)/g,"onClick:()=>{setActiveTab('all');window.VFitnessRouter&&window.VFitnessRouter.openStore();}");
html=html.replace(/onClick:\(\)=>setActiveTab\('purchased'\)/g,"onClick:()=>{setActiveTab('purchased');window.VFitnessRouter&&window.VFitnessRouter.openMyPrograms();}");
html=html.replace("setActiveTab('purchased');// Switch to purchased tab","setActiveTab('purchased');window.VFitnessRouter&&window.VFitnessRouter.openMyPrograms();// Switch to purchased tab");

const activeViewStart='if(showWorkoutView&&selectedEnrollment){return';
const activeViewEnd=';}// Show Programs browsing page';
const avStart=html.indexOf(activeViewStart);
const avEnd=html.indexOf(activeViewEnd,avStart);
assert(avStart>=0&&avEnd>avStart,'Active program render block not found');
const activeView=`if(showWorkoutView&&selectedEnrollment){const closeProgramView=()=>{setShowWorkoutView(false);setSelectedEnrollment(null);setActiveTab('purchased');window.VFitnessRouter&&window.VFitnessRouter.openMyPrograms();};return/*#__PURE__*/React.createElement(VFitnessProgramErrorBoundary,{feature:'programs',action:'program_dashboard',programId:selectedEnrollment.programId,enrollmentId:selectedEnrollment.id,onReturn:closeProgramView},/*#__PURE__*/React.createElement(ActiveProgramView,{enrollment:selectedEnrollment,user:user,theme:theme,onComplete:()=>{loadEnrolledPrograms();closeProgramView();},onBack:closeProgramView}));}`;
html=html.slice(0,avStart)+activeView+html.slice(avEnd+2);

html=html.replace('function ActiveProgramView({enrollment,user,theme,onComplete})','function ActiveProgramView({enrollment,user,theme,onComplete,onBack})');
const completeReplacement=`const completeWorkout=async payload=>{const workoutIndex=payload&&typeof payload==='object'?Math.max(0,Number(payload.workoutIndex)||0):Math.max(0,(Number(payload)||1)-1);const log=payload&&typeof payload==='object'&&payload.log?payload.log:{};const sessionKey=payload&&typeof payload==='object'&&payload.sessionKey?payload.sessionKey:'vfp-session-'+enrollment.id+'-'+currentWeek+'-'+workoutIndex;if(!window.VFitnessProgramCore)throw new Error('The program save service is unavailable.');const result=await window.VFitnessProgramCore.completeWorkout({db:db,firebase:firebase,enrollment:enrollment,program:CURRENT_PROGRAM,week:currentWeek,workoutIndex:workoutIndex,log:log,sessionKey:sessionKey});setCompletedWorkouts(result.completedWorkouts);setCurrentWeek(result.currentWeek);setSelectedWorkout(null);enrollment.completedWorkouts=result.completedWorkouts;enrollment.completedWorkoutsV2=result.completedWorkouts;enrollment.completionSchema=window.VFitnessProgramCore.schema;enrollment.currentWeek=result.currentWeek;enrollment.status=result.status;if(result.status==='completed'){alert('Program complete. Your progress and workout history have been saved.');if(onComplete)onComplete(result);}return result;}`;
html=replaceArrowFunction(html,'const completeWorkout=async workoutDay=>',completeReplacement);
html=html.replace("onBack:()=>{try{window.history.back()}catch(e){}}","onBack:onBack||(()=>{window.VFitnessRouter&&window.VFitnessRouter.openMyPrograms();})");
html=html.replace('onCompleteWorkout:completeWorkout});','onCompleteWorkout:completeWorkout,onBrowse:()=>{window.VFitnessRouter&&window.VFitnessRouter.openStore();}});');

const replacements=[
  [/new MutationObserver\(function\(\)\{ clearTimeout\(window\.__vfIphoneFit\); window\.__vfIphoneFit = setTimeout\(fitMobile, 120\); \}\)\.observe\(document\.documentElement,\{childList:true,subtree:true\}\);/g,"window.addEventListener('vf:ui-rendered',()=>setTimeout(fitMobile,120));"],
  [/var mo=new MutationObserver\(function\(\)\{clearTimeout\(window\.__vfTick\); window\.__vfTick=setTimeout\(tick,80\);\}\);\s*document\.addEventListener\('DOMContentLoaded',function\(\)\{tick\(\); mo\.observe\(document\.getElementById\('root'\)\|\|document\.body,\{childList:true,subtree:true\}\);\}\);/g,"document.addEventListener('DOMContentLoaded',tick);window.addEventListener('vf:ui-rendered',()=>setTimeout(tick,80));"],
  [/new MutationObserver\(function\(\)\{hideClientUnsafeAdminText\(\);fixTapTargets\(\);\}\)\.observe\(document\.documentElement,\{childList:true,subtree:true\}\);/g,"window.addEventListener('vf:ui-rendered',()=>{hideClientUnsafeAdminText();fixTapTargets();});"],
  [/new MutationObserver\(injectForgotPassword\)\.observe\(document\.documentElement,\{childList:true,subtree:true\}\);\s*setInterval\(injectForgotPassword,1000\);/g,"window.addEventListener('vf:ui-rendered',()=>{setTimeout(injectForgotPassword,100);setTimeout(injectForgotPassword,800);});"],
  [/new MutationObserver\(polishPublicGalleryCopy\)\.observe\(document\.documentElement,\{childList:true,subtree:true,characterData:true\}\);\s*setInterval\(polishPublicGalleryCopy, 900\);/g,"window.addEventListener('vf:ui-rendered',()=>setTimeout(polishPublicGalleryCopy,80));"],
  [/new MutationObserver\(function\(\)\{ clearTimeout\(window\.__vfHumanCopyTick\); window\.__vfHumanCopyTick = setTimeout\(applyHumanCopy, 80\); \}\)\.observe\(document\.documentElement,\{childList:true,subtree:true,characterData:true\}\);\s*setInterval\(applyHumanCopy, 1100\);/g,"window.addEventListener('vf:ui-rendered',()=>setTimeout(applyHumanCopy,80));"],
  [/const mo=new MutationObserver\(\(\)=>\{clearTimeout\(window\.__vfitScanTimer\); window\.__vfitScanTimer=setTimeout\(scan,120\);\}\);\s*mo\.observe\(document\.documentElement,\{subtree:true,childList:true,characterData:true\}\);/g,"window.addEventListener('vf:ui-rendered',()=>setTimeout(scan,120));"],
  [/var mo=new MutationObserver\(function\(\)\{clearTimeout\(mo\._t\);mo\._t=setTimeout\(mark,300\);\}\);\s*mo\.observe\(document\.body,\{childList:true,subtree:true\}\);/g,"window.addEventListener('vf:ui-rendered',()=>setTimeout(mark,300));"]
];
for(const [pattern,replacement] of replacements)html=html.replace(pattern,replacement);
assert(!html.includes('MutationObserver'),'Legacy MutationObserver remains in built HTML');

html=html.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Inter[^']+'\);/g,'');
html=html.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Geist[^']+'\);/g,'');

fs.writeFileSync(file,html);
console.log('Applied VFitness modular stability, routing, transaction, observer, and error-boundary refactor');
