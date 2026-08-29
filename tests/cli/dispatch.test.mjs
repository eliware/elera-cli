import { jest } from '@jest/globals';
import { dispatchLifecycle } from '../../src/cli/dispatch/lifecycle.mjs';
import { dispatchReadOnly } from '../../src/cli/dispatch/read-only.mjs';
import { dispatchManagement } from '../../src/cli/dispatch/management.mjs';
import { dispatchBackupRestore } from '../../src/cli/dispatch/backup-restore.mjs';

const emit = jest.fn();

test('dispatch modules return undefined for commands outside their responsibility', async () => {
  const context = { command: 'health', client: {}, emit, handlers: {}, lifecycleCommands: {} };
  expect(await dispatchLifecycle(context)).toBeUndefined();
  expect(await dispatchManagement({ ...context, controlClient: {}, args: {} })).toBeUndefined();
  expect(await dispatchBackupRestore({ ...context, args: [], config: {}, operations: {}, artifactCommands: jest.fn() })).toBeUndefined();
});

test('lifecycle dispatcher delegates direct node operations to the supplied handler', async () => {
  const handler = jest.fn(async () => 0);
  await expect(dispatchLifecycle({ command: 'cluster-join', client: {}, controlClient: {}, lifecycle: {}, emit, target: 'elera-1', lifecycleCommands: {}, handlers: { join: handler } })).resolves.toBe(0);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ target: 'elera-1' }));
});

test('read-only dispatcher delegates a resolved command and preserves context', async () => {
  const handler = jest.fn(async () => 0);
  await expect(dispatchReadOnly({ command: 'health', client: {}, emit, handlers: { health: handler } })).resolves.toBe(0);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ client: {}, emit }));
});
test('dispatches recovery and routing administration commands', async () => {
  const calls = {};
  const make = (name) => jest.fn(async (value) => { calls[name] = value; return 0; });
  await dispatchReadOnly({ command: 'recovery-status', client: {}, emit, handlers: { recoveryStatus: make('recoveryStatus') } });
  await dispatchReadOnly({ command: 'recovery-events', client: {}, emit, handlers: { recoveryEvents: make('recoveryEvents') } });
  await dispatchReadOnly({ command: 'routing-validate', client: {}, emit, application: 'app', handlers: { routingValidate: make('routingValidate') } });
  await dispatchManagement({ command: 'recovery-abort', client: {}, emit, args: ['reason'], handlers: { recoveryAbort: make('recoveryAbort') } });
  await dispatchManagement({ command: 'recovery-acknowledge', client: {}, emit, args: ['reason'], handlers: { recoveryAcknowledge: make('recoveryAcknowledge') } });
  await dispatchManagement({ command: 'routing-rebalance', client: {}, emit, args: ['app'], handlers: { routingRebalance: make('routingRebalance') } });
  await dispatchReadOnly({ command: 'routing-events', client: {}, emit, application: 'app', handlers: { routingEvents: make('routingEvents') } });
  expect(calls.recoveryStatus).toBeDefined(); expect(calls.recoveryEvents).toBeDefined(); expect(calls.routingValidate).toBeDefined(); expect(calls.recoveryAbort).toBeDefined(); expect(calls.recoveryAcknowledge).toBeDefined(); expect(calls.routingRebalance).toBeDefined(); expect(calls.routingEvents).toBeDefined();
});

test('management dispatcher delegates command arguments', async () => {
  const handler = jest.fn(async () => 0);
  await expect(dispatchManagement({ command: 'database-create', client: {}, controlClient: {}, emit, args: ['app', 'db'], handlers: { databaseCreate: handler } })).resolves.toBe(0);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ application: 'app', database: 'db' }));
});

test('backup dispatcher delegates native backup operations', async () => {
  const handler = jest.fn(async () => 0);
  await expect(dispatchBackupRestore({ command: 'backup', client: {}, emit, args: ['/tmp/out', 'a,b'], config: { database: 'default', identity: 'runtime' }, operations: { backup: handler }, artifactCommands: jest.fn() })).resolves.toBe(0);
  expect(handler).toHaveBeenCalledWith(expect.objectContaining({ root: '/tmp/out', databases: ['a', 'b'] }));
});
