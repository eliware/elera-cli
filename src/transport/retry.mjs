export async function withRetry(operation, { attempts = 3, delayMs = 250, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) } = {}) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try { return await operation(); } catch (error) { last = error; if (attempt < attempts) await sleep(delayMs * attempt); }
  }
  throw last;
}
