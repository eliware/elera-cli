import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createBackup } from './create-backup.mjs';
import { verifyBackup } from './verify-backup.mjs';
import { restoreVerify } from '../restore/restore-verify.mjs';
import { syncToNas } from '../transport/nas.mjs';

export async function withBundleCredentials(bundle, operation) {
  if (!bundle?.username || !bundle.password || !bundle.database) throw new TypeError('connection bundle credentials are required');
  const directory = await mkdtemp(join(tmpdir(), 'elera-cli-'));
  const file = join(directory, 'my.cnf');
  await writeFile(file, `[client]\nhost=${bundle.host}\nport=${bundle.port ?? 3306}\nuser=${bundle.username}\npassword=${bundle.password}\n` , { mode: 0o600 });
  try { return await operation(file); } finally { await rm(directory, { recursive: true, force: true }); }
}

export function createBackupFromBundle({ bundle, backupRoot, databases, metadata, ...options }) {
  return withBundleCredentials(bundle, async (credentialsFile) => {
    const result = await createBackup({ backupRoot, databases, credentialsFile, host: bundle.host, mysqlDump: 'mariadb-dump', ...options });
    if (metadata) await writeFile(join(result.path, 'SUPERVISOR-METADATA.json'), `${JSON.stringify(metadata, null, 2)}\n`, { mode: 0o600 });
    return result;
  });
}

export function verifyBackupFromBundle({ bundle, backupPath, databases, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile) => verifyBackup({ backupPath, databases, credentialsFile, host: bundle.host, ...options }));
}

export function restoreVerifyFromBundle({ bundle, restoreRoot, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile) => restoreVerify({ restoreRoot, credentialsFile, host: bundle.host, mysql: 'mariadb', ...options }));
}

export { syncToNas };
