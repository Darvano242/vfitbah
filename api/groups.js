const { createRelay } = require('../lib/relay.js');
module.exports = createRelay('groupSchedule', { maxBytes: 8192 });
