import { validateBundle } from '@eliware/elera-lib';
import { createSupervisorRequest } from './transport/supervisor-request.mjs';
import { createCoreEndpoints } from './client/core-endpoints.mjs';
import { createClusterEndpoints } from './client/cluster-endpoints.mjs';
import { createRoutingEndpoints } from './client/routing-endpoints.mjs';
import { createRestoreEndpoints } from './client/restore-endpoints.mjs';
import { createRecoveryEndpoints } from './client/recovery-endpoints.mjs';

/** Creates the public supervisor API by composing focused endpoint families. */
export function createSupervisorClient({ endpoint, token, fetchImpl = fetch, operationId } = {}) {
  const request = createSupervisorRequest({ endpoint, token, fetchImpl, operationId });
  return Object.freeze({
    ...createCoreEndpoints(request, validateBundle),
    ...createClusterEndpoints(request),
    ...createRoutingEndpoints(request, validateBundle),
    ...createRestoreEndpoints(request),
    ...createRecoveryEndpoints(request),
  });
}
