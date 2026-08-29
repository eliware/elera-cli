import { expect, jest, test } from '@jest/globals';
import { mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createBackup, dumpToGzip } from '../../src/backup/create-backup.mjs';
import { backupExists, verifyBackup } from '../../src/backup/verify-backup.mjs';
import { rotateBackups } from '../../src/backup/rotate-backups.mjs';

test('creates and verifies a compressed logical backup', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-')); const release = jest.fn();
  const result = await createBackup({ backupRoot: root, databases: ['mysql', 'app'], credentialsFile: '/tmp/my.cnf', host: 'db', lock: async () => ({ release }), dump: async (_binary, _args, path) => (await import('node:fs/promises')).writeFile(path, gzipSync('sql')), rotate: async () => {} });
  expect(result.databases).toEqual(['app']); expect(await backupExists(result.path)).toBe(true); await expect(verifyBackup({ backupPath: result.path, databases: ['app'] })).resolves.toMatchObject({ databases: ['app'] }); expect(release).toHaveBeenCalled(); expect(await readFile(join(result.path, 'DATABASES'), 'utf8')).toBe('app\n');
});

test('rejects empty backups and cleans up failed staging work', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-')); await expect(createBackup({ backupRoot: root, databases: ['mysql'] })).rejects.toThrow('No eligible');
  const notify = jest.fn(); const release = jest.fn(); await expect(createBackup({ backupRoot: root, databases: ['app'], lock: async () => ({ release }), dump: async () => { throw new Error('dump failed'); }, notify })).rejects.toThrow('dump failed'); expect(notify).toHaveBeenCalledWith('dump failed'); expect(release).toHaveBeenCalled();
});

test('reports missing backups, rotates old entries, and rejects invalid gzip', async () => {
  expect(await backupExists('/does/not/exist')).toBe(false); const removed = []; await rotateBackups({ backupRoot: 'root', keep: 2, list: async () => [{ name: '1' }, { name: '2' }, { name: '3' }], remove: async (path) => removed.push(path) }); expect(removed).toEqual([join('root', '2'), join('root', '1')]);
  const read = async () => Buffer.from('not gzip'); await expect(verifyBackup({ backupPath: 'x', databases: ['app'], read })).rejects.toThrow();
});

test('dumpToGzip reports child process failure', async () => { await expect(dumpToGzip(process.execPath, ['-e', "process.stderr.write('bad'); process.exit(2)"], join(tmpdir(), 'elera-dump.gz'))).rejects.toThrow('bad'); });
test('dumpToGzip uses the exit code when the child has no stderr', async () => { const root = await mkdtemp(join(tmpdir(), 'elera-dump-')); await expect(dumpToGzip(process.execPath, ['-e', 'process.exit(2)'], join(root, 'empty.gz'))).rejects.toThrow('dump exited with 2'); });

test('verifies the databases listed by the backup when no filter is supplied', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-'));
  const { writeFile } = await import('node:fs/promises');
  await writeFile(join(root, 'DATABASES'), 'app\n');
  await writeFile(join(root, 'app.sql.gz'), gzipSync('sql'));
  await expect(verifyBackup({ backupPath: root })).resolves.toMatchObject({ databases: ['app'] });
});

test('creates a native gzip dump and reports non-Error failures without a lock', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-'));
  const destination = join(root, 'native.sql.gz');
  await expect(dumpToGzip(process.execPath, ['-e', "process.stdout.write('sql')"], destination)).resolves.toBeUndefined();
  await expect(createBackup({ backupRoot: root, databases: ['app'], dump: async () => { throw 'raw failure'; }, notify: jest.fn() })).rejects.toBe('raw failure');
});
test('uses default notification handling for failed backups', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-'));
  await expect(createBackup({ backupRoot: root, databases: ['app'], dump: async () => { throw new Error('failed'); } })).rejects.toThrow('failed');
});
test('handles a backup failure before staging is created', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-backup-')); const file = join(root, 'not-a-directory'); await writeFile(file, 'x');
  await expect(createBackup({ backupRoot: file, databases: ['app'] })).rejects.toThrow();
});
