import { createRestoreMetadataEndpoints } from "./metadata-endpoints.mjs";
import { createRestoreAccountEndpoints } from "./account-endpoints.mjs";
import { createReconcileEndpoints } from "../reconcile-endpoints.mjs";
import { createPlanningEndpoints } from "../planning-endpoints.mjs";

export function createRestoreEndpoints(request) {
  return {
    ...createRestoreMetadataEndpoints(request),
    ...createRestoreAccountEndpoints(request),
    ...createReconcileEndpoints(request),
    ...createPlanningEndpoints(request),
  };
}
