import { jest } from '@jest/globals';
import { mkdtemp, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBackupList } from '../../../src/commands/backup/list.mjs';

test('lists backup artifact directories in stable order', async () => {
  const root = await mkdtemp(join(tmpdir(), 'elera-cli-backup-'));
  await mkdir(join(root, '2026-02'));
  await mkdir(join(root, '2026-01'));
  const emit = jest.fn();
  await expect(runBackupList({ emit, root })).resolves.toBe(0);
  expect(emit.mock.calls[0][0].data.entries).toEqual(['2026-01', '2026-02']);
});

test('requires a backup path', async () => {
  await expect(runBackupList({ emit: jest.fn() })).rejects.toThrow('backup list requires a backup path');
});
