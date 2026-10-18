import { createRecoveryStateEndpoints } from "./state-endpoints.mjs";
import { createColdRecoveryEndpoints } from "../cold-recovery-endpoints.mjs";

export function createRecoveryEndpoints(request) {
  return { ...createRecoveryStateEndpoints(request), ...createColdRecoveryEndpoints(request) };
}
