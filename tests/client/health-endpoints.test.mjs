import { expect, jest, test } from '@jest/globals';
import { createHealthEndpoints } from '../../src/client/health-endpoints.mjs';
test('creates health and readiness endpoints', async () => { const request = jest.fn(async (path) => ({ path })); const endpoints = createHealthEndpoints(request); await endpoints.health(); await endpoints.ready(); expect(request).toHaveBeenNthCalledWith(1, '/healthz'); expect(request).toHaveBeenNthCalledWith(2, '/readyz'); });
