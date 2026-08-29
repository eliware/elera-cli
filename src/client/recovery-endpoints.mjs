import { jsonRequest } from './endpoint-helpers.mjs';

export function createRecoveryEndpoints(request) {
  return {
    recoveryStatus: () => request('/api/v1/recovery/status'),
    recoveryEvents: () => request('/api/v1/recovery/events'),
    recoveryAcknowledge: (reason) => jsonRequest(request, '/api/v1/recovery/acknowledge', { confirm: true, reason }),
    recoveryAbort: (reason) => jsonRequest(request, '/api/v1/recovery/abort', { confirm: true, reason }),
    coldRecoveryEvidence: () => request('/api/v1/cluster/cold-recovery/evidence'),
    coldRecoveryStatus: () => request('/api/v1/cluster/cold-recovery/status'),
    coldRecoveryPlan: () => jsonRequest(request, '/api/v1/cluster/cold-recovery/plan', {}),
    coldRecoveryAuthorize: (input = {}) => jsonRequest(request, '/api/v1/cluster/cold-recovery/authorize', input),
    coldRecoveryBootstrap: (input = {}) => jsonRequest(request, '/api/v1/cluster/cold-recovery/bootstrap', input),
    coldRecoveryComplete: (input = {}) => jsonRequest(request, '/api/v1/cluster/cold-recovery/complete', input),
  };
}
