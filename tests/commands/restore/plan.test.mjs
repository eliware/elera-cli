import { jest } from '@jest/globals';
import { runRestorePlan } from '../../../src/commands/restore/plan.mjs';
test('plans restore coordination without embedding SQL', async () => { const emit = jest.fn(); await runRestorePlan({ client: { planRestore: async (value) => ({ value }) }, value: '{"databases":["app"]}', emit }); expect(emit).toHaveBeenCalledWith({ value: { databases: ['app'] } }); });
test('uses an empty restore plan by default', async () => { const emit = jest.fn(); await runRestorePlan({ client: { planRestore: async (value) => ({ value }) }, emit }); expect(emit).toHaveBeenCalledWith({ value: {} }); });
