import { expect, jest, test } from '@jest/globals';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { restoreArtifact } from '../src/restore/artifact-restore.mjs';

test('restores metadata, accounts, and application dumps while skipping system schemas', async () => {
  const root = await mkdtemp(join(process.env.TEMP ?? process.env.TMP, 'elera-artifact-'));
  await writeFile(join(root, 'SUPERVISOR-METADATA.json'), JSON.stringify({ databases: ['app'], identities: ['runtime'], accounts: [{ user: 'u' }], artifacts: [{ name: 'ssh', ciphertext: 'age-encryption.org/v1/x' }] }));
  await writeFile(join(root, 'DATABASES'), 'mysql\napp\nsys\n');
  await writeFile(join(root, 'app.sql.gz'), gzipSync('sql'));
  const client = { restoreMetadataApply: jest.fn(async () => {}), restoreAccountsApply: jest.fn(async () => {}), putSecret: jest.fn(async () => {}) };
  const restore = jest.fn(async (_binary, _args, stream) => { for await (const _chunk of stream) {} });
  await expect(restoreArtifact({ root, client, bundle: { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db' }] } }, confirm: true, restore })).resolves.toMatchObject({ restored: ['app'] });
  expect(client.restoreAccountsApply).toHaveBeenCalled();
  expect(client.putSecret).toHaveBeenCalledWith('ssh', expect.objectContaining({ ciphertext: 'age-encryption.org/v1/x' }));
  expect(restore).toHaveBeenCalledTimes(1);
});

test('rejects artifact restores without confirmation and supports metadata without accounts', async () => {
  const root = await mkdtemp(join(process.env.TEMP ?? process.env.TMP, 'elera-artifact-'));
  const client = { restoreMetadataApply: jest.fn() };
  await expect(restoreArtifact({ root, client })).rejects.toMatchObject({ statusCode: 409 });
  await writeFile(join(root, 'SUPERVISOR-METADATA.json'), '{}');
  await writeFile(join(root, 'DATABASES'), '');
  await expect(restoreArtifact({ root, client, bundle: { username: 'u', password: 'p', database: 'app', host: 'db' }, confirm: true, restore: jest.fn() })).resolves.toMatchObject({ restored: [] });
});
