import { expect, jest, test } from '@jest/globals';
import { createLiveDb } from '../../src/routing/live-db.mjs';

const bundle = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01T00:00:00Z' };

test('creates a bundled SQL client and attaches the routing stream', async () => {
  const db = { attachRoutingStream: jest.fn(async () => {}), close: jest.fn(async () => {}) };
  const createDb = jest.fn(async () => db);
  const live = await createLiveDb({ bundle, endpoint: 'http://supervisor', token: 'token', fetchBundle: jest.fn(), createDb });
  expect(createDb).toHaveBeenCalledWith({ endpoint: 'http://supervisor', token: 'token' });
  await live.close();
  expect(db.close).toHaveBeenCalled();
});

test('requires complete live-client inputs', async () => {
  await expect(createLiveDb()).rejects.toThrow('bundle, endpoint, token, fetchBundle, and createDb are required');
});
