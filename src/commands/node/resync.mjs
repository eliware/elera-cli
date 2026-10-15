import { runNodeResetData } from "./reset-operation.mjs";
export async function runNodeResync(options = {}) {
  return runNodeResetData({
    ...options,
    disposition: "single-member-resync",
    confirmationPrefix: "RESYNC",
    endpointConfirmation: `RESET ${options.node}`,
    endpointConfirmationField: "confirmation",
  });
}
