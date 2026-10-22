import { runTelemetryWatch } from "../../../commands/telemetry/watch.mjs";
import { runRoutingWatch } from "../../../commands/routing/watch.mjs";

export function createReadOnlyWatchHandlers({
  config,
  argv,
  telemetryWatch = runTelemetryWatch,
  routingWatch = runRoutingWatch,
}) {
  const once = argv.includes("--once");
  return {
    telemetryWatch: (value) => telemetryWatch({ ...value, ...config, once }),
    routingWatch: (value) => routingWatch({ ...value, ...config, once }),
  };
}
