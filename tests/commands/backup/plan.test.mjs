import { jest } from '@jest/globals';
import { runBackupPlan } from '../../../src/commands/backup/plan.mjs';
test('plans backup metadata without streaming SQL', async () => { const emit = jest.fn(); await runBackupPlan({ client: { planBackup: async (value) => ({ value }) }, value: '{"databases":["app"]}', emit }); expect(emit).toHaveBeenCalledWith({ value: { databases: ['app'] } }); });
test('uses an empty backup plan by default', async () => { const emit = jest.fn(); await runBackupPlan({ client: { planBackup: async (value) => ({ value }) }, emit }); expect(emit).toHaveBeenCalledWith({ value: {} }); });
