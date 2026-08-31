import { validateBundle } from '@eliware/elera-lib';
import { createSupervisorRequest } from './transport/supervisor-request.mjs';
import { createCoreEndpoints } from './client/core-endpoints.mjs';
import { createClusterEndpoints } from './client/cluster-endpoints.mjs';
import { createRoutingEndpoints } from './client/routing-endpoints.mjs';
import { createRestoreEndpoints } from './client/restore-endpoints.mjs';
import { createRecoveryEndpoints } from './client/recovery-endpoints.mjs';
import { pollOperation } from './operations/poll.mjs';

/** Creates the public supervisor API by composing focused endpoint families. */
export function createSupervisorClient({ endpoint, token, fetchImpl = fetch, operationId } = {}) {
  const request = createSupervisorRequest({ endpoint, token, fetchImpl, operationId });
  const operationStatus = (operationId) => request(`/api/v1/operations/${encodeURIComponent(operationId ?? '')}`);
  const waitOperation = async (operationId, options) => {
    const result = await pollOperation(async () => {
      const current = await operationStatus(operationId);
      return { ...current, done: ['completed', 'failed', 'error', 'cancelled'].includes(current?.status) };
    }, options);
    if (result?.status === 'failed' || result?.status === 'error') throw Object.assign(new Error(result.error?.message ?? 'supervisor operation failed'), { body: result, statusCode: 409 });
    return result;
  };
  return Object.freeze({
    ...createCoreEndpoints(request, validateBundle),
    ...createClusterEndpoints(request),
    ...createRoutingEndpoints(request, validateBundle),
    ...createRestoreEndpoints(request),
    ...createRecoveryEndpoints(request),
    operationStatus,
    waitOperation,
  });
}
