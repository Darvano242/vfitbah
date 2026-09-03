const fs=require('fs');
const path=require('path');
const vm=require('vm');

function assert(condition,message){if(!condition)throw new Error(message);}
const html=fs.readFileSync(path.join(process.cwd(),'site','index.html'),'utf8');
const coreSource=fs.readFileSync(path.join(process.cwd(),'site','vf-program-state.js'),'utf8');

assert(html.includes('data-vf-program-ui-final="hourglass-inherited-weeks"'),'Final canonical program UI override is missing');
assert(html.includes("const HOURGLASS_PROGRAM={id:'hourglass-8week'"),'Hourglass definition missing');
assert(html.includes("{week:4,name:'Curve Definer',workoutsPerWeek:5,weightIncrease:10"),'Hourglass Week 4 progression missing');

const context={window:{}};
vm.createContext(context);
vm.runInContext(coreSource,context);
const Core=context.window.VFitnessProgramCore;
assert(Core&&typeof Core.derive==='function','Canonical program core failed to load');

const mockHourglass={
  id:'hourglass-8week',
  weeklyPlans:[
    {week:1,workouts:[{name:'Glute Sculpting'},{name:'Waist Cincher'},{name:'Lower Body Blast'},{name:'Upper Body Tone'},{name:'Cardio Sculpt'}]},
    {week:2,workoutsPerWeek:5,weightIncrease:5},
    {week:3,workoutsPerWeek:5,weightIncrease:10},
    {week:4,workoutsPerWeek:5,weightIncrease:10},
    {week:5,workoutsPerWeek:5,weightIncrease:5},
    {week:6,workoutsPerWeek:5,weightIncrease:10},
    {week:7,workoutsPerWeek:5,weightIncrease:10},
    {week:8,workoutsPerWeek:5,weightIncrease:10}
  ]
};
const enrollment={currentWeek:4,completedWorkouts:[]};
const derived=Core.derive(mockHourglass,enrollment);
assert(derived.currentWeek===4,'Week 4 enrollment did not stay on Week 4');
assert(derived.perWeek===5,'Week 4 must inherit all 5 Hourglass workouts');
assert(derived.currentWorkouts.length===5,'Week 4 workout list is incomplete');
assert(derived.pct===0,'Fresh Week 4 enrollment must not show false 100% progress');
assert(derived.total===40,'Eight-week Hourglass program must resolve to 40 scheduled workouts');
console.log('Hourglass Week 4 regression gate passed: 5 workouts visible, 40 total, 0% for no completions.');
