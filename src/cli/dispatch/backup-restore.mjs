import { runBackupList } from '../../commands/backup/list.mjs';

export async function dispatchBackupRestore({ command, client, emit, args, config, operations, artifactCommands }) {
  if (command === 'backup-list') return runBackupList({ emit, root: args[0] });
  if (command === 'dump' || command === 'restore') {
    return operations.native({ client, emit, database: config.database, identity: config.identity, file: args[0] });
  }
  if (command === 'backup' || command === 'verify-backup' || command === 'restore-verify') {
    const root = args[0];
    if (command === 'backup') return operations.backup({ client, emit, database: config.database, identity: config.identity, root, databases: (args[1] ?? config.database).split(',') });
    if (command === 'verify-backup') return operations.verify({ client, emit, database: config.database, identity: config.identity, root });
    return operations.restoreVerify({ client, emit, database: config.database, identity: config.identity, root });
  }
  if (command === 'restore-artifact') return operations.artifact({ client, emit, database: config.database, identity: config.identity, root: args[0] });
  if (command.startsWith('restore-metadata-')) return operations.metadata({ client, emit, command, value: args[0] });
  if (command.startsWith('restore-accounts-')) return operations.accounts({ client, emit, command, value: args[0] });
  if (command.startsWith('secret-')) return artifactCommands(command, args);
  return undefined;
}
