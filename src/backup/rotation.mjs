import { readdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

export async function rotateBackups({ backupRoot, keep = 7, list = readdir, remove = rm }) {
  const entries = (await list(backupRoot, { withFileTypes: true })).filter((entry) => /^\d+$/.test(entry.name)).sort((a, b) => Number(b.name) - Number(a.name));
  for (const entry of entries.slice(keep - 1)) await remove(join(backupRoot, entry.name), { recursive: true, force: true });
}
