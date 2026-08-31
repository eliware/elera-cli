import { expect, jest, test } from '@jest/globals';
import { runMigrationAction } from '../../../src/commands/migration/run-action.mjs';
test('dispatches a migration action', async () => { const emit = jest.fn(); await expect(runMigrationAction({ client: { provisionDatabase: jest.fn(async () => ({ id: 'd' })) }, emit, action: 'database', input: { application: 'a', database: 'd' } })).resolves.toBe(0); });
