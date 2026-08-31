import { createRestoreMetadataEndpoints } from './restore-metadata-endpoints.mjs';
import { createRestoreAccountEndpoints } from './restore-account-endpoints.mjs';
import { createReconcileEndpoints } from './reconcile-endpoints.mjs';
import { createPlanningEndpoints } from './planning-endpoints.mjs';

export function createRestoreEndpoints(request) {
  return { ...createRestoreMetadataEndpoints(request), ...createRestoreAccountEndpoints(request), ...createReconcileEndpoints(request), ...createPlanningEndpoints(request) };
}
