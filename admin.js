const {chromium}=require('playwright');
const BASE=process.env.BASE||'https://preview.vfitbah.com';
const UP='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
const fs=require('fs');
async function up(file){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(file)],{type:'image/jpeg'}),require('path').basename(file));const r=await fetch(UP,{method:'POST',body:fd});const j=await r.json().catch(()=>({}));console.log('UP',file,j.file_url||JSON.stringify(j).slice(0,200));}
const init=()=>{
  const ts=(n)=>({toDate:()=>new Date(Date.now()-n*864e5)});
  const PK=[
   {id:'p1',clientId:'c1',clientName:'Darvano',packageName:'1 on 1 Training - 4 sessions',sessionsTotal:4,sessionsRemaining:4,sessionsCompleted:0,assignedTrainerId:'darvano',assignedTrainerName:'DARVANO',basePrice:120,createdAt:ts(0)},
   {id:'p2',clientId:'c2',clientName:'Joel Russell',packageName:'Semi Personal Training - 8 sessions',sessionsTotal:8,sessionsRemaining:3,sessionsCompleted:5,assignedTrainerId:'darvano',assignedTrainerName:'DARVANO',basePrice:173,createdAt:ts(17),autoRenewalEnabled:true},
   {id:'p3',clientId:'c3',clientName:'Taivon',packageName:'Semi Personal Training - 12 sessions',sessionsTotal:12,sessionsRemaining:6,sessionsCompleted:6,assignedTrainerId:'darvano',assignedTrainerName:'DARVANO',basePrice:240,discountPercentage:10,createdAt:ts(20)},
   {id:'p4',clientId:'c4',clientName:'Christina Almonor',packageName:'Semi Personal Training - 12 sessions',sessionsTotal:12,sessionsRemaining:1,sessionsCompleted:11,assignedTrainerId:'darvano',assignedTrainerName:'DARVANO',basePrice:240,status:'paused',createdAt:ts(40)},
   {id:'p5',clientId:'c5',clientName:'Kia Rolle',packageName:'1 on 1 Training - 8 sessions',sessionsTotal:8,sessionsRemaining:8,sessionsCompleted:0,assignedTrainerId:'kevin_mackey',assignedTrainerName:'Kevin Mackey',basePrice:240,createdAt:ts(2)}];
  const snap=(arr)=>{const docs=arr.map(o=>({id:o.id,exists:true,data:()=>o,get:k=>o[k],ref:{id:o.id}}));return{docs,size:docs.length,empty:!docs.length,forEach:f=>docs.forEach(f),docChanges:()=>[]};};
  const iv=setInterval(()=>{if(!window.firebase||!firebase.firestore)return;clearInterval(iv);
    const F=firebase.firestore;const D=F.DocumentReference.prototype,Q=F.Query.prototype;
    const og=D.get;D.get=function(){const p=og.apply(this,arguments);if(this.parent&&this.parent.id==='users'&&window.auth&&auth.currentUser&&this.id===auth.currentUser.uid){return p.then(s=>{const d=Object.assign({},s.data&&s.data()||{},{role:'admin',name:'QA Admin'});return{id:s.id,exists:true,data:()=>d,get:k=>d[k]};});}return p;};
    const col=q=>{try{return q.id||q._delegate._query.path.segments.slice(-1)[0];}catch(e){return'';}};
    const qg=Q.get;Q.get=function(){const c=col(this);if(c==='packages')return Promise.resolve(snap(PK));if(c==='users')return Promise.resolve(snap(PK.map(p=>({id:p.clientId,name:p.clientName,role:'client',email:p.clientId+'@x.com'}))));return qg.apply(this,arguments).catch(()=>snap([]));};
    const qs=Q.onSnapshot;Q.onSnapshot=function(){const c=col(this);const cb=[...arguments].find(a=>typeof a==='function');if(c==='packages'&&cb){setTimeout(()=>cb(snap(PK)),50);return()=>{};}return qs.apply(this,arguments);};
  },5);
};
(async()=>{
  const b=await chromium.launch();
  for(const [w,hh,tag] of [[1440,1000,'d'],[390,844,'m']]){
  const ctx=await b.newContext({viewport:{width:w,height:hh},deviceScaleFactor:1});
  const pg=await ctx.newPage();pg.on('pageerror',e=>console.log('PAGEERR',e.message.slice(0,150)));
  await pg.addInitScript(init);
  await pg.goto(BASE+'/',{waitUntil:'networkidle'});
  const email='vfit.qa.'+Date.now()+'@example.com';
  await pg.evaluate(async(e)=>{await auth.createUserWithEmailAndPassword(e,'QaTest!2345');},email);
  await pg.waitForTimeout(3000);
  await pg.evaluate(()=>{window.__vf26SetPage&&window.__vf26SetPage('admin');});
  await pg.waitForTimeout(3000);
  await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Package/i.test(x.textContent)&&x.textContent.length<40);b&&b.click();});
  await pg.waitForTimeout(2500);
  await pg.screenshot({path:`/vercel/qa/out/pk-list-${tag}.jpg`,type:'jpeg',quality:70});
  await pg.evaluate(()=>{const b=document.querySelector('.vf26-pkg-trainer');b&&b.click();});
  await pg.waitForTimeout(2000);
  const el=await pg.$('.vf26-pkg-group');if(el)await el.scrollIntoViewIfNeeded();
  await pg.evaluate(()=>{const g=document.querySelector('.vf26-pkg-back');if(g)window.scrollTo(0,g.getBoundingClientRect().top+scrollY-90);});
  await pg.waitForTimeout(800);
  await pg.screenshot({path:`/vercel/qa/out/pk-cards-${tag}.jpg`,type:'jpeg',quality:70});
  console.log(tag,'cards',await pg.$$eval('.vf26-pkg',x=>x.length),'opts',await pg.$$eval('.vf26-pkg select option',x=>[...new Set(x.map(o=>o.textContent))].join('|')));
  await pg.evaluate(async()=>{try{await auth.currentUser.delete();}catch(e){console.log(e.message)}});
  await ctx.close();}
  await b.close();
  for(const f of fs.readdirSync('/vercel/qa/out'))await up('/vercel/qa/out/'+f);
})();
