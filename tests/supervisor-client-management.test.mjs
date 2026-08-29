import { createSupervisorClient } from '../src/supervisor-client.mjs';

const response = (body) => ({ ok: true, headers: { get: () => 'application/json' }, json: async () => body });

test('supports account listing, token listing, and token rotation endpoints', async () => {
  const requests = [];
  const client = createSupervisorClient({ endpoint: 'http://supervisor', token: 'token', fetchImpl: async (url, options) => { requests.push([url, options]); return response({ ok: true }); } });
  await client.accounts();
  await client.tokens();
  await client.rotateToken('app token');
  expect(requests.map(([url]) => url)).toEqual(['http://supervisor/api/v1/accounts', 'http://supervisor/api/v1/tokens', 'http://supervisor/api/v1/tokens/app%20token/rotate']);
  expect(requests[2][1].method).toBe('POST');
});

test('supports database planning and verification endpoints', async () => {
  const paths = [];
  const client = createSupervisorClient({ endpoint: 'http://supervisor', token: 'token', fetchImpl: async (url) => { paths.push(url); return response({ ok: true }); } });
  await client.planDatabases({ databases: [] });
  await client.verifyDatabases({ databases: [] });
  expect(paths).toEqual(['http://supervisor/api/v1/databases/plan', 'http://supervisor/api/v1/databases/verify']);
});

test('supports backup planning without sending dump contents', async () => {
  const requests = [];
  const client = createSupervisorClient({ endpoint: 'http://supervisor', token: 'token', fetchImpl: async (url, options) => { requests.push([url, options]); return response({ ok: true }); } });
  await client.planBackup({ databases: ['app'] });
  expect(requests[0][0]).toBe('http://supervisor/api/v1/backups/plan');
  expect(JSON.parse(requests[0][1].body)).toEqual({ desired: { databases: ['app'] } });
});

test('supports restore planning without sending dump contents', async () => {
  const requests = [];
  const client = createSupervisorClient({ endpoint: 'http://supervisor', token: 'token', fetchImpl: async (url, options) => { requests.push([url, options]); return response({ ok: true }); } });
  await client.planRestore({ databases: ['app'] });
  expect(requests[0][0]).toBe('http://supervisor/api/v1/restores/plan');
  expect(JSON.parse(requests[0][1].body)).toEqual({ desired: { databases: ['app'] } });
});
