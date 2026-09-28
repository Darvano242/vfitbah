// Composes vfit-2026.js / .css from the deployed base plus the page layer.
const fs=require('fs'),path=require('path');const d=__dirname;
const rd=f=>fs.readFileSync(path.join(d,f),'utf8');
let js=rd('vfit-2026.base.js');
const swap=(a,b)=>{if(!js.includes(a))throw new Error('missing '+a.slice(0,60));js=js.split(a).join(b);};
swap('window.VF26={Navigation:Navigation,HomePage:HomePage,Footer:Footer};',rd('pages.part.js')+'\nwindow.VF26={Navigation:Navigation,HomePage:HomePage,Footer:Footer,pages:PAGES};');
swap(' var ms=React.useState(false),open=ms[0],setOpen=ms[1];\n',' var ms=React.useState(false),open=ms[0],setOpen=ms[1];\n window.__vf26SetPage=setCurrentPage;\n');
swap('Header, homepage and footer rebuilt','Header, homepage, footer and every public page rebuilt');
swap("['library','Exercise Library']","['library','Program Library']");
swap("b('Exercise Library','library')","b('Program Library','library')");
fs.writeFileSync(path.join(d,'vfit-2026.js'),js);
fs.writeFileSync(path.join(d,'vfit-2026.css'),rd('vfit-2026.base.css')+rd('pages.part.css'));
console.log('built');
