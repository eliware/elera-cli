import { completeOperation } from "../operations/complete-record.mjs";
import { createOperationRecord } from "../operations/create-record.mjs";
import { classifyOperation } from "../operations/classify-result.mjs";
import { pollOperation } from "../operations/poll.mjs";
import { lifecycleStatusDone } from "./lifecycle/status-done.mjs";
import { runLifecycleOperation } from "./lifecycle/run-operation.mjs";

export function createLifecycleCommands({ client, now, sleep, timeoutMs = 60000 } = {}) {
  if (!client) throw new TypeError("supervisor client is required");
  const run = async (action, input, operation) => {
    return runLifecycleOperation({ action, input, operation, now });
  };
  return {
    async drain() {
      return run("traffic.drain", {}, () => client.drain());
    },
    async drainStatus() {
      return run("traffic.status", {}, () => client.trafficStatus());
    },
    async stop() {
      const record = createOperationRecord("supervisor.shutdown", {}, now);
      await client.drain();
      const shutdown = await client.lifecycle("shutdown");
      const polled = await pollOperation(
        async () => {
          const response = await client.trafficStatus();
          const data = response.data ?? response;
          return { response, done: lifecycleStatusDone(data) };
        },
        { timeoutMs, sleep },
      );
      return completeOperation(
        record,
        polled.done
          ? { ...shutdown, ...polled.response, status: "completed" }
          : { ...shutdown, ...polled.response, status: "incomplete", timedOut: true },
        now,
      );
    },
    async undrain() {
      const status = await client.trafficStatus();
      const data = status.data ?? status;
      if (data.lifecycle === "stopping" || data.lifecycle === "stopped") {
        return completeOperation(
          createOperationRecord("traffic.undrain", {}, now),
          { ok: false, status: "unsafe", error: "cannot continue a stopping supervisor" },
          now,
        );
      }
      return run("traffic.undrain", {}, () => client.undrain());
    },
    async nodeStatus() {
      const [status, traffic] = await Promise.all([client.status(), client.trafficStatus()]);
      return completeOperation(
        createOperationRecord("node.status", {}, now),
        {
          ok: true,
          status: "completed",
          data: { ...(status.data ?? status), traffic: traffic.data ?? traffic },
        },
        now,
      );
    },
    async recover(target) {
      const plan = await client.lifecyclePlan("recover", { target });
      const decision = plan.data ?? plan;
      if (decision.eligible !== true)
        return completeOperation(
          createOperationRecord("cluster.recover", { target }, now),
          { ok: false, status: "unsafe", eligible: false, error: decision.reason },
          now,
        );
      return run("cluster.recover", { target }, () => client.lifecycle("recover", { target }));
    },
    classify: classifyOperation,
  };
}
