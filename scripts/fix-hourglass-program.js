const fs=require('fs');
const path=require('path');

const htmlFile=path.join(process.cwd(),'site','index.html');
const uiFile=path.join(process.cwd(),'site','vf-program-ui.js');
const coreFile=path.join(process.cwd(),'site','vf-program-state.js');
let html=fs.readFileSync(htmlFile,'utf8');
const ui=fs.readFileSync(uiFile,'utf8');
const core=fs.readFileSync(coreFile,'utf8');

function assert(condition,message){if(!condition)throw new Error(message);}

// Hourglass intentionally defines the five actual workouts once in Week 1.
// Weeks 2-8 are progression records (weightIncrease) and inherit that schedule.
assert(html.includes("const HOURGLASS_PROGRAM={id:'hourglass-8week'"),'Hourglass program definition is missing');
assert(html.includes("{week:4,name:'Curve Definer',workoutsPerWeek:5,weightIncrease:10"),'Hourglass Week 4 progression definition is missing');
assert(core.includes('return workouts.length?workouts:safeArray(base.workouts);'),'Canonical program state no longer inherits base-week workouts');
assert(ui.includes('if(Core)return Core.derive(program,enrollment||{});'),'Canonical program UI is not wired to program state');

// The legacy inline bundle declares older VFP globals after the first module load.
// Reload the authoritative UI after that bundle so its dashboard/resolver wins.
const marker='data-vf-program-ui-final="hourglass-inherited-weeks"';
if(!html.includes(marker)){
  const tag='\n    <script src="/vf-program-ui.js?v=20260903-hourglass" '+marker+'></script>\n';
  assert(html.includes('</body>'),'Closing body tag not found');
  html=html.replace('</body>',tag+'</body>');
}

fs.writeFileSync(htmlFile,html);
console.log('Hourglass inherited-week program resolver is authoritative in final bundle.');
