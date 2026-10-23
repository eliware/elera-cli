import { jest } from "@jest/globals";
import { runSqlDump, runSqlRestore } from "../../../src/commands/sql/native.mjs";

test("streams a database dump to stdout", async () => {
  const output = {};
  const dump = jest.fn();
  const client = { sqlConnection: async () => ({ data: { host: "db", username: "elera_root" } }) };
  await runSqlDump({ client, config: { token: "secret" }, database: "app_db", output, dump });
  expect(dump).toHaveBeenCalledWith(
    { host: "db", username: "elera_root", password: "secret", database: "app_db" },
    output,
  );
});

test("streams stdin into a database restore", async () => {
  const input = {};
  const restore = jest.fn();
  const client = { sqlConnection: async () => ({ data: { host: "db", username: "elera_root" } }) };
  await runSqlRestore({ client, config: { token: "secret" }, database: "app_db", input, restore });
  expect(restore).toHaveBeenCalledWith(
    { host: "db", username: "elera_root", password: "secret", database: "app_db" },
    input,
  );
});
