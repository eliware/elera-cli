import { appendFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { createGunzip } from 'node:zlib';
import { pipeline } from 'node:stream/promises';
import { createReadStream } from 'node:fs';
import { mysqlArgs } from '../database/commands.mjs';

export function runRestore(binary, args, input, { env, spawnImpl = spawn } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(binary, args, { env: { ...process.env, ...env }, shell: false, stdio: ['pipe', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    pipeline(input, child.stdin).catch(reject);
    child.once('error', reject);
    child.once('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `restore exited with ${code}`)));
  });
}

export function runSql(binary, args, { spawnImpl = spawn } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(binary, args, { shell: false, stdio: ['ignore', 'ignore', 'pipe'] });
    let stderr = '';
    child.stderr.setEncoding('utf8');
    child.stderr.on('data', (chunk) => { stderr += chunk; });
    child.once('error', reject);
    child.once('close', (code) => code === 0 ? resolve() : reject(new Error(stderr.trim() || `sql exited with ${code}`)));
  });
}

export function restoreCommand(binary, credentialsFile, host, database) {
  return [binary, [...mysqlArgs(credentialsFile, host), database]];
}

export { createGunzip, createReadStream, appendFile };
