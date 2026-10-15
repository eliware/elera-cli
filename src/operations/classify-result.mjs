import { exitCodes } from "./exit-code-table.mjs";
export function classifyOperation(result) {
  if (result?.outcome?.escalated || result?.forced) return exitCodes.escalated;
  if (result?.outcome?.nonPrimary || result?.data?.values?.wsrep_cluster_status === "Non-Primary")
    return exitCodes.nonPrimary;
  if (result?.outcome?.unsafe || result?.outcome?.status === "unsafe" || result?.eligible === false)
    return exitCodes.unsafe;
  if (result?.outcome?.timedOut || result?.timedOut || result?.outcome?.incomplete)
    return exitCodes.incomplete;
  if (result?.outcome?.ok === false || result?.ok === false) return exitCodes.incomplete;
  return exitCodes.ok;
}
