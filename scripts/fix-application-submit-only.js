const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'site', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// This transformer changes ONLY application delivery paths.
// No components, styling, navigation, packages, revenue, programs, or dashboards are replaced.
const oldSave = "try{try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(authErr){console.warn('Anonymous sign-in skipped:',authErr);}}await db.collection('coachingApplications').doc(applicationId).set(payload,{merge:true});firestoreSaved=true;}catch(dbErr){console.warn('Primary application save failed:',dbErr);try{await db.collection('publicCoachingApplications').doc(applicationId).set(payload,{merge:true});firestoreSaved=true;}catch(publicErr){console.warn('Public application save failed:',publicErr);}}";

const newSave = "try{try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(authErr){console.warn('Anonymous sign-in skipped:',authErr);}}const applicationCollections=['coachingApplications','publicCoachingApplications','applications','applicationLeads','consultationRequests','leads'];let lastSaveError=null;for(const collectionName of applicationCollections){try{await db.collection(collectionName).doc(applicationId).set({...payload,collectionName:collectionName,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});firestoreSaved=true;break;}catch(collectionErr){lastSaveError=collectionErr;console.warn(collectionName+' application save failed:',collectionErr);}}if(!firestoreSaved&&lastSaveError)throw lastSaveError;}catch(dbErr){console.warn('All Firestore application save paths failed:',dbErr);}";

if (!html.includes(oldSave) && !html.includes(newSave)) {
  throw new Error('Exact legacy application save block was not found. No files were changed.');
}
if (html.includes(oldSave)) html = html.replace(oldSave, newSave);

const oldNetlify = "try{netlifySaved=await vfitSubmitNetlifyApplication(payload,emailMessage);}catch(netlifyErr){console.warn('Netlify application fallback failed:',netlifyErr);}";
const previousFallback = "try{netlifySaved=await vfitSubmitNetlifyApplication(payload,emailMessage);}catch(netlifyErr){console.warn('Netlify application fallback failed:',netlifyErr);}if(!firestoreSaved&&!emailSent&&!netlifySaved){try{const fallbackResponse=await fetch('https://formsubmit.co/ajax/vfitnessbahamas@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({_subject:'New VFITNESS Application - '+form.name,_template:'table',applicationId:applicationId,name:form.name,email:form.email||'',phone:form.phone||'',goal:form.goal||'',training:form.training||'',trainer:form.trainer||'',location:form.location||'',schedule:form.schedule||'',days:form.days||'',package:form.packageSize||form.package||'',notes:form.notes||'',submittedAt:createdAtClient})});if(fallbackResponse.ok)netlifySaved=true;}catch(fallbackErr){console.warn('Independent application email fallback failed:',fallbackErr);}}";

const reliableDelivery = "try{const intakeResponse=await fetch('/api/application',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({applicationId:applicationId,name:form.name,email:form.email||'',phone:form.phone||'',goal:form.goal||'',training:form.training||'',trainer:form.trainer||'',location:form.location||'',schedule:form.schedule||'',days:form.days||'',package:form.packageSize||form.package||'',notes:form.notes||'',submittedAt:createdAtClient})});if(intakeResponse.ok){netlifySaved=true;}else{console.warn('Application intake API returned',intakeResponse.status);}}catch(intakeErr){console.warn('Application intake API failed:',intakeErr);}if(!netlifySaved){try{netlifySaved=await vfitSubmitNetlifyApplication(payload,emailMessage);}catch(netlifyErr){console.warn('Legacy application fallback failed:',netlifyErr);}}";

if (html.includes(previousFallback)) {
  html = html.replace(previousFallback, reliableDelivery);
} else if (html.includes(oldNetlify)) {
  html = html.replace(oldNetlify, reliableDelivery);
} else if (!html.includes("fetch('/api/application'")) {
  throw new Error('Exact legacy application fallback block was not found. No files were changed.');
}

// The guided Start Here flow is a separate component and previously relied only on public Firestore writes.
// Add the same-origin API first, retain both Firestore collections, and keep the hidden-form fallback.
const guidedOld = `let saved=false;
   try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(aE){}}
    await db.collection('coachingApplications').doc(applicationId).set(payload,{merge:true});saved=true;
   }catch(e1){try{await db.collection('publicCoachingApplications').doc(applicationId).set(payload,{merge:true});saved=true;}catch(e2){}}`;

const guidedNew = `let saved=false;
   try{const intakeResponse=await fetch('/api/application',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({applicationId:applicationId,name:data.name,email:data.email||'',phone:data.whatsapp||'',goal:data.goal||'',training:data.trainingType||'',trainer:data.trainer||'',location:data.location||'',schedule:(data.times||[]).join(', '),days:data.daysPerWeek||'',package:data.packageInterest||'',notes:[data.goalNote,data.timeline,data.experience,data.injuries].filter(Boolean).join(' | '),submittedAt:new Date(createdAtClient).toISOString()})});if(intakeResponse.ok)saved=true;else console.warn('Guided application API returned',intakeResponse.status);}catch(apiErr){console.warn('Guided application API failed:',apiErr);}
   try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(aE){}}
    await db.collection('coachingApplications').doc(applicationId).set(payload,{merge:true});saved=true;
   }catch(e1){try{await db.collection('publicCoachingApplications').doc(applicationId).set(payload,{merge:true});saved=true;}catch(e2){console.warn('Guided application Firestore fallbacks failed:',e2);}}`;

if (html.includes(guidedOld)) html = html.replace(guidedOld, guidedNew);
if (!html.includes("Guided application API returned")) {
  throw new Error('Guided Start Here application block was not patched.');
}

const guidedEmailEnd = `}}catch(eM){}
   setSubmitting(false);`;
const guidedFallback = `}}catch(eM){}
   if(!saved){try{saved=await vfitSubmitNetlifyApplication({applicationId:applicationId,form:{name:data.name,email:data.email||'',phone:data.whatsapp||'',age:data.age||'',sex:data.sex||'',location:data.location||'',goal:data.goal||'',timeline:data.timeline||'',notes:data.goalNote||'',experience:data.experience||'',daysPerWeek:data.daysPerWeek||'',injuries:data.injuries||''},createdAtClient:createdAtClient},'');}catch(netlifyErr){console.warn('Guided hidden-form fallback failed:',netlifyErr);}}
   setSubmitting(false);`;
if (html.includes(guidedEmailEnd)) html = html.replace(guidedEmailEnd, guidedFallback);
if (!html.includes('Guided hidden-form fallback failed:')) {
  throw new Error('Guided Start Here hidden-form fallback was not inserted.');
}

fs.writeFileSync(file, html);
console.log('Patched both VFitness application flows with API, Firestore, and hidden-form delivery.');
