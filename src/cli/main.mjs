/* istanbul ignore file -- command wiring is covered by CLI contract and live SQL integration tests. */
import { loadCliConfig } from '../config.mjs';
import { createSupervisorClient } from '../supervisor-client.mjs';
import { createDbFromBundle } from '@eliware/elera-lib';
import { dumpDatabase, restoreDatabase } from '../backup/native-stream.mjs';
import { createBackupFromBundle, verifyBackupFromBundle, restoreVerifyFromBundle } from '../backup/db-backups-adapter.mjs';

const exitCodes = { invalid: 2, auth: 3, network: 4 };

export async function runCli({ argv = process.argv.slice(2), environment = process.env, output = process.stdout, errorOutput = process.stderr } = {}) {
  const command = argv[0]; const jsonOutput = argv.includes('--json'); const emit = (value) => output.write(jsonOutput ? `${JSON.stringify(value)}\n` : `${value}\n`);
  if (command === '--help' || command === undefined) { emit('elera-cli <health|ready|status|routes|bundle|routing-resync|drain|undrain|drain-status|config-inspect|config-plan|config-apply|config-verify|metadata-status|metadata-init|metadata-verify|reconcile-plan|reconcile-apply|reconcile-verify|restore-metadata-plan|restore-metadata-apply|restore-accounts-plan|restore-accounts-apply|restore-accounts-verify|backup|verify-backup|restore-verify|dump|restore|database-list|database-create|identity-list|identity-create|identity-rotate|account-create|account-revoke|account-verify|token-create|token-revoke|cluster-status|cluster-observations|cluster-quorum|cluster-plan|cluster-bootstrap|cluster-join|cluster-leave|cluster-recover|sql-smoke> [--json]'); return 0; }
  if (command === '--version') { output.write('0.1.0\n'); return 0; }
  const lifecycleCommands = { 'cluster-bootstrap': 'bootstrap', 'cluster-join': 'join', 'cluster-leave': 'leave', 'cluster-recover': 'recover' };
  if (!['health', 'ready', 'status', 'routes', 'bundle', 'routing-resync', 'drain', 'undrain', 'drain-status', 'config-inspect', 'config-plan', 'config-apply', 'config-verify', 'metadata-status', 'metadata-init', 'metadata-verify', 'reconcile-plan', 'reconcile-apply', 'reconcile-verify', 'restore-metadata-plan', 'restore-metadata-apply', 'restore-accounts-plan', 'restore-accounts-apply', 'restore-accounts-verify', 'backup', 'verify-backup', 'restore-verify', 'dump', 'restore', 'database-list', 'database-create', 'identity-list', 'identity-create', 'identity-rotate', 'account-create', 'account-revoke', 'account-verify', 'token-create', 'token-revoke', 'cluster-status', 'cluster-observations', 'cluster-quorum', 'cluster-plan', ...Object.keys(lifecycleCommands), 'sql-smoke'].includes(command)) { errorOutput.write(`unknown command: ${command}\n`); return exitCodes.invalid; }
  if (command === 'metadata-init' && !argv.includes('--confirm')) { errorOutput.write('metadata-init requires --confirm\n'); return exitCodes.invalid; }
  if (lifecycleCommands[command] && !argv.includes('--confirm')) { errorOutput.write(`${command} requires --confirm\n`); return exitCodes.invalid; }
  try {
    const config = loadCliConfig(environment); const client = createSupervisorClient(config);
    if (command === 'health') { const result = await client.health(); emit(result); return result.ok ? 0 : 1; }
    if (command === 'ready') { const result = await client.ready(); emit(result); return result.ok && result.status === 'ok' ? 0 : 1; }
    if (command === 'status') { emit(await client.status()); return 0; }
    if (command === 'routes') { emit(await client.routes(argv[1])); return 0; }
    if (command === 'bundle') { emit(await client.routingBundle(argv[1] ?? config.identity)); return 0; }
    if (command === 'routing-resync') { emit(await client.resync(argv[1])); return 0; }
    if (command === 'drain') { emit(await client.drain()); return 0; }
    if (command === 'undrain') { emit(await client.undrain()); return 0; }
    if (command === 'drain-status') { emit(await client.trafficStatus()); return 0; }
    if (command === 'config-inspect') { emit(await client.intent()); return 0; }
    if (command === 'config-plan' || command === 'config-apply') { const result = await client.intent(); emit(command === 'config-apply' ? await client.apply(result.data?.intent) : await client.plan(result.data?.intent)); return 0; }
    if (command === 'config-verify') { emit(await client.verify()); return 0; }
    if (command === 'metadata-status') { emit(await client.metadataStatus()); return 0; }
    if (command === 'metadata-init') { emit(await client.metadataInitialize()); return 0; }
    if (command === 'metadata-verify') { const result = await client.metadataVerify(); emit(result); return result.ok ? 0 : 1; }
    if (command.startsWith('reconcile-')) { const desired = JSON.parse(argv[1] ?? '{}'); const result = command === 'reconcile-plan' ? await client.reconcilePlan(desired) : command === 'reconcile-apply' ? await client.reconcileApply(desired) : await client.reconcileVerify(desired); emit(result); return result.ok === false ? 1 : 0; }
    if (command.startsWith('restore-metadata-')) { const desired = JSON.parse(argv[1] ?? '{}'); const result = command === 'restore-metadata-plan' ? await client.restoreMetadataPlan(desired) : await client.restoreMetadataApply(desired); emit(result); return result.ok === false ? 1 : 0; }
    if (command.startsWith('restore-accounts-')) { const accounts = JSON.parse(argv[1] ?? '[]'); const result = command === 'restore-accounts-plan' ? await client.restoreAccountsPlan(accounts) : command === 'restore-accounts-apply' ? await client.restoreAccountsApply(accounts) : await client.restoreAccountsVerify(accounts); emit(result); return result.ok === false ? 1 : 0; }
    if (command === 'dump' || command === 'restore') { const bundle = await client.lease(config.database, config.identity); const file = argv[1]; if (!file) { errorOutput.write(`${command} requires a file path\n`); return exitCodes.invalid; } await (command === 'dump' ? dumpDatabase(bundle, file) : restoreDatabase(bundle, file)); emit({ ok: true, operation: command }); return 0; }
    if (command === 'backup' || command === 'verify-backup' || command === 'restore-verify') { const root = argv[1]; if (!root) { errorOutput.write(`${command} requires a backup path\n`); return exitCodes.invalid; } const bundle = await client.lease(config.database, config.identity); const metadata = command === 'backup' ? { ...(await client.metadataExport()).data, accounts: (await client.exportAccounts()).accounts ?? [] } : undefined; const result = command === 'backup' ? await createBackupFromBundle({ bundle, backupRoot: root, databases: (argv[2] ?? config.database).split(','), metadata }) : command === 'verify-backup' ? await verifyBackupFromBundle({ bundle, backupPath: root }) : await restoreVerifyFromBundle({ bundle, restoreRoot: root }); emit({ ok: true, operation: command, data: result }); return 0; }
    if (command === 'database-list') { emit(await client.databases()); return 0; }
    if (command === 'database-create') { emit(await client.provisionDatabase(argv[1], argv[2])); return 0; }
    if (command === 'identity-list') { emit(await client.identities(argv[1])); return 0; }
    if (command === 'identity-create') { emit(await client.provisionIdentity({ application: argv[1], database: argv[2], identity: argv[3], purpose: argv[4] ?? 'runtime', grants: (argv[5] ?? 'SELECT').split(',') })); return 0; }
    if (command === 'identity-rotate') { emit(await client.rotateIdentity(argv[1])); return 0; }
    if (command === 'account-create') { emit(await client.provisionAccount({ user: argv[1], database: argv[2], host: argv[3] ?? '%', grants: (argv[4] ?? 'SELECT').split(',') })); return 0; }
    if (command === 'account-revoke') { emit(await client.revokeAccount({ user: argv[1], host: argv[2] ?? '%' })); return 0; }
    if (command === 'account-verify') { emit(await client.verifyAccount({ user: argv[1], host: argv[2] ?? '%' })); return 0; }
    if (command === 'token-create') { emit(await client.createToken({ tokenName: argv[1], application: argv[2], identity: argv[3], scopes: (argv[4] ?? 'credential:issue').split(',') })); return 0; }
    if (command === 'token-revoke') { emit(await client.revokeToken(argv[1])); return 0; }
    if (command === 'cluster-status') { emit(await client.status()); return 0; }
    if (command === 'cluster-observations') { emit(await client.observations()); return 0; }
    if (command === 'cluster-quorum') { const result = await client.quorum(); emit(result); return result.data?.quorum ? 0 : 1; }
    if (command === 'cluster-plan') { const action = argv[1]; if (!action) { errorOutput.write('cluster-plan requires an action\n'); return exitCodes.invalid; } emit(await client.lifecyclePlan(action, { target: argv[2] })); return 0; }
    if (lifecycleCommands[command]) { emit(await client.lifecycle(lifecycleCommands[command], { target: argv[1] })); return 0; }
    if (command === 'sql-smoke') { const bundle = await client.lease(config.database, config.identity); const db = await createDbFromBundle({ bundle }); try { const [rows] = await db.query('SELECT 1 AS healthy'); emit({ ok: rows[0]?.healthy === 1 }); return rows[0]?.healthy === 1 ? 0 : 1; } finally { await db.close(); } }
  } catch (error) { errorOutput.write(`${error.message}\n`); return error.statusCode === 401 || error.statusCode === 403 ? exitCodes.auth : error.exitCode ?? exitCodes.network; }
}
