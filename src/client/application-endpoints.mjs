import { encoded } from "./encode-path.mjs";
import { jsonRequest } from "./request-json.mjs";

export function createApplicationEndpoints(request) {
  return {
    createApplication: (name) => jsonRequest(request, "/api/v1/applications", { name }),
    applications: () => request("/api/v1/applications"),
    applicationStatus: (applicationId) => request(`/api/v1/applications/${encoded(applicationId)}`),
    createAppAdminToken: (application, tokenName = "owner") =>
      jsonRequest(request, "/api/v1/app-admin/tokens", { application, tokenName }),
  };
}
