import { expect, jest, test } from '@jest/globals';
import { createDatabaseEndpoints } from '../../src/client/database-endpoints.mjs';
test('creates database endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createDatabaseEndpoints(request); await endpoints.deleteDatabase('db'); await endpoints.routes('app'); await endpoints.databases(); await endpoints.provisionDatabase('app', 'db'); expect(request).toHaveBeenCalledTimes(4); });
