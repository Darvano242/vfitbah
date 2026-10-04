const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const file = path.join(process.cwd(), 'site/index.html');
let html = fs.readFileSync(file, 'utf8');
const MARKER = 'VFIT_AUTH_LIFECYCLE_20261004';
if (!html.includes(MARKER)) {
  const start = html.indexOf('useEffect(()=>{const unsubscribe=auth.onAuthStateChanged(');
  const endToken = 'return unsubscribe;},[]);';
  const end = html.indexOf(endToken, start);
  if (start < 0 || end < start) throw new Error('Expected auth lifecycle block missing; refusing partial patch.');
  const replacement = `useEffect(()=>{/* ${MARKER} */let disposed=false;let generation=0;const timers=new Set();const clearTimers=()=>{timers.forEach(clearTimeout);timers.clear();};const unsubscribe=auth.onAuthStateChanged(async nextUser=>{const revision=++generation;clearTimers();const current=()=>!disposed&&revision===generation&&auth.currentUser?.uid===nextUser?.uid;setUser(null);setIsAdmin(false);setShowOnboarding(false);setShowNotificationPrompt(false);if(!nextUser||nextUser.isAnonymous){setLoading(false);return;}setLoading(true);let profileTimer;try{const userDoc=await Promise.race([db.collection('users').doc(nextUser.uid).get(),new Promise((_,reject)=>{profileTimer=setTimeout(()=>reject(new Error('Profile loading timed out')),10000);timers.add(profileTimer);})]);clearTimeout(profileTimer);timers.delete(profileTimer);if(!current())return;const userData=userDoc.exists?(userDoc.data()||{}):{};setUser({...userData,uid:nextUser.uid,email:nextUser.email,displayName:nextUser.displayName});const staff=userData.role==='admin'||userData.role==='trainer';setIsAdmin(staff);const applying=!!window.__vfApplySignup;if(!applying)setCurrentPage(staff?'admin':'dashboard');if(!staff){setShowOnboarding(!userData.onboardingCompleted&&!applying);const postSignupTab=localStorage.getItem('vfitness-post-signup-tab');if(postSignupTab){localStorage.removeItem('vfitness-post-signup-tab');const timer=setTimeout(()=>{timers.delete(timer);if(current()&&confirm('Your account is ready. Open your program now?')){setDashboardTab('onlineprograms');setCurrentPage('dashboard');}},700);timers.add(timer);}const timer=setTimeout(()=>{timers.delete(timer);if(current()&&'Notification'in window&&Notification.permission==='default')setShowNotificationPrompt(true);},8000);timers.add(timer);}}catch(error){if(current()){console.error('Unable to load account profile');setUser(null);setIsAdmin(false);}}finally{clearTimeout(profileTimer);timers.delete(profileTimer);if(current())setLoading(false);}});return()=>{disposed=true;++generation;clearTimers();unsubscribe();};},[]);`;
  html = html.slice(0, start) + replacement + html.slice(end + endToken.length);
}

const INTAKE_MARKER = 'VFIT_GUIDED_INTAKE_RELAY_20261004';
if (!html.includes(INTAKE_MARKER)) {
  const component = html.search(/function (?:VFLegacy)?StartHereFlow\(/);
  const start = html.indexOf("  try{if(typeof emailjs!=='undefined'", component);
  const endToken = 'catch(eM){}';
  const end = html.indexOf(endToken, start);
  if (component < 0 || start < component || end < start) throw new Error('Guided intake delivery block missing.');
  const relay = `  /* ${INTAKE_MARKER} */const controller=new AbortController();const deliveryTimer=setTimeout(()=>controller.abort(),15000);try{const response=await fetch('/api/application',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},signal:controller.signal,body:JSON.stringify({applicationId,name:data.name,email:data.email||'',phone:data.whatsapp,goal:data.goal,training:data.trainingType,trainer:data.trainer,location:data.location,schedule:data.times.join(', '),days:data.daysPerWeek,package:data.packageInterest,notes:data.goalNote||'',submittedAt:new Date(createdAtClient).toISOString()})});const result=await response.json();if(response.ok&&result.ok===true)saved=true;}catch(_){/* A Firestore success still counts as a saved application. */}finally{clearTimeout(deliveryTimer);}`;
  html = html.slice(0, start) + relay + html.slice(end + endToken.length);
}

// Bound the older application page relay as well as the guided flow.
html = html.replace("const intakeResponse=await fetch('/api/application',{method:'POST',headers:", "const intakeResponse=await fetch('/api/application',{method:'POST',signal:AbortSignal.timeout(15000),headers:")
  .replace('if(intakeResponse.ok){netlifySaved=true;}', 'if(intakeResponse.ok&&(await intakeResponse.json()).ok===true){netlifySaved=true;}');

// Payment and booking details belong in protected records, never browser debug logs.
html = html.replaceAll("console.log('Payment successful:',order);", '')
  .replaceAll("console.log('Booking appointment:',appointmentData);", '');
let count = 0;
for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
  if (/\bsrc\s*=|application\/ld\+json/i.test(match[1]) || !match[2].trim()) continue;
  new vm.Script(match[2], { filename: `site/index.html:inline-${++count}` });
}
if (!count) throw new Error('No app scripts found.');
fs.writeFileSync(file, html);
console.log(`Verified ${count} inline scripts after account lifecycle hardening.`);
