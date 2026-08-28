import { pollOperation } from '../src/operations/poll.mjs';

test('polls with default clock and sleep until the operation completes', async () => {
  let attempts = 0;
  await expect(pollOperation(async () => ({ done: ++attempts > 1 }), { timeoutMs: 100, intervalMs: 1 })).resolves.toEqual({ done: true });
  expect(attempts).toBe(2);
});
