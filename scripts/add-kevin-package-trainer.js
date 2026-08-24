const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const threeTrainerList="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'}];";
const fourTrainerList="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'},{id:'kevin_mackey',name:'Kevin Mackey'}];";

if(html.includes(threeTrainerList)) html=html.replace(threeTrainerList,fourTrainerList);

if(!html.includes(fourTrainerList)){
  throw new Error('Kevin Mackey is missing from the final PACKAGE_ASSIGN_TRAINERS production bundle');
}
if(!html.includes("PACKAGE_ASSIGN_TRAINERS.map")){
  throw new Error('Package trainer dropdown renderer is missing from the final production bundle');
}

fs.writeFileSync(file,html);
console.log('Verified Kevin Mackey in final Package Control trainer list.');
