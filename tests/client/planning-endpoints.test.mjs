import { expect, jest, test } from '@jest/globals';
import { createPlanningEndpoints } from '../../src/client/planning-endpoints.mjs';
test('creates planning endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createPlanningEndpoints(request); await endpoints.planDatabases({}); await endpoints.verifyDatabases({}); await endpoints.planBackup({}); await endpoints.planRestore({}); expect(request).toHaveBeenCalledTimes(4); });
