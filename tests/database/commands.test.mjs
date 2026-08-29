import { expect, jest, test } from '@jest/globals';
import { applicationDatabases, manifestText, sha256 } from '../../src/backup/manifests.mjs';
import { discoverDatabases, dumpArgs, validateDatabaseName } from '../../src/database/commands.mjs';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

test('database helpers filter, discover, validate, and build dump arguments', async () => {
  expect(applicationDatabases(['mysql', 'app', 'information_schema', 'app2', 'performance_schema'])).toEqual(['app', 'app2']);
  const run = jest.fn().mockResolvedValue({ stdout: 'app\r\nother\n', stderr: '' });
  await expect(discoverDatabases({ credentialsFile: '/root/.my.cnf', host: 'db', run })).resolves.toEqual(['app', 'other']);
  expect(run).toHaveBeenCalledWith('mysql', ['--defaults-extra-file=/root/.my.cnf', '--host', 'db', '-N', '-e', 'SHOW DATABASES;']);
  expect(dumpArgs('/root/.my.cnf', 'db', 'app')).toContain('app');
  expect(() => validateDatabaseName('app; DROP DATABASE mysql')).toThrow('Invalid database name');
});

test('manifest helpers format and hash artifacts', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'elera-cli-')); const file = join(dir, 'app.sql.gz'); await writeFile(file, 'backup');
  const hash = await sha256(file); expect(hash).toHaveLength(64); expect(manifestText([{ hash, name: 'app.sql.gz' }])).toContain(`${hash}  app.sql.gz`);
});
