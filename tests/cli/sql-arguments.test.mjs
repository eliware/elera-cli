import { normalizeSqlArguments } from "../../src/cli/sql-arguments.mjs";

test("normalizes MySQL query and dump forms", () => {
  expect(normalizeSqlArguments(["-e", "SHOW DATABASES;"])).toEqual([
    "sql",
    "query",
    "SHOW DATABASES;",
  ]);
  expect(normalizeSqlArguments(["dump", "app_db"])).toEqual(["sql", "dump", "app_db"]);
  expect(normalizeSqlArguments(["--execute"])).toEqual(["sql", "query", ""]);
  expect(normalizeSqlArguments(["dump"])).toEqual(["sql", "dump", ""]);
});

test("treats an unknown bare database name as a piped restore", () => {
  expect(normalizeSqlArguments(["app_db"], { stdinIsTty: false })).toEqual([
    "sql",
    "restore",
    "app_db",
  ]);
  expect(normalizeSqlArguments(["health"], { knownCommand: "health", stdinIsTty: false })).toEqual([
    "health",
  ]);
  expect(normalizeSqlArguments(["app_db"], { stdinIsTty: true })).toEqual(["app_db"]);
  expect(normalizeSqlArguments(["app_db"])).toEqual(["app_db"]);
  expect(normalizeSqlArguments(["backup"], { knownCommand: "backup" })).toEqual(["backup"]);
});
