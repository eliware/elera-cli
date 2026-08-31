import { encoded, jsonRequest } from './endpoint-helpers.mjs';
export function createIdentityEndpoints(request) { return { identities: (application) => request(`/api/v1/identities?application=${encoded(application)}`), provisionIdentity: (input) => jsonRequest(request, '/api/v1/identities', input), rotateIdentity: (identity) => jsonRequest(request, '/api/v1/identities/rotate', { identity }) }; }
