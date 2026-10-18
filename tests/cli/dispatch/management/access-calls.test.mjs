import { expect, test } from "@jest/globals";
import { createManagementAccessCalls } from "../../../../src/cli/dispatch/management/access-calls.mjs";

test("creates access and recovery calls", () => {
  const calls = createManagementAccessCalls({ handlers: {} });
  expect(calls["identity-create"]).toEqual(expect.any(Function));
  expect(calls["cold-recovery-complete"]).toEqual(expect.any(Function));
});
