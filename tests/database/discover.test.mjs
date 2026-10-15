import "../../test-fixtures/integration/barrels/database/commands.mjs";
import { expect, jest, test } from "@jest/globals";
import { discoverDatabases } from "../../src/database/discover.mjs";
test("discovers and normalizes database names", async () => {
  const run = jest.fn(async () => ({ stdout: "app\r\n other\n", stderr: "" }));
  await expect(discoverDatabases({ credentialsFile: "my.cnf", host: "db", run })).resolves.toEqual([
    "app",
    "other",
  ]);
});

test("uses the default database process runner", async () => {
  await expect(
    discoverDatabases({
      credentialsFile: "missing.cnf",
      host: "127.0.0.1",
      mysql: "elera-missing-mysql",
    }),
  ).rejects.toBeDefined();
});
