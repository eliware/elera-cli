import { runRoutingWatch } from "../../../commands/routing/watch.mjs";

export function createReadOnlyWatchHandlers({ config, argv, watch = runRoutingWatch }) {
  const once = argv.includes("--once");
  return {
    telemetryWatch: (value) => watch({ ...value, ...config, once }),
    routingWatch: (value) => watch({ ...value, ...config, once }),
  };
}
