import { jest } from '@jest/globals';
import * as subject from '../../src/client/routing-endpoints.mjs';
import { validateBundle } from '@eliware/elera-lib';
test('exports routing endpoint operations', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
test('requests a token-bound bundle without adding an identity selector', async () => {
  const request = jest.fn(async (path) => ({ data: { application: 'payments', database: 'ledger' }, path }));
  const endpoints = subject.createRoutingEndpoints(request, (bundle) => bundle);
  await expect(endpoints.routingBundle()).resolves.toEqual({ application: 'payments', database: 'ledger' });
  expect(request).toHaveBeenCalledWith('/api/v1/routing/bundle');
});
test('requests routing administration operations', async () => {
  const request = jest.fn(async (path, options) => ({ ok: true, path, options }));
  const endpoints = subject.createRoutingEndpoints(request, (bundle) => bundle);
  await endpoints.routingValidate('a'); await endpoints.routingEvents('a'); await endpoints.routingRebalance('a');
  expect(request).toHaveBeenNthCalledWith(1, '/api/v1/routing/validate?application=a');
  expect(request).toHaveBeenNthCalledWith(2, '/api/v1/routing/events?application=a');
  expect(request).toHaveBeenNthCalledWith(3, '/api/v1/routing/rebalance', expect.objectContaining({ method: 'POST' }));
  await endpoints.routingValidate(); await endpoints.routingEvents();
  await endpoints.routingRebalance();
  expect(request).toHaveBeenCalledWith('/api/v1/routing/validate');
  expect(request).toHaveBeenCalledWith('/api/v1/routing/events');
  expect(request).toHaveBeenLastCalledWith('/api/v1/routing/rebalance', expect.objectContaining({ body: '{"confirm":true}' }));
});
test('accepts a canonical elera-lib bundle and rejects malformed bundle responses', async () => {
  const canonical = { apiVersion: 'v1', application: 'payments', database: 'ledger', identity: 'runtime', credentials: { username: 'u', password: 'fixture-only' }, bundleVersion: 1, expiresAt: '2099-01-01T00:00:00Z', nodeIdentity: 'sql0', ports: { sql: 3306, http: 8080 }, routes: { primary: [{ host: 'sql0', port: 3306 }], balanced: [] }, writer: { host: 'sql0', port: 3306 }, failover: [], readers: [] };
  const request = jest.fn(async () => ({ data: canonical }));
  await expect(subject.createRoutingEndpoints(request, validateBundle).routingBundle()).resolves.toBe(canonical);
  request.mockResolvedValue({ data: { ...canonical, apiVersion: 'v0' } });
  await expect(subject.createRoutingEndpoints(request, validateBundle).routingBundle()).rejects.toThrow('routing bundle apiVersion must be v1');
});
