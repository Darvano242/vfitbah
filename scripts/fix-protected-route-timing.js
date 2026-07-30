const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const oldGuard="useEffect(()=>{if(loading||!window.VFitnessRouter)return;const route=window.VFitnessRouter.current();if(route.protected&&!user){try{sessionStorage.setItem('vfit_return_path',route.path);}catch(e){}setCurrentPage('login');window.VFitnessRouter.navigate('/login',{replace:true});}},[loading,user]);";
const newGuard="useEffect(()=>{if(!window.VFitnessRouter)return;const route=window.VFitnessRouter.current();if(!route.protected)return;const timer=setTimeout(()=>{const restoredUser=user||(window.auth&&window.auth.currentUser);if(restoredUser)return;try{sessionStorage.setItem('vfit_return_path',route.path);}catch(e){}setCurrentPage('login');window.VFitnessRouter.navigate('/login',{replace:true});},1800);return()=>clearTimeout(timer);},[user,currentPage]);";

html=html.split(oldGuard).join('');
html=html.split(newGuard).join('');

const appStart=html.indexOf('function VFitnessApp(){');
if(appStart<0)throw new Error('VFitnessApp boundary not found');
const loadingDeclaration='const[loading,setLoading]=useState(true);';
const loadingIndex=html.indexOf(loadingDeclaration,appStart);
if(loadingIndex<0)throw new Error('VFitnessApp loading state not found');
const insertAt=loadingIndex+loadingDeclaration.length;
html=html.slice(0,insertAt)+newGuard+html.slice(insertAt);

const nextComponent=html.indexOf('function ',appStart+20);
const appBlock=html.slice(appStart,nextComponent>appStart?nextComponent:html.length);
if(!appBlock.includes(newGuard))throw new Error('Protected route guard was not scoped to VFitnessApp');
if((html.match(/vfit_return_path/g)||[]).length!==1)throw new Error('Protected route guard was injected more than once');

fs.writeFileSync(file,html);
console.log('Scoped protected-route auth timing to VFitnessApp');
