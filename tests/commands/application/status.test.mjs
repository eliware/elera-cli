import { expect, jest, test } from "@jest/globals";
import { runApplicationStatus } from "../../../src/commands/application/status.mjs";
test("resolves and emits application status", async () => {
  const emit = jest.fn();
  const client = {
    applications: jest.fn(async () => ({ data: [{ id: "a", name: "app" }] })),
    applicationStatus: jest.fn(async () => ({ id: "a" })),
  };
  await expect(runApplicationStatus({ client, emit, applicationId: "app" })).resolves.toBe(0);
  expect(client.applicationStatus).toHaveBeenCalledWith("a");
});
