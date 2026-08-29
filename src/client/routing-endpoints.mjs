import { encoded, jsonRequest } from './endpoint-helpers.mjs';

export function createRoutingEndpoints(request, validateBundle) {
  return {
    routingBundle: async (identity) => { const selector = identity ? `?identity=${encoded(identity)}` : ''; const body = await request(`/api/v1/routing/bundle${selector}`); return validateBundle(body.data ?? body); },
    refreshRoutes: (input) => jsonRequest(request, '/api/v1/routes/refresh', input),
    resync: (application) => request(`/api/v1/routing/resync${application ? `?application=${encoded(application)}` : ''}`),
    trafficStatus: () => request('/api/v1/traffic/status'),
    drain: () => request('/api/v1/traffic/drain', { method: 'POST' }),
    undrain: () => request('/api/v1/traffic/undrain', { method: 'POST' }),
    routingValidate: (application) => request(`/api/v1/routing/validate${application ? `?application=${encoded(application)}` : ''}`),
    routingEvents: (application) => request(`/api/v1/routing/events${application ? `?application=${encoded(application)}` : ''}`),
    routingRebalance: (application) => jsonRequest(request, '/api/v1/routing/rebalance', { ...(application ? { application } : {}), confirm: true }),
  };
}
