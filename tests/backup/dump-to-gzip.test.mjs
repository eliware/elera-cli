import { expect, jest, test } from '@jest/globals';
import { Readable, Writable } from 'node:stream';
import { dumpToGzip } from '../../src/backup/dump-to-gzip.mjs';

test('starts dump subprocesses without a shell', async () => {
  const child = { stdout: new Readable({ read() { this.push(null); } }), stderr: { setEncoding: jest.fn(), on: jest.fn() }, once: jest.fn((event, handler) => event === 'close' && handler(0)) };
  const spawnImpl = jest.fn(() => child);
  await expect(dumpToGzip('mariadb-dump', [], 'backup.sql.gz', { spawnImpl, createOutput: () => new Writable({ write(_chunk, _encoding, done) { done(); } }) })).resolves.toBeUndefined();
  expect(spawnImpl).toHaveBeenCalledWith('mariadb-dump', [], expect.objectContaining({ shell: false }));
});
