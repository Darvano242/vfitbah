const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');
const css='<link rel="stylesheet" href="/vfit-inspired-marketplace.css">';
const js='<script defer src="/vfit-inspired-marketplace.js"></script>';
if(!html.includes(css)){
  if(!html.includes('</head>'))throw new Error('Missing </head> marker');
  html=html.replace('</head>',css+'\n</head>');
}
if(!html.includes(js)){
  if(!html.includes('</body>'))throw new Error('Missing </body> marker');
  html=html.replace('</body>',js+'\n</body>');
}
fs.writeFileSync(file,html);
console.log('Injected isolated VFITNESS marketplace inspiration assets');
