const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'site', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const start = "const handlePasswordReset=async()=>{";
const end = ";};// SUCCESS / WELCOME ANIMATION";
const startIndex = html.indexOf(start);
const endIndex = html.indexOf(end, startIndex);

if (startIndex < 0 || endIndex < 0) {
  throw new Error('Password reset handler markers were not found');
}

const replacement = `const handlePasswordReset=async()=>{setError('');setResetMessage('');const cleanEmail=String(email||'').trim().toLowerCase();if(!cleanEmail){setError('Please enter your email address first, then tap Forgot Password.');return;}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail)){setError('Enter the email address used for your VFitness account.');return;}setResetLoading(true);try{let response=null;try{response=await fetch('/api/password-reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:cleanEmail})});}catch(networkError){console.warn('[VFitness reset] API unavailable, falling back to Firebase SDK',networkError);}if(response){const data=await response.json().catch(()=>({}));if(!response.ok){throw new Error(data.message||'Unable to send password reset email.');}setResetMessage('Reset email sent to '+cleanEmail+'. Check your inbox, spam, and junk folders. The link may take a minute or two to arrive.');}else{await auth.sendPasswordResetEmail(cleanEmail);setResetMessage('Reset email sent to '+cleanEmail+'. Check your inbox, spam, and junk folders. The link may take a minute or two to arrive.');}}catch(err){console.error('[VFitness reset] failed',err);setError(err.message||'Unable to send password reset email. Please try again or contact VFitness support.');}finally{setResetLoading(false);}}`;

html = html.slice(0, startIndex) + replacement + html.slice(endIndex + 2);

if (!html.includes("fetch('/api/password-reset'")) {
  throw new Error('Password reset API route was not wired into the final bundle');
}
if (!html.includes("String(email||'').trim().toLowerCase()")) {
  throw new Error('Password reset email normalization was not applied');
}

fs.writeFileSync(file, html);
console.log('Hardened VFitness password reset flow.');
