/* istanbul ignore file -- native mariadb process adapter is covered by Docker integration tests. */
import { createReadStream, createWriteStream } from 'node:fs';
import { spawn } from 'node:child_process';

function credentials(bundle) {
  if (!bundle?.username || !bundle.password || !bundle.database) throw new TypeError('connection bundle credentials are required');
  return { MYSQL_PWD: bundle.password };
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
  const file = typeof destination === 'string' ? createWriteStream(destination) : destination;
  return run('mariadb-dump', ['--host', bundle.host, '--port', String(bundle.port ?? 3306), '--user', bundle.username, '--single-transaction', '--routines', '--events', bundle.database], { env: credentials(bundle), output: file });
}

export function restoreDatabase(bundle, source) {
  credentials(bundle);
  const file = typeof source === 'string' ? createReadStream(source) : source;
  return run('mariadb', ['--host', bundle.host, '--port', String(bundle.port ?? 3306), '--user', bundle.username, bundle.database], { env: credentials(bundle), input: file });
}
