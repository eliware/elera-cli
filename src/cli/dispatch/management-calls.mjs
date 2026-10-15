import { createManagementResourceCalls } from "./management-resource-calls.mjs";
import { createManagementAccessCalls } from "./management-access-calls.mjs";

export function createManagementCalls(input) {
  return {
    ...createManagementResourceCalls(input),
    ...createManagementAccessCalls(input),
  };
}
