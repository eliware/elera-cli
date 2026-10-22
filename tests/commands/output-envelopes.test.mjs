import { expect, test } from "@jest/globals";
import {
  applicationStatusOutput,
  databaseDeleteOutput,
} from "../../src/commands/output-envelopes.mjs";

test("provides stable administrative output envelopes", () => {
  expect(applicationStatusOutput({ id: "1" })).toEqual({
    ok: true,
    operation: "app-status",
    data: { id: "1" },
  });
  expect(databaseDeleteOutput({ id: "2" })).toEqual({
    ok: true,
    operation: "database-delete",
    data: { id: "2" },
  });
});
