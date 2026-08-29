import { jest } from '@jest/globals';
import { dispatchBackupRestore } from '../../../src/cli/dispatch/backup-restore.mjs';
const context = { client: {}, emit: jest.fn(), config: { database: 'db', identity: 'id' }, operations: { native: jest.fn(), backup: jest.fn(), verify: jest.fn(), restoreVerify: jest.fn(), artifact: jest.fn(), metadata: jest.fn(), accounts: jest.fn() }, artifactCommands: jest.fn() };
test('routes every backup and restore operation', async () => {
  await dispatchBackupRestore({ ...context, command: 'backup-list', args: ['.'] });
  await dispatchBackupRestore({ ...context, command: 'backup-list', args: ['.'] });
  for (const command of ['dump', 'restore', 'backup', 'verify-backup', 'restore-verify', 'restore-artifact', 'restore-metadata-plan', 'restore-metadata-apply', 'restore-accounts-plan', 'restore-accounts-apply', 'restore-accounts-verify', 'secret-list']) {
    await dispatchBackupRestore({ ...context, command, args: ['value', 'a,b'] });
  }
  expect(context.operations.native).toHaveBeenCalledTimes(2);
  expect(context.operations.backup).toHaveBeenCalled(); expect(context.operations.verify).toHaveBeenCalled();
  expect(context.operations.restoreVerify).toHaveBeenCalled(); expect(context.operations.artifact).toHaveBeenCalled();
  expect(context.operations.metadata).toHaveBeenCalledTimes(2); expect(context.operations.accounts).toHaveBeenCalledTimes(3); expect(context.artifactCommands).toHaveBeenCalled();
});
test('returns undefined outside its responsibility', async () => expect(dispatchBackupRestore({ ...context, command: 'health', args: [] })).resolves.toBeUndefined());
