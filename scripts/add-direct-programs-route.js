const fs=require('fs');
const path=require('path');

const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');

// Safe direct-route bridge. It does not replace React components or business logic.
const marker='data-vfitness-direct-programs-route';
if(html.includes(marker)){
  console.log('Direct programs route already present');
  process.exit(0);
}

const script=`<script ${marker}="true">\n(function(){\n  var p=(window.location.pathname||'/').replace(/\\/+$/,'')||'/';\n  var isPrograms=p==='/programs'||p==='/training-programs'||p==='/online-programs';\n  if(!isPrograms)return;\n  document.title='VFITNESS Training Programs | Bahamas';\n  function openPrograms(){\n    var items=[].slice.call(document.querySelectorAll('button,a'));\n    var target=items.find(function(el){\n      var t=String(el.textContent||'').trim().toLowerCase();\n      return t==='programs'||t==='online programs'||t==='training programs'||t==='view programs';\n    });\n    if(target){target.click();window.scrollTo(0,0);return true;}\n    return false;\n  }\n  var tries=0;\n  function attempt(){\n    tries+=1;\n    if(openPrograms()||tries>=30)return;\n    setTimeout(attempt,200);\n  }\n  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',attempt,{once:true});\n  else attempt();\n})();\n</script>\n`;

if(!html.includes('</body>')){
  console.warn('No closing body marker found; direct programs route skipped safely');
  process.exit(0);
}

html=html.replace('</body>',script+'</body>');
fs.writeFileSync(file,html);
console.log('Added safe direct public programs routes');
