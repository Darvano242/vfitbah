const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const packageStart=html.indexOf('function PackageManagement({clients,loadAdminData})');
const packageEnd=html.indexOf('function WorkoutPlanBuilder({clients})',packageStart);
if(packageStart<0||packageEnd<0)throw new Error('Package Management boundaries not found');
let section=html.slice(packageStart,packageEnd);

// Load active and paused packages. Existing records are migrated to a 45-day expiry.
const activeQuery="const snapshot=await db.collection('packages').where('status','==','active').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.sessionsRemaining||0)>=0);";
const migratedQuery="const snapshot=await db.collection('packages').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.status==='active'||pkg.status==='paused')&&(pkg.sessionsRemaining||0)>=0);const expiryWrites=[];pkgs.forEach(pkg=>{const started=pkg.purchaseDate?.toDate?.()||pkg.createdAt?.toDate?.();if(!started)return;const target=new Date(started.getTime()+45*86400000);const current=pkg.expiryDate?.toDate?.();if(!current||current.getTime()<target.getTime()){expiryWrites.push(db.collection('packages').doc(pkg.id).set({expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(target),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}));pkg.expiryDays=45;pkg.expiryDate=firebase.firestore.Timestamp.fromDate(target);}});if(expiryWrites.length)await Promise.all(expiryWrites);";
if(section.includes(activeQuery))section=section.replace(activeQuery,migratedQuery);

// Add pause/resume behavior once.
const adjustMarker='const adjustSessions=async(packageId,adjustment,packageData)=>';
const pauseLogic=`const togglePackagePause=async pkg=>{try{if(pkg.status==='paused'){const pausedAt=pkg.pauseStartedAt?.toDate?.()||pkg.pausedAt?.toDate?.()||new Date();const pausedMs=Math.max(0,Date.now()-pausedAt.getTime());const currentExpiry=pkg.expiryDate?.toDate?.()||new Date(Date.now()+45*86400000);const extendedExpiry=new Date(currentExpiry.getTime()+pausedMs);await db.collection('packages').doc(pkg.id).set({status:'active',resumedAt:firebase.firestore.FieldValue.serverTimestamp(),expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(extendedExpiry),pauseStartedAt:firebase.firestore.FieldValue.delete(),pausedAt:firebase.firestore.FieldValue.delete(),pauseReason:firebase.firestore.FieldValue.delete(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_resumed',note:'Package resumed. Expiry extended by '+Math.ceil(pausedMs/86400000)+' paused day(s).',createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('✅ Package resumed for '+(pkg.clientName||'client')+'.\\nThe expiry date was extended for the paused time.');}else{const reason=prompt('Why is this package being paused?\\n\\nExamples: travel, illness, family emergency, work schedule.','Travel / emergency');if(reason===null)return;await db.collection('packages').doc(pkg.id).set({status:'paused',pauseReason:(reason||'Temporary pause').trim(),pauseStartedAt:firebase.firestore.FieldValue.serverTimestamp(),pausedAt:firebase.firestore.FieldValue.serverTimestamp(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_paused',note:(reason||'Temporary pause').trim(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('⏸️ Package paused for '+(pkg.clientName||'client')+'.\\nSessions cannot be logged until it is resumed.');}loadPackages();if(loadAdminData)loadAdminData();}catch(err){alert('Could not update package pause: '+err.message);}};`;
if(section.includes(adjustMarker)&&!section.includes('const togglePackagePause=async pkg=>'))section=section.replace(adjustMarker,pauseLogic+adjustMarker);
if(!section.includes('const togglePackagePause=async pkg=>'))throw new Error('Pause logic was not inserted');

// Block all session changes while paused.
const sessionStart="const adjustSessions=async(packageId,adjustment,packageData)=>{const currentRemaining=packageData.sessionsRemaining||0;";
if(section.includes(sessionStart))section=section.replace(sessionStart,"const adjustSessions=async(packageId,adjustment,packageData)=>{if(packageData.status==='paused'){alert('This package is paused. Resume it before logging or adding sessions.');return;}const currentRemaining=packageData.sessionsRemaining||0;");

// Premium full-width package action stack.
section=section.replace('React.createElement("div",{className:"grid grid-cols-2 gap-2"},React.createElement("button",{onClick:()=>adjustSessions(pkg.id,-1,pkg),className:"px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1",style:{background:\'rgba(34,197,94,.15)\',color:\'#86efac\'}},React.createElement(Ico,{name:"check",size:15})," Log Session"),React.createElement("button",{onClick:()=>adjustSessions(pkg.id,1,pkg),className:"px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1",style:{background:\'rgba(61,125,255,.15)\',color:\'#9cc0ff\'}},React.createElement(Ico,{name:"plus",size:15})," Add Session"))',
'React.createElement("div",{className:"vf-package-actions"},React.createElement("button",{onClick:()=>adjustSessions(pkg.id,-1,pkg),className:"vf-package-action vf-package-action--emerald"},React.createElement(Ico,{name:"check",size:21,strokeWidth:2.25}),React.createElement("span",null,"Log Session")),React.createElement("button",{onClick:()=>adjustSessions(pkg.id,1,pkg),className:"vf-package-action vf-package-action--blue"},React.createElement(Ico,{name:"plus",size:22,strokeWidth:2.15}),React.createElement("span",null,"Add Session")))');

