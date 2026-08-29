import { jest } from '@jest/globals'; import { runDatabaseList } from '../../../src/commands/database/list.mjs';
test('lists databases', async () => { const emit = jest.fn(); await runDatabaseList({ client: { databases: async () => ({ ok: true }) }, emit }); expect(emit).toHaveBeenCalledWith({ ok: true }); });
