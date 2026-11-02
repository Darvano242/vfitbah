const { createRelay } = require('../lib/relay.js');
module.exports = createRelay('siteTrack', { maxBytes: 6144, timeoutMs: 8000 });
