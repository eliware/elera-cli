import { expect, test } from "@jest/globals";
import { applicationDatabases } from "../../src/backup/application-databases.mjs";
test("filters system databases", () => {
  expect(applicationDatabases(["mysql", "app", "sys"])).toEqual(["app"]);
});
