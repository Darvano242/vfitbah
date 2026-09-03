const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

function assert(condition,message){if(!condition)throw new Error(message);}

const loadFrom="const loadEnrolledPrograms=async()=>{try{const snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();const programs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()}));setEnrolledPrograms(programs);";
const loadTo="const loadEnrolledPrograms=async()=>{try{const snapshot=await db.collection('workoutProgramEnrollments').where('clientId','==',user.uid).get();const vfJei=((user&&user.email)||'').trim().toLowerCase()==='jei.9@outlook.com';const programs=snapshot.docs.map(doc=>({id:doc.id,...doc.data()})).map(p=>{const vfHourglass=vfJei&&((p.programId||'').toLowerCase().includes('hourglass')||(p.programTitle||'').toLowerCase().includes('hourglass'));if(!vfHourglass)return p;const repaired={...p,programId:'hourglass-8week',programTitle:'HOURGLASS: Ladies Weight Loss Program',status:p.status||'active'};db.collection('workoutProgramEnrollments').doc(p.id).set({programId:'hourglass-8week',programTitle:'HOURGLASS: Ladies Weight Loss Program',status:repaired.status,updatedAt:firebase.firestore.FieldValue.serverTimestamp()},{merge:true}).catch(e=>console.warn('Jei Hourglass enrollment repair deferred:',e&&e.message||e));return repaired;});setEnrolledPrograms(programs);";
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

assert(html.includes("'jei.9@outlook.com'"),'Jei account repair email missing');
assert(html.includes("programId:'hourglass-8week'"),'Jei Hourglass canonical program repair missing');
assert(html.includes('vfJeiHourglass?HOURGLASS_PROGRAM'),'Jei Hourglass active-program override missing');

fs.writeFileSync(file,html);
console.log('Applied client-specific Hourglass enrollment repair for Jei.9@outlook.com.');
