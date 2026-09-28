const {chromium,devices}=require('playwright');
const fs=require('fs'),path=require('path');
const BASE=process.env.BASE||'https://preview.vfitbah.com';
const UP='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
async function up(file){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(file)],{type:'image/jpeg'}),path.basename(file));const r=await fetch(UP,{method:'POST',body:fd});const j=await r.json().catch(()=>({}));console.log('UP',path.basename(file),(j.file_url||'').split('/').pop());}
const adminInit=()=>{const iv=setInterval(()=>{if(!window.firebase||!firebase.firestore)return;clearInterval(iv);const D=firebase.firestore.DocumentReference.prototype;const og=D.get;D.get=function(){const p=og.apply(this,arguments);const cu=firebase.auth().currentUser;if(cu&&this.path==='users/'+cu.uid){return p.then(s=>{const d=Object.assign({},s.data&&s.data()||{},{role:'admin',name:'QA Admin'});return{id:s.id,exists:true,data:()=>d,get:k=>d[k]};});}return p;};},5);};
async function login(pg,admin){await pg.goto(BASE+'/',{waitUntil:'load'});await pg.waitForTimeout(3000);const email='vfit.qa.z'+Date.now()+'@example.com';await pg.evaluate(async(e)=>{const c=await auth.createUserWithEmailAndPassword(e,'QaTest!2345');await db.collection('users').doc(c.user.uid).set({name:'Test Client',email:e,role:'client',onboardingCompleted:true},{merge:true});},email);await pg.waitForTimeout(4500);}
async function cleanup(pg){await pg.evaluate(async()=>{try{await db.collection('users').doc(auth.currentUser.uid).delete();}catch(e){}try{await auth.currentUser.delete();}catch(e){}});}
(async()=>{
 const b=await chromium.launch();const shots=[];
 async function shot(pg,name,full){const f='/vercel/qa/out/'+name+'.jpg';await pg.screenshot({path:f,type:'jpeg',quality:60,fullPage:!!full});shots.push(f);}
 // client mobile
 {const ctx=await b.newContext({...devices['iPhone 13'],deviceScaleFactor:1});const pg=await ctx.newPage();const errs=new Set();pg.on('pageerror',e=>errs.add(e.message.slice(0,100)));
  await login(pg,false);await shot(pg,'c-overview',true);
  console.log('CLIENT TABS',await pg.$$eval('.vf26-tabstrip button',x=>x.map(b=>b.textContent).join('|')));
  console.log('NAV',await pg.$$eval('.mu-bottomnav button',x=>x.map(b=>b.textContent).join('|')));
  await pg.evaluate(()=>{window.__vf26SetPage('pricing');});await pg.waitForTimeout(2500);
  const btn=await pg.$('.vf26-pkg .vf26-btn');console.log('pkgbtn',!!btn);if(btn){await btn.click();await pg.waitForTimeout(2500);await shot(pg,'c-checkout1');
   const tr=await pg.$('.vf26-co-tr');if(tr){await tr.click();await pg.waitForTimeout(4000);await shot(pg,'c-checkout2');}}
  console.log('CERRS',[...errs].join(' || '));await cleanup(pg);await ctx.close();}
 // admin desktop gallery upload
 {const ctx=await b.newContext({viewport:{width:1440,height:950}});const pg=await ctx.newPage();pg.on('dialog',d=>{console.log('DIALOG',d.message().slice(0,80));d.dismiss();});await pg.addInitScript(adminInit);
  await login(pg,true);await pg.evaluate(()=>window.__vf26SetPage('admin'));await pg.waitForTimeout(3000);await shot(pg,'a-home');
  console.log('ADMIN TABS',await pg.$$eval('.vf26-rail-item',x=>x.map(b=>b.textContent).join('|')));
  await pg.evaluate(()=>{const b=[...document.querySelectorAll('.vf26-rail-item')].find(x=>/Gallery/.test(x.textContent));b&&b.click();});await pg.waitForTimeout(2500);
  await pg.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Add Image/.test(x.textContent));b&&b.click();});await pg.waitForTimeout(1200);
  const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAIAAAD91JpzAAAAFklEQVR4nGNkYGD4z8DAwMDAxMDAAAAQFAIBxAwY1QAAAABJRU5ErkJggg==','base64');fs.writeFileSync('/vercel/qa/t.png',png);
  const inp=await pg.$('.fixed input[type=file]');console.log('fileinput',!!inp);
  if(inp){await inp.setInputFiles('/vercel/qa/t.png');const t0=Date.now();for(let i=0;i<30;i++){await pg.waitForTimeout(500);const up=await pg.evaluate(()=>/Uploading/.test(document.querySelector('.fixed')?.innerText||''));if(!up)break;}console.log('UPLOAD ms',Date.now()-t0);await shot(pg,'a-gallery-modal');
   console.log('ADD ENABLED',await pg.evaluate(()=>{const b=[...document.querySelectorAll('.fixed button')].find(x=>/Add to Gallery/.test(x.textContent));return b?!b.disabled:null;}));
   console.log('IMG',await pg.evaluate(()=>{const i=document.querySelector('.fixed img');return i?i.src.slice(0,90):'none';}));}
  await cleanup(pg);await ctx.close();}
 await b.close();for(const f of shots)await up(f);
})();
