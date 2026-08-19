const fs=require('fs');
const path=require('path');
const root=process.cwd();
const htmlPath=path.join(root,'site','index.html');
const homePath=path.join(root,'site','home.html');
const pwaPath=path.join(root,'site','vf-pwa-update.js');
const cssPath=path.join(root,'site','vf-design-system.css');
let html=fs.readFileSync(htmlPath,'utf8');
let home=fs.readFileSync(homePath,'utf8');
let pwa=fs.readFileSync(pwaPath,'utf8');
let css=fs.readFileSync(cssPath,'utf8');
let publicRuntime=fs.readFileSync(path.join(root,'src','services','v2Execution.js'),'utf8');
const appRuntime=fs.readFileSync(path.join(root,'src','services','v2AppExecution.js'),'utf8');
const v2css=fs.readFileSync(path.join(root,'src','styles','v2-execution.css'),'utf8');
const MARK='VF_V2_EXECUTION_20260819';
const APP_MARK='VF_V2_APP_EXECUTION_20260819';
const RESULT_MARK='VF_V2_RESULTS_GUARD_20260819';
const GATE_FIX_MARK='VF_V2_GATE_FIX_20260819';
const PROGRAM_COPY_MARK='VF_V2_PROGRAM_COPY_20260819';
const HOME_MOBILE_MARK='VF_V2_HOME_MOBILE_GALLERY_20260819';

// Trainer accounts do not receive the commercial Packages tab. Numbers is already admin-only.
html=html.replace(
  "isAdmin||!['siteDesign','applications','testimonials','gallery','analytics','auditTrail','buttonqa'].includes(tab.id)",
  "isAdmin||!['siteDesign','applications','packages','testimonials','gallery','analytics','auditTrail','buttonqa'].includes(tab.id)"
);

// Resolve the legacy duration precedence bug. Existing strings such as "4 weeks" or "45 days"
// are already complete labels and must never have another " weeks" appended.
const legacyDuration="program.duration||program.weeks?`${program.weeks||program.duration} weeks`:'8 weeks'";
const fixedDuration="program.duration||(program.weeks?`${program.weeks} weeks`:'8 weeks')";
html=html.replaceAll(legacyDuration,fixedDuration);

// Keep the stable internal program ID so existing purchases/enrollments continue resolving.
const homeStart=html.indexOf("const HOME_30DAY_PROGRAM={id:'home-30day'");
const homeEnd=homeStart>=0?html.indexOf('};function WorkoutProgramsPage',homeStart):-1;
if(homeStart<0||homeEnd<0)throw new Error('Could not locate the stable HOME program object');
let homeProgram=html.slice(homeStart,homeEnd+2);
homeProgram=homeProgram
  .replace(/title:'[^']*'/,"title:'HOME 45: 45 Day Get In Shape Plan'")
  .replace(/duration:'[^']*'/,"duration:'45 days'")
  .replace(/description:'[^']*'/,"description:'Transform at home with a structured 45-day training track. No gym needed. Get in shape with bodyweight exercises and minimal equipment. Perfect for busy people!'")
  .replace("'5 workouts per week (30 days total)'","'5 workouts per week'")
  .replace("'30-day meal plan included'","'Meal plan included'");
html=html.slice(0,homeStart)+homeProgram+html.slice(homeEnd+2);

// The public avatar is the signed-out login entry point. Authenticated clients reach the dashboard after auth.
publicRuntime=publicRuntime
  .replace('<a class="vf-v2-account" href="/dashboard" aria-label="Account">','<a class="vf-v2-account" href="/login" aria-label="Account">')
  .replace('<a href="/dashboard">Account</a>','<a href="/login">Account</a>');

// Load Geist as a real stylesheet link; the sans fallback chain still works if the font request fails.
if(!html.includes('data-vf-geist-v2')){
  html=html.replace('</head>','<link data-vf-geist-v2="1" rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700;800;900&display=swap">\n</head>');
}

// Mobile homepage: load the hardening layer after the shared design system so the phone rules win.
if(!home.includes('vf-mobile-home-fix.css')){
  home=home.replace('<link rel="stylesheet" href="/vf-design-system.css">','<link rel="stylesheet" href="/vf-design-system.css">\n  <link rel="stylesheet" href="/vf-mobile-home-fix.css">');
}

// Reuse the exact Firestore `gallery` collection used by AboutPage instead of a separate Results image picker.
const oldHomeResults=`    <section class="vf-v2-section"><div class="vf-v2-wrap">
      <div class="vf-v2-head"><span class="vf-v2-eyebrow">RESULTS</span><h2 class="vf-v2-h2">Real clients only.</h2><p class="vf-v2-copy">No stock transformation, no fabricated rating, no placeholder dressed up as proof.</p></div>
      <div class="vf-v2-emptyproof"><div><strong>Client transformations are being curated for this section.</strong><p class="vf-v2-static-note">Only real VFitness client media with recorded consent is published here.</p></div></div>
    </div></section>`;
