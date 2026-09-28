const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
pg.on('console',m=>{if(/Storage|storage|upload/i.test(m.text()))console.log('CON',m.text().slice(0,300));});
await pg.goto('https://www.vfitbah.com/',{waitUntil:'load'});await pg.waitForTimeout(3000);
const email='vfit.qa.u'+Date.now()+'@example.com';
const r=await pg.evaluate(async(e)=>{const out={};const c=await auth.createUserWithEmailAndPassword(e,'QaTest!2345');
 out.bucket=firebase.app().options.storageBucket;out.hasStorage=!!storage;
 const cv=document.createElement('canvas');cv.width=40;cv.height=40;const blob=await new Promise(r=>cv.toBlob(r,'image/png'));const file=new File([blob],'t.png',{type:'image/png'});
 const t0=Date.now();
 try{const ref=storage.ref().child('gallery/qa_'+Date.now()+'.png');
   const p=ref.put(file);const res=await Promise.race([p.then(()=>ref.getDownloadURL()),new Promise((_,rej)=>setTimeout(()=>rej(new Error('TIMEOUT 20s')),20000))]);out.url=String(res).slice(0,120);try{await ref.delete();}catch(x){}}catch(x){out.err=(x.code||'')+' '+x.message;}
 out.ms=Date.now()-t0;try{await auth.currentUser.delete();}catch(x){}return out;},email);
console.log(JSON.stringify(r));await b.close();})();
