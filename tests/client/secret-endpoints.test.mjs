import { expect, jest, test } from '@jest/globals';
import { createSecretEndpoints } from '../../src/client/secret-endpoints.mjs';
test('creates secret endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createSecretEndpoints(request); await endpoints.listSecrets(); await endpoints.putSecret('a/b', {}); await endpoints.getSecret('a'); await endpoints.verifySecret('a'); await endpoints.removeSecret('a'); expect(request).toHaveBeenCalledTimes(5); });
