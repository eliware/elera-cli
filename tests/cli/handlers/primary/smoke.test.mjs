import { expect, jest, test } from "@jest/globals";
import { runPrimarySqlSmoke } from "../../../../src/cli/handlers/primary/smoke.mjs";

test("primary SQL smoke handler maps its dependencies", async () => {
  const client = {
    lease: jest.fn(async () => ({ host: "db" })),
    routingBundle: jest.fn(),
  };
  const emit = jest.fn();
  const config = { endpoint: "db", database: "app", identity: "runtime" };
  const createLiveDb = jest.fn();
  const createDb = jest.fn();
  const close = jest.fn();
  createLiveDb.mockResolvedValue({ db: { query: async () => [[{ healthy: 1 }]] }, close });
  await expect(
    runPrimarySqlSmoke({ client, emit, config, dependencies: { createLiveDb, createDb } }),
  ).resolves.toBe(0);
  expect(createLiveDb).toHaveBeenCalledWith(
    expect.objectContaining({ endpoint: config.endpoint, createDb }),
  );
  expect(emit).toHaveBeenCalledWith({ ok: true });
  expect(close).toHaveBeenCalled();
});
