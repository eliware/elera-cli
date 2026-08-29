import { jsonRequest } from './endpoint-helpers.mjs';

export function createRestoreEndpoints(request) {
  return {
    metadataExport: () => request('/api/v1/metadata/export'),
    reconcilePlan: (desired) => jsonRequest(request, '/api/v1/reconcile/plan', { desired }),
    reconcileApply: (desired) => jsonRequest(request, '/api/v1/reconcile/apply', { desired, confirm: true }),
    reconcileVerify: (desired) => jsonRequest(request, '/api/v1/reconcile/verify', { desired }),
    restoreMetadataPlan: (desired) => jsonRequest(request, '/api/v1/restores/metadata/plan', { desired }),
    restoreMetadataApply: (desired) => jsonRequest(request, '/api/v1/restores/metadata/apply', { desired, confirm: true }),
    restoreAccountsPlan: (accounts) => jsonRequest(request, '/api/v1/restores/accounts/plan', { accounts }),
    restoreAccountsApply: (accounts) => jsonRequest(request, '/api/v1/restores/accounts/apply', { accounts, confirm: true }),
    restoreAccountsVerify: (accounts) => jsonRequest(request, '/api/v1/restores/accounts/verify', { accounts }),
    planDatabases: (desired) => jsonRequest(request, '/api/v1/databases/plan', { desired }),
    verifyDatabases: (desired) => jsonRequest(request, '/api/v1/databases/verify', { desired }),
    planBackup: (desired) => jsonRequest(request, '/api/v1/backups/plan', { desired }),
    planRestore: (desired) => jsonRequest(request, '/api/v1/restores/plan', { desired }),
  };
}
