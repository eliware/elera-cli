import { expect, test, jest } from '@jest/globals';
import { createSupervisorClient } from '../src/supervisor-client.mjs';

test('exposes routing resync and drain operations through REST', async () => {
  const fetchImpl = jest.fn(async () => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => ({ ok: true }) }));
  const client = createSupervisorClient({ endpoint: 'http://db', token: 't', fetchImpl });
  await client.resync('app'); await client.drain(); await client.undrain(); await client.trafficStatus();
  expect(fetchImpl.mock.calls.map(([url, options]) => [url, options?.method])).toEqual([
    ['http://db/api/v1/routing/resync?application=app', undefined], ['http://db/api/v1/traffic/drain', 'POST'], ['http://db/api/v1/traffic/undrain', 'POST'], ['http://db/api/v1/traffic/status', undefined]
  ]);
});
