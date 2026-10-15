import { encoded } from "./encode-path.mjs";
import { jsonRequest } from "./request-json.mjs";
export function createSecretEndpoints(request) {
  return {
    listSecrets: () => request("/api/v1/secrets"),
    putSecret: (name, artifact) =>
      jsonRequest(request, `/api/v1/secrets/${encoded(name)}`, artifact, "PUT"),
    getSecret: (name) => request(`/api/v1/secrets/${encoded(name)}`),
    verifySecret: (name) => request(`/api/v1/secrets/${encoded(name)}/verify`, { method: "POST" }),
    removeSecret: (name) => request(`/api/v1/secrets/${encoded(name)}`, { method: "DELETE" }),
  };
}
