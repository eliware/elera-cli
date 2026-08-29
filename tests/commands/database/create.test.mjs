import { jest } from '@jest/globals'; import { runDatabaseCreate } from '../../../src/commands/database/create.mjs';
test('creates a database', async () => { const provisionDatabase = jest.fn(async () => ({ ok: true })); await runDatabaseCreate({ client: { provisionDatabase }, emit: jest.fn(), application: 'app', database: 'db' }); expect(provisionDatabase).toHaveBeenCalledWith('app', 'db'); });
