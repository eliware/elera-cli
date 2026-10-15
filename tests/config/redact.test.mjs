import { expect, test } from "@jest/globals";
import { redactCliConfig } from "../../src/config/redact.mjs";
test("redacts configured tokens and preserves absent tokens", () => {
  expect(redactCliConfig({ token: "secret" }).token).toBe("[redacted]");
  expect(redactCliConfig({}).token).toBeUndefined();
});
