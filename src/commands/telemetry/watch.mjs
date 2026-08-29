import { runRoutingWatch } from '../routing/watch.mjs';

export async function runTelemetryWatch(options = {}) {
  return runRoutingWatch({ ...options, once: options.once });
}
