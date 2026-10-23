import { jest } from "@jest/globals";
import { runSqlQuery } from "../../../src/commands/sql/query.mjs";

test("runs a query with the persistent token account and writes raw output", async () => {
  const output = { write: jest.fn() };
  const errorOutput = { write: jest.fn() };
  const run = jest.fn().mockResolvedValue({ stdout: "Database\napp\n", stderr: "" });
  await runSqlQuery({
    client: { sqlConnection: async () => ({ data: { host: "db", username: "elera_t_1" } }) },
    config: { token: "secret" },
    query: "SHOW DATABASES;",
    output,
    errorOutput,
    run,
  });
  expect(run).toHaveBeenCalledWith("mariadb", expect.arrayContaining(["-e", "SHOW DATABASES;"]), {
    env: { MYSQL_PWD: "secret" },
  });
  expect(output.write).toHaveBeenCalledWith("Database\napp\n");
});

test("rejects an empty query", async () => {
  await expect(runSqlQuery({ query: " " })).rejects.toThrow("sql requires a query");
});

test("writes SQL client errors to the provided error stream", async () => {
  const errorOutput = { write: jest.fn() };
  await runSqlQuery({
    client: { sqlConnection: async () => ({ host: "db", username: "elera_t_1" }) },
    config: { token: "secret" },
    query: "SELECT 1;",
    output: { write: jest.fn() },
    errorOutput,
    run: async () => ({ stdout: "", stderr: "warning\n" }),
  });
  expect(errorOutput.write).toHaveBeenCalledWith("warning\n");
});
