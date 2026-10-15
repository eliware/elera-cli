import { jsonRequest } from "./request-json.mjs";
export function createConfigurationEndpoints(request) {
  return {
    intent: () => request("/api/v1/config/intent"),
    plan: (intent) => jsonRequest(request, "/api/v1/config/plan", { intent }),
    apply: (intent) => jsonRequest(request, "/api/v1/config/apply", { intent, confirm: true }),
    verify: () => request("/api/v1/config/verify", { method: "POST" }),
    initializationStatus: () => request("/api/v1/initialization"),
    initializationPlan: () => request("/api/v1/initialization/plan", { method: "POST" }),
    initializationApply: () =>
      jsonRequest(request, "/api/v1/initialization/apply", { confirm: true }),
    initializationVerify: () => request("/api/v1/initialization/verify", { method: "POST" }),
    metadataStatus: () => request("/api/v1/metadata/status"),
    metadataInitialize: () =>
      jsonRequest(request, "/api/v1/metadata/initialize", { confirm: true }),
    metadataVerify: () => request("/api/v1/metadata/verify", { method: "POST" }),
  };
}
