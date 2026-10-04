const test = require('node:test');
const assert = require('node:assert/strict');
const { createHandler } = require('../api/application');
const fields = { applicationId: 'VF-123', name: 'Test Client', phone: '+1 242 555 0123', email: 'test@example.com', goal: 'Strength' };
function request(body = fields, headers = {}) { return { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.vfitbah.com', ...headers }, body, socket: { remoteAddress: '127.0.0.1' } }; }
function response() { return { headers: {}, setHeader(k,v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, json(body) { this.body = body; return this; } }; }
const success = async () => ({ ok: true, json: async () => ({ success: 'true' }) }); // FormSubmit shape; the save endpoint treats it as not saved, so these tests exercise the email fallback
test('valid application relays only allowlisted fields and confirms provider acceptance', async () => {
  let sent;
  const handler = createHandler({ fetchImpl: async (url, options) => { sent = JSON.parse(options.body); assert.ok(options.signal); return /submitApplication/.test(url) ? { ok: true, json: async () => ({ ok: true }) } : success(); } });
  const res = response(); await handler(request({ ...fields, secret: 'never relay' }), res);
  assert.equal(res.code, 200); assert.equal(res.body.ok, true); assert.equal(sent.secret, undefined); assert.equal(res.headers['Cache-Control'], 'no-store');
});
for (const [label, body] of [['objects', { ...fields, name: {} }], ['oversized field', { ...fields, notes: 'a'.repeat(2001) }], ['invalid email', { ...fields, email: 'bad' }], ['invalid phone', { ...fields, phone: 'no phone' }], ['missing goal', { ...fields, goal: '' }], ['honeypot', { ...fields, website: 'spam' }], ['invalid date', { ...fields, submittedAt: 'bad' }], ['oversized body', { ...fields, extra: 'x'.repeat(17000) }]]) {
  test(`rejects ${label} before delivery`, async () => {
    const handler = createHandler({ fetchImpl: () => { throw new Error('Must not send'); } });
    const res = response(); await handler(request(body), res); assert.equal(res.code, 400);
  });
}
test('method, content type, origin and declared size are guarded', async () => {
  const handler = createHandler({ fetchImpl: success });
  for (const [req, code] of [[{ ...request(), method: 'GET' },405], [request(fields, { 'content-type': 'text/plain' }),415], [request(fields, { origin: 'https://attacker.example' }),403], [request(fields, { 'content-length': '17000' }),413]]) {
    const res = response(); await handler(req, res); assert.equal(res.code, code);
  }
});
test('HTTP 200 with provider rejection or invalid JSON is a failure', async () => {
  for (const json of [async () => ({ success: false, ok: false }), async () => { throw new SyntaxError(); }]) {
    const res = response(); await createHandler({ fetchImpl: async () => ({ ok: true, json }) })(request(), res); assert.equal(res.code, 502); assert.equal(res.body.ok, false);
  }
});
test('provider timeout returns a bounded failure', async () => {
  const res = response(); await createHandler({ fetchImpl: async () => { throw Object.assign(new Error(), { name: 'TimeoutError' }); } })(request(), res); assert.equal(res.code, 504);
});
test('concurrent exact retries share a delivery within the instance', async () => {
  let calls = 0; const handler = createHandler({ fetchImpl: async () => { calls++; return success(); } });
  const results = [response(), response()]; await Promise.all(results.map(res => handler(request(), res)));
  assert.equal(calls, 2); // one save attempt + one fallback, shared by both requests assert.ok(results.every(res => res.code === 200));
});
test('failed delivery can be retried; warm-instance quota expires', async () => {
  let clock = 0, calls = 0;
  const handler = createHandler({ now: () => clock, fetchImpl: async (url) => { if (/submitApplication/.test(url)) throw new Error(); if (++calls === 1) throw new Error(); return success(); } });
  const failed = response(); await handler(request(), failed); assert.equal(failed.code, 502);
  const retry = response(); await handler(request(), retry); assert.equal(retry.code, 200);
  for (let i=0;i<3;i++) await handler(request(), response());
  const limited=response(); await handler(request(), limited); assert.equal(limited.code,429); assert.equal(limited.headers['Retry-After'],'60');
  clock=60001; const later=response(); await handler(request(),later); assert.equal(later.code,200);
});
test('Vercel build command fits its platform schema limit',()=>{
  const config=require('../vercel.json');assert.ok(config.buildCommand.length<=256);
});
test('with the relay secret, a confirmed backend save is the acknowledgement and no fallback email is sent', async () => {
  process.env.VFIT_RELAY_SECRET = 'test-secret'; const urls = [];
  try {
    const handler = createHandler({ fetchImpl: async (url, options) => { urls.push(url); assert.equal(options.headers['x-vfit-relay'], 'test-secret'); return { ok: true, json: async () => ({ ok: true }) }; } });
    const res = response(); await handler(request(), res);
    assert.equal(res.code, 200); assert.equal(urls.length, 1); assert.match(urls[0], /functions\/submitApplication$/);
  } finally { delete process.env.VFIT_RELAY_SECRET; }
});
test('when the backend save fails, the email fallback still delivers the lead', async () => {
  process.env.VFIT_RELAY_SECRET = 'test-secret'; const urls = [];
  try {
    const handler = createHandler({ fetchImpl: async (url) => { urls.push(url); if (/submitApplication/.test(url)) return { ok: false, json: async () => ({ ok: false }) }; return success(); } });
    const res = response(); await handler(request(), res);
    assert.equal(res.code, 200); assert.equal(urls.length, 2); assert.match(urls[1], /formsubmit/);
  } finally { delete process.env.VFIT_RELAY_SECRET; }
});
test('without the relay secret the save is still attempted, with no secret header', async () => {
  const seen = [];
  const handler = createHandler({ fetchImpl: async (url, options) => { seen.push([url, options.headers['x-vfit-relay']]); return { ok: true, json: async () => ({ ok: true }) }; } });
  const res = response(); await handler(request(), res);
  assert.equal(res.code, 200); assert.equal(seen.length, 1); assert.match(seen[0][0], /submitApplication/); assert.equal(seen[0][1], undefined);
});
