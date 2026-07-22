const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const packageStart=html.indexOf('function PackageManagement({clients,loadAdminData})');
const packageEnd=html.indexOf('function AddPackageForm({clients,onPackageAdded})',packageStart);
if(packageStart<0||packageEnd<0)throw new Error('Package Management markers not found');
let section=html.slice(packageStart,packageEnd);

// Package Control must show both active and temporarily paused packages.
section=section.replace("const snapshot=await db.collection('packages').where('status','==','active').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.sessionsRemaining||0)>=0);","const snapshot=await db.collection('packages').get();let pkgs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).filter(pkg=>(pkg.status==='active'||pkg.status==='paused')&&(pkg.sessionsRemaining||0)>=0);");

// Add pause/resume behavior. Resuming extends expiry by the exact time spent paused.
const adjustMarker='const adjustSessions=async(packageId,adjustment,packageData)=>';
if(!section.includes(adjustMarker))throw new Error('Package session adjustment marker not found');
const pauseLogic=`const togglePackagePause=async pkg=>{try{if(pkg.status==='paused'){const pausedAt=pkg.pauseStartedAt?.toDate?.()||pkg.pausedAt?.toDate?.()||new Date();const pausedMs=Math.max(0,Date.now()-pausedAt.getTime());const currentExpiry=pkg.expiryDate?.toDate?.()||new Date(Date.now()+45*86400000);const extendedExpiry=new Date(currentExpiry.getTime()+pausedMs);await db.collection('packages').doc(pkg.id).set({status:'active',resumedAt:firebase.firestore.FieldValue.serverTimestamp(),expiryDate:firebase.firestore.Timestamp.fromDate(extendedExpiry),pauseStartedAt:firebase.firestore.FieldValue.delete(),pausedAt:firebase.firestore.FieldValue.delete(),pauseReason:firebase.firestore.FieldValue.delete(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_resumed',note:'Package resumed. Expiry extended by '+Math.ceil(pausedMs/86400000)+' paused day(s).',createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('✅ Package resumed for '+(pkg.clientName||'client')+'.\\nThe expiry date was extended for the paused time.');}else{const reason=prompt('Why is this package being paused?\\n\\nExamples: travel, illness, family emergency, work schedule.','Travel / emergency');if(reason===null)return;await db.collection('packages').doc(pkg.id).set({status:'paused',pauseReason:(reason||'Temporary pause').trim(),pauseStartedAt:firebase.firestore.FieldValue.serverTimestamp(),pausedAt:firebase.firestore.FieldValue.serverTimestamp(),lastUpdated:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});try{await db.collection('packageAuditLog').add({packageId:pkg.id,clientId:pkg.clientId||'',clientName:pkg.clientName||'',action:'package_paused',note:(reason||'Temporary pause').trim(),createdAt:firebase.firestore.FieldValue.serverTimestamp()});}catch(e){}alert('⏸️ Package paused for '+(pkg.clientName||'client')+'.\\nSessions cannot be logged until it is resumed.');}loadPackages();if(loadAdminData)loadAdminData();}catch(err){alert('Could not update package pause: '+err.message);}};`;
section=section.replace(adjustMarker,pauseLogic+adjustMarker);

// Block session use while the package is paused.
section=section.replace("const adjustSessions=async(packageId,adjustment,packageData)=>{const currentRemaining=packageData.sessionsRemaining||0;","const adjustSessions=async(packageId,adjustment,packageData)=>{if(packageData.status==='paused'){alert('This package is paused. Resume it before logging or adding sessions.');return;}const currentRemaining=packageData.sessionsRemaining||0;");

// Add a Pause / Resume action beside the existing package actions.
const renewalButtonMarker='React.createElement("button",{onClick:()=>toggleAutoRenewal(pkg)';
if(!section.includes(renewalButtonMarker))throw new Error('Auto renewal button marker not found');
const pauseButton=`React.createElement("button",{onClick:()=>togglePackagePause(pkg),className:"px-3 py-2 rounded-lg text-xs font-bold",style:pkg.status==='paused'?{background:'rgba(34,197,94,.16)',color:'#86efac',border:'1px solid rgba(34,197,94,.32)'}:{background:'rgba(245,158,11,.16)',color:'#fcd34d',border:'1px solid rgba(245,158,11,.32)'}},pkg.status==='paused'?'Resume Package':'Pause Package'),`;
section=section.replace(renewalButtonMarker,pauseButton+renewalButtonMarker);

html=html.slice(0,packageStart)+section+html.slice(packageEnd);

// Every newly created package now has a 45-day validity period.
const expiryMarker='expiryDate:null});';
if(!html.includes(expiryMarker))throw new Error('New package expiry marker not found');
html=html.replace(expiryMarker,"expiryDays:45,expiryDate:firebase.firestore.Timestamp.fromDate(new Date(Date.now()+45*86400000))});");

// Update any remaining customer-facing 30-day package wording or legacy day calculation.
html=html.replaceAll('30-day','45-day').replaceAll('30 days','45 days').replaceAll('30*DAY','45*DAY');

fs.writeFileSync(file,html);
console.log('Applied 45-day package expiry and pause/resume controls');
