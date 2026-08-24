const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

const before="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'}];";
const after="const PACKAGE_ASSIGN_TRAINERS=[{id:'darvano',name:'DARVANO'},{id:'chavese_moss',name:'Chavese Moss'},{id:'lanardo_mackey',name:'Lanardo Mackey'},{id:'kevin_mackey',name:'Kevin Mackey'}];";

if(html.includes(before)) html=html.replace(before,after);
if(!html.includes(after)) throw new Error('Kevin Mackey package trainer option was not applied');

fs.writeFileSync(file,html);
console.log('Added Kevin Mackey to package assignment trainers.');
