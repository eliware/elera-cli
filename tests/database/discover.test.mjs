import { expect, jest, test } from '@jest/globals';
import { discoverDatabases } from '../../src/database/discover.mjs';
test('discovers and normalizes database names', async () => { const run = jest.fn(async () => ({ stdout: 'app\r\n other\n', stderr: '' })); await expect(discoverDatabases({ credentialsFile: 'my.cnf', host: 'db', run })).resolves.toEqual(['app', 'other']); });
