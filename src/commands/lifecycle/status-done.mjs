export function lifecycleStatusDone(data) {
  return Boolean(data?.lifecycle === "stopped");
}
