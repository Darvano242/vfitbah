const { chromium } = require('playwright'); const fs=require('fs'); const {spawn}=require('child_process');
const [,,w,h,n,outDir,ts]=process.argv; fs.mkdirSync(outDir,{recursive:true});
const srv=spawn('node',[require('path').join(__dirname,'serve.cjs'),__dirname,'4231']);
(async()=>{await new Promise(r=>setTimeout(r,500));
const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:+w,height:+h}}); p.on('console',m=>console.log('console',m.text())); p.on('pageerror',e=>console.log('err',e.message));
await p.goto(`http://localhost:4231/barbell-scene.html?w=${w}&h=${h}&ss=2`); await p.waitForFunction('window.ready',null,{timeout:60000});
const list= ts? ts.split(',').map(Number) : Array.from({length:+n},(_,i)=>i/(+n-1));
let i=0; const t0=Date.now();
for(const t of list){const d=await p.evaluate(t=>window.grab(t,0.74),t); fs.writeFileSync(`${outDir}/f${String(i).padStart(3,'0')}.webp`,Buffer.from(d.split(',')[1],'base64')); i++;}
console.log('done',i,'frames',(Date.now()-t0)/1000,'s'); await b.close(); srv.kill();})();
