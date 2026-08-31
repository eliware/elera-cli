import { expect, jest, test } from '@jest/globals';
import { createApplicationEndpoints } from '../../src/client/application-endpoints.mjs';
test('creates application endpoint operations', async () => { const request = jest.fn(async (path, options) => ({ path, options })); const endpoints = createApplicationEndpoints(request); await endpoints.createApplication('app'); await endpoints.applications(); await endpoints.applicationStatus('a/b'); await endpoints.createAppAdminToken('app'); expect(request).toHaveBeenCalledTimes(4); expect(request.mock.calls[2][0]).toContain('/a%2Fb'); });
