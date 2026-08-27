const legacyMarkers = ["agent-check", "33060", "33070", "elera-check.exe"];

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
    const config = configPath ? await read(configPath, "utf8") : "";
    checks.httpOnly = !legacyMarkers.some((marker) => config.includes(marker));
    return { ok: Object.values(checks).every(Boolean), checks };
  };
}
