import { jest } from '@jest/globals'; import { runInitializationPlan } from '../../../src/commands/initialization/plan.mjs';
test('emits initialization plan', async () => { const emit = jest.fn(); await runInitializationPlan({ client: { initializationPlan: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
