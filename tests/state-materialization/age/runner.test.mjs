import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import { runAge } from "../../../src/state-materialization/age/runner.mjs";

function child(code, output, error) {
  const process = new EventEmitter();
  process.stdin = { end: jest.fn() };
  process.stdout = new EventEmitter();
  process.stderr = new EventEmitter();
  queueMicrotask(() => {
    if (output) process.stdout.emit("data", Buffer.from(output));
    if (error) process.stderr.emit("data", Buffer.from(error));
    process.emit("close", code);
  });
  return process;
}

test("runs age with the supplied input and environment", async () => {
  const spawnImpl = jest.fn(() => child(0, "cipher", ""));
  const environment = { AGE_RECIPIENT: "recipient" };
  await expect(
    runAge(["-a", "-r", "recipient"], "secret", { spawnImpl, environment }),
  ).resolves.toBe("cipher");
  expect(spawnImpl).toHaveBeenCalledWith("age", ["-a", "-r", "recipient"], {
    env: environment,
    stdio: ["pipe", "pipe", "pipe"],
  });
  expect(spawnImpl.mock.results[0].value.stdin.end).toHaveBeenCalledWith("secret");
});

test("reports age diagnostics and exit codes", async () => {
  await expect(runAge([], "", { spawnImpl: () => child(1, "", "bad age") })).rejects.toThrow(
    "bad age",
  );
  await expect(runAge([], "", { spawnImpl: () => child(7, "", "") })).rejects.toThrow(
    "age exited with 7",
  );
});
