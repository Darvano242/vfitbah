const { createRelay } = require('../lib/relay.js');
// Notification Center (bookings, reminders, renewals over WhatsApp, SMS and email). Logic and keys live in the
// VFIT backend function siteNotify; this only relays same-origin requests with the visitor's sign-in token.
module.exports = createRelay('siteNotify', { maxBytes: 24576, timeoutMs: 25000 });
