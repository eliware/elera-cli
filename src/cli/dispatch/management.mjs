import { createManagementCalls } from "./management-calls.mjs";

export function dispatchManagement(input) {
  const calls = createManagementCalls(input);
  return calls[input.command] ? calls[input.command]() : undefined;
}
