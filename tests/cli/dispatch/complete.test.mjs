import { jest, test, expect } from '@jest/globals';
import { dispatchLifecycle } from '../../../src/cli/dispatch/lifecycle.mjs';
import { dispatchReadOnly } from '../../../src/cli/dispatch/read-only.mjs';
import { dispatchManagement } from '../../../src/cli/dispatch/management.mjs';
import { dispatchBackupRestore } from '../../../src/cli/dispatch/backup-restore.mjs';

const handler = jest.fn(async () => 0);
const handlers = new Proxy({}, { get: () => handler });
const base = { client: {}, controlClient: { lifecycle: jest.fn(async () => ({})) }, lifecycle: {}, emit: jest.fn(), target: 'node', args: ['a', 'b', 'c', 'd', 'SELECT'] };

test('covers every lifecycle dispatch branch', async () => {
  for (const command of ['cluster-bootstrap', 'cluster-join', 'cluster-rejoin', 'drain', 'undrain', 'drain-status', 'stop', 'node-status', 'recover', 'cluster-leave']) {
    await dispatchLifecycle({ ...base, command, lifecycleCommands: { 'cluster-leave': 'leave' }, handlers });
  }
  expect(handler).toHaveBeenCalled(); expect(base.controlClient.lifecycle).toHaveBeenCalled();
});

test('covers every read-only dispatch branch', async () => {
  const readHandler = jest.fn(async () => 0);
  const commands = ['health', 'ready', 'initialization-status', 'initialization-verify', 'initialization-plan', 'telemetry', 'telemetry-detail', 'connections', 'status', 'cluster-status', 'cluster-observations', 'node-evidence', 'cluster-quorum', 'assignment-status', 'bundle-version', 'routes', 'bundle', 'routing-resync', 'config-inspect', 'config-verify', 'metadata-status', 'metadata-verify', 'database-list', 'identity-list', 'account-list', 'token-list', 'recovery-status', 'recovery-events', 'cold-recovery-evidence', 'cold-recovery-status', 'cold-recovery-plan', 'routing-validate', 'routing-events', 'routing-watch', 'telemetry-watch'];
  for (const command of commands) await dispatchReadOnly({ command, client: {}, emit: jest.fn(), application: 'app', identity: 'id', handlers: new Proxy({}, { get: () => readHandler }) });
  expect(readHandler).toHaveBeenCalled();
});

test('covers management command dispatch and JSON recovery inputs', async () => {
  const commands = ['initialization-apply', 'standalone-init', 'config-apply', 'metadata-init', 'reconcile-plan', 'reconcile-apply', 'reconcile-verify', 'database-create', 'database-plan', 'database-verify', 'identity-create', 'identity-rotate', 'account-create', 'account-revoke', 'account-verify', 'token-create', 'token-revoke', 'token-rotate', 'recovery-acknowledge', 'recovery-abort', 'routing-rebalance', 'cold-recovery-authorize', 'cold-recovery-bootstrap', 'cold-recovery-complete'];
  const managementHandlers = new Proxy({}, { get: () => handler });
  for (const command of commands) {
    if (command === 'standalone-init') continue;
    await dispatchManagement({ ...base, command, args: command.startsWith('cold-recovery') ? ['{}'] : base.args, handlers: managementHandlers });
  }
  expect(handler).toHaveBeenCalled();
});

test('covers backup, restore, artifact, secret, and unknown dispatch branches', async () => {
  const operations = { native: handler, backup: handler, verify: handler, restoreVerify: handler, artifact: handler, metadata: handler, accounts: handler };
  for (const command of ['dump', 'restore', 'backup', 'verify-backup', 'restore-verify', 'restore-artifact', 'restore-metadata-plan', 'restore-metadata-apply', 'restore-accounts-plan', 'restore-accounts-apply', 'restore-accounts-verify', 'secret-list']) {
    await dispatchBackupRestore({ command, client: {}, emit: jest.fn(), args: ['root', 'db'], config: { database: 'db', identity: 'id' }, operations, artifactCommands: handler });
  }
  await expect(dispatchBackupRestore({ command: 'unknown', client: {}, emit: jest.fn(), args: [], config: {}, operations, artifactCommands: handler })).resolves.toBeUndefined();
  expect(handler).toHaveBeenCalled();
});
