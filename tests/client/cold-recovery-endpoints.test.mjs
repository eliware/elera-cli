import { expect, jest, test } from '@jest/globals';
import { createColdRecoveryEndpoints } from '../../src/client/cold-recovery-endpoints.mjs';
test('creates cold recovery protocol endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createColdRecoveryEndpoints(request); await endpoints.coldRecoveryEvidence(); await endpoints.coldRecoveryStatus(); await endpoints.coldRecoveryPlan(); await endpoints.coldRecoveryAuthorize({}); await endpoints.coldRecoveryBootstrap({}); await endpoints.coldRecoveryComplete({}); expect(request).toHaveBeenCalledTimes(6); });

test('uses the supervisor cold-recovery route for recovery planning', async () => {
  const request = jest.fn(async () => ({ ok: true }));
  await createColdRecoveryEndpoints(request).coldRecoveryPlan();
  expect(request).toHaveBeenCalledWith('/api/v1/cluster/cold-recovery/plan', expect.objectContaining({ method: 'POST' }));
});
