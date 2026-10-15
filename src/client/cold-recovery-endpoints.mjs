import { jsonRequest } from "./request-json.mjs";
export function createColdRecoveryEndpoints(request) {
  return {
    coldRecoveryEvidence: () => request("/api/v1/cluster/cold-recovery/evidence"),
    coldRecoveryStatus: () => request("/api/v1/cluster/cold-recovery/status"),
    coldRecoveryPlan: () => jsonRequest(request, "/api/v1/cluster/cold-recovery/plan", {}),
    coldRecoveryAuthorize: (input = {}) =>
      jsonRequest(request, "/api/v1/cluster/cold-recovery/authorize", input),
    coldRecoveryBootstrap: (input = {}) =>
      jsonRequest(request, "/api/v1/cluster/cold-recovery/bootstrap", input),
    coldRecoveryComplete: (input = {}) =>
      jsonRequest(request, "/api/v1/cluster/cold-recovery/complete", input),
  };
}
