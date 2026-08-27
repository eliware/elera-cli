import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createBackup } from './create-backup.mjs';
import { verifyBackup } from './verify-backup.mjs';
import { restoreVerify } from '../restore/restore-verify.mjs';
import { syncToNas } from '../transport/nas.mjs';

export async function withBundleCredentials(bundle, operation) {
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host, port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port };
  if (!profile.username || !profile.password || !profile.database || !profile.host) throw new TypeError('connection bundle credentials are required');
  const directory = await mkdtemp(join(tmpdir(), 'elera-cli-'));
  const file = join(directory, 'my.cnf');
  await writeFile(file, `[client]\nhost=${profile.host}\nport=${profile.port ?? 3306}\nuser=${profile.username}\npassword=${profile.password}\n` , { mode: 0o600 });
  try { return await operation(file, profile); } finally { await rm(directory, { recursive: true, force: true }); }
}

export function createBackupFromBundle({ bundle, backupRoot, databases, metadata, ...options }) {
  return withBundleCredentials(bundle, async (credentialsFile, profile) => {
    const result = await createBackup({ backupRoot, databases, credentialsFile, host: profile.host, mysqlDump: 'mariadb-dump', ...options });
    if (metadata) await writeFile(join(result.path, 'SUPERVISOR-METADATA.json'), `${JSON.stringify(metadata, null, 2)}\n`, { mode: 0o600 });
    return result;
  });
}

export function verifyBackupFromBundle({ bundle, backupPath, databases, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile, profile) => verifyBackup({ backupPath, databases, credentialsFile, host: profile.host, ...options }));
}

export function restoreVerifyFromBundle({ bundle, restoreRoot, ...options }) {
  return withBundleCredentials(bundle, (credentialsFile, profile) => restoreVerify({ restoreRoot, credentialsFile, host: profile.host, mysql: 'mariadb', ...options }));
}

export { syncToNas };
