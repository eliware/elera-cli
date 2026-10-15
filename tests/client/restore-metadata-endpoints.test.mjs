import { expect, jest, test } from "@jest/globals";
import { createRestoreMetadataEndpoints } from "../../src/client/restore-metadata-endpoints.mjs";
test("creates metadata restore endpoints", async () => {
  const request = jest.fn(async () => ({ ok: true }));
  const endpoints = createRestoreMetadataEndpoints(request);
  await endpoints.metadataExport();
  await endpoints.restoreMetadataPlan({});
  await endpoints.restoreMetadataApply({});
  expect(request).toHaveBeenCalledTimes(3);
});