// Place a visible Pause/Resume button before Auto Renewal on every card.
const pauseButton=`React.createElement("button",{onClick:()=>togglePackagePause(pkg),className:"vf-package-action "+(pkg.status==='paused'?'vf-package-action--resume':'vf-package-action--bronze')},React.createElement(Ico,{name:pkg.status==='paused'?'play':'pause',size:21,strokeWidth:2.15}),React.createElement("span",null,pkg.status==='paused'?'Resume Package':'Pause Package')),`;
if(!section.includes("pkg.status==='paused'?'Resume Package':'Pause Package'")){
  const autoStart='React.createElement("button",{onClick:()=>toggleAutoRenewal(pkg)';
  if(!section.includes(autoStart))throw new Error('Auto Renewal action not found');
  section=section.replace(autoStart,pauseButton+autoStart);
}
if(!section.includes("pkg.status==='paused'?'Resume Package':'Pause Package'"))throw new Error('Pause button was not inserted');

const oldAuto=`React.createElement("button",{onClick:()=>toggleAutoRenewal(pkg),className:"w-full mt-2 px-3 py-2 rounded-lg text-sm font-bold flex items-center justify-center gap-1",style:pkg.autoRenewalEnabled?{background:'rgba(45,212,191,.16)',color:'#7dd3fc',border:'1px solid rgba(45,212,191,.28)'}:{background:'rgba(245,158,11,.12)',color:'#fcd34d',border:'1px solid rgba(245,158,11,.22)'}},React.createElement(Ico,{name:pkg.autoRenewalEnabled?"refresh-cw":"repeat",size:15}),pkg.autoRenewalEnabled?'Auto Renewal On':'Enable Auto Renewal')`;
const newAuto=`React.createElement("button",{onClick:()=>toggleAutoRenewal(pkg),className:"vf-package-action "+(pkg.autoRenewalEnabled?'vf-package-action--renewal-on':'vf-package-action--gold')},React.createElement(Ico,{name:pkg.autoRenewalEnabled?"refresh-cw":"repeat",size:21,strokeWidth:2.05}),React.createElement("span",null,pkg.autoRenewalEnabled?'Auto Renewal On':'Enable Auto Renewal'))`;
if(section.includes(oldAuto))section=section.replace(oldAuto,newAuto);

const oldInvoice=`React.createElement("button",{onClick:()=>downloadPackageInvoice(pkg,client),className:"w-full mt-2 px-3 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1",style:{background:'rgba(255,255,255,.06)',color:'#e5e7eb',border:'1px solid var(--mu-border)'}},React.createElement(Ico,{name:"file-text",size:15})," Download Invoice")`;
const newInvoice=`React.createElement("button",{onClick:()=>downloadPackageInvoice(pkg,client),className:"vf-package-action vf-package-action--graphite"},React.createElement(Ico,{name:"file-text",size:21,strokeWidth:2}),React.createElement("span",null,"Download Invoice"))`;
if(section.includes(oldInvoice))section=section.replace(oldInvoice,newInvoice);

html=html.slice(0,packageStart)+section+html.slice(packageEnd);

