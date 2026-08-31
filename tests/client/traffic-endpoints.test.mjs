import { expect, jest, test } from '@jest/globals';
import { createTrafficEndpoints } from '../../src/client/traffic-endpoints.mjs';
test('creates traffic control endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createTrafficEndpoints(request); await endpoints.trafficStatus(); await endpoints.drain(); await endpoints.undrain(); expect(request).toHaveBeenCalledTimes(3); });
