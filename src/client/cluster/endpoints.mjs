import { createClusterObservabilityEndpoints } from "./observability.mjs";
import { createClusterLifecycleEndpoints } from "./lifecycle.mjs";

export function createClusterEndpoints(request) {
  return {
    ...createClusterObservabilityEndpoints(request),
    ...createClusterLifecycleEndpoints(request),
  };
}
