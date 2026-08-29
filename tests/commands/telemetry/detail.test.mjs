import { jest } from '@jest/globals';
import { runTelemetryDetail } from '../../../src/commands/telemetry/detail.mjs';
test('emits application telemetry detail', async () => { const emit = jest.fn(); await runTelemetryDetail({ client: { telemetryDetails: async (application) => ({ application }) }, application: 'app-a', emit }); expect(emit).toHaveBeenCalledWith({ application: 'app-a' }); });
