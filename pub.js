const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const BASE=process.env.BASE||'https://preview.vfitbah.com';
const UP='https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/integration-endpoints/Core/UploadFile';
async function up(file){const fd=new FormData();fd.append('file',new Blob([fs.readFileSync(file)],{type:'image/jpeg'}),path.basename(file));const r=await fetch(UP,{method:'POST',body:fd});const j=await r.json().catch(()=>({}));console.log('UP',path.basename(file),(j.file_url||'').split('/').pop());}
(async()=>{const b=await chromium.launch();const W=+(process.env.W||1440),H=W<600?844:900;
 const ctx=await b.newContext({viewport:{width:W,height:H},deviceScaleFactor:1});const pg=await ctx.newPage();const errs=new Set();pg.on('pageerror',e=>errs.add(e.message.slice(0,90)));
 await pg.goto(BASE+'/',{waitUntil:'load'});await pg.waitForTimeout(3500);
 const pages=(process.env.P||'home,pricing,trainers,results,about,contact').split(',');const shots=[];
 for(const p of pages){await pg.evaluate(p=>window.__vf26SetPage(p),p);await pg.waitForTimeout(1800);
  // reveal all
  await pg.evaluate(async()=>{for(let y=0;y<document.body.scrollHeight;y+=500){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,60));}window.scrollTo(0,0);});await pg.waitForTimeout(900);
  const f='/vercel/qa/out/'+p+'-'+W+'.png';await pg.screenshot({path:f,fullPage:true});shots.push([p,f]);}
 const sheet=await b.newPage({deviceScaleFactor:1});const colW=W<600?260:420;
 for(let i=0;i<shots.length;i+=3){const g=shots.slice(i,i+3);await sheet.setViewportSize({width:colW*3+32,height:800});
  await sheet.setContent(`<body style="margin:0;background:#777;display:flex;gap:8px;align-items:flex-start">${g.map(([n,f])=>`<div style="width:${colW}px"><div style="font:bold 13px sans-serif;background:#000;color:#fff;padding:2px">${n}</div><img src="data:image/png;base64,${fs.readFileSync(f).toString('base64')}" style="width:${colW}px;display:block"></div>`).join('')}</body>`);
  await sheet.waitForTimeout(300);const o='/vercel/qa/out/pub-'+W+'-'+i/3+'.jpg';await sheet.screenshot({path:o,type:'jpeg',quality:60,fullPage:true});await up(o);}
 console.log('ERRS',[...errs].join(' | '));await b.close();})();
