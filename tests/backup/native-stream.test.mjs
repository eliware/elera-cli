import { expect, test } from '@jest/globals';
import { dumpDatabase, restoreDatabase } from '../../src/backup/native-stream.mjs';
import { PassThrough } from 'node:stream';

test('native dump and restore require a complete connection bundle', async () => {
  expect(() => dumpDatabase({}, 'unused.sql')).toThrow('connection bundle credentials are required');
  expect(() => restoreDatabase({}, 'unused.sql')).toThrow('connection bundle credentials are required');
});
test('keeps credentials out of native arguments while supporting streamed dump and restore', async () => {
  const calls = [];
  const runImpl = async (binary, args, options) => { calls.push({ binary, args, options }); return { code: 0 }; };
  const bundle = { database: 'app', credentials: { username: 'user', password: 'secret' }, routes: { primary: [{ host: 'db', port: 3307 }] } };
  await dumpDatabase(bundle, new PassThrough(), { runImpl });
  await restoreDatabase(bundle, new PassThrough(), { runImpl });
  expect(calls).toHaveLength(2);
  for (const call of calls) {
    expect(call.args.join(' ')).not.toContain('secret');
    expect(call.options.env).toEqual({ MYSQL_PWD: 'secret' });
  }
  expect(calls[0].args).toContain('user');
  expect(calls[1].args).toContain('app');
});
