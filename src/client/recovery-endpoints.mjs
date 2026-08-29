import { jsonRequest } from './endpoint-helpers.mjs';

export function createRecoveryEndpoints(request) {
  return {
    recoveryStatus: () => request('/api/v1/recovery/status'),
    recoveryEvents: () => request('/api/v1/recovery/events'),
    recoveryAcknowledge: (reason) => jsonRequest(request, '/api/v1/recovery/acknowledge', { confirm: true, reason }),
    recoveryAbort: (reason) => jsonRequest(request, '/api/v1/recovery/abort', { confirm: true, reason }),
  };
}
