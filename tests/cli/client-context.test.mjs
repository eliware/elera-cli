import { jest } from '@jest/globals';
import { createClientContext, resolveTargetEndpoint } from '../../src/cli/client-context.mjs';

test('uses the configured endpoint by default and a direct endpoint only when selected', () => {
  const createClient = jest.fn((config) => config);
  const config = { endpoint: 'http://load-balancer', protocol: 'http', port: 8080 };
  const normal = createClientContext({ config, createClient, operationId: 'op' });
  expect(normal.client.endpoint).toBe(config.endpoint);
  expect(normal.controlClient).toBe(normal.client);
  const direct = createClientContext({ config, createClient, targetEndpoint: 'http://node/' });
  expect(direct.controlClient.endpoint).toBe('http://node');
});

test('resolves explicit endpoint, direct host, or no override in priority order', () => {
  const config = { protocol: 'https', port: 8443 };
  expect(resolveTargetEndpoint({ config, explicitTarget: 'http://explicit', targetHost: 'node' })).toBe('http://explicit');
  expect(resolveTargetEndpoint({ config, targetHost: 'node' })).toBe('https://node:8443');
  expect(resolveTargetEndpoint({ config })).toBeUndefined();
});
