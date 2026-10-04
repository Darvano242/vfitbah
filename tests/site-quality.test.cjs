const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '../site/index.html'), 'utf8');
const vf26 = fs.readFileSync(path.join(__dirname, '../vf26/vfit-2026.js'), 'utf8');

function vf26Packages() {
  const src = vf26.slice(vf26.indexOf('var PKG={') + 'var PKG='.length, vf26.indexOf('};', vf26.indexOf('var PKG={')) + 1);
  return Function(`return (${src});`)();
}

test('package savings are computed from prices, never hardcoded', () => {
  assert.ok(!/discount:\d/.test(vf26.slice(vf26.indexOf('var PKG={'), vf26.indexOf('function PricingPage('))));
  const legacy = html.slice(html.indexOf('const oneOnOnePackages=['), html.indexOf('const oneOnOnePackages=[') + 2000);
  assert.ok(!/discount:\d/.test(legacy.slice(0, legacy.indexOf('[oneOnOnePackages,semiPersonalPackages].forEach'))));
  const pkg = vf26Packages();
  const save = (list, n) => { const p = list.find(x => x.sessions === n); const full = list[0].price * n; return Math.round((full - p.price) / full * 1000) / 10; };
  assert.equal(save(pkg.semi, 8), 1.7);   // $173 against $176
  assert.equal(save(pkg.one, 8), 7.9);    // $221 against $240
  assert.equal(save(pkg.one, 12), 18.3);  // $294 against $360
  assert.ok(vf26.includes('function pkgSavings(pkg,single)'));
});

test('every public page has a distinct address that maps back to the same page', () => {
  const routes = Function(`return (${vf26.slice(vf26.indexOf('var ROUTES=') + 'var ROUTES='.length, vf26.indexOf('};', vf26.indexOf('var ROUTES=')) + 1)});`)();
  for (const page of ['home', 'pricing', 'trainers', 'results', 'about', 'contact', 'starthere', 'login']) assert.ok(routes[page], page);
  const paths = Object.values(routes); assert.equal(new Set(paths).size, paths.length);
  // The first render reads the same addresses, so a refresh lands on the right page.
  const map = html.slice(html.indexOf("const map={start:'starthere'"), html.indexOf('};', html.indexOf("const map={start:'starthere'")));
  for (const [seg, page] of [['services', 'pricing'], ['team', 'trainers'], ['company', 'about'], ['start', 'starthere'], ['portal', 'dashboard'], ['consultation', 'book']]) assert.ok(map.includes(`${seg}:'${page}'`) || map.includes(`'${seg}':'${page}'`), seg);
  assert.ok(vf26.includes("window.addEventListener('popstate',onPop)"));
  assert.ok(vf26.includes('history.pushState'));
});

test('intake fields have persistent labels, autocomplete and announced, field-linked errors', () => {
  const start = html.indexOf('function StartHereFlow('); const block = html.slice(start, html.indexOf('\n// ============================================', start));
  assert.ok(block.includes('htmlFor:id')); assert.ok(block.includes("'aria-invalid':e?'true':undefined"));
  assert.ok(block.includes("'aria-describedby'")); assert.ok(block.includes('role:"alert"'));
  for (const ac of ['ac:"name"', 'ac:"tel"', 'ac:"email"', 'ac:"new-password"']) assert.ok(block.includes(ac), ac);
  assert.ok(block.includes("vf_lead_location:'location'"), 'Train here preselects the location');
  assert.ok(block.includes("const goBack=()=>{setErr('');setFieldErrors({});"), 'going back clears errors');
  // Draft keeps choices only, never contact, health or password details.
  const fields = block.slice(block.indexOf('const DRAFT_FIELDS='), block.indexOf('];', block.indexOf('const DRAFT_FIELDS=')));
  for (const sensitive of ['whatsapp', 'email', 'password', 'injuries', 'name']) assert.ok(!fields.includes(`'${sensitive}'`), sensitive);
});

test('contact rule matches the application API: WhatsApp required with the same phone check', () => {
  const start = html.indexOf('function StartHereFlow('); const block = html.slice(start, html.indexOf('if(saved){', start));
  assert.ok(block.includes("String(v||'').replace(/\\D/g,'').length>=7"));
  const api = fs.readFileSync(path.join(__dirname, '../api/application.js'), 'utf8');
  assert.ok(api.includes("data.phone.replace(/\\D/g, '').length < 7"));
  assert.ok(api.includes("const REQUIRED = ['applicationId', 'name', 'phone', 'goal'];"));
});

test('one password recovery control, no native sign-in alerts', () => {
  assert.ok(!html.includes("document.addEventListener('DOMContentLoaded',injectForgotPassword);"));
  assert.ok(!/alert\('Please sign in first/.test(html + vf26));
  assert.ok(!html.includes("alert('Sign in first so we can save this to your account.')"));
  assert.ok(vf26.includes("window.addEventListener('vf:need-account',on)"));
});

test('page copy rewriters never touch script or style text', () => {
  const walkers = [];
  for (let i = html.indexOf('createTreeWalker('); i >= 0; i = html.indexOf('createTreeWalker(', i + 1)) {
    const call = html.slice(i, i + 320); if (call.slice(0, 120).includes('SHOW_TEXT')) walkers.push(call);
  }
  assert.ok(walkers.length >= 3);
  for (const w of walkers) assert.ok(w.includes('FILTER_REJECT'), w.slice(0, 120));
});

test('tabs, carousels and menu are keyboard and screen reader friendly', () => {
  assert.ok(vf26.includes("e.key==='ArrowRight'") && vf26.includes("e.key==='Home'") && vf26.includes("e.key==='End'"));
  assert.ok(vf26.includes("role:'tabpanel'"));
  assert.ok(vf26.includes("'Pause slideshow'") && html.includes("'Pause slideshow'"));
  assert.ok(!html.includes('gallery.slice(0,8)'), 'every result is reachable');
  assert.ok(vf26.includes("id:'vf26-menu-sheet'") && vf26.includes("e.key==='Escape'"));
});
