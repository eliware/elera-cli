import { runClusterBootstrap } from "../../commands/cluster/bootstrap.mjs";
import { runClusterJoin } from "../../commands/cluster/join.mjs";
import { runDrain } from "../../commands/lifecycle/drain.mjs";
import { runUndrain } from "../../commands/lifecycle/undrain.mjs";
import { runDrainStatus } from "../../commands/lifecycle/drain-status.mjs";
import { runStop } from "../../commands/lifecycle/stop.mjs";
import { runLifecycleStatus } from "../../commands/lifecycle/status.mjs";
import { runLifecycleRecover } from "../../commands/lifecycle/recover.mjs";

export function createLifecycleHandlers() {
  return {
    bootstrap: runClusterBootstrap,
    join: runClusterJoin,
    rejoin: async ({ client, emit }) => {
      emit(await client.rejoin());
      return 0;
    },
    drain: runDrain,
    undrain: runUndrain,
    drainStatus: runDrainStatus,
    stop: runStop,
    status: runLifecycleStatus,
    recover: runLifecycleRecover,
  };
}
