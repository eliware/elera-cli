import { runDatabaseDelete } from '../../../src/commands/database/delete.mjs';
import { jest } from '@jest/globals';
test('deletes a database with confirmed operation metadata', async () => { const emit = jest.fn(); const deleteDatabase = jest.fn(async (id, input) => ({ id, input })); await expect(runDatabaseDelete({ client: { deleteDatabase }, emit, databaseId: '2', confirm: true, dryRun: false, idempotencyKey: 'op' })).resolves.toBe(0); expect(deleteDatabase).toHaveBeenCalledWith('2', { confirm: true, dryRun: false, idempotencyKey: 'op' }); });
