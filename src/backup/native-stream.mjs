import { createReadStream, createWriteStream } from 'node:fs';
import { runNative } from './native-process.mjs';

function credentials(bundle) {
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host };
  if (!profile.username || !profile.password || !profile.database || !profile.host) throw new TypeError('connection bundle credentials are required');
  return { MYSQL_PWD: profile.password };
}

export function dumpDatabase(bundle, destination, { runImpl = runNative } = {}) {
  credentials(bundle);
  const file = typeof destination === 'string' ? createWriteStream(destination) : destination;
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host, port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port };
  return runImpl('mariadb-dump', ['--host', profile.host, '--port', String(profile.port ?? 3306), '--user', profile.username, '--single-transaction', '--routines', '--events', profile.database], { env: credentials(bundle), output: file });
}

export function restoreDatabase(bundle, source, { runImpl = runNative } = {}) {
  credentials(bundle);
  const file = typeof source === 'string' ? createReadStream(source) : source;
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host, port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port };
  return runImpl('mariadb', ['--host', profile.host, '--port', String(profile.port ?? 3306), '--user', profile.username, profile.database], { env: credentials(bundle), input: file });
}
