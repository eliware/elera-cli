import { expect, jest, test } from "@jest/globals";
import { createSupervisorClient } from "../src/supervisor-client.mjs";

test("sends bearer authentication and validates lease bundles", async () => {
  const fetchImpl = jest.fn(async (_url, options) => ({
    ok: true,
    json: async () => ({
      data: {
        database: "app",
        identity: "runtime",
        credentials: { username: "u", password: "p" },
        routes: {
          primary: [{ host: "sql0", port: 3306 }],
          balanced: [{ host: "sql0", port: 3306 }],
        },
        expiresAt: "2099-01-01",
      },
    }),
  }));
  const client = createSupervisorClient({
    endpoint: "https://db",
    token: "secret",
    fetchImpl,
  });
  const bundle = await client.lease("app", "runtime");
  expect(bundle.database).toBe("app");
  expect(fetchImpl.mock.calls[0][1].headers.authorization).toBe(
    "Bearer secret",
  );
});
test("requires an application for telemetry details", async () => {
  const client = createSupervisorClient({ endpoint: "https://db", token: "secret", fetchImpl: jest.fn() });
  await expect(client.telemetryDetails()).rejects.toThrow("application is required");
});
test("includes an operation id when configured", async () => {
  const fetchImpl = jest.fn(async () => ({ ok: true, json: async () => ({ ok: true }) }));
  const client = createSupervisorClient({ endpoint: "https://db", token: "secret", operationId: "op-1", fetchImpl });
  await client.status();
  expect(fetchImpl.mock.calls[0][1].headers["x-elera-operation-id"]).toBe("op-1");
});
test("exposes the complete REST command surface and handles text errors", async () => {
  const fetchImpl = jest.fn(async () => ({
    ok: true,
    json: async () => ({
      ok: true,
      data: {
        database: "app",
        identity: "runtime",
        credentials: { username: "u", password: "p" },
        routes: { primary: [{ host: "sql0", port: 3306 }] },
        expiresAt: "2099-01-01",
      },
    }),
  }));
  const client = createSupervisorClient({
    endpoint: "https://db/",
    token: "secret",
    fetchImpl,
  });
  await client.status();
  await client.telemetry();
  await client.telemetryDetails("app");
  await client.intent();
  await client.plan({});
  await client.apply({});
  await client.verify();
  await client.metadataStatus();
  await client.metadataInitialize();
  await client.metadataVerify();
  await client.observations();
  await client.quorum();
  await client.coldBootstrapPlan();
  await client.coldBootstrap({ confirm: true, idempotencyKey: "op" });
  await client.coldBootstrapEvidence();
  await client.lifecyclePlan("drain");
  await client.lifecycleApply("drain");
  await client.lifecycle("drain");
  await client.health();
  await client.ready();
  await client.initializationStatus();
  await client.initializationPlan();
  await client.initializationApply();
  await client.initializationVerify();
  await client.routes("app");
  await client.routingBundle("runtime");
  await client.refreshRoutes({});
  await client.resync("app");
  await client.trafficStatus();
  await client.drain();
  await client.undrain();
  await client.lease("app", "runtime");
  await client.refreshCredentials("runtime");
  await client.databases();
  await client.provisionDatabase("app", "app");
  await client.identities("app");
  await client.provisionIdentity({});
  await client.rotateIdentity("runtime");
  await client.createToken({});
  await client.revokeToken("x");
  await client.provisionAccount({});
  await client.revokeAccount({});
  await client.verifyAccount({});
  await client.exportAccounts();
  await client.metadataExport();
  await client.reconcilePlan({});
  await client.reconcileApply({});
  await client.reconcileVerify({});
  await client.restoreMetadataPlan({});
  await client.restoreMetadataApply({});
  await client.restoreAccountsPlan([]);
  await client.restoreAccountsApply([]);
  await client.restoreAccountsVerify([]);
  await client.listSecrets();
  await client.putSecret("x", {});
  await client.getSecret("x");
  await client.verifySecret("x");
  await client.removeSecret("x");
  expect(fetchImpl).toHaveBeenCalledTimes(58);
  const fail = createSupervisorClient({
    endpoint: "https://db",
    token: "secret",
    fetchImpl: jest.fn(async () => ({
      ok: false,
      status: 503,
      headers: { get: () => "text/plain" },
      text: async () => "offline",
    })),
  });
  await expect(fail.status()).rejects.toMatchObject({ statusCode: 503 });
  expect(() => createSupervisorClient({})).toThrow("supervisor endpoint");
});

test("uses default query values and accepts unwrapped routing and credential bundles", async () => {
  const bundle = {
    database: "app",
    identity: "runtime",
    credentials: { username: "u", password: "p" },
    routes: { primary: [{ host: "sql0", port: 3306 }] },
    expiresAt: "2099-01-01",
  };
  const fetchImpl = jest.fn(async () => ({
    ok: true,
    json: async () => bundle,
  }));
  const client = createSupervisorClient({
    endpoint: "https://db",
    token: "secret",
    fetchImpl,
  });
  await client.routes();
  await client.resync();
  await client.routingBundle("runtime");
  await client.refreshCredentials("runtime");
  await client.lease("app", "runtime", undefined);
  expect(
    fetchImpl.mock.calls.some(([url]) => url.endsWith("application=default")),
  ).toBe(true);
  expect(
    fetchImpl.mock.calls.some(([url]) => url.endsWith("application=default")),
  ).toBe(true);
});
