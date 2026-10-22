import { encoded } from "./encode-path.mjs";
import { jsonRequest } from "./request-json.mjs";

export function createTokenEndpoints(request) {
  return {
    tokens: () => request("/api/v1/tokens"),
    createToken: (input) => jsonRequest(request, "/api/v1/tokens", input),
    rotateToken: (name) =>
      jsonRequest(request, `/api/v1/tokens/${encoded(name)}/rotate`, { confirm: true }),
    revokeToken: (name) => jsonRequest(request, "/api/v1/tokens/revoke", { name }),
  };
}
