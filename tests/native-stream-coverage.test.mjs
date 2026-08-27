import { expect, jest, test } from '@jest/globals';
import { dumpDatabase, restoreDatabase } from '../src/backup/native-stream.mjs';
import { PassThrough } from 'node:stream';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const bundle = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] } };
test('streams dump and restore through injected process runner', async () => {
  const run = jest.fn(async (_command, _args, options) => { options.output?.end?.(); options.input?.resume?.(); return { code: 0 }; });
  await dumpDatabase(bundle, new PassThrough(), { runImpl: run }); await restoreDatabase(bundle, new PassThrough(), { runImpl: run });
  expect(run).toHaveBeenCalledTimes(2); expect(run.mock.calls[0][0]).toBe('mariadb-dump'); expect(run.mock.calls[1][0]).toBe('mariadb');
});
test('rejects native stream operations without complete bundle credentials', () => { expect(() => dumpDatabase({ database: 'app' }, '/tmp/x')).toThrow('connection bundle'); expect(() => restoreDatabase({ database: 'app' }, '/tmp/x')).toThrow('connection bundle'); });

test('supports file paths and direct bundle host and port fields', async () => {
  const root = await mkdtemp(join(process.env.TEMP ?? process.env.TMP, 'elera-native-'));
  const run = jest.fn(async (_command, _args, options) => { options.output?.end?.(); options.input?.resume?.(); return { code: 0 }; });
  const direct = { database: 'app', username: 'u', password: 'p', host: 'direct', port: 3307 };
  await dumpDatabase(direct, join(root, 'dump.sql'), { runImpl: run });
  await writeFile(join(root, 'source.sql'), 'sql');
  await restoreDatabase(direct, join(root, 'source.sql'), { runImpl: run });
  expect(run.mock.calls[0][1]).toContain('3307');
});

test('defaults the native client port when the bundle omits it', async () => {
  const run = jest.fn(async (_command, _args, options) => { options.output?.end?.(); options.input?.resume?.(); return { code: 0 }; });
  const noPort = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db' }] } };
  await dumpDatabase(noPort, new PassThrough(), { runImpl: run });
  await restoreDatabase(noPort, new PassThrough(), { runImpl: run });
  expect(run.mock.calls[0][1]).toContain('3306');
});
