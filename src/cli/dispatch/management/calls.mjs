import { createManagementResourceCalls } from "./resource-calls.mjs";
import { createManagementAccessCalls } from "./access-calls.mjs";

export function createManagementCalls(input) {
  return {
    ...createManagementResourceCalls(input),
    ...createManagementAccessCalls(input),
  };
}
