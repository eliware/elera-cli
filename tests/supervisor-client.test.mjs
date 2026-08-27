import { expect, jest, test } from '@jest/globals';
import { createSupervisorClient } from '../src/supervisor-client.mjs';

test('sends bearer authentication and validates lease bundles', async () => { const fetchImpl = jest.fn(async (_url, options) => ({ ok: true, json: async () => ({ data: { database: 'app', identity: 'runtime', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'sql0', port: 3306 }], balanced: [{ host: 'sql0', port: 3306 }] }, expiresAt: '2099-01-01' } }) })); const client = createSupervisorClient({ endpoint: 'https://db', token: 'secret', fetchImpl }); const bundle = await client.lease('app', 'runtime'); expect(bundle.database).toBe('app'); expect(fetchImpl.mock.calls[0][1].headers.authorization).toBe('Bearer secret'); });
