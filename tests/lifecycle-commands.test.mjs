import { expect, jest, test } from '@jest/globals';
import { createLifecycleCommands } from '../src/commands/lifecycle.mjs';

const client = () => ({ drain: jest.fn(async () => ({ ok: true })), undrain: jest.fn(async () => ({ ok: true })), trafficStatus: jest.fn(async () => ({ data: { drained: true, active: 0, lifecycle: 'draining' } })), status: jest.fn(async () => ({ data: { ready: true, values: { wsrep_cluster_status: 'Primary' } } })), lifecyclePlan: jest.fn(async () => ({ data: { eligible: false, reason: 'quorum required' } })) });

test('drain status and stop record outcomes', async () => {
  const value = createLifecycleCommands({ client: client(), now: () => 'now', sleep: async () => {} });
  await expect(value.drain()).resolves.toMatchObject({ action: 'traffic.drain', outcome: { ok: true } });
  await expect(value.stop()).resolves.toMatchObject({ action: 'supervisor.shutdown', outcome: { status: 'completed' } });
});

test('refuses unsafe resume and recovery', async () => {
  const stopping = client(); stopping.trafficStatus.mockResolvedValue({ data: { lifecycle: 'stopping', drained: true, active: 0 } });
  const value = createLifecycleCommands({ client: stopping, now: () => 'now' });
  await expect(value.undrain()).resolves.toMatchObject({ outcome: { status: 'unsafe' } });
  await expect(value.recover('elera-0')).resolves.toMatchObject({ outcome: { status: 'unsafe', eligible: false } });
});

test('executes an eligible recovery request', async () => {
  const value = client();
  value.lifecyclePlan.mockResolvedValue({ data: { eligible: true } });
  value.lifecycle = jest.fn(async () => ({ ok: true, status: 'completed' }));
  const commands = createLifecycleCommands({ client: value, now: () => 'now' });
  await expect(commands.recover('elera-0')).resolves.toMatchObject({ outcome: { ok: true, status: 'completed' } });
  expect(value.lifecycle).toHaveBeenCalledWith('recover', { target: 'elera-0' });
});

test('covers direct supervisor response shapes and validation', async () => {
  expect(() => createLifecycleCommands()).toThrow('supervisor client');
  const value = client();
  value.trafficStatus.mockResolvedValueOnce({ lifecycle: 'serving', drained: false, active: 1 });
  value.undrain.mockResolvedValue({ ok: true, status: 'resumed' });
  await expect(createLifecycleCommands({ client: value, now: () => 'now' }).undrain()).resolves.toMatchObject({ outcome: { status: 'resumed' } });
  value.status.mockResolvedValue({ ready: true });
  value.trafficStatus.mockResolvedValue({ lifecycle: 'stopped', drained: true, active: 0 });
  await expect(createLifecycleCommands({ client: value, now: () => 'now' }).nodeStatus()).resolves.toMatchObject({ outcome: { data: { ready: true } } });
  value.lifecyclePlan.mockResolvedValue({ eligible: false, reason: 'unsafe' });
  await expect(createLifecycleCommands({ client: value, now: () => 'now' }).recover()).resolves.toMatchObject({ outcome: { status: 'unsafe' } });
});

test('handles completed and incomplete stop polls', async () => {
  const completed = client(); completed.trafficStatus.mockResolvedValue({ lifecycle: 'stopped', active: 0 });
  await expect(createLifecycleCommands({ client: completed, now: () => 'now' }).stop()).resolves.toMatchObject({ outcome: { status: 'completed' } });
  const incomplete = client(); incomplete.trafficStatus.mockResolvedValue({ lifecycle: 'serving', drained: false, active: 1 });
  await expect(createLifecycleCommands({ client: incomplete, now: () => 'now', timeoutMs: 0 }).stop()).resolves.toMatchObject({ outcome: { status: 'incomplete', timedOut: true } });
  const noActive = client(); noActive.trafficStatus.mockResolvedValue({ drained: true });
  await expect(createLifecycleCommands({ client: noActive, now: () => 'now' }).stop()).resolves.toMatchObject({ outcome: { status: 'completed' } });
});
