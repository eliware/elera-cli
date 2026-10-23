import { jsonRequest } from "../request-json.mjs";
export function createRestoreAccountEndpoints(request) {
  return {
    restoreAccountsPlan: (accounts) =>
      jsonRequest(request, "/api/v1/restores/accounts/plan", { accounts }),
    restoreAccountsApply: (accounts, { idempotencyKey } = {}) =>
      jsonRequest(request, "/api/v1/restores/accounts/apply", {
        accounts,
        confirm: true,
        idempotencyKey,
      }),
    restoreAccountsVerify: (accounts) =>
      jsonRequest(request, "/api/v1/restores/accounts/verify", { accounts }),
  };
}
