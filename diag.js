const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const pg=await (await b.newContext({viewport:{width:390,height:844}})).newPage();
await pg.goto('https://preview.vfitbah.com/',{waitUntil:'load'});await pg.waitForTimeout(4000);
const r=await pg.evaluate(async()=>{const out=[];for(const y of [0,2000,3000,4000,6000,9000]){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,400));const el=document.querySelector('.vf26-how3');const rc=el&&el.getBoundingClientRect();out.push({ask:y,sy:scrollY,sh:document.documentElement.scrollHeight,bodyOv:getComputedStyle(document.body).overflow,how:rc?Math.round(rc.top):null,hidden:document.querySelectorAll('.vf26-reveal:not(.is-in)').length});}return out;});
console.log(JSON.stringify(r));await b.close();})();
