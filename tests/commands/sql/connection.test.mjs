import { sqlConnection } from "../../../src/commands/sql/connection.mjs";

test("adds the persistent API token as the SQL password", async () => {
  const result = await sqlConnection(
    { sqlConnection: async () => ({ data: { host: "db", username: "elera_root" } }) },
    "secret",
    "app_db",
  );
  expect(result).toEqual({
    host: "db",
    username: "elera_root",
    password: "secret",
    database: "app_db",
  });
});

test("rejects missing server SQL connection details", async () => {
  await expect(sqlConnection({ sqlConnection: async () => ({}) }, "secret")).rejects.toThrow(
    "SQL connection details are unavailable",
  );
});
