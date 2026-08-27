import { expect, jest, test } from '@jest/globals';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
import { restoreArtifact } from '../src/restore/artifact-restore.mjs';

test('artifact restore requires confirmation before reading or mutating state', async () => {
  await expect(restoreArtifact({ root: 'unused', client: {} })).rejects.toThrow(/confirm/);
});

test('artifact restore restores metadata before application SQL', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-artifact-'));
  await writeFile(join(root, 'app.sql.gz'), gzipSync('unused'));
  const read = jest.fn(async (path) => path.endsWith('SUPERVISOR-METADATA.json') ? JSON.stringify({ databases: [], identities: [], accounts: [{ user: 'app', host: '%' }] }) : 'app\n');
  const client = { restoreMetadataApply: jest.fn(), restoreAccountsApply: jest.fn() };
  const restore = jest.fn();
  await restoreArtifact({ root, client, bundle: { host: 'db', port: 3306, username: 'root', password: 'secret' }, confirm: true, read, restore });
  expect(client.restoreMetadataApply).toHaveBeenCalled();
  expect(client.restoreAccountsApply).toHaveBeenCalled();
  expect(restore).toHaveBeenCalled();
});
