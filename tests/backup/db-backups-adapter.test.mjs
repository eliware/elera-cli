import { expect, jest, test } from '@jest/globals';
import { mkdtemp } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { Readable } from 'node:stream';
import { createBackupFromBundle, verifyBackupFromBundle, restoreVerifyFromBundle, withBundleCredentials } from '../../src/backup/db-backups-adapter.mjs';

const bundle = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01' };
test('materializes bundle credentials only for the operation lifetime', async () => { await expect(withBundleCredentials({}, async () => true)).rejects.toThrow('connection bundle'); const result = await withBundleCredentials(bundle, async (file, profile) => ({ file, profile })); expect(result.profile.host).toBe('db'); });
test('accepts direct bundle connection fields and applies the default port', async () => { const result = await withBundleCredentials({ database: 'app', username: 'u', password: 'p', host: 'direct' }, async (file, profile) => ({ file, profile })); expect(result.profile.port).toBeUndefined(); });
test('creates, verifies, and restore-verifies a bundle backup with metadata', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-adapter-')); const dump = async (_binary, _args, path) => (await import('node:fs/promises')).writeFile(path, gzipSync('sql')); const rotate = async () => {};
  const created = await createBackupFromBundle({ bundle, backupRoot: root, databases: ['app'], metadata: { identities: [] }, dump, rotate }); expect(created.databases).toEqual(['app']);
  await expect(verifyBackupFromBundle({ bundle, backupPath: created.path, databases: ['app'] })).resolves.toMatchObject({ databases: ['app'] });
  const execSql = jest.fn(async () => {}); const restore = jest.fn(async () => {}); await expect(restoreVerifyFromBundle({ bundle, restoreRoot: created.path, execSql, restore, stream: () => Readable.from([gzipSync('sql')]) })).resolves.toBe(1); expect(restore).toHaveBeenCalled();
});
test('creates a bundle backup without a metadata sidecar', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-adapter-')); const dump = async (_binary, _args, path) => (await import('node:fs/promises')).writeFile(path, gzipSync('sql'));
  await expect(createBackupFromBundle({ bundle, backupRoot: root, databases: ['app'], dump, rotate: async () => {} })).resolves.toMatchObject({ databases: ['app'] });
});
