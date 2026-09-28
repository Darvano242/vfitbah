const {chromium,devices}=require('playwright');
const fs=require('fs'),path=require('path');
const BASE=process.env.BASE||'https://preview.vfitbah.com';
const MODE=process.env.MODE||'client';
const TAG=process.env.TAG||'t';
const UP='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
async function up(file){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(file)],{type:'image/jpeg'}),path.basename(file));const r=await fetch(UP,{method:'POST',body:fd});const j=await r.json().catch(()=>({}));console.log('UP',path.basename(file),(j.file_url||'').split('/').pop());}
const adminInit=()=>{const iv=setInterval(()=>{if(!window.firebase||!firebase.firestore)return;clearInterval(iv);const D=firebase.firestore.DocumentReference.prototype;const og=D.get;D.get=function(){const p=og.apply(this,arguments);const cu=firebase.auth().currentUser;if(cu&&this.path==='users/'+cu.uid){return p.then(s=>{const d=Object.assign({},s.data&&s.data()||{},{role:'admin',name:'QA Admin'});return{id:s.id,exists:true,data:()=>d,get:k=>d[k]};});}return p;};},5);};
(async()=>{
  const b=await chromium.launch();
  const mobile=process.env.VP!=='desktop';
  const ctx=await b.newContext(mobile?{...devices['iPhone 13']}:{viewport:{width:1440,height:1000}});
  const pg=await ctx.newPage();
  const errs=new Set();pg.on('pageerror',e=>errs.add(e.message.slice(0,120)));
  if(MODE==='admin')await pg.addInitScript(adminInit);
  await pg.goto(BASE+'/',{waitUntil:'load'});await pg.waitForTimeout(3000);
  const email='vfit.qa.t'+Date.now()+'@example.com';
  await pg.evaluate(async([e,m])=>{const c=await auth.createUserWithEmailAndPassword(e,'QaTest!2345');await db.collection('users').doc(c.user.uid).set({name:'Test Client',email:e,role:'client',onboardingCompleted:true},{merge:true});},[email,MODE]);
  await pg.waitForTimeout(4500);
  if(MODE==='admin'){await pg.evaluate(()=>window.__vf26SetPage&&window.__vf26SetPage('admin'));await pg.waitForTimeout(3000);}
  const shots=[];
  async function shot(name){await pg.evaluate(()=>window.scrollTo(0,0));await pg.waitForTimeout(700);const f=`/vercel/qa/out/${TAG}-${String(shots.length).padStart(2,'0')}-${name}.png`;await pg.screenshot({path:f,fullPage:true});shots.push([name,f]);}
  await shot('start');
  const tabs=await pg.evaluate(()=>{const row=document.querySelector('.vf26-seg')||document.querySelector('.mu-tabscroll');if(!row)return[];return [...row.querySelectorAll('button')].map(b=>b.textContent.trim());});
  console.log('TABS',tabs.join('|'));
  for(const t of tabs){await pg.evaluate(t=>{const row=document.querySelector('.vf26-seg')||document.querySelector('.mu-tabscroll');const b=[...row.querySelectorAll('button')].find(x=>x.textContent.trim()===t);b&&b.click();},t);await pg.waitForTimeout(2200);await shot(t.replace(/\W+/g,'_'));}
  // contact sheets: scale each full page to width 300, clip height 2200
  const pages=[];for(const [n,f] of shots){pages.push([n,'data:image/png;base64,'+fs.readFileSync(f).toString('base64')]);}
  const sheet=await b.newPage({deviceScaleFactor:1});
  for(let i=0;i<pages.length;i+=4){const grp=pages.slice(i,i+4);
    await sheet.setViewportSize({width:1280,height:900});
    await sheet.setContent(`<body style="margin:0;background:#888;display:flex;gap:8px;align-items:flex-start">${grp.map(([n,u])=>`<div style="width:314px"><div style="font:bold 14px sans-serif;background:#000;color:#fff;padding:2px">${n}</div><img src="${u}" style="width:314px;display:block"></div>`).join('')}</body>`);
    await sheet.waitForTimeout(300);const f=`/vercel/qa/out/sheet-${TAG}-${i/4}.jpg`;await sheet.screenshot({path:f,type:'jpeg',quality:55,fullPage:true,clip:undefined});await up(f);}
  console.log('ERRS',[...errs].join(' || '));
  await pg.evaluate(async()=>{try{await db.collection('users').doc(auth.currentUser.uid).delete();}catch(e){}try{await auth.currentUser.delete();}catch(e){}});
  await b.close();
})();
