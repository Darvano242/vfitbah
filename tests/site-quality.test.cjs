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
  assert.equal(save(pkg.semi, 8), 38.2);  // $173 against $280 (single session $35)
  assert.equal(save(pkg.one, 8), 44.8);   // $221 against $400 (single session $50)
  assert.equal(save(pkg.one, 12), 51);    // $294 against $600
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

test('package savings below 5% are not advertised, and there is no floating Ask Coach button', () => {
  assert.ok(vf26.includes('var MIN_SAVE_PCT=5;'));
  const fn = Function(vf26.slice(vf26.indexOf('var MIN_SAVE_PCT'), vf26.indexOf('window.vfPkgSavings')) + ';return pkgSavings;')();
  assert.equal(fn({ sessions: 4, price: 87 }, 22).amount, 0);   // $1 off $88 is not a saving worth claiming
  assert.equal(fn({ sessions: 12, price: 195 }, 22).pctLabel, '26%');
  assert.ok(html.includes('p.discount=pct>=5?pct:0'));
  assert.ok(!html.includes("b.textContent='Ask Coach'"));
});

test('single sessions are $35 semi private and $50 1 on 1, and package prices are unchanged', () => {
  const pkg = vf26Packages();
  assert.deepEqual(pkg.semi.map(p => p.price), [35, 87, 130, 173, 195]);
  assert.deepEqual(pkg.one.map(p => p.price), [50, 120, 180, 221, 294]);
  assert.ok(html.includes("'1on1':{1:50,4:120,6:180,8:221,12:294}"));
  assert.ok(html.includes("Object.assign({1:35,4:87,6:130,8:173,12:195},vfCommitLive?{36:495}:{})"));
  assert.ok(html.includes('{sessions:1,price:35,title:"Single Semi Personal Session"}'));
});

test('3 month commitment: 36 sessions, $495, 135 days, gone after December 20 2026 Nassau time', () => {
  const src = vf26.slice(vf26.indexOf('var COMMIT3='), vf26.indexOf('window.vfCommit3=COMMIT3'));
  const { COMMIT3, commitLive } = Function(`${src};return {COMMIT3,commitLive};`)();
  assert.equal(COMMIT3.sessions, 36); assert.equal(COMMIT3.price, 495); assert.equal(COMMIT3.expiryDays, 135);
  assert.equal(commitLive(Date.parse('2026-12-20T23:30:00-05:00')), true);
  assert.equal(commitLive(Date.parse('2026-12-21T00:00:30-05:00')), false);
  // Admin form uses the same cut-off, and both checkout paths carry the longer validity onto the package.
  assert.ok(html.includes("Date.now()<=Date.parse('2026-12-21T04:59:59Z')"));
  assert.equal(html.split('selectedPackage.expiryDays?{expiryDays:selectedPackage.expiryDays').length - 1, 2);
  const policy = fs.readFileSync(path.join(__dirname, '../scripts/apply-package-policy.js'), 'utf8');
  assert.ok(policy.includes('sessionCount===36?135:45'));
  assert.ok(policy.includes('Number(pkg.expiryDays)>45?Number(pkg.expiryDays):45'));
});

test('retention plan: renewals due, lapsed clients split by recency, open group places', () => {
  const start = vf26.indexOf('var RT_LOW='), end = vf26.indexOf('window.vfRetentionPlan=rtPlan');
  const tdDate = v => (v && v.toDate ? v.toDate() : v ? new Date(v) : null);
  const { rtPlan, rtSeats, rtPhone } = Function('tdDate', 'h', 'icon', `${vf26.slice(start, end)};return {rtPlan,rtSeats,rtPhone};`)(tdDate, () => null, () => null);
  const now = Date.parse('2026-11-13T12:00:00-05:00'), DAY = 86400000;
  const clients = ['a', 'b', 'c', 'd', 'e'].map(id => ({ id, name: id.toUpperCase() }));
  const pkgs = [
    { id: 'p1', clientId: 'a', status: 'active', sessionsRemaining: 2, expiryDate: now + 30 * DAY },   // low balance
    { id: 'p2', clientId: 'b', status: 'active', sessionsRemaining: 9, expiryDate: now + 3 * DAY },    // expiring soon
    { id: 'p3', clientId: 'c', status: 'active', sessionsRemaining: 8, expiryDate: now + 30 * DAY },   // fine
    { id: 'p4', clientId: 'd', status: 'completed', sessionsRemaining: 0, completedAt: now - 10 * DAY } // lapsed recently
  ];
  const plan = rtPlan(pkgs, [], clients, now);
  assert.deepEqual(plan.due.map(r => r.pkg.id), ['p1', 'p2']);
  assert.deepEqual(plan.recent.map(r => r.client.id), ['d']);
  assert.deepEqual(plan.older.map(r => r.client.id), ['e']);
  // A paused package still counts as a current client; an expired active one does not.
  assert.equal(rtPlan([{ id: 'x', clientId: 'a', status: 'paused', sessionsRemaining: 5, expiryDate: now - DAY }], [], [clients[0]], now).older.length, 0);
  assert.equal(rtPlan([{ id: 'x', clientId: 'a', status: 'active', sessionsRemaining: 5, expiryDate: now - DAY }], [{ clientId: 'a', createdAt: now - 2 * DAY }], [clients[0]], now).recent.length, 1);
  const seats = rtSeats([{ id: 'g1', status: 'open', seats: [{ state: 'confirmed' }, { state: 'free' }, { state: 'free' }, { state: 'held' }], waitlist: [] },
    { id: 'g2', status: 'open', seats: [{ state: 'confirmed' }], waitlist: [] }, { id: 'g3', status: 'closed', seats: [{ state: 'free' }], waitlist: [] }]);
  assert.equal(seats.total, 2); assert.deepEqual(seats.rows.map(r => r.g.id), ['g1']);
  assert.equal(rtPhone('454-9063'), '12424549063'); assert.equal(rtPhone('(242) 454-9063'), '12424549063'); assert.equal(rtPhone('123'), '');
});
