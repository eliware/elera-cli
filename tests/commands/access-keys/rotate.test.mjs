import { jest } from "@jest/globals";
import { runTokenRotate } from "../../../src/commands/access-keys/rotate.mjs";
test("rotates a token", async () => {
  const emit = jest.fn();
  await runTokenRotate({
    client: { rotateToken: async (token) => ({ token }) },
    token: "app",
    emit,
  });
  expect(emit).toHaveBeenCalledWith({ token: "app" });
});
