const {chromium,devices}=require('playwright');
const BASE=process.env.BASE||'https://www.vfitbah.com';
const UP='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
const fs=require('fs');
async function up(file){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(file)],{type:'image/jpeg'}),require('path').basename(file));const r=await fetch(UP,{method:'POST',body:fd});const j=await r.json().catch(()=>({}));console.log('UP',file,j.file_url||'');}
(async()=>{
  const b=await chromium.launch();
  const ctx=await b.newContext({...devices['iPhone 13']});
  const pg=await ctx.newPage();
  pg.on('pageerror',e=>console.log('PAGEERR',e.message.slice(0,300)));
  pg.on('console',m=>{if(m.type()==='error'||/rror|Role|redirect|logged/i.test(m.text()))console.log('CON',m.type(),m.text().slice(0,250));});
  await pg.goto(BASE+'/',{waitUntil:'load'});await pg.waitForTimeout(3000);
  const email='vfit.qa.c'+Date.now()+'@example.com',pw='QaTest!2345';
  console.log('CREATE',await pg.evaluate(async([e,p])=>{try{const c=await auth.createUserWithEmailAndPassword(e,p);await db.collection('users').doc(c.user.uid).set({name:'QA Client',email:e,role:'client',onboardingCompleted:true,createdAt:firebase.firestore.FieldValue.serverTimestamp()});await auth.signOut();return 'ok';}catch(x){return x.message}},[email,pw]));
  await pg.goto(BASE+'/login',{waitUntil:'load'});await pg.waitForTimeout(3000);
  await pg.evaluate(()=>window.scrollTo(0,400));
  await pg.fill('input[type=email]',email);await pg.fill('input[type=password]',pw);
  await pg.click('button:has-text("SIGN IN"), button:has-text("Sign In"), button[type=submit]');
  for(const t of [1500,4000,8000]){await pg.waitForTimeout(t===1500?1500:t-(t===4000?1500:4000));
    const info=await pg.evaluate(()=>{const root=document.getElementById('root')||document.body;const shells=[...document.querySelectorAll('[class*="vf26-shell"]')].map(e=>e.className+':'+e.getBoundingClientRect().height|0);return {url:location.pathname,scroll:scrollY,h:document.body.scrollHeight,shells,text:(document.querySelector('main')||root).innerText.slice(0,300).replace(/\n+/g,' | ')};});
    console.log('T',t,JSON.stringify(info));
    await pg.screenshot({path:`/vercel/qa/out/cl-${t}.jpg`,type:'jpeg',quality:60,fullPage:true});
  }
  // dump first children of app root
  console.log('DOM',await pg.evaluate(()=>{const r=document.getElementById('root');return r?[...r.querySelectorAll(':scope > * > *')].slice(0,12).map(e=>e.tagName+'.'+(e.className||'').toString().slice(0,80)+' h='+(e.getBoundingClientRect().height|0)).join('\n'):'no root';}));
  await pg.evaluate(async()=>{try{await auth.currentUser.delete();}catch(e){}});
  await b.close();
  for(const f of fs.readdirSync('/vercel/qa/out'))await up('/vercel/qa/out/'+f);
})();
