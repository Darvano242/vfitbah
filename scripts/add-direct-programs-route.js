const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

// Change only the initial page state so /programs opens the existing public program marketplace.
// No program data, purchases, Firebase, authentication, pricing, or component markup is replaced.
const statePattern=/const\s*\[\s*currentPage\s*,\s*setCurrentPage\s*\]\s*=\s*useState\(\s*(['"])home\1\s*\)/;
const match=html.match(statePattern);

if(!match){
  // Keep builds idempotent when this transformer has already been applied.
  if(html.includes("window.location.pathname.replace(/\\/+$/,'')")&&html.includes("'workoutprograms'")){
    console.log('Direct /programs route already present');
    process.exit(0);
  }
  throw new Error('Could not find the currentPage home-state declaration. No files were changed.');
}

const routedState="const[currentPage,setCurrentPage]=useState(()=>{const directPath=window.location.pathname.replace(/\\/+$/,'')||'/';return directPath==='/programs'||directPath==='/training-programs'||directPath==='/online-programs'?'workoutprograms':'home';})";
html=html.replace(statePattern,routedState);

// Add route-aware title/description without altering the React interface.
const headMarker='</head>';
const routeMeta=`<script>\n(function(){\n  var p=window.location.pathname.replace(/\\/+$/,'')||'/';\n  if(p==='/programs'||p==='/training-programs'||p==='/online-programs'){\n    document.title='VFITNESS Training Programs | Bahamas';\n    var d=document.querySelector('meta[name="description"]');\n    if(d)d.setAttribute('content','Browse VFITNESS workout programs for fat loss, muscle gain, glute development, strength and athletic performance.');\n  }\n})();\n</script>\n`;
if(!html.includes("VFITNESS Training Programs | Bahamas")){
  if(!html.includes(headMarker))throw new Error('Missing closing head marker. No files were changed.');
  html=html.replace(headMarker,routeMeta+headMarker);
}

fs.writeFileSync(file,html);
console.log('Added direct public routes: /programs, /training-programs and /online-programs');
