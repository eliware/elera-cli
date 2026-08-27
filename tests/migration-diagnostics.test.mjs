import { expect, jest, test } from "@jest/globals";
import { createMigrationDiagnostics } from "../src/migration/diagnostics.mjs";

test("diagnoses HTTP probes and rejects legacy HAProxy markers", async () => {
  const diagnose = createMigrationDiagnostics({
    fetchImpl: async (url) => ({ status: url.endsWith("healthz") ? 200 : 503 }),
    read: async () => "backend old agent-check 33060",
  });
  await expect(diagnose({ endpoint: "http://vip", configPath: "haproxy.cfg" })).resolves.toEqual({
    ok: false,
    checks: { healthz: true, readyz: false, httpOnly: false },
  });
});

test("passes when both probes are healthy and no config is supplied", async () => {
  const diagnose = createMigrationDiagnostics({
    fetchImpl: jest.fn(async () => ({ status: 200 })),
  });
  await expect(diagnose({ endpoint: "http://vip" })).resolves.toEqual({
    ok: true,
    checks: { healthz: true, readyz: true, httpOnly: true },
  });
});

test("reports unreachable endpoints", async () => {
  const diagnose = createMigrationDiagnostics({ fetchImpl: async () => { throw new Error("offline"); } });
  await expect(diagnose({ endpoint: "http://vip" })).resolves.toMatchObject({ ok: false });
});

test("requires an endpoint", async () => {
  const diagnose = createMigrationDiagnostics();
  await expect(diagnose()).rejects.toThrow("endpoint is required");
});
