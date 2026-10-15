import { jsonRequest } from "./request-json.mjs";
export function createCredentialEndpoints(request, validateBundle) {
  return {
    lease: async (database, identity, routes = ["primary", "balanced"]) => {
      const body = await jsonRequest(request, "/api/v1/credentials/lease", {
        database,
        identity,
        routes,
      });
      return validateBundle(body.data ?? body);
    },
    refreshCredentials: async (identity) => {
      const body = await jsonRequest(request, "/api/v1/credentials/refresh", { identity });
      return validateBundle(body.data ?? body);
    },
  };
}
