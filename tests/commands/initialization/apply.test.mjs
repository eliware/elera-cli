import { jest } from "@jest/globals";
import { runInitializationApply } from "../../../src/commands/initialization/apply.mjs";
test("applies initialization", async () => {
  const emit = jest.fn();
  await runInitializationApply({
    client: { initializationApply: async () => ({ ok: true }) },
    emit,
  });
  expect(emit).toHaveBeenCalledWith({ ok: true });
});
test("returns failure when initialization fails", async () => {
  const emit = jest.fn();
  await expect(
    runInitializationApply({
      client: { initializationApply: async () => ({ ok: false, error: "already initialized" }) },
      emit,
    }),
  ).resolves.toBe(1);
  expect(emit).toHaveBeenCalledWith({ ok: false, error: "already initialized" });
});

test("returns failure when the initialization response is incomplete", async () => {
  await expect(
    runInitializationApply({ client: { initializationApply: async () => ({}) }, emit: jest.fn() }),
  ).resolves.toBe(1);
});
