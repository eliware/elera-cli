import { jest } from '@jest/globals';
import { runConfigPlan } from '../../../src/commands/configuration/plan.mjs';
test('plans configuration intent', async () => { const emit = jest.fn(); const client = { intent: async () => ({ data: { intent: {} } }), plan: async (value) => ({ value }) }; await runConfigPlan({ client, emit }); expect(emit).toHaveBeenCalledWith({ value: {} }); });
