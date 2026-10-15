import "../../../test-fixtures/integration/barrels/commands/node/reset-data.mjs";
import { expect, jest, test } from "@jest/globals";
import { runNodeResetData } from "../../../src/commands/node/reset-operation.mjs";
test("executes a confirmed node reset", async () => {
  const emit = jest.fn();
  const client = { resetNodeData: jest.fn(async () => ({ ok: true })) };
  await expect(
    runNodeResetData({ client, emit, node: "node-1", confirm: "RESET node-1" }),
  ).resolves.toBe(0);
  expect(client.resetNodeData).toHaveBeenCalled();
});
