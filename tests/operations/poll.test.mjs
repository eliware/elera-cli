import { expect, test } from '@jest/globals';
import { pollOperation } from '../../src/operations/poll.mjs';

test('polls until complete and reports timeout', async () => {
  let calls = 0; let clock = 0;
  await expect(pollOperation(async () => ({ done: ++calls > 1 }), { now: () => clock, sleep: async () => { clock += 1; }, timeoutMs: 5 })).resolves.toMatchObject({ done: true });
  await expect(pollOperation(async () => ({ done: false }), { now: () => clock, sleep: async () => { clock += 10; }, timeoutMs: 5 })).resolves.toMatchObject({ done: false, timedOut: true });
});

test('uses the default clock and sleep path for an immediate completion', async () => {
  await expect(pollOperation(async () => ({ done: true }))).resolves.toEqual({ done: true });
});

test('uses the default sleep path while waiting', async () => {
  await expect(pollOperation(async () => ({ done: false }), { timeoutMs: 1, intervalMs: 1 })).resolves.toMatchObject({ done: false, timedOut: true });
});

test('enters the bounded wait branch before timing out', async () => {
  const values = [0, 0, 0, 1, 6]; let index = 0;
  await expect(pollOperation(async () => ({ done: false }), { timeoutMs: 5, now: () => values[Math.min(index++, values.length - 1)], sleep: async () => {} })).resolves.toMatchObject({ timedOut: true });
});
