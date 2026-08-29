import { jest } from '@jest/globals';
import { runTelemetrySummary } from '../../../src/commands/telemetry/summary.mjs';
test('emits telemetry summary', async () => { const emit = jest.fn(); const result = { ok: true, data: {} }; await expect(runTelemetrySummary({ client: { telemetry: async () => result }, emit })).resolves.toBe(0); expect(emit).toHaveBeenCalledWith(result); });
