/* istanbul ignore file -- command wiring is covered by CLI contract and live SQL integration tests. */
import { loadCliConfig } from '../config.mjs';
import { createSupervisorClient } from '../supervisor-client.mjs';
import { createDb } from '@eliware/elera-lib';

const exitCodes = { invalid: 2, auth: 3, network: 4 };

export async function runCli({ argv = process.argv.slice(2), environment = process.env, output = process.stdout, errorOutput = process.stderr } = {}) {
  const command = argv[0]; const jsonOutput = argv.includes('--json'); const emit = (value) => output.write(jsonOutput ? `${JSON.stringify(value)}\n` : `${value}\n`);
  if (command === '--help' || command === undefined) { emit('elera-cli <health|ready|status|config-inspect|config-plan|config-apply|config-verify|metadata-status|metadata-init|metadata-verify|database-list|database-create|identity-list|identity-create|identity-rotate|token-create|cluster-status|cluster-observations|cluster-quorum|cluster-plan|cluster-bootstrap|cluster-join|cluster-leave|cluster-recover|sql-smoke> [--json]'); return 0; }
  if (command === '--version') { output.write('0.1.0\n'); return 0; }
  const lifecycleCommands = { 'cluster-bootstrap': 'bootstrap', 'cluster-join': 'join', 'cluster-leave': 'leave', 'cluster-recover': 'recover' };
  if (!['health', 'ready', 'status', 'config-inspect', 'config-plan', 'config-apply', 'config-verify', 'metadata-status', 'metadata-init', 'metadata-verify', 'database-list', 'database-create', 'identity-list', 'identity-create', 'identity-rotate', 'token-create', 'cluster-status', 'cluster-observations', 'cluster-quorum', 'cluster-plan', ...Object.keys(lifecycleCommands), 'sql-smoke'].includes(command)) { errorOutput.write(`unknown command: ${command}\n`); return exitCodes.invalid; }
  if (command === 'metadata-init' && !argv.includes('--confirm')) { errorOutput.write('metadata-init requires --confirm\n'); return exitCodes.invalid; }
  if (lifecycleCommands[command] && !argv.includes('--confirm')) { errorOutput.write(`${command} requires --confirm\n`); return exitCodes.invalid; }
  try {
    const config = loadCliConfig(environment); const client = createSupervisorClient(config);
    if (command === 'health') { const result = await client.health(); emit(result); return result.ok ? 0 : 1; }
    if (command === 'ready') { const result = await client.ready(); emit(result); return result.ok && result.status === 'ok' ? 0 : 1; }
    if (command === 'status') { emit(await client.status()); return 0; }
    if (command === 'config-inspect') { emit(await client.intent()); return 0; }
    if (command === 'config-plan' || command === 'config-apply') { const result = await client.intent(); emit(command === 'config-apply' ? await client.apply(result.data?.intent) : await client.plan(result.data?.intent)); return 0; }
    if (command === 'config-verify') { emit(await client.verify()); return 0; }
    if (command === 'metadata-status') { emit(await client.metadataStatus()); return 0; }
    if (command === 'metadata-init') { emit(await client.metadataInitialize()); return 0; }
    if (command === 'metadata-verify') { const result = await client.metadataVerify(); emit(result); return result.ok ? 0 : 1; }
    if (command === 'database-list') { emit(await client.databases()); return 0; }
    if (command === 'database-create') { emit(await client.provisionDatabase(argv[1], argv[2])); return 0; }
    if (command === 'identity-list') { emit(await client.identities(argv[1])); return 0; }
    if (command === 'identity-create') { emit(await client.provisionIdentity({ application: argv[1], database: argv[2], identity: argv[3], purpose: argv[4] ?? 'runtime', grants: (argv[5] ?? 'SELECT').split(',') })); return 0; }
    if (command === 'identity-rotate') { emit(await client.rotateIdentity(argv[1])); return 0; }
    if (command === 'token-create') { emit(await client.createToken({ tokenName: argv[1], application: argv[2], identity: argv[3], scopes: (argv[4] ?? 'credential:issue').split(',') })); return 0; }
    if (command === 'cluster-status') { emit(await client.status()); return 0; }
    if (command === 'cluster-observations') { emit(await client.observations()); return 0; }
    if (command === 'cluster-quorum') { const result = await client.quorum(); emit(result); return result.data?.quorum ? 0 : 1; }
    if (command === 'cluster-plan') { const action = argv[1]; if (!action) { errorOutput.write('cluster-plan requires an action\n'); return exitCodes.invalid; } emit(await client.lifecyclePlan(action, { target: argv[2] })); return 0; }
    if (lifecycleCommands[command]) { emit(await client.lifecycle(lifecycleCommands[command], { target: argv[1] })); return 0; }
    if (command === 'sql-smoke') { const bundle = await client.lease(config.database, config.identity); const db = await createDb({ primary: { ...bundle.routes.primary[0], user: bundle.credentials?.username, password: bundle.credentials?.password, database: bundle.database }, bundle, identity: bundle.identity }); try { const [rows] = await db.query('SELECT 1 AS healthy'); emit({ ok: rows[0]?.healthy === 1 }); return rows[0]?.healthy === 1 ? 0 : 1; } finally { await db.close(); } }
  } catch (error) { errorOutput.write(`${error.message}\n`); return error.statusCode === 401 || error.statusCode === 403 ? exitCodes.auth : error.exitCode ?? exitCodes.network; }
}
