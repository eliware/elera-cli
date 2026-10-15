import { jsonRequest } from "./request-json.mjs";
export function createClusterObservabilityEndpoints(request) {
  return {
    observations: () => request("/api/v1/cluster/observations"),
    quorum: () => request("/api/v1/cluster/quorum"),
    coldBootstrapPlan: () => request("/api/v1/cluster/cold-bootstrap/plan", { method: "POST" }),
    coldBootstrap: (input = {}) => jsonRequest(request, "/api/v1/cluster/cold-bootstrap", input),
    coldBootstrapEvidence: () => request("/api/v1/cluster/cold-bootstrap/evidence"),
  };
}
