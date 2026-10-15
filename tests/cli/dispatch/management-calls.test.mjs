import { expect, jest, test } from "@jest/globals";
import { createManagementCalls } from "../../../src/cli/dispatch/management-calls.mjs";

test("creates calls for management commands", async () => {
  const handle = jest.fn(async () => 0);
  const calls = createManagementCalls({
    command: "app-create",
    client: {},
    controlClient: {},
    emit: jest.fn(),
    args: ["app"],
    handlers: { applicationCreate: handle },
  });
  await expect(calls["app-create"]()).resolves.toBe(0);
  expect(handle).toHaveBeenCalledWith({ client: {}, emit: expect.any(Function), name: "app" });
});
