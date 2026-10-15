import { createClusterObservabilityEndpoints } from "./cluster-observability.mjs";
import { createClusterLifecycleEndpoints } from "./cluster-lifecycle.mjs";

export function createClusterEndpoints(request) {
  return {
    ...createClusterObservabilityEndpoints(request),
    ...createClusterLifecycleEndpoints(request),
  };
}
