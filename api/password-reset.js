const FIREBASE_WEB_API_KEY = process.env.FIREBASE_WEB_API_KEY || 'AIzaSyAcgUyJ0s7CxxdJeuw0GI1Ym9hiCjoh9e4';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, message: 'Method not allowed.' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ ok: false, code: 'INVALID_EMAIL', message: 'Enter the email address used for your VFitness account.' });
  }

  try {
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${encodeURIComponent(FIREBASE_WEB_API_KEY)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Firebase-Locale': 'en'
      },
      body: JSON.stringify({ requestType: 'PASSWORD_RESET', email })
    });

    const data = await response.json().catch(() => ({}));
    if (response.ok) {
      return res.status(200).json({ ok: true, email: data.email || email });
    }

    const firebaseMessage = String(data?.error?.message || 'PASSWORD_RESET_FAILED');
    console.error('[VFitness password reset]', firebaseMessage, { email });

    if (firebaseMessage.includes('EMAIL_NOT_FOUND')) {
      return res.status(404).json({ ok: false, code: 'EMAIL_NOT_FOUND', message: 'We could not find a VFitness account with that email. Check the spelling or contact VFitness so we can verify the email saved on your account.' });
    }
    if (firebaseMessage.includes('INVALID_EMAIL')) {
      return res.status(400).json({ ok: false, code: 'INVALID_EMAIL', message: 'That email address is not valid.' });
    }
    if (firebaseMessage.includes('TOO_MANY_ATTEMPTS') || firebaseMessage.includes('TOO_MANY_REQUESTS')) {
      return res.status(429).json({ ok: false, code: 'TOO_MANY_REQUESTS', message: 'Too many reset attempts were made. Wait a few minutes, then try again.' });
    }
    if (firebaseMessage.includes('OPERATION_NOT_ALLOWED')) {
      return res.status(503).json({ ok: false, code: 'OPERATION_NOT_ALLOWED', message: 'Password reset is temporarily unavailable. Please contact VFitness support.' });
    }

    return res.status(502).json({ ok: false, code: firebaseMessage, message: 'We could not send the reset email right now. Please try again.' });
  } catch (error) {
    console.error('[VFitness password reset] network error', error);
    return res.status(502).json({ ok: false, code: 'NETWORK_ERROR', message: 'We could not reach the password service. Check your connection and try again.' });
  }
};
