// Same-origin relay from vfitbah.com to a VFIT backend function (Base44).
// Checks method, JSON, size and origin, forwards the visitor address for the backend's own rate limit,
// and passes the backend's JSON answer through. Bodies are never logged.
const BASE = 'https://vfit-core-flow.base44.app/api/apps/6a0105785d309cbb9ad53ee3/functions/';

function createRelay(fn, { maxBytes = 8192, fetchImpl = (...a) => fetch(...a), timeoutMs = 12000 } = {}) {
  return async function handler(req, res) {
    res.setHeader('Cache-Control', 'no-store');
    if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ ok: false, error: 'Method not allowed' }); }
    const type = req.headers?.['content-type'] || '';
    if (!/^(application\/json|text\/plain)(?:;|$)/i.test(type)) return res.status(415).json({ ok: false, error: 'JSON required' });
    if (Number(req.headers?.['content-length']) > maxBytes) return res.status(413).json({ ok: false, error: 'Request too large' });
    const origin = req.headers?.origin;
    if (origin) {
      const allowed = new Set(['https://vfitbah.com', 'https://www.vfitbah.com', 'https://preview.vfitbah.com']);
      for (const host of [process.env.VERCEL_URL, process.env.VERCEL_BRANCH_URL]) if (host) allowed.add(`https://${host}`);
      if (!allowed.has(origin)) return res.status(403).json({ ok: false, error: 'Origin not allowed' });
    }
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (_) { body = null; } }
    if (!body || typeof body !== 'object' || Array.isArray(body)) return res.status(400).json({ ok: false, error: 'Invalid request' });
    let text;
    try { text = JSON.stringify(body); } catch (_) { return res.status(400).json({ ok: false, error: 'Invalid request' }); }
    if (Buffer.byteLength(text) > maxBytes) return res.status(413).json({ ok: false, error: 'Request too large' });
    const address = String(req.headers?.['x-real-ip'] || (req.headers?.['x-forwarded-for'] || '').split(',')[0] || req.socket?.remoteAddress || 'unknown').trim();
    try {
      const r = await fetchImpl(BASE + fn, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Forwarded-For': address },
        body: text, signal: AbortSignal.timeout(timeoutMs) });
      let out = null;
      try { out = await r.json(); } catch (_) { out = null; }
      if (!out || typeof out !== 'object') return res.status(502).json({ ok: false, error: 'The schedule is not available right now' });
      return res.status(r.status >= 400 ? r.status : 200).json(out);
    } catch (error) {
      const timeout = error?.name === 'TimeoutError' || error?.name === 'AbortError';
      return res.status(timeout ? 504 : 502).json({ ok: false, error: timeout ? 'The request timed out' : 'The schedule is not available right now' });
    }
  };
}
module.exports = { createRelay, BASE };
