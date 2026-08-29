import { jest } from '@jest/globals'; import { runInitializationStatus } from '../../../src/commands/initialization/status.mjs';
test('emits initialization status', async () => { const emit = jest.fn(); await runInitializationStatus({ client: { initializationStatus: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
