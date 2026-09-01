import { validateRoutingEvent } from '@eliware/elera-lib';

export function createCliRoutingStream({ endpoint, token, WebSocketImpl = globalThis.WebSocket, onUpdate, onError } = {}) {
  if (!endpoint) throw new TypeError('endpoint is required');
  let socket;
  let closed = false;
  // The native WebSocket API cannot set arbitrary Authorization headers; the
  // supervisor stream contract intentionally accepts this query token.
  const url = `${endpoint.replace(/^http/i, 'ws').replace(/\/$/, '')}/api/v1/routing/stream?token=${encodeURIComponent(token ?? '')}`;
  async function connect() {
    if (closed || typeof WebSocketImpl !== 'function') return;
    socket = new WebSocketImpl(url);
    socket.onmessage = ({ data }) => { try { onUpdate?.(validateRoutingEvent(JSON.parse(data))); } catch (error) { onError?.(error); } };
    socket.onerror = (error) => onError?.(error);
    socket.onclose = () => { socket = undefined; };
  }
  return { connect, close: () => { closed = true; socket?.close?.(); }, state: () => ({ connected: socket?.readyState === 1, endpoint }) };
}
