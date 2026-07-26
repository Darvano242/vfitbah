module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const required = ['applicationId', 'name', 'phone', 'goal'];
    const missing = required.filter((key) => !String(body[key] || '').trim());
    if (missing.length) {
      return res.status(400).json({ ok: false, error: 'Missing required fields', missing });
    }

    const payload = {
      _subject: `New VFITNESS Application - ${body.name}`,
      _template: 'table',
      _captcha: 'false',
      applicationId: body.applicationId,
      name: body.name,
      email: body.email || 'Not provided',
      phone: body.phone,
      goal: body.goal,
      training: body.training || 'Not provided',
      trainer: body.trainer || 'No preference',
      location: body.location || 'Not provided',
      schedule: body.schedule || 'Not provided',
      days: body.days || 'Not provided',
      package: body.package || body.packageSize || 'Not provided',
      notes: body.notes || 'None',
      submittedAt: body.submittedAt || new Date().toISOString(),
      source: 'vfitbah.com Start Here'
    };

    const response = await fetch('https://formsubmit.co/ajax/vfitnessbahamas@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'User-Agent': 'VFITNESS-Application-Relay/1.0'
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    let providerResponse = null;
    try { providerResponse = JSON.parse(text); } catch (_) { providerResponse = text; }

    if (!response.ok) {
      console.error('Application relay provider failed', response.status, providerResponse);
      return res.status(502).json({ ok: false, error: 'Application relay failed' });
    }

    return res.status(200).json({ ok: true, applicationId: body.applicationId });
  } catch (error) {
    console.error('Application endpoint error', error);
    return res.status(500).json({ ok: false, error: 'Application could not be delivered' });
  }
};
