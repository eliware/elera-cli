import { createSqlEndpoints } from "../../src/client/sql-endpoints.mjs";
import { jest } from "@jest/globals";

test("exposes the SQL connection endpoint", async () => {
  const request = jest.fn().mockResolvedValue({ ok: true });
  await expect(createSqlEndpoints(request).sqlConnection()).resolves.toEqual({ ok: true });
  expect(request).toHaveBeenCalledWith("/api/v1/sql/connection");
});
