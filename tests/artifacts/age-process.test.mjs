import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import { createAgeProcess } from "../../src/artifacts/age-process.mjs";

function child(code = 0, output = "age-output", error = "") {
  const value = new EventEmitter();
  value.stdin = { end: jest.fn() };
  value.stdout = new EventEmitter();
  value.stderr = new EventEmitter();
  queueMicrotask(() => {
    if (output) value.stdout.emit("data", Buffer.from(output));
    if (error) value.stderr.emit("data", Buffer.from(error));
    value.emit("close", code);
  });
  return value;
}
test("encrypts and decrypts through the age process", async () => {
  const calls = [];
  const age = createAgeProcess({
    spawnImpl: (command, args) => {
      calls.push([command, args]);
      return child();
    },
  });
  await expect(age.encrypt("secret", "age1recipient")).resolves.toBe(
    "age-output",
  );
  await expect(age.decrypt("cipher", "/keys/id")).resolves.toBe("age-output");
  expect(calls[0][1]).toEqual(["-a", "-r", "age1recipient"]);
  expect(calls[1][1]).toEqual(["-d", "-i", "/keys/id"]);
});
test("reports age failures and validates key inputs", async () => {
  const age = createAgeProcess({ spawnImpl: () => child(1, "", "bad age") });
  await expect(age.encrypt("x")).rejects.toThrow("recipient");
  await expect(age.decrypt("x")).rejects.toThrow("identity");
  await expect(age.encrypt("x", "r")).rejects.toThrow("bad age");
});
test("reports the exit code when age emits no diagnostics", async () => {
  const age = createAgeProcess({ spawnImpl: () => child(7, "", "") });
  await expect(age.encrypt("x", "r")).rejects.toThrow("age exited with 7");
});
test("uses configured age environment keys", async () => {
  const age = createAgeProcess({
    environment: { AGE_RECIPIENT: "r", AGE_IDENTITY_FILE: "i" },
    spawnImpl: () => child(),
  });
  await expect(age.encrypt("x")).resolves.toBe("age-output");
  await expect(age.decrypt("x")).resolves.toBe("age-output");
});
