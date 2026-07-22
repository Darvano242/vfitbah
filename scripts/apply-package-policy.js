const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const packageStart=html.indexOf('function PackageManagement({clients,loadAdminData})');
const packageEnd=html.indexOf('function AddPackageForm({clients,onPackageAdded})',packageStart);
if(packageStart<0||packageEnd<0)throw new Error('Package Management markers not found');
let section=html.slice(packageStart,packageEnd);

// Load both active and paused packages, and migrate all surviving packages to a 45-day expiry.
const activeQuery="const snapshot=await db.collection('packages').where('status','==','active').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.sessionsRemaining||0)>=0);";
const migratedQuery="const snapshot=await db.collection('packages').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.status==='active'||pkg.status==='paused')&&(pkg.sessionsRemaining||0)>=0);const expiryWrites=[];pkgs.forEach(pkg=>{const started=pkg.purchaseDate?.toDate?.()||pkg.createdAt?.toDate?.();if(!started)return;const target=new Date(started.getTime()+45*86400000);const current=pkg.expiryDate?.toDate?.();if(!current||current.getTime()<target.getTime()){expiryWrites.push(db.collection('packages').doc(pkg.id).set({expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(target),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}));pkg.expiryDays=45;pkg.expiryDate=firebase.firestore.Timestamp.fromDate(target);}});if(expiryWrites.length)await Promise.all(expiryWrites);";
if(section.includes(activeQuery))section=section.replace(activeQuery,migratedQuery);

// Add package pause and resume logic once for every package, existing or new.
const adjustMarker='const adjustSessions=async(packageId,adjustment,packageData)=>';
const pauseLogic=`const togglePackagePause=async pkg=>{try{if(pkg.status==='paused'){const pausedAt=pkg.pauseStartedAt?.toDate?.()||pkg.pausedAt?.toDate?.()||new Date();const pausedMs=Math.max(0,Date.now()-pausedAt.getTime());const currentExpiry=pkg.expiryDate?.toDate?.()||new Date(Date.now()+45*86400000);const extendedExpiry=new Date(currentExpiry.getTime()+pausedMs);await db.collection('packages').doc(pkg.id).set({status:'active',resumedAt:firebase.firestore.FieldValue.serverTimestamp(),expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(extendedExpiry),pauseStartedAt:firebase.firestore.FieldValue.delete(),pausedAt:firebase.firestore.FieldValue.delete(),pauseReason:firebase.firestore.FieldValue.delete(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_resumed',note:'Package resumed. Expiry extended by '+Math.ceil(pausedMs/86400000)+' paused day(s).',createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('✅ Package resumed for '+(pkg.clientName||'client')+'.\\nThe expiry date was extended for the paused time.');}else{const reason=prompt('Why is this package being paused?\\n\\nExamples: travel, illness, family emergency, work schedule.','Travel / emergency');if(reason===null)return;await db.collection('packages').doc(pkg.id).set({status:'paused',pauseReason:(reason||'Temporary pause').trim(),pauseStartedAt:firebase.firestore.FieldValue.serverTimestamp(),pausedAt:firebase.firestore.FieldValue.serverTimestamp(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_paused',note:(reason||'Temporary pause').trim(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('⏸️ Package paused for '+(pkg.clientName||'client')+'.\\nSessions cannot be logged until it is resumed.');}loadPackages();if(loadAdminData)loadAdminData();}catch(err){alert('Could not update package pause: '+err.message);}};`;
if(section.includes(adjustMarker)&&!section.includes('const togglePackagePause=async pkg=>'))section=section.replace(adjustMarker,pauseLogic+adjustMarker);
if(!section.includes('const togglePackagePause=async pkg=>'))throw new Error('Pause logic was not inserted');

// Do not permit session changes while paused.
const sessionStart="const adjustSessions=async(packageId,adjustment,packageData)=>{const currentRemaining=packageData.sessionsRemaining||0;";
if(section.includes(sessionStart))section=section.replace(sessionStart,"const adjustSessions=async(packageId,adjustment,packageData)=>{if(packageData.status==='paused'){alert('This package is paused. Resume it before logging or adding sessions.');return;}const currentRemaining=packageData.sessionsRemaining||0;");

// Insert a visible full-width Pause/Resume button immediately before the Auto Renewal button.
const pauseButton=`React.createElement("button",{onClick:()=>togglePackagePause(pkg),className:"w-full py-4 rounded-xl font-bold",style:pkg.status==='paused'?{background:'rgba(34,197,94,.18)',color:'#86efac',border:'1px solid rgba(34,197,94,.38)'}:{background:'rgba(245,158,11,.16)',color:'#fcd34d',border:'1px solid rgba(245,158,11,.38)'}},React.createElement(Ico,{name:pkg.status==='paused'?'play':'pause',size:18,style:{display:'inline-flex',verticalAlign:'-3px',margin:'0 6px 0 0'}}),pkg.status==='paused'?'Resume Package':'Pause Package'),`;
if(!section.includes("pkg.status==='paused'?'Resume Package':'Pause Package'")){
  const labelIndex=section.indexOf('Enable Auto Renewal');
  if(labelIndex<0)throw new Error('Enable Auto Renewal label not found');
  const buttonStart=section.lastIndexOf('React.createElement("button"',labelIndex);
  if(buttonStart<0)throw new Error('Auto Renewal button start not found');
  section=section.slice(0,buttonStart)+pauseButton+section.slice(buttonStart);
}
if(!section.includes("pkg.status==='paused'?'Resume Package':'Pause Package'"))throw new Error('Pause button was not inserted');

html=html.slice(0,packageStart)+section+html.slice(packageEnd);

// Every newly created package gets 45 days.
const expiryMarker='expiryDate:null});';
if(html.includes(expiryMarker))html=html.replace(expiryMarker,"expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(new Date(Date.now()+45*86400000))});");
html=html.replaceAll('30-day','45-day').replaceAll('30 days','45 days').replaceAll('30*DAY','45*DAY');

fs.writeFileSync(file,html);
console.log('Applied 45-day expiry and pause/resume to every package card');
