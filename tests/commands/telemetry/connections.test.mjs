import { jest } from '@jest/globals';
import { runTelemetryConnections } from '../../../src/commands/telemetry/connections.mjs';
test('wraps connection telemetry in operation output', async () => { const emit = jest.fn(); await runTelemetryConnections({ client: { telemetryDetails: async () => ({ count: 1 }) }, application: 'app-a', emit }); expect(emit).toHaveBeenCalledWith({ ok: true, operation: 'connections', data: { count: 1 } }); });
