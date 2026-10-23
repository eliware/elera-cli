import { expect, jest, test } from "@jest/globals";
import { runCli } from "../../src/cli/main.mjs";
import "../../test-fixtures/integration/cli/main-suite.mjs";

test("runs the CLI entry point", () => {
  expect(runCli).toEqual(expect.any(Function));
});

test("dispatches MySQL query, dump, and piped restore forms", async () => {
  const output = { write: jest.fn() };
  const runSqlQuery = jest.fn(async () => 0);
  const runSqlDump = jest.fn(async () => 0);
  const runSqlRestore = jest.fn(async () => 0);
  const common = {
    environment: { ELERA_API_ENDPOINT: "http://node", ELERA_CLI_TOKEN: "token-value" },
    output,
    dependencies: {
      createSupervisorClient: () => ({}),
      runSqlQuery,
      runSqlDump,
      runSqlRestore,
    },
  };
  await expect(runCli({ ...common, argv: ["-e", "SHOW DATABASES;"] })).resolves.toBe(0);
  await expect(runCli({ ...common, argv: ["dump", "app_db"] })).resolves.toBe(0);
  await expect(runCli({ ...common, argv: ["app_db"], input: { isTTY: false } })).resolves.toBe(0);
  expect(runSqlQuery).toHaveBeenCalledWith(expect.objectContaining({ query: "SHOW DATABASES;" }));
  expect(runSqlDump).toHaveBeenCalledWith(expect.objectContaining({ database: "app_db", output }));
  expect(runSqlRestore).toHaveBeenCalledWith(
    expect.objectContaining({ database: "app_db", input: { isTTY: false } }),
  );
});
