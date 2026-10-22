import { expect, jest, test } from "@jest/globals";
import { runPrimaryMigrationDiagnostics } from "../../../../src/cli/handlers/primary/diagnostics.mjs";

test("primary migration diagnostics receive the selected config path", async () => {
  const diagnose = jest.fn(async () => ({ ok: true }));
  const emit = jest.fn();
  await runPrimaryMigrationDiagnostics({
    dependencies: { migrationDiagnostics: diagnose },
    argv: ["node", "config.json", "--json"],
    config: { endpoint: "db" },
    emit,
  });
  expect(diagnose).toHaveBeenCalledWith(expect.objectContaining({ configPath: "config.json" }));
});

test("primary migration diagnostics create the default diagnostics runner", async () => {
  const diagnose = jest.fn(async () => ({ ok: true }));
  const createDiagnostics = jest.fn(() => diagnose);
  await runPrimaryMigrationDiagnostics({
    dependencies: {},
    argv: ["node"],
    config: { endpoint: "db" },
    emit: jest.fn(),
    createDiagnostics,
  });
  expect(createDiagnostics).toHaveBeenCalled();
  expect(diagnose).toHaveBeenCalledWith({ endpoint: "db", configPath: undefined });
});
