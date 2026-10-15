import { expect, jest, test } from "@jest/globals";
import { finalizeStaging, prepareStaging } from "../../src/transport/nas-staging.mjs";

test("prepares a quoted remote staging directory", async () => {
  const sshRun = jest.fn(async () => [{ code: 0 }, { code: 0 }]);
  await expect(
    prepareStaging({ sshOptions: { host: "nas" }, stagePath: "/tmp/a'b", sshRun }),
  ).resolves.toBeUndefined();
  expect(sshRun.mock.calls[0][0].commands[1]).toContain("mkdir -p -- '/tmp/a'\\''b'");
});

test("finalizes remote staging only when all commands succeed", async () => {
  const sshRun = jest.fn(async () => [{ code: 0 }, { code: 0 }, { code: 0 }]);
  await expect(
    finalizeStaging({
      sshOptions: {},
      stagePath: "/tmp/stage",
      remotePath: "/backup/latest",
      rotateCommand: "rotate",
      sshRun,
    }),
  ).resolves.toBeUndefined();
  expect(sshRun.mock.calls[0][0].commands).toHaveLength(3);
});
