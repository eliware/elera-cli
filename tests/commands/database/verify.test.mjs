import { jest } from '@jest/globals';
import { runDatabaseVerify } from '../../../src/commands/database/verify.mjs';
test('reports database verification failures', async () => { const emit = jest.fn(); expect(await runDatabaseVerify({ client: { verifyDatabases: async () => ({ ok: false }) }, value: '{}', emit })).toBe(1); });
test('reports successful database verification', async () => { const emit = jest.fn(); expect(await runDatabaseVerify({ client: { verifyDatabases: async () => ({ ok: true }) }, emit })).toBe(0); });
