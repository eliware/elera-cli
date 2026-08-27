import { expect, test } from '@jest/globals';
import process from 'node:process';
import { PassThrough } from 'node:stream';
import { EventEmitter } from 'node:events';
import { runNative } from '../src/backup/native-process.mjs';

test('runs native commands with streamed input and output', async () => {
  const input = new PassThrough();
  const output = new PassThrough();
  const chunks = [];
  output.on('data', (chunk) => chunks.push(chunk.toString()));
  const promise = runNative(process.execPath, ['-e', "process.stdin.pipe(process.stdout)"], { input, output });
  input.end('payload');
  await expect(promise).resolves.toEqual({ code: 0 });
  expect(chunks.join('')).toBe('payload');
});

test('reports native command failures', async () => {
  await expect(runNative(process.execPath, ['-e', 'process.exit(2)'])).rejects.toMatchObject({ code: 2 });
  await expect(runNative('missing-elera-native-command', [])).rejects.toBeTruthy();
});

test('handles signal exits and omitted stream wiring', async () => {
  const spawnImpl = () => {
    const child = new EventEmitter();
    child.stdout = new PassThrough(); child.stderr = new PassThrough();
    queueMicrotask(() => child.emit('close', null, 'SIGTERM'));
    return child;
  };
  await expect(runNative('fake', [], { spawnImpl })).rejects.toMatchObject({ code: 1, signal: 'SIGTERM' });
});
