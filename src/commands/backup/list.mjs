import { readdir } from 'node:fs/promises';

export async function runBackupList({ emit, root }) {
  if (!root) throw new TypeError('backup list requires a backup path');
  const entries = (await readdir(root, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
  emit({ ok: true, operation: 'backup.list', status: 'completed', data: { root, entries } });
  return 0;
}
