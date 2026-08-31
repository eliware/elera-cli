import * as subject from '../../../src/cli/dispatch/management.mjs';
import { dispatchManagement } from '../../../src/cli/dispatch/management.mjs';
import { jest } from '@jest/globals';
test('exports management dispatch', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
test('dispatches cold recovery JSON operations', async () => {
  const calls = { authorize: jest.fn(async () => 0), bootstrap: jest.fn(async () => 0), complete: jest.fn(async () => 0) };
  const handlers = { coldRecoveryAuthorize: ({ input }) => calls.authorize(input), coldRecoveryBootstrap: ({ input }) => calls.bootstrap(input), coldRecoveryComplete: ({ input }) => calls.complete(input) };
  for (const [command, method] of [['cold-recovery-authorize', 'authorize'], ['cold-recovery-bootstrap', 'bootstrap'], ['cold-recovery-complete', 'complete']]) await dispatchManagement({ command, client: {}, controlClient: {}, emit: jest.fn(), args: ['{"epoch":"e"}'], handlers });
  for (const command of ['cold-recovery-authorize', 'cold-recovery-bootstrap', 'cold-recovery-complete']) await dispatchManagement({ command, client: {}, controlClient: {}, emit: jest.fn(), args: [], handlers });
  expect(calls.authorize).toHaveBeenCalledWith({ epoch: 'e' }); expect(calls.bootstrap).toHaveBeenCalledWith({ epoch: 'e' }); expect(calls.complete).toHaveBeenCalledWith({ epoch: 'e' });
});
test('dispatches approved application and deletion scaffolds', async () => {
  const calls = {};
  const handlers = { applicationCreate: (value) => { calls.create = value; return 1; }, applicationStatus: (value) => { calls.status = value; return 2; }, appAdminCreate: (value) => { calls.admin = value; return 3; }, databaseDelete: (value) => { calls.delete = value; return 4; } };
  await dispatchManagement({ command: 'app-create', client: {}, controlClient: {}, emit: jest.fn(), args: ['Demo'], handlers });
  await dispatchManagement({ command: 'app-status', client: {}, controlClient: {}, emit: jest.fn(), args: ['1'], handlers });
  await dispatchManagement({ command: 'app-admin-create', client: {}, controlClient: {}, emit: jest.fn(), args: ['1'], operationId: 'op-1', handlers });
  await dispatchManagement({ command: 'database-delete', client: {}, controlClient: {}, emit: jest.fn(), args: ['2'], operationId: 'op-2', handlers });
  expect(calls.create.name).toBe('Demo'); expect(calls.status.applicationId).toBe('1'); expect(calls.admin.application).toBe('1'); expect(calls.delete.idempotencyKey).toBe('op-2');
});
test('dispatches migration explanation and pending actions', async () => { const explain = jest.fn(() => 0); const pending = jest.fn(() => 0); const handlers = { migrationExplain: explain, migrationPending: pending }; for (const command of ['migration-explain', 'migration-inspect', 'migration-database-create', 'migration-identity-create', 'migration-token-create', 'migration-verify']) await dispatchManagement({ command, client: {}, controlClient: {}, emit: jest.fn(), args: [], handlers }); expect(explain).toHaveBeenCalledTimes(1); expect(pending).toHaveBeenCalledTimes(5); });
test('passes provisioning option values to handlers', async () => { const identityCreate = jest.fn(() => 0); const tokenCreate = jest.fn(() => 0); const handlers = { identityCreate, tokenCreate }; await dispatchManagement({ command: 'identity-create', client: {}, controlClient: {}, emit: jest.fn(), args: ['app', 'db', 'runtime'], options: { grants: 'SELECT,INSERT' }, handlers }); await dispatchManagement({ command: 'token-create', client: {}, controlClient: {}, emit: jest.fn(), args: ['token', 'app', 'runtime'], options: { scopes: 'database:read,database:write' }, handlers }); expect(identityCreate).toHaveBeenCalledWith(expect.objectContaining({ grants: 'SELECT,INSERT' })); expect(tokenCreate).toHaveBeenCalledWith(expect.objectContaining({ scopes: 'database:read,database:write' })); });
