import { expect, jest, test } from '@jest/globals';
import { createClusterObservabilityEndpoints } from '../../src/client/cluster-observability.mjs';
test('creates cluster observability endpoints', async () => { const request = jest.fn(async (path) => ({ path })); const endpoints = createClusterObservabilityEndpoints(request); await endpoints.observations(); await endpoints.quorum(); await endpoints.coldBootstrapPlan(); await endpoints.coldBootstrapEvidence(); expect(request).toHaveBeenCalledTimes(4); });
