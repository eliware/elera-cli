import { expect, jest, test } from "@jest/globals";
import { createReadOnlyWatchHandlers } from "../../../../src/cli/handlers/read/only-watches.mjs";

test("read-only watch handlers apply config and one-shot mode", async () => {
  const watch = jest.fn();
  const config = { endpoint: "db" };
  const handlers = createReadOnlyWatchHandlers({
    config,
    argv: ["node", "watch", "--once"],
    watch,
  });
  await handlers.telemetryWatch({ client: "client" });
  await handlers.routingWatch({ client: "client" });
  expect(watch).toHaveBeenNthCalledWith(1, { client: "client", ...config, once: true });
  expect(watch).toHaveBeenNthCalledWith(2, { client: "client", ...config, once: true });
});
