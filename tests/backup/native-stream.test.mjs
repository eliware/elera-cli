import { expect, test } from '@jest/globals';
import { dumpDatabase, restoreDatabase } from '../../src/backup/native-stream.mjs';

test('native dump and restore require a complete connection bundle', async () => {
  expect(() => dumpDatabase({}, 'unused.sql')).toThrow('connection bundle credentials are required');
  expect(() => restoreDatabase({}, 'unused.sql')).toThrow('connection bundle credentials are required');
});
