import { completeOperation, createOperationRecord } from '../operations/record.mjs';
import { classifyOperation } from '../operations/exit-codes.mjs';
import { pollOperation } from '../operations/poll.mjs';

function statusDone(data) {
  return Boolean(data?.lifecycle === 'stopped' || (data?.drained && Number(data?.active ?? 0) === 0));
}

export function createLifecycleCommands({ client, now, sleep, timeoutMs = 60000 } = {}) {
  if (!client) throw new TypeError('supervisor client is required');
  const run = async (action, input, operation) => {
    const record = createOperationRecord(action, input, now);
    const result = await operation();
    return completeOperation(record, result, now);
  };
  return {
    async drain() {
      return run('traffic.drain', {}, () => client.drain());
    },
    async drainStatus() {
      return run('traffic.status', {}, () => client.trafficStatus());
    },
    async stop() {
      const record = createOperationRecord('supervisor.shutdown', {}, now);
      await client.drain();
      const polled = await pollOperation(async () => {
        const response = await client.trafficStatus();
        const data = response.data ?? response;
        return { response, done: statusDone(data) };
      }, { timeoutMs, sleep });
      return completeOperation(record, polled.done ? { ...polled.response, status: 'completed' } : { ...polled.response, status: 'incomplete', timedOut: true }, now);
    },
    async undrain() {
      const status = await client.trafficStatus();
      const data = status.data ?? status;
      if (data.lifecycle === 'stopping' || data.lifecycle === 'stopped') {
        return completeOperation(createOperationRecord('traffic.undrain', {}, now), { ok: false, status: 'unsafe', error: 'cannot resume a stopping supervisor' }, now);
      }
      return run('traffic.undrain', {}, () => client.undrain());
    },
    async nodeStatus() {
      const [status, traffic] = await Promise.all([client.status(), client.trafficStatus()]);
      return completeOperation(createOperationRecord('node.status', {}, now), { ok: true, status: 'completed', data: { ...(status.data ?? status), traffic: traffic.data ?? traffic } }, now);
    },
    async recover(target) {
      const plan = await client.lifecyclePlan('recover', { target });
      const decision = plan.data ?? plan;
      if (decision.eligible !== true) return completeOperation(createOperationRecord('cluster.recover', { target }, now), { ok: false, status: 'unsafe', eligible: false, error: decision.reason }, now);
      return run('cluster.recover', { target }, () => client.lifecycle('recover', { target }));
    },
    classify: classifyOperation,
  };
}
