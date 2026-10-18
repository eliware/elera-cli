import { expect, jest, test } from "@jest/globals";
import { runRoutingWatch } from "../../../../../src/commands/routing/watch.mjs";

test("connects a routing watch and supports one-shot inspection", async () => {
  const emit = jest.fn();
  const close = jest.fn();
  class FakeWebSocket {
    constructor() {
      this.readyState = 1;
    }
    close = close;
  }
  await expect(
    runRoutingWatch({
      emit,
      endpoint: "http://router",
      token: "token",
      WebSocketImpl: FakeWebSocket,
      once: true,
    }),
  ).resolves.toBe(0);
  expect(close).toHaveBeenCalled();
});

test("forwards stream updates and stops on a lifecycle signal", async () => {
  const emit = jest.fn();
  const close = jest.fn();
  const signals = new Map();
  class FakeWebSocket {
    static instances = [];
    constructor() {
      this.readyState = 1;
      FakeWebSocket.instances.push(this);
      queueMicrotask(() => this.onopen?.());
    }
    send = jest.fn();
    close = close;
  }
  const oldOnce = process.once;
  process.once = jest.fn((signal, handler) => signals.set(signal, handler));
  try {
    const pending = runRoutingWatch({
      emit,
      endpoint: "http://router",
      token: "token",
      WebSocketImpl: FakeWebSocket,
    });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const socket = FakeWebSocket.instances[0];
    socket.onmessage?.({
      data: JSON.stringify({
        type: "routing.update",
        version: 1,
        generatedAt: "2099-01-01T00:00:00Z",
        apiVersion: "v1",
        application: "app",
        database: "db",
        physicalDatabase: "elera_db_app",
        identity: "id",
        nodeIdentity: "node-1",
        credentials: { username: "u", password: "fixture-only" },
        bundleVersion: 1,
        ports: { sql: 3306, http: 8080 },
        writer: { host: "db", port: 3306 },
        readers: [],
        failover: [],
        expiresAt: "2099-01-01T00:00:00Z",
        routes: { primary: [], balanced: [] },
      }),
    });
    socket.onmessage?.({
      data: JSON.stringify({
        type: "routing.shutdown",
        version: 1,
        generatedAt: "2099-01-01T00:00:00Z",
        node: "elera-0",
        reconnectDeadlineMs: 1000,
        loadBalancerEndpoint: "http://lb",
      }),
    });
    await new Promise((resolve) => queueMicrotask(resolve));
    signals.get("SIGTERM")();
    await expect(pending).resolves.toBe(0);
    expect(emit).toHaveBeenCalledWith(expect.objectContaining({ type: "routing.update" }));
    expect(signals.has("SIGINT")).toBe(true);
    expect(close).toHaveBeenCalled();
  } finally {
    process.once = oldOnce;
  }
});
test("reports malformed stream messages and websocket errors", async () => {
  const emit = jest.fn();
  const _onError = jest.fn();
  class FakeWebSocket {
    constructor() {
      this.readyState = 1;
      queueMicrotask(() => {
        this.onmessage?.({ data: "{" });
        this.onerror?.(new Error("socket"));
      });
    }
    close() {}
  }
  const pending = runRoutingWatch({
    emit,
    endpoint: "http://router",
    token: "token",
    WebSocketImpl: FakeWebSocket,
  });
  await new Promise((resolve) => queueMicrotask(resolve));
  process.emit("SIGINT");
  await expect(pending).resolves.toBe(0);
});

test("uses default routing watch controls", async () => {
  await expect(runRoutingWatch()).rejects.toThrow();
});
