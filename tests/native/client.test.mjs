import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import { runNativeClient } from "../../src/native/client.mjs";

const connection = {
  host: "db.internal",
  port: 3307,
  username: "elera_root",
  password: "token-value",
};

function childProcess() {
  return new EventEmitter();
}

test("passes raw SQL client arguments and streams through the native process", async () => {
  const child = childProcess();
  const spawnImpl = jest.fn(() => child);
  const result = runNativeClient({
    binary: "mysql",
    args: ["-e", "SHOW DATABASES;"],
    connection,
    environment: { PATH: "tools" },
    spawnImpl,
  });
  expect(spawnImpl).toHaveBeenCalledWith(
    "mysql",
    ["--host", "db.internal", "--port", "3307", "--user", "elera_root", "-e", "SHOW DATABASES;"],
    {
      env: { PATH: "tools", MYSQL_PWD: "token-value" },
      stdio: "inherit",
      windowsHide: true,
    },
  );
  child.emit("close", 0, null);
  await expect(result).resolves.toBe(0);
});

test("keeps MariaDB defaults files before injected connection options", async () => {
  const child = childProcess();
  const spawnImpl = jest.fn(() => child);
  const result = runNativeClient({
    binary: "mysqldump",
    args: ["--defaults-extra-file=/tmp/client.cnf", "--all-databases"],
    connection,
    spawnImpl,
  });
  expect(spawnImpl.mock.calls[0][1]).toEqual([
    "--defaults-extra-file=/tmp/client.cnf",
    "--host",
    "db.internal",
    "--port",
    "3307",
    "--user",
    "elera_root",
    "--all-databases",
  ]);
  child.emit("close", 0, null);
  await expect(result).resolves.toBe(0);
});

test("keeps separate MariaDB defaults file arguments together", async () => {
  const child = childProcess();
  const spawnImpl = jest.fn(() => child);
  const result = runNativeClient({
    binary: "mysql",
    args: ["--defaults-file", "/tmp/client.cnf", "-e", "SHOW DATABASES;"],
    connection,
    spawnImpl,
  });
  expect(spawnImpl.mock.calls[0][1]).toEqual([
    "--defaults-file",
    "/tmp/client.cnf",
    "--host",
    "db.internal",
    "--port",
    "3307",
    "--user",
    "elera_root",
    "-e",
    "SHOW DATABASES;",
  ]);
  child.emit("close", null, null);
  await expect(result).resolves.toBe(1);
});

test("preserves native client failure status and spawn errors", async () => {
  const failedChild = childProcess();
  const failedRun = runNativeClient({
    binary: "mysql",
    args: [],
    connection,
    spawnImpl: () => failedChild,
  });
  failedChild.emit("close", 3, null);
  await expect(failedRun).resolves.toBe(3);

  const missingChild = childProcess();
  const missingRun = runNativeClient({
    binary: "mysql",
    args: [],
    connection,
    spawnImpl: () => missingChild,
  });
  const error = new Error("client is unavailable");
  missingChild.emit("error", error);
  await expect(missingRun).rejects.toBe(error);
});

test("rejects missing native SQL connection details", () => {
  expect(() => runNativeClient({ binary: "mysql", args: [], connection: {} })).toThrow(
    "native SQL connection details are incomplete",
  );
});
