import { expect, jest, test } from "@jest/globals";
import { runNodeResync } from "../../../src/commands/node/resync.mjs";
test("maps resync confirmation to the supervisor reset contract", async () => {
  const client = { resetNodeData: jest.fn(async () => ({ ok: true })) };
  await expect(
    runNodeResync({ client, emit: jest.fn(), node: "node-1", confirm: "RESYNC node-1" }),
  ).resolves.toBe(0);
  expect(client.resetNodeData.mock.calls[0][1].confirmation).toBe("RESET node-1");
});
