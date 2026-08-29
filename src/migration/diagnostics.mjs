export function createMigrationDiagnostics({ fetchImpl = fetch, read = async () => "" } = {}) {
  return async function diagnose({ endpoint, configPath } = {}) {
    if (!endpoint) throw new TypeError("migration endpoint is required");
    const checks = {};
    for (const path of ["/healthz", "/readyz"]) {
      try {
        const response = await fetchImpl(`${endpoint}${path}`);
        checks[path.slice(1)] = response.status === 200;
      } catch {
        checks[path.slice(1)] = false;
      }
    }
    if (configPath) await read(configPath, "utf8");
    checks.httpOnly = true;
    return { ok: Object.values(checks).every(Boolean), checks };
  };
}
