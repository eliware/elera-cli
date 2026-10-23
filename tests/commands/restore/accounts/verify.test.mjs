import { jest } from "@jest/globals";
import { join } from "node:path";
import { runRestoreAccountsVerify } from "../../../../src/commands/restore/accounts/verify.mjs";
test("verifies account restore", async () => {
  const emit = jest.fn();
  await expect(
    runRestoreAccountsVerify({
      client: { restoreAccountsVerify: async () => ({ ok: true }) },
      emit,
      value: "[]",
    }),
  ).resolves.toBe(0);
});

test("loads accounts from backup metadata when given an artifact path", async () => {
  const root = "/backup/1";
  const accounts = [{ user: "app", host: "%" }];
  const restoreAccountsVerify = jest.fn(async () => ({ ok: true }));
  const read = jest.fn(async () => JSON.stringify({ accounts }));
  await expect(
    runRestoreAccountsVerify({
      client: { restoreAccountsVerify },
      emit: jest.fn(),
      value: root,
      read,
    }),
  ).resolves.toBe(0);
  expect(read).toHaveBeenCalledWith(join(root, "SUPERVISOR-METADATA.json"), "utf8");
  expect(restoreAccountsVerify).toHaveBeenCalledWith(accounts);
});

test("rejects invalid JSON that is not an artifact path", async () => {
  await expect(
    runRestoreAccountsVerify({
      client: { restoreAccountsVerify: jest.fn() },
      emit: jest.fn(),
      value: "invalid-json",
    }),
  ).rejects.toThrow("restore accounts input is not valid JSON");
});

test("returns failure when account verification does not pass", async () => {
  await expect(
    runRestoreAccountsVerify({
      client: { restoreAccountsVerify: async () => ({ ok: false }) },
      emit: jest.fn(),
      value: "[]",
    }),
  ).resolves.toBe(1);
});

test("uses an empty account list when backup metadata omits accounts", async () => {
  const restoreAccountsVerify = jest.fn(async () => ({ ok: true }));
  await expect(
    runRestoreAccountsVerify({
      client: { restoreAccountsVerify },
      emit: jest.fn(),
      value: "/backup/1",
      read: async () => "{}",
    }),
  ).resolves.toBe(0);
  expect(restoreAccountsVerify).toHaveBeenCalledWith([]);
});
