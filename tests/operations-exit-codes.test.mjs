import { expect, test } from '@jest/globals';
import { classifyOperation, exitCodes } from '../src/operations/exit-codes.mjs';

test('classifies operational failure outcomes', () => {
  expect(classifyOperation({ forced: true })).toBe(exitCodes.escalated);
  expect(classifyOperation({ outcome: { nonPrimary: true } })).toBe(exitCodes.nonPrimary);
  expect(classifyOperation({ data: { values: { wsrep_cluster_status: 'Non-Primary' } } })).toBe(exitCodes.nonPrimary);
  expect(classifyOperation({ outcome: { timedOut: true } })).toBe(exitCodes.incomplete);
  expect(classifyOperation({ timedOut: true })).toBe(exitCodes.incomplete);
  expect(classifyOperation({ outcome: { incomplete: true } })).toBe(exitCodes.incomplete);
  expect(classifyOperation({ eligible: false })).toBe(exitCodes.unsafe);
  expect(classifyOperation({ outcome: { ok: false } })).toBe(exitCodes.incomplete);
  expect(classifyOperation({ ok: false })).toBe(exitCodes.incomplete);
});
