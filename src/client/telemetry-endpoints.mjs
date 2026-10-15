import { encoded } from "./encode-path.mjs";
export function createTelemetryEndpoints(request) {
  return {
    status: () => request("/api/v1/status"),
    telemetry: () => request("/api/v1/telemetry"),
    telemetryDetails: async (application) => {
      if (!application) throw new TypeError("application is required");
      return request(`/api/v1/telemetry/details?application=${encoded(application)}`);
    },
  };
}
