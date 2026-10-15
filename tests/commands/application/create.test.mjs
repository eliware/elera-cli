import "../../../test-fixtures/integration/barrels/commands/app.mjs";
import { expect, jest, test } from "@jest/globals";
import { runApplicationCreate } from "../../../src/commands/application/create.mjs";
test("creates an application", async () => {
  const emit = jest.fn();
  await expect(
    runApplicationCreate({
      client: { createApplication: jest.fn(async () => ({ id: "a" })) },
      emit,
      name: "app",
    }),
  ).resolves.toBe(0);
  expect(emit).toHaveBeenCalled();
});
