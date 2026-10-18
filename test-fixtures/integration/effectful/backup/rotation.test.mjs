import { expect, test } from "@jest/globals";
import * as subject from "../../../../src/backup/rotation.mjs";
import { join } from "node:path";
import { mkdtemp, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
test("rotates numeric backup directories beyond the retention window", async () => {
  const removed = [];
  await subject.rotateBackups({
    backupRoot: "root",
    keep: 2,
    list: async () => [{ name: "1" }, { name: "2" }, { name: "3" }, { name: "current" }],
    remove: async (path) => removed.push(path),
  });
  expect(removed).toEqual([join("root", "2"), join("root", "1")]);
});

test("uses default backup rotation options", async () => {
  const root = await mkdtemp(join(tmpdir(), "elera-rotate-"));
  await mkdir(join(root, "1"));
  await mkdir(join(root, "2"));
  await subject.rotateBackups({ backupRoot: root });
});
