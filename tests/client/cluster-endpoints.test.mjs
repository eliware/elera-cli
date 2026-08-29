import { jest } from '@jest/globals';
import { createClusterEndpoints } from '../../src/client/cluster-endpoints.mjs';

test('routes every cluster endpoint with the expected method and payload', async () => {
  const request = jest.fn(async (path, options) => ({ path, options }));
  const endpoints = createClusterEndpoints(request);
  await endpoints.observations(); await endpoints.quorum(); await endpoints.coldBootstrapPlan();
  await endpoints.coldBootstrap({ force: true }); await endpoints.coldBootstrapEvidence();
  await endpoints.bootstrap(); await endpoints.join(); await endpoints.rejoin();
  await endpoints.bootstrapEligibility(); await endpoints.bootstrapPlan(); await endpoints.joinPlan();
  await endpoints.recoverPlan(); await endpoints.recover({ node: 'elera-0' }); await endpoints.waitReady();
  await endpoints.lifecyclePlan('drain', { node: 'elera-0' });
  await endpoints.lifecycleApply('recover', { node: 'elera-0' });
  await endpoints.lifecycle('join', { node: 'elera-1' });
  expect(request).toHaveBeenCalledWith('/api/v1/cluster/join', expect.objectContaining({ method: 'POST' }));
  expect(request).toHaveBeenCalledWith('/api/v1/cluster/lifecycle/apply', expect.objectContaining({ method: 'POST' }));
  expect(request).toHaveBeenCalledTimes(17);
});
