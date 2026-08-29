import { expect, jest, test } from '@jest/globals';
import { createRecoveryEndpoints } from '../../src/client/recovery-endpoints.mjs';

test('builds recovery endpoint requests', async () => {
  const request = jest.fn(async (path, options) => ({ path, options }));
  const endpoints = createRecoveryEndpoints(request);
  await endpoints.recoveryStatus(); await endpoints.recoveryEvents(); await endpoints.recoveryAcknowledge('ok'); await endpoints.recoveryAbort('stop');
  expect(request).toHaveBeenCalledWith('/api/v1/recovery/status');
  expect(request).toHaveBeenCalledWith('/api/v1/recovery/events');
  expect(request).toHaveBeenCalledWith('/api/v1/recovery/acknowledge', expect.objectContaining({ method: 'POST' }));
  expect(request).toHaveBeenCalledWith('/api/v1/recovery/abort', expect.objectContaining({ method: 'POST' }));
});
