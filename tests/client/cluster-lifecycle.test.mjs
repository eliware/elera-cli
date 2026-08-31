import { expect, jest, test } from '@jest/globals';
import { createClusterLifecycleEndpoints } from '../../src/client/cluster-lifecycle.mjs';
test('creates cluster lifecycle endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createClusterLifecycleEndpoints(request); await endpoints.bootstrap(); await endpoints.join(); await endpoints.lifecyclePlan('drain'); await endpoints.recover({ reason: 'test' }); expect(request).toHaveBeenCalledTimes(4); });
