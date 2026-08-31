import { expect, jest, test } from '@jest/globals';
import { createTelemetryEndpoints } from '../../src/client/telemetry-endpoints.mjs';
test('creates telemetry endpoints', async () => { const request = jest.fn(async () => ({ ok: true })); const endpoints = createTelemetryEndpoints(request); await endpoints.status(); await endpoints.telemetry(); await endpoints.telemetryDetails('app'); expect(request).toHaveBeenCalledTimes(3); });
