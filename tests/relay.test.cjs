const test = require('node:test');
const assert = require('node:assert/strict');
const { createRelay } = require('../lib/relay');
function req(body, headers = {}) { return { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://www.vfitbah.com', 'x-real-ip': '1.2.3.4', ...headers }, body }; }
function res() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(n) { this.code = n; return this; }, json(b) { this.body = b; return this; } }; }

test('forwards JSON to the named backend function with the visitor address', async () => {
  let seen;
  const h = createRelay('groupSchedule', { fetchImpl: async (url, o) => { seen = { url, o }; return { status: 200, json: async () => ({ ok: true, groups: [] }) }; } });
  const r = res(); await h(req({ action: 'list' }), r);
  assert.equal(r.code, 200); assert.deepEqual(r.body, { ok: true, groups: [] });
  assert.match(seen.url, /functions\/groupSchedule$/); assert.equal(seen.o.headers['X-Forwarded-For'], '1.2.3.4');
  assert.equal(JSON.parse(seen.o.body).action, 'list'); assert.equal(r.headers['Cache-Control'], 'no-store');
});
test('accepts a text/plain beacon body', async () => {
  let body;
  const h = createRelay('siteTrack', { fetchImpl: async (u, o) => { body = JSON.parse(o.body); return { status: 200, json: async () => ({ ok: true, saved: 1 }) }; } });
  const r = res(); await h(req(JSON.stringify({ events: [{ event: 'page_view' }] }), { 'content-type': 'text/plain;charset=UTF-8' }), r);
  assert.equal(r.code, 200); assert.equal(body.events.length, 1);
});
test('passes backend error status and message through', async () => {
  const h = createRelay('groupSchedule', { fetchImpl: async () => ({ status: 401, json: async () => ({ ok: false, error: 'Please sign in' }) }) });
  const r = res(); await h(req({ action: 'reserve' }), r); assert.equal(r.code, 401); assert.equal(r.body.error, 'Please sign in');
});
test('guards method, type, origin, shape and size', async () => {
  const h = createRelay('groupSchedule', { maxBytes: 100, fetchImpl: () => { throw new Error('must not send'); } });
  let r = res(); await h({ ...req({}), method: 'GET' }, r); assert.equal(r.code, 405);
  r = res(); await h(req({}, { 'content-type': 'text/html' }), r); assert.equal(r.code, 415);
  r = res(); await h(req({}, { origin: 'https://evil.example' }), r); assert.equal(r.code, 403);
  r = res(); await h(req([1, 2]), r); assert.equal(r.code, 400);
  r = res(); await h(req('not json', { 'content-type': 'text/plain' }), r); assert.equal(r.code, 400);
  r = res(); await h(req({ a: 'x'.repeat(200) }), r); assert.equal(r.code, 413);
});
test('backend down gives a plain 502', async () => {
  const h = createRelay('groupSchedule', { fetchImpl: async () => { throw new Error('down'); } });
  const r = res(); await h(req({ action: 'list' }), r); assert.equal(r.code, 502); assert.equal(r.body.ok, false);
});
