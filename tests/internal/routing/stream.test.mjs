import "../../../test-fixtures/integration/internal/routing/validate-bundle.mjs";
import { expect, jest, test } from "@jest/globals";
import { createCliRoutingStream } from "../../../src/internal/routing/stream.mjs";

test("requires an endpoint", () => {
  expect(() => createCliRoutingStream()).toThrow("endpoint is required");
});
test("requires a token", () => {
  expect(() => createCliRoutingStream({ endpoint: "https://router" })).toThrow("token is required");
});
test("builds a websocket URL, reports updates/errors, and closes", async () => {
  const updates = jest.fn();
  const errors = jest.fn();
  let socket;
  class FakeWebSocket {
    constructor(url, options) {
      this.url = url;
      this.options = options;
      this.readyState = 1;
      socket = this;
    }
    close = jest.fn();
  }
  const stream = createCliRoutingStream({
    endpoint: "https://router/",
    token: "a b",
    fetchBundle: async () => ({}),
    WebSocketImpl: FakeWebSocket,
    onUpdate: updates,
    onError: errors,
  });
  await stream.connect();
  expect(socket.url).toBe("wss://router/api/v1/routing/stream");
  expect(socket.options).toEqual({ headers: { authorization: "Bearer a b" } });
  expect(stream.state().connected).toBe(true);
  socket.onmessage({
    data: '{"type":"routing.shutdown","version":1,"generatedAt":"2026-08-30T00:00:00.000Z","node":"node-1","reason":"maintenance","reconnectDeadlineMs":1000}',
  });
  socket.onmessage({ data: "{" });
  socket.onerror(new Error("offline"));
  expect(updates).toHaveBeenCalled();
  expect(errors).toHaveBeenCalledTimes(2);
  socket.onmessage({
    data: '{"type":"routing.unknown","version":1,"generatedAt":"2026-08-30T00:00:00.000Z"}',
  });
  expect(errors).toHaveBeenLastCalledWith(
    expect.objectContaining({ message: "unsupported routing event" }),
  );
  socket.onclose();
  expect(stream.state().connected).toBe(false);
  stream.close();
  await stream.connect();
  expect(stream.state().connected).toBe(false);
});
test("does not construct a socket when websocket support is unavailable", async () => {
  const stream = createCliRoutingStream({
    endpoint: "http://x",
    token: "test-token",
    fetchBundle: async () => ({}),
    WebSocketImpl: null,
  });
  await stream.connect();
  expect(stream.state().connected).toBe(false);
});
