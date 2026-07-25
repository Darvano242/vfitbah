const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'site', 'index.html');
let html = fs.readFileSync(file, 'utf8');

// This transformer intentionally changes ONLY the Start Here / application save attempt.
// No components, styling, navigation, packages, revenue, programs, or dashboards are replaced.
const oldSave = "try{try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(authErr){console.warn('Anonymous sign-in skipped:',authErr);}}await db.collection('coachingApplications').doc(applicationId).set(payload,{merge:true});firestoreSaved=true;}catch(dbErr){console.warn('Primary application save failed:',dbErr);try{await db.collection('publicCoachingApplications').doc(applicationId).set(payload,{merge:true});firestoreSaved=true;}catch(publicErr){console.warn('Public application save failed:',publicErr);}}";

const newSave = "try{try{if(!auth.currentUser&&auth.signInAnonymously){try{await auth.signInAnonymously();}catch(authErr){console.warn('Anonymous sign-in skipped:',authErr);}}const applicationCollections=['coachingApplications','publicCoachingApplications','applications','applicationLeads','consultationRequests','leads'];let lastSaveError=null;for(const collectionName of applicationCollections){try{await db.collection(collectionName).doc(applicationId).set({...payload,collectionName:collectionName,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});firestoreSaved=true;break;}catch(collectionErr){lastSaveError=collectionErr;console.warn(collectionName+' application save failed:',collectionErr);}}if(!firestoreSaved&&lastSaveError)throw lastSaveError;}catch(dbErr){console.warn('All Firestore application save paths failed:',dbErr);}";

if (!html.includes(oldSave)) {
  throw new Error('Exact application save block was not found. No files were changed.');
}

html = html.replace(oldSave, newSave);

// Add one independent email fallback only inside the application submit handler.
const oldNetlify = "try{netlifySaved=await vfitSubmitNetlifyApplication(payload,emailMessage);}catch(netlifyErr){console.warn('Netlify application fallback failed:',netlifyErr);}";
const newNetlify = "try{netlifySaved=await vfitSubmitNetlifyApplication(payload,emailMessage);}catch(netlifyErr){console.warn('Netlify application fallback failed:',netlifyErr);}if(!firestoreSaved&&!emailSent&&!netlifySaved){try{const fallbackResponse=await fetch('https://formsubmit.co/ajax/vfitnessbahamas@gmail.com',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({_subject:'New VFITNESS Application - '+form.name,_template:'table',applicationId:applicationId,name:form.name,email:form.email||'',phone:form.phone||'',goal:form.goal||'',training:form.training||'',trainer:form.trainer||'',location:form.location||'',schedule:form.schedule||'',days:form.days||'',package:form.packageSize||form.package||'',notes:form.notes||'',submittedAt:createdAtClient})});if(fallbackResponse.ok)netlifySaved=true;}catch(fallbackErr){console.warn('Independent application email fallback failed:',fallbackErr);}}";

if (!html.includes(oldNetlify)) {
  throw new Error('Exact application fallback block was not found. No files were changed.');
}
html = html.replace(oldNetlify, newNetlify);

fs.writeFileSync(file, html);
console.log('Patched application saving only; all other app code left unchanged.');
