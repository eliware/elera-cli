import { expect, jest, test } from '@jest/globals';
import { createCliRoutingStream } from '../../../src/internal/routing/stream.mjs';

test('requires an endpoint', () => { expect(() => createCliRoutingStream()).toThrow('endpoint is required'); });
test('builds a websocket URL, reports updates/errors, and closes', async () => {
  const updates = jest.fn(); const errors = jest.fn(); let socket;
  class FakeWebSocket { constructor(url) { this.url = url; this.readyState = 1; socket = this; } close = jest.fn(); }
  const stream = createCliRoutingStream({ endpoint: 'https://router/', token: 'a b', fetchBundle: async () => ({}), WebSocketImpl: FakeWebSocket, onUpdate: updates, onError: errors });
  await stream.connect(); expect(socket.url).toBe('wss://router/api/v1/routing/stream?token=a%20b'); expect(stream.state().connected).toBe(true);
  socket.onmessage({ data: '{"type":"routing.update"}' }); socket.onmessage({ data: '{' }); socket.onerror(new Error('offline')); expect(updates).toHaveBeenCalled(); expect(errors).toHaveBeenCalledTimes(2);
  socket.onclose(); expect(stream.state().connected).toBe(false); stream.close(); await stream.connect(); expect(stream.state().connected).toBe(false);
});
test('does not construct a socket when websocket support is unavailable', async () => { const stream = createCliRoutingStream({ endpoint: 'http://x', fetchBundle: async () => ({}) , WebSocketImpl: undefined }); await stream.connect(); expect(stream.state().connected).toBe(false); });
