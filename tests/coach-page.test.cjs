const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const page = fs.readFileSync(path.join(__dirname, '../site/coach/index.html'), 'utf8');
const { createHandler } = require('../api/application.js');

// Runs the page's own inline script against a small stand-in for the form, and returns what it would send.
function submitFrom(values, checked = []) {
  const script = /<script>\s*([\s\S]*?)<\/script>\s*<\/body>/.exec(page)[1];
  const sent = [];
  const el = (value = '') => ({ value, focus() {} });
  const elements = {};
  for (const name of ['name', 'phone', 'email', 'experience', 'certification', 'where', 'link', 'why', 'website']) elements[name] = el(values[name] || '');
  let onSubmit;
  const form = { elements, hidden: false, addEventListener: (_, fn) => { onSubmit = fn; },
    querySelectorAll: () => checked.map(value => ({ value })) };
  const status = { textContent: '', className: '' }, btn = { disabled: false }, done = { hidden: true, focus() {} };
  const document = { getElementById: id => ({ 'coach-form': form, 'coach-status': status, 'coach-submit': btn, 'coach-done': done }[id]) };
  const fetch = (url, init) => { sent.push({ url, init }); return new Promise(() => {}); };
  Function('document', 'fetch', script)(document, fetch);
  onSubmit({ preventDefault() {} });
  return { sent, status };
}

function respond() {
  const res = { headers: {}, code: 0, body: null };
  res.setHeader = (k, v) => { res.headers[k] = v; };
  res.status = code => { res.code = code; return res; };
  res.json = body => { res.body = body; return res; };
  return res;
}

test('coach page: public copy has no dashes, no pay figures and no "our gyms"', () => {
  const text = page.replace(/<script>[\s\S]*?<\/script>/g, '').replace(/<style>[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  assert.equal(/[–—]/.test(text), false, 'no en or em dashes in copy');
  assert.equal(/\d+\s?%/.test(text), false, 'the commission split is never published');
  assert.equal(/\$\s?\d/.test(text), false, 'no earnings figures on the public page');
  assert.equal(/our gyms?/i.test(text), false);
  assert.ok(page.includes('<link rel="canonical" href="https://www.vfitbah.com/coach">'));
  assert.ok(fs.readFileSync(path.join(__dirname, '../site/sitemap.xml'), 'utf8').includes('https://www.vfitbah.com/coach'));
});

test('coach page: a filled form is accepted by the real application endpoint and is labelled as a coach application', async () => {
  const { sent } = submitFrom({ name: 'Sample Applicant', phone: '(242) 555-0100', email: 'applicant@example.com', experience: '1 to 3 years',
    certification: 'ISSA CPT', where: 'Independent', link: '@sample', why: 'I want a full client list.\nSecond line.' }, ['Early mornings', 'Evenings']);
  assert.equal(sent.length, 1);
  assert.equal(sent[0].url, '/api/application');
  const body = JSON.parse(sent[0].init.body);
  assert.match(body.applicationId, /^coach-[a-z0-9-]+$/);
  assert.equal(body.training, 'Coach application');
  assert.ok(body.goal.startsWith('COACH APPLICATION.'));
  assert.equal(body.schedule, 'Early mornings, Evenings');
  assert.ok(body.notes.includes('Why VFITNESS: I want a full client list.'));
  let saved = null;
  const handler = createHandler({ fetchImpl: async (url, init) => { saved = JSON.parse(init.body); return { ok: true, json: async () => ({ ok: true }) }; } });
  const res = respond();
  await handler({ method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.vfitbah.com' }, body, socket: {} }, res);
  assert.equal(res.code, 200);
  assert.equal(res.body.ok, true);
  assert.equal(saved.training, 'Coach application');
});

test('coach page: missing name, bad phone or missing experience never reaches the server', () => {
  assert.equal(submitFrom({ phone: '2425550100', experience: 'Under 1 year' }).sent.length, 0);
  assert.equal(submitFrom({ name: 'Sample Applicant', phone: 'call me', experience: 'Under 1 year' }).sent.length, 0);
  assert.equal(submitFrom({ name: 'Sample Applicant', phone: '2425550100' }).sent.length, 0);
  const bad = submitFrom({ name: 'Sample Applicant', phone: '2425550100', experience: 'Under 1 year', email: 'not-an-email' });
  assert.equal(bad.sent.length, 0);
  assert.equal(bad.status.className, 'status bad');
});

test('coach page: the longest allowed answers still fit the endpoint limits', async () => {
  const { sent } = submitFrom({ name: 'N'.repeat(120), phone: '2425550100', experience: 'More than 5 years', certification: 'C'.repeat(100),
    where: 'W'.repeat(120), link: 'L'.repeat(120), why: 'Y'.repeat(1200) }, ['Early mornings', 'Daytime', 'Evenings', 'Weekends']);
  const body = JSON.parse(sent[0].init.body);
  assert.ok(body.goal.length <= 300 && body.notes.length <= 2000 && body.location.length <= 160);
  const handler = createHandler({ fetchImpl: async () => ({ ok: true, json: async () => ({ ok: true }) }) });
  const res = respond();
  await handler({ method: 'POST', headers: { 'content-type': 'application/json' }, body, socket: {} }, res);
  assert.equal(res.code, 200);
});
