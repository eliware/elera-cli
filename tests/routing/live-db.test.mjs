import { expect, jest, test } from '@jest/globals';
import { createLiveDb } from '../../src/routing/live-db.mjs';

const bundle = { database: 'app', credentials: { username: 'u', password: 'p' }, routes: { primary: [{ host: 'db', port: 3306 }] }, expiresAt: '2099-01-01T00:00:00Z' };

test('creates a bundled SQL client and attaches the routing stream', async () => {
  const db = { attachRoutingStream: jest.fn(async () => {}), close: jest.fn(async () => {}) };
  const stream = { close: jest.fn() };
  const createDb = jest.fn(async () => db);
  const createStream = jest.fn(() => stream);
  const live = await createLiveDb({ bundle, endpoint: 'http://supervisor', token: 'token', application: 'app', fetchBundle: jest.fn(), createDb, createStream });
  expect(createStream).toHaveBeenCalledWith(expect.objectContaining({ endpoint: 'http://supervisor', token: 'token', application: 'app' }));
  expect(db.attachRoutingStream).toHaveBeenCalledWith(stream);
  await live.close();
  expect(stream.close).toHaveBeenCalled();
  expect(db.close).toHaveBeenCalled();
});

test('requires complete live-client inputs', async () => {
  await expect(createLiveDb()).rejects.toThrow('bundle, endpoint, token, and fetchBundle are required');
});
