import { encoded, jsonRequest } from './endpoint-helpers.mjs';
export function createSystemEndpoints(request) { return { operationStatus: (operationId) => request(`/api/v1/operations/${encoded(operationId)}`), resetNodeData: (node, input = {}) => jsonRequest(request, '/api/v1/node/data/reset', { node, ...input }) }; }
