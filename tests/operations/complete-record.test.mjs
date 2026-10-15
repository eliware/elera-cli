import { expect, test } from "@jest/globals";
import { completeOperation } from "../../src/operations/complete-record.mjs";
test("completes an operation record", () => {
  expect(completeOperation({ operationId: "op" }, { ok: true }, () => "done")).toEqual({
    operationId: "op",
    completedAt: "done",
    outcome: { ok: true },
  });
});
