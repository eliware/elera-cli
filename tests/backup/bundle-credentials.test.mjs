import { expect, test } from '@jest/globals';
import { normalizeBundleCredentials } from '../../src/backup/bundle-credentials.mjs';

test('normalizes credentials and primary route', () => {
  expect(normalizeBundleCredentials({ database: 'db', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3307 }] } })).toMatchObject({ username: 'u', password: 'p', host: 'db', port: 3307 });
});

test('rejects incomplete credentials', () => {
  expect(() => normalizeBundleCredentials({ database: 'db' })).toThrow('connection bundle credentials are required');
});