// Apple Fitness / Wallet-inspired glossy action styling.
const premiumActionStyles=`
<style id="vf-package-action-premium-styles">
.vf-package-actions{display:flex;flex-direction:column;gap:12px;margin-top:2px}
.vf-package-action{position:relative;isolation:isolate;width:100%;min-height:58px;margin-top:12px;padding:0 20px;border-radius:16px;border:1px solid rgba(255,255,255,.16);display:flex;align-items:center;justify-content:center;gap:11px;overflow:hidden;color:#fff;font-family:'Geist','Inter',system-ui,sans-serif;font-size:16px;font-weight:760;letter-spacing:-.018em;line-height:1;cursor:pointer;-webkit-tap-highlight-color:transparent;transform:translateZ(0);transition:transform .18s cubic-bezier(.2,.8,.2,1),filter .18s ease,box-shadow .18s ease,border-color .18s ease;text-shadow:0 1px 1px rgba(0,0,0,.24);box-shadow:inset 0 1px 0 rgba(255,255,255,.24),inset 0 -1px 0 rgba(0,0,0,.22),0 11px 26px -14px rgba(0,0,0,.9),0 3px 8px rgba(0,0,0,.34)}
.vf-package-actions>.vf-package-action{margin-top:0}
.vf-package-action::before{content:"";position:absolute;z-index:-1;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.22) 0%,rgba(255,255,255,.07) 22%,transparent 48%);pointer-events:none}
.vf-package-action::after{content:"";position:absolute;z-index:-1;left:7%;right:7%;top:0;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.78),transparent);opacity:.8;pointer-events:none}
.vf-package-action svg{flex:0 0 auto;filter:drop-shadow(0 1px 1px rgba(0,0,0,.28));transition:transform .18s cubic-bezier(.2,.8,.2,1)}
.vf-package-action span{display:block;transform:translateY(-.25px)}
.vf-package-action--emerald{background:linear-gradient(145deg,#155d42 0%,#0d4c35 48%,#083a29 100%);border-color:rgba(91,242,173,.28);color:#9ff2c7;box-shadow:inset 0 1px 0 rgba(206,255,231,.28),inset 0 -12px 20px rgba(0,32,21,.24),0 13px 28px -15px rgba(17,185,110,.62),0 3px 8px rgba(0,0,0,.4)}
.vf-package-action--blue{background:linear-gradient(145deg,#244b8f 0%,#1a376d 50%,#122951 100%);border-color:rgba(116,165,255,.3);color:#b7d0ff;box-shadow:inset 0 1px 0 rgba(219,233,255,.25),inset 0 -12px 20px rgba(5,20,48,.28),0 13px 28px -15px rgba(48,106,224,.62),0 3px 8px rgba(0,0,0,.4)}
.vf-package-action--bronze{background:linear-gradient(145deg,#6a4c20 0%,#503816 50%,#39270f 100%);border-color:rgba(255,190,64,.38);color:#ffd551;box-shadow:inset 0 1px 0 rgba(255,235,169,.28),inset 0 -12px 20px rgba(55,31,3,.3),0 13px 28px -15px rgba(219,139,15,.54),0 3px 8px rgba(0,0,0,.42)}
.vf-package-action--gold{background:linear-gradient(145deg,#5a421d 0%,#443115 50%,#30220e 100%);border-color:rgba(255,198,71,.32);color:#ffdc68;box-shadow:inset 0 1px 0 rgba(255,239,183,.26),inset 0 -12px 20px rgba(48,28,4,.28),0 13px 28px -15px rgba(220,151,24,.46),0 3px 8px rgba(0,0,0,.42)}
.vf-package-action--resume,.vf-package-action--renewal-on{background:linear-gradient(145deg,#15594d 0%,#0d443b 50%,#092f29 100%);border-color:rgba(73,231,199,.3);color:#91f0d4;box-shadow:inset 0 1px 0 rgba(205,255,244,.24),inset 0 -12px 20px rgba(1,40,32,.25),0 13px 28px -15px rgba(29,190,151,.5),0 3px 8px rgba(0,0,0,.4)}
.vf-package-action--graphite{background:linear-gradient(145deg,rgba(45,47,52,.94) 0%,rgba(29,31,35,.96) 52%,rgba(21,23,27,.98) 100%);border-color:rgba(255,255,255,.13);color:#f1f3f6;backdrop-filter:blur(18px) saturate(135%);-webkit-backdrop-filter:blur(18px) saturate(135%);box-shadow:inset 0 1px 0 rgba(255,255,255,.2),inset 0 -10px 18px rgba(0,0,0,.22),0 13px 28px -15px rgba(0,0,0,.92),0 3px 8px rgba(0,0,0,.42)}
@media (hover:hover){.vf-package-action:hover{transform:translateY(-2px) scale(1.005);filter:brightness(1.08) saturate(1.05);border-color:rgba(255,255,255,.26);box-shadow:inset 0 1px 0 rgba(255,255,255,.3),inset 0 -1px 0 rgba(0,0,0,.2),0 17px 34px -15px rgba(0,0,0,.9),0 5px 12px rgba(0,0,0,.4)}.vf-package-action:hover svg{transform:scale(1.06)}}
.vf-package-action:active{transform:translateY(1px) scale(.985);filter:brightness(.96);transition-duration:.08s;box-shadow:inset 0 2px 5px rgba(0,0,0,.22),inset 0 1px 0 rgba(255,255,255,.15),0 5px 12px -8px rgba(0,0,0,.8)}
.vf-package-action:focus-visible{outline:none;box-shadow:0 0 0 3px rgba(90,145,255,.3),inset 0 1px 0 rgba(255,255,255,.25),0 13px 28px -15px rgba(0,0,0,.9)}
@media(max-width:480px){.vf-package-action{min-height:58px;border-radius:15px;font-size:16px;padding:0 17px;gap:10px}}
@media(prefers-reduced-motion:reduce){.vf-package-action,.vf-package-action svg{transition:none!important}}
</style>`;
if(!html.includes('vf-package-action-premium-styles'))html=html.replace('</head>',premiumActionStyles+'\n</head>');

// New packages receive 45 days immediately.
const expiryMarker='expiryDate:null});';
if(html.includes(expiryMarker))html=html.replace(expiryMarker,"expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(new Date(Date.now()+45*86400000))});");
html=html.replaceAll('30-day','45-day').replaceAll('30 days','45 days').replaceAll('30*DAY','45*DAY');

fs.writeFileSync(file,html);
console.log('Applied 45-day expiry, pause/resume, and premium package action styling');