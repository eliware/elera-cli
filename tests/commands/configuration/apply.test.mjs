import { jest } from "@jest/globals";
import { runConfigApply } from "../../../src/commands/configuration/apply.mjs";
test("applies configuration intent", async () => {
  const emit = jest.fn();
  const client = {
    intent: async () => ({ data: { intent: {} } }),
    apply: async (value) => ({ ok: true, value }),
  };
  await expect(runConfigApply({ client, emit })).resolves.toBe(0);
  expect(emit).toHaveBeenCalledWith({ ok: true, value: {} });
});

test("reports failed or incomplete configuration apply responses", async () => {
  const emit = jest.fn();
  const client = {
    intent: async () => ({ data: { intent: {} } }),
    apply: async () => ({ ok: false }),
  };
  await expect(runConfigApply({ client, emit })).resolves.toBe(1);
  client.apply = async () => ({});
  await expect(runConfigApply({ client, emit })).resolves.toBe(1);
});
