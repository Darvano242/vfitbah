const fs = require('fs');
const path = require('path');

const file = path.join(process.cwd(), 'site', 'index.html');
let html = fs.readFileSync(file, 'utf8');

const apiMarker = "fetch('/api/password-reset'";
const normalizeMarker = "String(email||'').trim().toLowerCase()";

// Production/preview builds can run this transformer against an already-hardened
// bundle. Treat that as success instead of failing on a marker that was already
// replaced by an earlier build pass.
if (html.includes(apiMarker) && html.includes(normalizeMarker)) {
  console.log('Password reset flow already hardened; verified final bundle.');
  process.exit(0);
}

const handlerPattern = /const\s+handlePasswordReset\s*=\s*async\s*\(\s*\)\s*=>\s*\{/;
const match = handlerPattern.exec(html);
if (!match) {
  throw new Error('Password reset handler was not found and the hardened reset flow is not present');
}

const startIndex = match.index;
const openBraceIndex = html.indexOf('{', startIndex);

function findFunctionEnd(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }

    if (ch === "'" || ch === '"' || ch === '`') {
      quote = ch;
      continue;
    }
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) {
        let end = i + 1;
        while (/\s/.test(source[end] || '')) end += 1;
        if (source[end] === ';') end += 1;
        return end;
      }
    }
  }

  return -1;
}

const endIndex = findFunctionEnd(html, openBraceIndex);
if (endIndex < 0) {
  throw new Error('Password reset handler end could not be determined safely');
}

const replacement = `const handlePasswordReset=async()=>{setError('');setResetMessage('');const cleanEmail=String(email||'').trim().toLowerCase();if(!cleanEmail){setError('Please enter your email address first, then tap Forgot Password.');return;}if(!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(cleanEmail)){setError('Enter the email address used for your VFitness account.');return;}setResetLoading(true);try{let response=null;try{response=await fetch('/api/password-reset',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:cleanEmail})});}catch(networkError){console.warn('[VFitness reset] API unavailable, falling back to Firebase SDK',networkError);}if(response){const data=await response.json().catch(()=>({}));if(!response.ok){throw new Error(data.message||'Unable to send password reset email.');}setResetMessage('Reset email sent to '+cleanEmail+'. Check your inbox, spam, and junk folders. The link may take a minute or two to arrive.');}else{await auth.sendPasswordResetEmail(cleanEmail);setResetMessage('Reset email sent to '+cleanEmail+'. Check your inbox, spam, and junk folders. The link may take a minute or two to arrive.');}}catch(err){console.error('[VFitness reset] failed',err);setError(err.message||'Unable to send password reset email. Please try again or contact VFitness support.');}finally{setResetLoading(false);}};`;

html = html.slice(0, startIndex) + replacement + html.slice(endIndex);

if (!html.includes(apiMarker)) {
  throw new Error('Password reset API route was not wired into the final bundle');
}
if (!html.includes(normalizeMarker)) {
  throw new Error('Password reset email normalization was not applied');
}

fs.writeFileSync(file, html);
console.log('Hardened VFitness password reset flow.');
