import { expect, jest, test } from '@jest/globals';
import { Readable } from 'node:stream';
import { EventEmitter } from 'node:events';
import { Writable } from 'node:stream';
import { gzipSync } from 'node:zlib';
import { restoreVerify, runRestore, runSql } from '../src/restore/restore-verify.mjs';

test('restores each application schema, skips system schemas, and logs verification', async () => {
  const calls = []; const execSql = jest.fn(async (_binary, args) => { calls.push(args.at(-1)); }); const restore = jest.fn(async () => {}); const writes = [];
  const count = await restoreVerify({ restoreRoot: 'root', credentialsFile: 'cnf', read: async () => 'mysql\napp\nsys\n', execSql, restore, stream: () => Readable.from([gzipSync('sql')]), writeLog: async (_path, value) => writes.push(value), logPath: 'log', now: () => 'now' });
  expect(count).toBe(1); expect(restore).toHaveBeenCalled(); expect(calls.join(' ')).toContain('DROP DATABASE'); expect(writes.join('')).toContain('passed');
});

test('notifies and logs restore verification failures', async () => { const notify = jest.fn(); const writes = []; await expect(restoreVerify({ restoreRoot: 'root', read: async () => 'bad;name\n', writeLog: async (_path, value) => writes.push(value), logPath: 'log', notify })).rejects.toThrow('Invalid database name'); expect(notify).toHaveBeenCalledWith(expect.stringContaining('bad;name')); expect(writes.join('')).toContain('failed'); });

test('runRestore and runSql report missing binaries', async () => { await expect(runRestore('elera-missing', [], Readable.from([]))).rejects.toThrow(); await expect(runSql('elera-missing', [])).rejects.toThrow(); });
test('runRestore and runSql resolve successful child processes', async () => { await expect(runRestore(process.execPath, ['-e', 'process.stdin.resume()'], Readable.from([]))).resolves.toBeUndefined(); await expect(runSql(process.execPath, ['-e', ''])).resolves.toBeUndefined(); });
test('reports native restore and SQL failures without stderr', async () => { await expect(runRestore(process.execPath, ['-e', 'process.stdin.resume(); process.exit(3)'], Readable.from([]))).rejects.toThrow('restore exited with 3'); await expect(runSql(process.execPath, ['-e', 'process.exit(4)'])).rejects.toThrow('sql exited with 4'); });
test('restore verification cleans up when restore itself fails', async () => { const execSql = jest.fn(async () => {}); const notify = jest.fn(); await expect(restoreVerify({ restoreRoot: 'root', read: async (path) => path.endsWith('DATABASES') ? 'app\n' : gzipSync('sql'), execSql, restore: async () => { throw new Error('restore failed'); }, stream: () => Readable.from([gzipSync('sql')]), notify })).rejects.toThrow('restore failed'); expect(execSql).toHaveBeenCalledTimes(2); expect(notify).toHaveBeenCalled(); });

test('skips system schemas and can verify an empty application manifest without logging', async () => { const execSql = jest.fn(async () => {}); await expect(restoreVerify({ restoreRoot: 'root', credentialsFile: 'cnf', read: async () => 'mysql\r\nsys\n', execSql })).resolves.toBe(0); expect(execSql).not.toHaveBeenCalled(); });

test('handles injected native process errors and optional restore environment', async () => {
  const spawnImpl = () => { const child = new EventEmitter(); child.stdin = new Writable({ write(_chunk, _encoding, callback) { callback(); } }); child.stderr = new EventEmitter(); child.stderr.setEncoding = jest.fn(); process.nextTick(() => { child.stderr.emit('data', ''); child.emit('error', new Error('spawn failed')); }); return child; };
  await expect(runRestore('missing', [], Readable.from([]), { spawnImpl })).rejects.toThrow('spawn failed');
  await expect(runSql('missing', [], { spawnImpl })).rejects.toThrow('spawn failed');
});

test('formats non-Error restore failures with default notification handling', async () => {
  await expect(restoreVerify({ restoreRoot: 'root', read: async () => 'app\n', execSql: async () => {}, restore: async () => { throw 'raw restore failure'; }, stream: () => Readable.from([gzipSync('sql')]) })).rejects.toBe('raw restore failure');
});
test('formats failures that happen before a database is selected', async () => {
  await expect(restoreVerify({ restoreRoot: 'root', read: async () => { throw new Error('manifest unavailable'); } })).rejects.toThrow('manifest unavailable');
});
