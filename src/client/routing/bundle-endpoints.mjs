import { encoded } from "../encode-path.mjs";
export function createRoutingBundleEndpoints(request, validateBundle) {
  return {
    routingBundle: async (identity) => {
      const selector = identity ? `?identity=${encoded(identity)}` : "";
      const body = await request(`/api/v1/routing/bundle${selector}`);
      return validateBundle(body.data ?? body);
    },
    refreshRoutes: async (input) =>
      request("/api/v1/routes/refresh", { method: "POST", body: JSON.stringify(input) }),
  };
}
