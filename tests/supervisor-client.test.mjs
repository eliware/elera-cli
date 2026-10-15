import { expect, test } from "@jest/globals";
import { createSupervisorClient } from "../src/supervisor-client.mjs";
import "../test-fixtures/integration/supervisor-client-suite.mjs";

test("creates the supervisor client", () => {
  expect(createSupervisorClient).toEqual(expect.any(Function));
});

test("rejects missing default client settings", () => {
  expect(() => createSupervisorClient()).toThrow("supervisor endpoint and token");
});
