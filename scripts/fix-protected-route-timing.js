const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const oldGuard="useEffect(()=>{if(loading||!window.VFitnessRouter)return;const route=window.VFitnessRouter.current();if(route.protected&&!user){try{sessionStorage.setItem('vfit_return_path',route.path);}catch(e){}setCurrentPage('login');window.VFitnessRouter.navigate('/login',{replace:true});}},[loading,user]);";
const newGuard="useEffect(()=>{if(!window.VFitnessRouter)return;const route=window.VFitnessRouter.current();if(!route.protected)return;const timer=setTimeout(()=>{const restoredUser=user||(window.auth&&window.auth.currentUser);if(restoredUser)return;try{sessionStorage.setItem('vfit_return_path',route.path);}catch(e){}setCurrentPage('login');window.VFitnessRouter.navigate('/login',{replace:true});},1800);return()=>clearTimeout(timer);},[user,currentPage]);";

if(!html.includes(oldGuard)&&!html.includes(newGuard))throw new Error('Protected route guard marker not found');
html=html.replace(oldGuard,newGuard);
fs.writeFileSync(file,html);
console.log('Applied resilient protected-route auth timing');
