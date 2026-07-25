const fs=require('fs');
const path=require('path');
const file=path.join(process.cwd(),'site','index.html');
let html=fs.readFileSync(file,'utf8');
const css='<link rel="stylesheet" href="/vfit-inspired-marketplace.css">';
const unsafeJs='<script defer src="/vfit-inspired-marketplace.js"></script>';

// Remove the previous DOM observer enhancement. It could interfere with React rendering/navigation.
html=html.split(unsafeJs).join('');

// Keep this upgrade presentation-only.
if(!html.includes(css)){
  if(!html.includes('</head>'))throw new Error('Missing </head> marker');
  html=html.replace('</head>',css+'\n</head>');
}

fs.writeFileSync(file,html);
console.log('Applied safe CSS-only VFITNESS marketplace upgrade');
