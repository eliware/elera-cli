import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { createGunzip } from 'node:zlib';
import { runRestore } from './restore-verify.mjs';

const readNames = async (root, read) => (await read(join(root, 'DATABASES'), 'utf8')).split(/\r?\n/).map((value) => value.trim()).filter(Boolean);

export async function restoreArtifact({ root, client, bundle, confirm = false, restore = runRestore, read = readFile }) {
  if (!confirm) throw Object.assign(new Error('artifact restore requires confirm: true'), { statusCode: 409 });
  const metadata = JSON.parse(await read(join(root, 'SUPERVISOR-METADATA.json'), 'utf8'));
  const accounts = metadata.accounts ?? [];
  await client.restoreMetadataApply({ databases: metadata.databases ?? [], identities: metadata.identities ?? [] });
  if (accounts.length) await client.restoreAccountsApply(accounts);
  const databases = await readNames(root, read);
  const restored = [];
  for (const database of databases) {
    if (['mysql', 'sys', 'information_schema', 'performance_schema'].includes(database)) continue;
    await restore('mariadb', ['--host', bundle.host, '--port', String(bundle.port ?? 3306), '--user', bundle.username, database], createReadStream(join(root, `${database}.sql.gz`)).pipe(createGunzip()), { env: { MYSQL_PWD: bundle.password } });
    restored.push(database);
  }
  return { metadata: { databases: metadata.databases?.length ?? 0, identities: metadata.identities?.length ?? 0, accounts: accounts.length }, restored };
}
