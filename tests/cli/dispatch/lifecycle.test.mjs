import { jest } from '@jest/globals';
import { dispatchLifecycle } from '../../../src/cli/dispatch/lifecycle.mjs';
test('routes lifecycle commands to their handlers', async () => {
  const handlers = Object.fromEntries(['bootstrap', 'join', 'rejoin', 'drain', 'undrain', 'drainStatus', 'stop', 'status', 'recover'].map(name => [name, jest.fn(async () => 0)]));
  const context = { command: '', client: {}, controlClient: { lifecycle: jest.fn(async () => ({ ok: true })) }, lifecycle: {}, emit: jest.fn(), target: 'node', lifecycleCommands: { 'cluster-leave': 'leave' }, handlers };
  for (const command of ['cluster-bootstrap', 'cluster-join', 'cluster-rejoin', 'drain', 'undrain', 'drain-status', 'stop', 'node-status', 'recover', 'cluster-leave']) await dispatchLifecycle({ ...context, command });
  expect(handlers.bootstrap).toHaveBeenCalled(); expect(handlers.join).toHaveBeenCalled(); expect(handlers.rejoin).toHaveBeenCalled(); expect(handlers.recover).toHaveBeenCalled(); expect(context.controlClient.lifecycle).toHaveBeenCalledWith('leave', { target: 'node' });
});
test('returns undefined for unrelated commands', async () => expect(dispatchLifecycle({ command: 'health', handlers: {}, lifecycleCommands: {} })).resolves.toBeUndefined());
