import { createWriteStream } from 'node:fs';
import { createGzip } from 'node:zlib';
import { spawn } from 'node:child_process';
import { pipeline } from 'node:stream/promises';

export function dumpToGzip(binary, args, destination, { spawnImpl = spawn, createOutput = createWriteStream, gzip = createGzip } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(binary, args, { shell: false, stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    const exited = new Promise((done, fail) => child.once('close', (code) => code === 0 ? done() : fail(new Error(stderr.trim() || `dump exited with ${code}`))));
    Promise.all([pipeline(child.stdout, gzip(), createOutput(destination)), exited]).then(() => resolve(), reject);
    child.once('error', reject);
  });
}
