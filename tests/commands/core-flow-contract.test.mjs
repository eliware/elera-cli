import { jest } from '@jest/globals';
import { runBackup } from '../../src/commands/backup/create.mjs';
import { runDatabaseDelete } from '../../src/commands/database/delete.mjs';
import { runTokenRotate } from '../../src/commands/token/rotate.mjs';
import { runTokenRevoke } from '../../src/commands/token/revoke.mjs';

test('backup command exposes the created artifact path in its JSON data envelope', async () => {
  const emit = jest.fn();
  const artifact = { path: '/backups/7', databases: ['primary'] };
  const client = {
    lease: jest.fn(async () => ({ database: 'physical_primary' })),
    metadataExport: jest.fn(async () => ({ data: { applications: ['lab-example'] } })),
    exportAccounts: jest.fn(async () => ({ accounts: [] })),
  };
  await runBackup({
    client,
    createBackup: jest.fn(async () => artifact),
    emit,
    database: 'primary',
    identity: 'ExampleApp',
    root: '/backups',
  });
  expect(emit).toHaveBeenCalledWith({ ok: true, operation: 'backup', data: artifact });
  expect(emit.mock.calls[0][0].data.path).toBe('/backups/7');
});

test('database delete preserves dry-run, confirmation, and idempotency semantics', async () => {
  const deleteDatabase = jest.fn(async (_id, input) => ({ ok: true, input }));
  const emit = jest.fn();
  await runDatabaseDelete({ client: { deleteDatabase }, emit, databaseId: 'db-1', confirm: false, dryRun: true, idempotencyKey: 'op-1' });
  expect(deleteDatabase).toHaveBeenCalledWith('db-1', { confirm: false, dryRun: true, idempotencyKey: 'op-1' });
});

test('token rotation delegates the token name and idempotency key without exposing a token', async () => {
  const rotateToken = jest.fn(async (token) => ({ ok: true, token }));
  await expect(runTokenRotate({ client: { rotateToken }, emit: jest.fn(), token: 'ExampleRuntime' })).resolves.toBe(0);
  expect(rotateToken).toHaveBeenCalledWith('ExampleRuntime');
  expect(JSON.stringify(rotateToken.mock.calls)).not.toContain('secret');
});

test('token revocation delegates only the named token', async () => {
  const revokeToken = jest.fn(async (token) => ({ ok: true, token }));
  await expect(runTokenRevoke({ client: { revokeToken }, emit: jest.fn(), token: 'ExampleRuntime' })).resolves.toBe(0);
  expect(revokeToken).toHaveBeenCalledWith('ExampleRuntime');
});
