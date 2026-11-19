'use strict';
const assert = require('assert');
const { ReadOnlyDiag } = require('../kit/runtime/readonly-diag');
(async () => {
  const calls = [];
  const fakeDiag = {
    p: {}, available: true, error: null,
    init: async function () { return this; },
    physical: async (...args) => { calls.push(args); return [0x62, 0x44, 0xBE, 0x00, 0x01]; }
  };
  const d = Object.create(ReadOnlyDiag.prototype);
  d.ecu = 0x12; d.ready = true; d.error = null;
  d.stats = { sent: 0, replies: 0, missed: 0 }; d.diag = fakeDiag;
  const reply = await d.physical(0x12, 0x22, [0x44, 0xBE], 1000);
  assert(reply && reply[0] === 0x62);
  assert.strictEqual(d.stats.sent, 1);
  assert.strictEqual(d.stats.replies, 1);
  await assert.rejects(() => d.physical(0x12, 0x2E, [0x44, 0xBE], 1000), /0x22 only/);
  await assert.rejects(() => d.physical(0x18, 0x22, [0x44, 0xBE], 1000), /restricted/);
  await assert.rejects(() => d.physical(0x12, 0x22, [0x44], 1000), /16-bit DID/);
  assert.strictEqual(calls.length, 1);
  console.log('readonly-diag: OK');
})().catch((e) => { console.error(e); process.exit(1); });
