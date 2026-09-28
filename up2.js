const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await b.newPage();
await pg.goto('https://www.vfitbah.com/',{waitUntil:'load'});await pg.waitForTimeout(2000);
const r=await pg.evaluate(async()=>{const cv=document.createElement('canvas');cv.width=40;cv.height=40;const blob=await new Promise(r=>cv.toBlob(r,'image/jpeg'));
 const fd=new FormData();fd.append('file',blob,'probe.jpg');const t0=Date.now();
 try{const res=await fetch('https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile',{method:'POST',body:fd});const j=await res.json();return {status:res.status,url:j.file_url,ms:Date.now()-t0};}catch(e){return {err:e.message};}});
console.log(JSON.stringify(r));await b.close();})();
