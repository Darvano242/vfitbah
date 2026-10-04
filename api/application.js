const { createHash } = require('node:crypto');

const LIMITS = { applicationId: 100, name: 120, email: 254, phone: 40, goal: 300,
  training: 120, trainer: 120, location: 160, schedule: 300, days: 160,
  package: 160, packageSize: 160, notes: 2000, submittedAt: 50, website: 200 };
const REQUIRED = ['applicationId', 'name', 'phone', 'goal'];
const WINDOW_MS = 60000;
const SAVE_URL = 'https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/submitApplication';
const MAX_ENTRIES = 1000;

function validate(body) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null;
  let bytes;
  try { bytes = Buffer.byteLength(JSON.stringify(body)); } catch (_) { return null; }
  if (bytes > 16384) return null;
  const data = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    if (body[key] === undefined) { data[key] = ''; continue; }
    if (typeof body[key] !== 'string' || body[key].length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(body[key])) return null;
    data[key] = body[key].trim();
  }
  if (REQUIRED.some(key => !data[key]) || data.website) return null;
  if (!/^[a-zA-Z0-9_-]+$/.test(data.applicationId)) return null;
  if (!/^[+()\d\s.\-]+$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 7) return null;
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return null;
  if (data.submittedAt && !Number.isFinite(Date.parse(data.submittedAt))) return null;
  return data;
}

function createHandler({ fetchImpl = (...args) => fetch(...args), now = Date.now } = {}) {
  // Best effort within one warm instance; durable abuse protection belongs at the edge.
  const requests = new Map();
  const deliveries = new Map();
  function bound(map) { while (map.size > MAX_ENTRIES) map.delete(map.keys().next().value); }
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST');
      return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    if (!/^application\/json(?:;|$)/i.test(req.headers?.['content-type'] || '')) {
      return res.status(415).json({ ok: false, error: 'JSON required' });
    }
    if (Number(req.headers?.['content-length']) > 16384) return res.status(413).json({ ok: false, error: 'Request too large' });
    const origin = req.headers?.origin;
    if (origin) {
      const allowed = new Set(['https://vfitbah.com', 'https://www.vfitbah.com', 'https://preview.vfitbah.com']);
      for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) {
        if (host) allowed.add(`https://${host}`);
      }
      if (!allowed.has(origin)) return res.status(403).json({ ok: false, error: 'Origin not allowed' });
    }
    const data = validate(req.body);
    if (!data) return res.status(400).json({ ok: false, error: 'Invalid application fields' });
    const clock = now();
    for (const [key, entry] of requests) if (entry.expires <= clock) requests.delete(key);
    for (const [key, entry] of deliveries) if (entry.expires <= clock) deliveries.delete(key);
    const address = req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
    const client = createHash('sha256').update(String(address)).digest('hex');
    const quota = requests.get(client) || { count: 0, expires: clock + WINDOW_MS };
    if (++quota.count > 5) {
      res.setHeader('Retry-After', String(Math.max(1, Math.ceil((quota.expires - clock) / 1000))));
      return res.status(429).json({ ok: false, error: 'Please try again shortly' });
    }
    requests.set(client, quota); bound(requests);
    const key = createHash('sha256').update(JSON.stringify(data)).digest('hex');
    let delivery = deliveries.get(key);
    if (!delivery) {
      delivery = { expires: clock + 600000, promise: null };
      delivery.promise = (async () => {
        const payload = { _subject: `New VFITNESS Application - ${data.name.replace(/[\r\n]/g, ' ')}`,
          _template: 'table', _captcha: 'false', applicationId: data.applicationId,
          name: data.name, email: data.email || 'Not provided', phone: data.phone, goal: data.goal,
          training: data.training || 'Not provided', trainer: data.trainer || 'No preference',
          location: data.location || 'Not provided', schedule: data.schedule || 'Not provided',
          days: data.days || 'Not provided', package: data.package || data.packageSize || 'Not provided',
          notes: data.notes || 'None', submittedAt: data.submittedAt || new Date(clock).toISOString(),
          source: 'vfitbah.com Start Here' };
        // 1) Save the application in the VFIT backend (Base44), which also emails the team.
        //    Only a confirmed save counts; an email alone is a fallback, never the record.
        const secret = process.env.VFIT_RELAY_SECRET;
        try {
          const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
          if (secret) headers['x-vfit-relay'] = secret;
          const saved = await fetchImpl(SAVE_URL, {
            method: 'POST', headers,
            body: JSON.stringify({ ...payload, source: 'vfitbah.com Start Here' }), signal: AbortSignal.timeout(12000) });
          const result = await saved.json();
          if (saved.ok && result.ok === true) return;
        } catch (_) { /* fall through to the email fallback */ }
        // 2) Fallback: email the application so the lead is not lost while the backend is down.
        const response = await fetchImpl('https://formsubmit.co/ajax/vfitnessbahamas@gmail.com', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(payload), signal: AbortSignal.timeout(10000) });
        const provider = await response.json();
        if (!response.ok || !(provider.success === true || provider.success === 'true')) throw new Error('Provider rejected delivery');
      })();
      deliveries.set(key, delivery); bound(deliveries);
    }
    try {
      await delivery.promise;
      return res.status(200).json({ ok: true, applicationId: data.applicationId });
    } catch (error) {
      deliveries.delete(key);
      // Never log the provider body, request fields, or contact details.
      const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
      return res.status(timeout ? 504 : 502).json({ ok: false, error: timeout ? 'Delivery timed out' : 'Application could not be delivered' });
    }
  };
}
module.exports = createHandler();
module.exports.createHandler = createHandler;
