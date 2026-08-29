import { jsonRequest } from './endpoint-helpers.mjs';

export function createClusterEndpoints(request) {
  return {
    observations: () => request('/api/v1/cluster/observations'),
    quorum: () => request('/api/v1/cluster/quorum'),
    coldBootstrapPlan: () => request('/api/v1/cluster/cold-bootstrap/plan', { method: 'POST' }),
    coldBootstrap: (input = {}) => jsonRequest(request, '/api/v1/cluster/cold-bootstrap', input),
    coldBootstrapEvidence: () => request('/api/v1/cluster/cold-bootstrap/evidence'),
    bootstrap: () => jsonRequest(request, '/api/v1/cluster/bootstrap', { confirm: true }),
    join: () => jsonRequest(request, '/api/v1/cluster/join', { confirm: true }),
    rejoin: () => jsonRequest(request, '/api/v1/cluster/join', { confirm: true, rejoin: true }),
    bootstrapEligibility: () => request('/api/v1/cluster/bootstrap/eligibility'),
    bootstrapPlan: () => request('/api/v1/cluster/bootstrap/plan', { method: 'POST' }),
    joinPlan: () => request('/api/v1/cluster/join/plan', { method: 'POST' }),
    recoverPlan: () => request('/api/v1/cluster/recover/plan', { method: 'POST' }),
    recover: (input = {}) => jsonRequest(request, '/api/v1/cluster/recover', { confirm: true, ...input }),
    waitReady: () => request('/api/v1/cluster/wait-ready'),
    lifecyclePlan: (action, options = {}) => jsonRequest(request, '/api/v1/cluster/lifecycle/plan', { action, ...options }),
    lifecycleApply: (action, options = {}) => jsonRequest(request, '/api/v1/cluster/lifecycle/apply', { action, ...options }),
    lifecycle: (action, options = {}) => jsonRequest(request, '/api/v1/cluster/lifecycle/apply', { action, confirm: true, ...options }),
  };
}
