/* istanbul ignore file -- network adapter is covered through API integration tests. */
import { validateBundle } from '@eliware/elera-lib';

export function createSupervisorClient({ endpoint, token, fetchImpl = fetch }) {
  if (!endpoint || !token) throw new TypeError('supervisor endpoint and token are required');
  const request = async (path, options = {}) => {
    const response = await fetchImpl(`${endpoint.replace(/\/$/, '')}${path}`, { ...options, headers: { accept: 'application/json', authorization: `Bearer ${token}`, ...options.headers } });
    const contentType = response.headers?.get?.('content-type') ?? '';
    const body = contentType.includes('json') || !contentType ? await response.json() : { ok: response.ok, status: (await response.text()).trim() };
    if (!response.ok) throw Object.assign(new Error(body.error?.message ?? body.error ?? `supervisor request failed: ${response.status}`), { statusCode: response.status, body });
    return body;
  };
  return {
    async status() { return request('/api/v1/status'); },
    async intent() { return request('/api/v1/config/intent'); },
    async plan(intent) { return request('/api/v1/config/plan', { method: 'POST', body: JSON.stringify({ intent }), headers: { 'content-type': 'application/json' } }); },
    async apply(intent) { return request('/api/v1/config/apply', { method: 'POST', body: JSON.stringify({ intent, confirm: true }), headers: { 'content-type': 'application/json' } }); },
    async verify() { return request('/api/v1/config/verify', { method: 'POST' }); },
    async metadataStatus() { return request('/api/v1/metadata/status'); },
    async metadataInitialize() { return request('/api/v1/metadata/initialize', { method: 'POST', body: JSON.stringify({ confirm: true }), headers: { 'content-type': 'application/json' } }); },
    async metadataVerify() { return request('/api/v1/metadata/verify', { method: 'POST' }); },
    async health() { return request('/healthz'); },
    async ready() { return request('/readyz'); },
    async lease(database, identity, routes = ['primary', 'balanced']) { const body = await request('/api/v1/credentials/lease', { method: 'POST', body: JSON.stringify({ database, identity, routes }), headers: { 'content-type': 'application/json' } }); return validateBundle(body.data ?? body); }
  };
}
