import { expect, jest, test } from '@jest/globals';
import { withRetry } from '../../src/transport/retry.mjs';

test('retries failures with bounded backoff and returns success', async () => {
  const operation = jest.fn().mockRejectedValueOnce(new Error('temporary')).mockResolvedValue('ok');
  const sleep = jest.fn();
  await expect(withRetry(operation, { attempts: 3, delayMs: 10, sleep })).resolves.toBe('ok');
  expect(operation).toHaveBeenCalledTimes(2);
  expect(sleep).toHaveBeenCalledWith(10);
});

test('throws the final failure after exhausting attempts', async () => {
  const failure = new Error('failed');
  await expect(withRetry(() => { throw failure; }, { attempts: 2, sleep: jest.fn() })).rejects.toBe(failure);
});
