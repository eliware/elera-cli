import { expect, test } from '@jest/globals';
import { manifestText } from '../../src/backup/manifest-text.mjs';
test('serializes checksum entries', () => { expect(manifestText([{ hash: 'abc', name: 'app.sql.gz' }])).toBe('abc  app.sql.gz\n'); });
