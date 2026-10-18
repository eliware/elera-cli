import { createRoutingBundleEndpoints } from "./bundle-endpoints.mjs";
import { createRoutingAdministrationEndpoints } from "./administration-endpoints.mjs";
import { createTrafficEndpoints } from "../traffic-endpoints.mjs";

export function createRoutingEndpoints(request, validateBundle) {
  return {
    ...createRoutingBundleEndpoints(request, validateBundle),
    ...createRoutingAdministrationEndpoints(request),
    ...createTrafficEndpoints(request),
  };
}
