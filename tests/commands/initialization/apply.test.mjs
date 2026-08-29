import { jest } from '@jest/globals'; import { runInitializationApply } from '../../../src/commands/initialization/apply.mjs';
test('applies initialization', async () => { const emit = jest.fn(); await runInitializationApply({ client: { initializationApply: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
