/* istanbul ignore file -- network adapter is covered through API integration tests. */
import { validateBundle } from '@eliware/galera-lib';

export function createSupervisorClient({ endpoint, token, fetchImpl = fetch }) {
  if (!endpoint || !token) throw new TypeError('supervisor endpoint and token are required');
  const request = async (path, options = {}) => {
    const response = await fetchImpl(`${endpoint.replace(/\/$/, '')}${path}`, { ...options, headers: { accept: 'application/json', authorization: `Bearer ${token}`, ...options.headers } });
    const body = await response.json();
    if (!response.ok) throw Object.assign(new Error(body.error?.message ?? body.error ?? `supervisor request failed: ${response.status}`), { statusCode: response.status, body });
    return body;
  };
  return {
    async status() { return request('/api/v1/status'); },
    async lease(database, identity, routes = ['primary', 'balanced']) { const body = await request('/api/v1/credentials/lease', { method: 'POST', body: JSON.stringify({ database, identity, routes }), headers: { 'content-type': 'application/json' } }); return validateBundle(body.data ?? body); }
  };
}
