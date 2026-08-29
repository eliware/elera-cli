import { encoded, jsonRequest } from './endpoint-helpers.mjs';

export function createCoreEndpoints(request, validateBundle) {
  return {
    status: () => request('/api/v1/status'),
    telemetry: () => request('/api/v1/telemetry'),
    telemetryDetails: async (application) => {
      if (!application) throw new TypeError('application is required');
      return request(`/api/v1/telemetry/details?application=${encoded(application)}`);
    },
    health: () => request('/healthz'),
    ready: () => request('/readyz'),
    intent: () => request('/api/v1/config/intent'),
    plan: (intent) => jsonRequest(request, '/api/v1/config/plan', { intent }),
    apply: (intent) => jsonRequest(request, '/api/v1/config/apply', { intent, confirm: true }),
    verify: () => request('/api/v1/config/verify', { method: 'POST' }),
    initializationStatus: () => request('/api/v1/initialization'),
    initializationPlan: () => request('/api/v1/initialization/plan', { method: 'POST' }),
    initializationApply: () => jsonRequest(request, '/api/v1/initialization/apply', { confirm: true }),
    initializationVerify: () => request('/api/v1/initialization/verify', { method: 'POST' }),
    metadataStatus: () => request('/api/v1/metadata/status'),
    metadataInitialize: () => jsonRequest(request, '/api/v1/metadata/initialize', { confirm: true }),
    metadataVerify: () => request('/api/v1/metadata/verify', { method: 'POST' }),
    routes: (application) => request(`/api/v1/routes?application=${encoded(application ?? 'default')}`),
    databases: () => request('/api/v1/databases'),
    provisionDatabase: (application, database) => jsonRequest(request, '/api/v1/databases', { application, database }),
    identities: (application) => request(`/api/v1/identities?application=${encoded(application)}`),
    provisionIdentity: (input) => jsonRequest(request, '/api/v1/identities', input),
    rotateIdentity: (identity) => jsonRequest(request, '/api/v1/identities/rotate', { identity }),
    accounts: () => request('/api/v1/accounts'),
    provisionAccount: (input) => jsonRequest(request, '/api/v1/accounts/provision', input),
    revokeAccount: (input) => jsonRequest(request, '/api/v1/accounts/revoke', input),
    verifyAccount: (input) => jsonRequest(request, '/api/v1/accounts/verify', input),
    exportAccounts: () => request('/api/v1/accounts/export', { method: 'POST' }),
    tokens: () => request('/api/v1/tokens'),
    createToken: (input) => jsonRequest(request, '/api/v1/tokens', input),
    rotateToken: (name) => jsonRequest(request, `/api/v1/tokens/${encoded(name)}/rotate`, { confirm: true }),
    revokeToken: (name) => jsonRequest(request, '/api/v1/tokens/revoke', { name }),
    listSecrets: () => request('/api/v1/secrets'),
    putSecret: (name, artifact) => jsonRequest(request, `/api/v1/secrets/${encoded(name)}`, artifact, 'PUT'),
    getSecret: (name) => request(`/api/v1/secrets/${encoded(name)}`),
    verifySecret: (name) => request(`/api/v1/secrets/${encoded(name)}/verify`, { method: 'POST' }),
    removeSecret: (name) => request(`/api/v1/secrets/${encoded(name)}`, { method: 'DELETE' }),
    lease: async (database, identity, routes = ['primary', 'balanced']) => { const body = await jsonRequest(request, '/api/v1/credentials/lease', { database, identity, routes }); return validateBundle(body.data ?? body); },
    refreshCredentials: async (identity) => { const body = await jsonRequest(request, '/api/v1/credentials/refresh', { identity }); return validateBundle(body.data ?? body); },
  };
}
