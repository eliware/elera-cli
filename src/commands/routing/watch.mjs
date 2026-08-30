import { createCliRoutingStream as createRoutingStream } from '../../internal/routing/stream.mjs';

export async function runRoutingWatch({ client, emit, endpoint, token, identity, WebSocketImpl, once = false } = {}) {
  const stream = createRoutingStream({ endpoint, token, WebSocketImpl, onUpdate: (event) => emit(event) });
  await stream.connect();
  if (once) { stream.close(); return 0; }
  return new Promise((resolve) => {
    const stop = () => { stream.close(); resolve(0); };
    process.once('SIGINT', stop); process.once('SIGTERM', stop);
  });
}
