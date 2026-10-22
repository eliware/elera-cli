import { expect, jest, test } from "@jest/globals";
import { createReadOnlyWatchHandlers } from "../../../../src/cli/handlers/read/only-watches.mjs";

test("read-only watch handlers apply config and one-shot mode", async () => {
  const telemetryWatch = jest.fn();
  const routingWatch = jest.fn();
  const config = { endpoint: "db" };
  const handlers = createReadOnlyWatchHandlers({
    config,
    argv: ["node", "watch", "--once"],
    telemetryWatch,
    routingWatch,
  });
  await handlers.telemetryWatch({ client: "client" });
  await handlers.routingWatch({ client: "client" });
  expect(telemetryWatch).toHaveBeenCalledWith({ client: "client", ...config, once: true });
  expect(routingWatch).toHaveBeenCalledWith({ client: "client", ...config, once: true });
});
