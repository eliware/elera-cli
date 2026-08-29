import { jest } from '@jest/globals';
import { runDatabasePlan } from '../../../src/commands/database/plan.mjs';
test('plans database changes', async () => { const emit = jest.fn(); await runDatabasePlan({ client: { planDatabases: async (value) => ({ value }) }, value: '{"databases":[]}', emit }); expect(emit).toHaveBeenCalledWith({ value: { databases: [] } }); });
test('uses an empty desired document by default', async () => { const emit = jest.fn(); await runDatabasePlan({ client: { planDatabases: async (value) => ({ value }) }, emit }); expect(emit).toHaveBeenCalledWith({ value: {} }); });
