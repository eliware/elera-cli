import { createRoutingBundleEndpoints } from './routing-bundle-endpoints.mjs';
import { createRoutingAdministrationEndpoints } from './routing-administration-endpoints.mjs';
import { createTrafficEndpoints } from './traffic-endpoints.mjs';

export function createRoutingEndpoints(request, validateBundle) {
  return { ...createRoutingBundleEndpoints(request, validateBundle), ...createRoutingAdministrationEndpoints(request), ...createTrafficEndpoints(request) };
}
