const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

function assert(condition,message){if(!condition)throw new Error(message);}

const loadFrom="const loadEnrolledPrograms=async()=>{try{const snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();const programs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));setEnrolledPrograms(programs);";
const loadTo="const loadEnrolledPrograms=async()=>{try{let snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();const vfJei=((user&&user.email)||'').trim().toLowerCase()==='jei.9@outlook.com';if(vfJei){const vfReissueId='jei-hourglass-reissue-20260903';const vfExisting=snapshot.docs.find(d=>d.id===vfReissueId);if(!vfExisting){const vfHourglassDocs=snapshot.docs.filter(d=>{const p=d.data()||{};return((p.programId||'').toLowerCase().includes('hourglass')||(p.programTitle||'').toLowerCase().includes('hourglass'));});const vfBatch=db.batch();vfHourglassDocs.forEach(d=>vfBatch.delete(d.ref));const vfNewRef=db.collection('workoutProgramEnrollments').doc(vfReissueId);vfBatch.set(vfNewRef,{clientId:user.uid,clientEmail:(user.email||'').trim().toLowerCase(),programId:'hourglass-8week',programTitle:'HOURGLASS: Ladies Weight Loss Program',status:'active',currentWeek:1,completedWorkouts:[],completedWorkoutsV2:[],completionSchema:'zero-based-v2',setLogs:{},weights:{},oneRepMaxes:{},purchaseDate:firebase.firestore.FieldValue.serverTimestamp(),startedAt:firebase.firestore.FieldValue.serverTimestamp(),createdAt:firebase.firestore.FieldValue.serverTimestamp(),updatedAt:firebase.firestore.FieldValue.serverTimestamp(),reissuedAt:firebase.firestore.FieldValue.serverTimestamp(),reissueReason:'Clean reissue requested by VFitness admin'});await vfBatch.commit();snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();window.dispatchEvent(new CustomEvent('vf:jei-hourglass-reissued'));}else{const p=vfExisting.data()||{};if(p.programId!=='hourglass-8week'||p.status!=='active'){await vfExisting.ref.set({programId:'hourglass-8week',programTitle:'HOURGLASS: Ladies Weight Loss Program',status:'active',updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true});snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();}}}const programs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));setEnrolledPrograms(programs);";
if(!html.includes(loadTo)){
  assert(html.includes(loadFrom),'Jei enrollment load marker not found');
  html=html.replace(loadFrom,loadTo);
}

const programFrom="const CURRENT_PROGRAM=PROGRAM_MAP[enrollment.programId]||vfCustomProg||VF_LOADING_PROGRAM;";
const programTo="const vfJeiHourglass=((((user&&user.email)||enrollment.clientEmail||'').trim().toLowerCase()==='jei.9@outlook.com')&&(((enrollment.programId||'').toLowerCase().includes('hourglass'))||((enrollment.programTitle||'').toLowerCase().includes('hourglass'))));const CURRENT_PROGRAM=vfJeiHourglass?HOURGLASS_PROGRAM:(PROGRAM_MAP[enrollment.programId]||vfCustomProg||VF_LOADING_PROGRAM);";
if(!html.includes(programTo)){
  assert(html.includes(programFrom),'Jei active program marker not found');
  html=html.replace(programFrom,programTo);
}

assert(html.includes("'jei.9@outlook.com'"),'Jei account reissue email missing');
assert(html.includes("'jei-hourglass-reissue-20260903'"),'Jei deterministic reissue id missing');
assert(html.includes('vfHourglassDocs.forEach(d=>vfBatch.delete(d.ref))'),'Jei old Hourglass deletion is missing');
assert(html.includes("programId:'hourglass-8week'"),'Jei Hourglass canonical reissue missing');
assert(html.includes('completedWorkouts:[]'),'Jei fresh completion state is missing');
assert(html.includes('vfJeiHourglass?HOURGLASS_PROGRAM'),'Jei Hourglass active-program override missing');

fs.writeFileSync(file,html);
console.log('Applied clean Hourglass delete-and-reissue migration for Jei.9@outlook.com.');
