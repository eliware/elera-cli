import { expect, jest, test } from '@jest/globals';
import { runTelemetryWatch } from '../../../src/commands/telemetry/watch.mjs';

test('uses the routing stream presentation for telemetry watch', async () => {
  const close = jest.fn();
  class FakeWebSocket { constructor() { this.readyState = 1; } close = close; }
  await expect(runTelemetryWatch({ client: { routingBundle: async () => ({}) }, emit: jest.fn(), endpoint: 'http://router', token: 'token', WebSocketImpl: FakeWebSocket, once: true })).resolves.toBe(0);
  expect(close).toHaveBeenCalled();
});
