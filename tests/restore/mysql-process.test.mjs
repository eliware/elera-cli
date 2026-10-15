import { expect, jest, test } from "@jest/globals";
import { runSql, restoreCommand } from "../../src/restore/mysql-process.mjs";

test("runs SQL with shell execution disabled and resolves successful children", async () => {
  const child = {
    stderr: { setEncoding: jest.fn(), on: jest.fn() },
    once: jest.fn((event, handler) => event === "close" && handler(0)),
  };
  const spawnImpl = jest.fn(() => child);
  await expect(runSql("mariadb", ["--version"], { spawnImpl })).resolves.toBeUndefined();
  expect(spawnImpl).toHaveBeenCalledWith(
    "mariadb",
    ["--version"],
    expect.objectContaining({ shell: false }),
  );
});

test("builds a credential-file restore command", () => {
  expect(restoreCommand("mariadb", "my.cnf", "db", "app")[1]).toEqual(
    expect.arrayContaining(["--defaults-extra-file=my.cnf", "app"]),
  );
});
