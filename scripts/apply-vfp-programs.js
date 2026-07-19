const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');
if(html.includes('data-vfp-programs="1"')){console.log('VFP program layer already applied');process.exit(0)}
const appMarker='    <script>\nconst{useState,useEffect,useRef}=React;';
if(!html.includes(appMarker))throw new Error('Main app marker not found');
html=html.replace(appMarker,'    <link rel="stylesheet" href="/vfp-programs.css?v=20260719" data-vfp-programs="1">\n    <script src="/vfp-programs.js?v=20260719"></script>\n\n'+appMarker);
const purchasedStart=html.indexOf("activeTab==='purchased'&&");
const purchasedEnd=html.indexOf(',purchaseMode&&selectedProgram&&',purchasedStart);
if(purchasedStart<0||purchasedEnd<0)throw new Error('Purchased-program block markers not found');
const purchased="activeTab==='purchased'&&/*#__PURE__*/React.createElement(VFPProgramLibrary,{enrollments:enrolledPrograms,customPrograms:customPrograms,theme:theme,user:user,onBrowse:()=>setActiveTab('all'),onOpen:(enrollment)=>{setSelectedEnrollment(enrollment);setShowWorkoutView(true);}})";
html=html.slice(0,purchasedStart)+purchased+html.slice(purchasedEnd);
const activeStart=html.indexOf('function ActiveProgramView(');
const renderStart=html.indexOf('const weekProgress=',activeStart);
const footer=html.indexOf('// ============================================\n// FOOTER',renderStart);
if(activeStart<0||renderStart<0||footer<0)throw new Error('Active-program render markers not found');
const tail=`const weekProgress=completedWorkouts.filter(w=>w.startsWith('week'+currentWeek)).length;const totalWorkouts=baseWeek.workouts.length;const progressPercentage=weekProgress/Math.max(1,totalWorkouts)*100;
const openProgramNote=async()=>{const note=prompt('Program note:',enrollment.clientNotes||'');if(note===null)return;try{await db.collection('workoutProgramEnrollments').doc(enrollment.id).set({clientNotes:note},{merge:true});enrollment.clientNotes=note;alert('Program note saved.');}catch(err){alert('Could not save note: '+err.message);}};
const openHistory=()=>{const logs=enrollment.setLogs||{};const items=Object.values(logs);alert(items.length?items.map((x,i)=>'Workout '+(i+1)+': '+(x.duration?Math.round(x.duration/60)+' min':'saved')+(x.note?' - '+x.note:'')).join('\\n'):'Exercise history will appear after you log sets in the new workout player.');};
const logWeightPrompt=()=>{const v=prompt('Enter current weight (lbs):',weights[currentWeek]||'');if(v!==null&&v!==''){const next={...weights,[currentWeek]:parseFloat(v)};db.collection('workoutProgramEnrollments').doc(enrollment.id).set({weights:next},{merge:true}).then(()=>{setWeights(next);alert('Weight saved.');}).catch(e=>alert(e.message));}};
const open1RMPrompt=()=>{const name=prompt('Exercise name for 1RM:','Bench Press');if(!name)return;const val=prompt('Enter 1RM (lbs):',oneRepMaxes[name]||'');if(val!==null&&val!=='')save1RM(name,val);};
const dashboardEl=React.createElement(VFPProgramDashboard,{program:CURRENT_PROGRAM,enrollment:enrollment,currentWeek:currentWeek,completedWorkouts:completedWorkouts,getWorkoutForWeek:getWorkoutForWeek,onSelectWorkout:setSelectedWorkout,onBack:()=>{try{window.history.back()}catch(e){}},onWeight:logWeightPrompt,on1RM:open1RMPrompt,onMeal:()=>setShowMealPlan(true),onHistory:openHistory,onNote:openProgramNote,selectedWorkout:selectedWorkout,onExitWorkout:()=>setSelectedWorkout(null),onCompleteWorkout:completeWorkout});
let mealEl=null;
if(showMealPlan){let mealContent=React.createElement('p',{className:'text-gray-400'},'This program does not include a meal plan.');if(CURRENT_PROGRAM.mealPlan){const mealCards=(CURRENT_PROGRAM.mealPlan.meals||[]).map((m,i)=>React.createElement('div',{key:i,className:'vfp-card p-4'},React.createElement('div',{className:'font-black'},m.name||('Meal '+(i+1))),m.time?React.createElement('div',{className:'text-xs text-gray-500 mb-2'},m.time):null,React.createElement('ul',{className:'text-sm text-gray-300 space-y-1'},(m.foods||[]).map((f,j)=>React.createElement('li',{key:j},'• ',f)))));mealContent=React.createElement('div',{className:'space-y-4'},CURRENT_PROGRAM.mealPlan.calories?React.createElement('div',{className:'vfp-card p-4 font-bold'},CURRENT_PROGRAM.mealPlan.calories,' calories · ',CURRENT_PROGRAM.mealPlan.protein||'—','g protein'):null,mealCards);}mealEl=React.createElement('div',{className:'vfp-modal vfp-shell'},React.createElement('div',{className:'vfp-modal-body'},React.createElement('div',{className:'flex justify-between items-center mb-5'},React.createElement('h2',{className:'text-2xl font-black'},'Meal Plan'),React.createElement('button',{className:'vfp-btn vfp-secondary',onClick:()=>setShowMealPlan(false)},'Close')),mealContent));}
return React.createElement(React.Fragment,null,dashboardEl,mealEl);
}
`;
html=html.slice(0,renderStart)+tail+html.slice(footer);
fs.writeFileSync(file,html);
console.log('Applied premium VFITNESS online-program experience');
