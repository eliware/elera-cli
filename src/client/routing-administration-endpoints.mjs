import { encoded } from "./encode-path.mjs";
import { jsonRequest } from "./request-json.mjs";
export function createRoutingAdministrationEndpoints(request) {
  return {
    resync: (application) =>
      request(`/api/v1/routing/resync${application ? `?application=${encoded(application)}` : ""}`),
    routingValidate: (application) =>
      request(
        `/api/v1/routing/validate${application ? `?application=${encoded(application)}` : ""}`,
      ),
    routingEvents: (application) =>
      request(`/api/v1/routing/events${application ? `?application=${encoded(application)}` : ""}`),
    routingRebalance: (application) =>
      jsonRequest(request, "/api/v1/routing/rebalance", {
        ...(application ? { application } : {}),
        confirm: true,
      }),
  };
}
