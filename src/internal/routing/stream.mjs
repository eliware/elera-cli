import { validateRoutingEvent } from "@eliware/elera-lib";
import WebSocket from "ws";

export function createCliRoutingStream({
  endpoint,
  token,
  WebSocketImpl = WebSocket,
  onUpdate,
  onError,
} = {}) {
  if (!endpoint) throw new TypeError("endpoint is required");
  if (!token) throw new TypeError("token is required");
  let socket;
  let closed = false;
  const url = `${endpoint.replace(/^http/i, "ws").replace(/\/$/, "")}/api/v1/routing/stream`;
  async function connect() {
    if (closed || typeof WebSocketImpl !== "function") return;
    socket = new WebSocketImpl(url, { headers: { authorization: `Bearer ${token}` } });
    socket.onmessage = ({ data }) => {
      try {
        onUpdate?.(validateRoutingEvent(JSON.parse(data)));
      } catch (error) {
        onError?.(error);
      }
    };
    socket.onerror = (error) => onError?.(error);
    socket.onclose = () => {
      socket = undefined;
    };
  }
  return {
    connect,
    close: () => {
      closed = true;
      socket?.close?.();
    },
    state: () => ({ connected: socket?.readyState === 1, endpoint }),
  };
}
