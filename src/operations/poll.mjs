export async function pollOperation(check, { timeoutMs = 60000, intervalMs = 1000, now = Date.now, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  const deadline = now() + timeoutMs;
  let latest;
  do {
    latest = await check();
    if (latest?.done) return latest;
    if (now() >= deadline) break;
    await sleep(Math.min(intervalMs, Math.max(1, deadline - now())));
  } while (now() < deadline);
  return { ...latest, done: false, timedOut: true };
}
