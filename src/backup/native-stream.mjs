/* istanbul ignore file -- native mariadb process adapter is covered by Docker integration tests. */
import { createReadStream, createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';

function credentials(bundle) {
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host };
  if (!profile.username || !profile.password || !profile.database || !profile.host) throw new TypeError('connection bundle credentials are required');
  return { MYSQL_PWD: profile.password };
}

function run(command, args, { env, input, output } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { env: { ...process.env, ...env }, stdio: [input ? 'pipe' : 'ignore', output ? 'pipe' : 'inherit', 'inherit'] });
    if (input) input.pipe(child.stdin);
    if (output) child.stdout.pipe(output);
    child.once('error', reject);
    child.once('close', (code, signal) => code === 0 ? resolve({ code }) : reject(Object.assign(new Error(`${command} exited with ${code ?? signal}`), { code: code ?? 1, signal })));
  });
}

export function dumpDatabase(bundle, destination) {
  credentials(bundle);
  const file = typeof destination === 'string' ? createWriteStream(destination) : destination;
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host, port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port };
  return run('mariadb-dump', ['--host', profile.host, '--port', String(profile.port ?? 3306), '--user', profile.username, '--single-transaction', '--routines', '--events', profile.database], { env: credentials(bundle), output: file });
}

export function restoreDatabase(bundle, source) {
  credentials(bundle);
  const file = typeof source === 'string' ? createReadStream(source) : source;
  const profile = { ...bundle, ...(bundle?.credentials ?? {}), host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host, port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port };
  return run('mariadb', ['--host', profile.host, '--port', String(profile.port ?? 3306), '--user', profile.username, profile.database], { env: credentials(bundle), input: file });
}