const newHomeResults=`    <!-- ${HOME_MOBILE_MARK} -->
    <section class="vf-v2-section"><div class="vf-v2-wrap">
      <div class="vf-v2-head"><span class="vf-v2-eyebrow">GALLERY</span><h2 class="vf-v2-h2">Inside VFitness.</h2><p class="vf-v2-copy">The same live slideshow from our About page — training, clients and the VFitness environment.</p></div>
      <div class="vf-v2-home-gallery" data-vf-home-gallery aria-live="polite">
        <div class="vf-v2-home-gallery-status" data-gallery-status>Loading the VFitness gallery…</div>
        <div class="vf-v2-home-gallery-stage" data-gallery-stage hidden>
          <div class="vf-v2-home-gallery-progress"><span data-gallery-progress></span></div>
          <button class="vf-v2-home-gallery-arrow vf-v2-home-gallery-prev" type="button" data-gallery-prev aria-label="Previous gallery image">←</button>
          <button class="vf-v2-home-gallery-arrow vf-v2-home-gallery-next" type="button" data-gallery-next aria-label="Next gallery image">→</button>
        </div>
        <div class="vf-v2-home-gallery-meta" data-gallery-meta hidden>
          <span class="vf-v2-home-gallery-count" data-gallery-count>01 / 01</span>
          <div class="vf-v2-home-gallery-dots" data-gallery-dots aria-label="Gallery slides"></div>
        </div>
        <div class="vf-v2-home-gallery-thumbs" data-gallery-thumbs hidden aria-label="Gallery thumbnails"></div>
      </div>
    </div></section>`;
if(home.includes(oldHomeResults))home=home.replace(oldHomeResults,newHomeResults);
if(!home.includes(HOME_MOBILE_MARK))throw new Error('Could not replace the static Results placeholder with the About gallery mount');
if(!home.includes('vf-home-gallery.js'))home=home.replace('</body>','<script defer src="/vf-home-gallery.js"></script>\n</body>');

if(!css.includes(MARK))css+='\n'+v2css+'\n';
if(!css.includes(GATE_FIX_MARK))css+='\n/* '+GATE_FIX_MARK+' */\nhtml,body{margin:0!important;padding:0!important}\n';
if(!css.includes(RESULT_MARK))css+='\n/* '+RESULT_MARK+' */\n.vf-proof-slide img,.vf-proof-image-shell img{width:100%!important;aspect-ratio:4/5!important;max-height:58vh!important;object-fit:cover!important}\n@media(max-width:767px){.vf-proof-prev,.vf-proof-next,.vf-proof-arrow{display:none!important}}\n';
if(!pwa.includes(MARK))pwa+='\n'+publicRuntime+'\n';
if(!pwa.includes(APP_MARK))pwa+='\n'+appRuntime+'\n';
if(!pwa.includes(RESULT_MARK))pwa+='\n/* '+RESULT_MARK+' */\n(function(){function clean(){if(location.pathname.indexOf(\'/results\')!==0)return;document.querySelectorAll(\'body *\').forEach(function(el){if(el.children.length>3)return;var tx=((el.textContent||\'\').replace(/\\s+/g,\' \').trim()).toUpperCase();if(tx===\'REAL VFITNESS CLIENT\'){var card=el.closest(\'.vf-proof-slide,article,section,div\');if(card&&!card.querySelector(\'img[src]\'))card.remove();}});}window.addEventListener(\'vf:ui-rendered\',function(){setTimeout(clean,100)});window.addEventListener(\'pageshow\',function(){setTimeout(clean,100)});})();\n';
if(!pwa.includes(PROGRAM_COPY_MARK))pwa+='\n/* '+PROGRAM_COPY_MARK+' · app programme copy is patched in the built shell while home-30day remains the stable data ID. */\n';

if(html.includes(legacyDuration))throw new Error('V2 duration fix did not remove the duplicated-unit renderer');
if(!html.includes("id:'home-30day',title:'HOME 45: 45 Day Get In Shape Plan'"))throw new Error('V2 HOME 45 customer-facing copy was not applied');

fs.writeFileSync(htmlPath,html);
fs.writeFileSync(homePath,home);
fs.writeFileSync(pwaPath,pwa);
fs.writeFileSync(cssPath,css);
console.log('Applied VFITNESS V2 execution layer.');
