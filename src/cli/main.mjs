import { loadCliConfig } from "../config.mjs";
import { createSupervisorClient } from "../supervisor-client.mjs";
import { createDbFromBundle } from "@eliware/elera-lib";
import { dumpDatabase, restoreDatabase } from "../backup/native-stream.mjs";
import {
  createBackupFromBundle,
  verifyBackupFromBundle,
  restoreVerifyFromBundle,
} from "../backup/db-backups-adapter.mjs";
import { restoreArtifact } from "../restore/artifact-restore.mjs";
import { createArtifactCommands } from "../artifacts/commands.mjs";
import { createAgeProcess } from "../artifacts/age-process.mjs";
import { createMigrationDiagnostics } from "../migration/diagnostics.mjs";
import { createLiveDb } from "../routing/live-db.mjs";
import { readFile } from "node:fs/promises";
import { createLifecycleCommands } from "../commands/lifecycle.mjs";
import { exitCodes } from "../operations/exit-codes.mjs";
import { formatHuman } from "../output/format.mjs";
import { runColdBootstrap } from "../commands/cold-bootstrap.mjs";
import { parseArguments, helpPaths } from "./parser.mjs";
import {
  confirmationCommands,
  directedCommands,
  mutatingCommands,
  schemaFor,
} from "./command-spec.mjs";
import { runHealthStatus } from "../commands/health/status.mjs";
import { runHealthReady } from "../commands/health/ready.mjs";
import { runTelemetrySummary } from "../commands/telemetry/summary.mjs";
import { runTelemetryDetail } from "../commands/telemetry/detail.mjs";
import { runTelemetryConnections } from "../commands/telemetry/connections.mjs";
import { runAssignment, runBundleVersion } from "../commands/routing/assignment.mjs";
import { runRoutes } from "../commands/routing/routes.mjs";
import { runBundle } from "../commands/routing/bundle.mjs";
import { runResync } from "../commands/routing/resync.mjs";
import { runRoutingValidate } from "../commands/routing/validate.mjs";
import { runRoutingEvents } from "../commands/routing/events.mjs";
import { runRoutingRebalance } from "../commands/routing/rebalance.mjs";
import { runRecoveryStatus } from "../commands/recovery/status.mjs";
import { runRecoveryEvents } from "../commands/recovery/events.mjs";
import { runRecoveryAcknowledge } from "../commands/recovery/acknowledge.mjs";
import { runRecoveryAbort } from "../commands/recovery/abort.mjs";
import { runColdRecoveryEvidence, runColdRecoveryStatus, runColdRecoveryPlan, runColdRecoveryAuthorize, runColdRecoveryBootstrap, runColdRecoveryComplete } from "../commands/recovery/protocol.mjs";
import { runRoutingWatch } from "../commands/routing/watch.mjs";
import { runTelemetryWatch } from "../commands/telemetry/watch.mjs";
import { runInitializationStatus } from "../commands/initialization/status.mjs";
import { runInitializationPlan } from "../commands/initialization/plan.mjs";
import { runInitializationApply } from "../commands/initialization/apply.mjs";
import { runInitializationVerify } from "../commands/initialization/verify.mjs";
import { runClusterStatus, runClusterObservations, runClusterQuorum } from "../commands/cluster/status.mjs";
import { runClusterPlan, runClusterAction } from "../commands/cluster/lifecycle.mjs";
import { runClusterBootstrap } from "../commands/cluster/bootstrap.mjs";
import { runClusterJoin } from "../commands/cluster/join.mjs";
import { runConfigInspect } from "../commands/configuration/inspect.mjs";
import { runConfigPlan } from "../commands/configuration/plan.mjs";
import { runConfigApply } from "../commands/configuration/apply.mjs";
import { runConfigVerify } from "../commands/configuration/verify.mjs";
import { runMetadataStatus } from "../commands/metadata/status.mjs";
import { runMetadataInitialize } from "../commands/metadata/initialize.mjs";
import { runMetadataVerify } from "../commands/metadata/verify.mjs";
import { runReconcile } from "../commands/metadata/reconcile.mjs";
import { runDatabaseList } from "../commands/database/list.mjs";
import { runDatabaseCreate } from "../commands/database/create.mjs";
import { runDatabasePlan } from "../commands/database/plan.mjs";
import { runDatabaseVerify } from "../commands/database/verify.mjs";
import { runIdentityList } from "../commands/identity/list.mjs";
import { runIdentityCreate } from "../commands/identity/create.mjs";
import { runIdentityRotate } from "../commands/identity/rotate.mjs";
import { runAccountCreate } from "../commands/account/create.mjs";
import { runAccountList } from "../commands/account/list.mjs";
import { runAccountRevoke } from "../commands/account/revoke.mjs";
import { runAccountVerify } from "../commands/account/verify.mjs";
import { runTokenCreate } from "../commands/token/create.mjs";
import { runTokenList } from "../commands/token/list.mjs";
import { runTokenRevoke } from "../commands/token/revoke.mjs";
import { runTokenRotate } from "../commands/token/rotate.mjs";
import { runSecretList } from "../commands/secrets/list.mjs";
import { runSecretGet } from "../commands/secrets/get.mjs";
import { runSecretVerify } from "../commands/secrets/verify.mjs";
import { runSecretDelete } from "../commands/secrets/delete.mjs";
import { runDump } from "../commands/backup/dump.mjs";
import { runRestore } from "../commands/backup/restore.mjs";
import { runBackup } from "../commands/backup/create.mjs";
import { runBackupVerify } from "../commands/backup/verify.mjs";
import { runBackupPlan } from "../commands/backup/plan.mjs";
import { runRestoreVerify } from "../commands/restore/verify.mjs";
import { runRestorePlan } from "../commands/restore/plan.mjs";
import { runRestoreArtifact } from "../commands/restore/artifact.mjs";
import { runRestoreMetadataPlan } from "../commands/restore/metadata-plan.mjs";
import { runRestoreMetadataApply } from "../commands/restore/metadata-apply.mjs";
import { runRestoreAccountsPlan } from "../commands/restore/accounts-plan.mjs";
import { runRestoreAccountsApply } from "../commands/restore/accounts-apply.mjs";
import { runRestoreAccountsVerify } from "../commands/restore/accounts-verify.mjs";
import { runDrain } from "../commands/lifecycle/drain.mjs";
import { runUndrain } from "../commands/lifecycle/undrain.mjs";
import { runDrainStatus } from "../commands/lifecycle/drain-status.mjs";
import { runStop } from "../commands/lifecycle/stop.mjs";
import { runLifecycleStatus } from "../commands/lifecycle/status.mjs";
import { runLifecycleRecover } from "../commands/lifecycle/recover.mjs";
import { runMigrationDiagnostics } from "../commands/diagnostics/migration.mjs";
import { runSqlSmoke } from "../commands/smoke/sql.mjs";
import { handleEarlyExit } from "./early-exit.mjs";
import { createClientContext, resolveTargetEndpoint } from "./client-context.mjs";
import { dispatchLifecycle } from "./dispatch/lifecycle.mjs";
import { dispatchReadOnly } from "./dispatch/read-only.mjs";
import { dispatchManagement } from "./dispatch/management.mjs";
import { dispatchBackupRestore } from "./dispatch/backup-restore.mjs";

export async function runCli({
  argv = process.argv.slice(2),
  environment = process.env,
  output = process.stdout,
  errorOutput = process.stderr,
  dependencies = {},
} = {}) {
  const supervisorClient =
    dependencies.createSupervisorClient ?? createSupervisorClient;
  const dump = dependencies.dumpDatabase ?? dumpDatabase;
  const restore = dependencies.restoreDatabase ?? restoreDatabase;
  const createBackup =
    dependencies.createBackupFromBundle ?? createBackupFromBundle;
  const verifyBackup =
    dependencies.verifyBackupFromBundle ?? verifyBackupFromBundle;
  const restoreVerify =
    dependencies.restoreVerifyFromBundle ?? restoreVerifyFromBundle;
  const restoreArtifactOperation =
    dependencies.restoreArtifact ?? restoreArtifact;
  const createDb = dependencies.createDbFromBundle ?? createDbFromBundle;
  const createLive = dependencies.createLiveDb ?? createLiveDb;
  const parsed = parseArguments(argv);
  const command = parsed.command;
  const commandArgv = parsed.argv;
  const jsonOutput = argv.includes("--json");
  const operationId = commandArgv.find((value) => value.startsWith("--operation-id="))?.slice("--operation-id=".length);
  const explicitTarget = commandArgv.find((value) => value.startsWith("--target-endpoint="))?.slice("--target-endpoint=".length);
  const targetHost = directedCommands.has(command) && commandArgv[1] && !commandArgv[1].startsWith("--") ? commandArgv[1] : undefined;
  const emit = (value) =>
    output.write(jsonOutput ? JSON.stringify(value) + "\n" : formatHuman(value) + "\n");
  const earlyExit = handleEarlyExit({ argv, parsed, emit, output, errorOutput });
  if (earlyExit !== undefined) return earlyExit;
  argv = commandArgv;
  const lifecycleCommands = {
    "cluster-bootstrap": "bootstrap",
    "cluster-join": "join",
    "cluster-leave": "leave",
    "cluster-recover": "recover",
  };
  if ((command === "cold-bootstrap" || command === "cold-recover") && commandArgv.includes("--confirm") === false && commandArgv.includes("--dry-run") === false) {
    errorOutput.write(`${command} requires --confirm or --dry-run\n`);
  }
  if (mutatingCommands.has(command) && argv.includes("--dry-run")) {
    emit({ ok: true, operation: command, status: "planned", operationId: operationId ?? null, data: { arguments: argv.slice(1).filter((value) => !value.startsWith("--")) } });
    return 0;
  }
  if (confirmationCommands.has(command) && !argv.includes("--confirm") && !argv.includes("--dry-run")) {
    errorOutput.write(`${command} requires --confirm\n`);
    return exitCodes.invalid;
  }
  try {
    const config = loadCliConfig(environment);
    const targetEndpoint = resolveTargetEndpoint({ config, explicitTarget, targetHost });
    const { client, controlClient } = createClientContext({ config, createClient: supervisorClient, targetEndpoint, operationId });
    const artifactCommands = createArtifactCommands({
      client,
      age: dependencies.age ?? createAgeProcess({ environment }),
      materialize: dependencies.materialize,
      emit,
    });
    if (command === "restore-artifact" && (!argv[1] || !argv.includes("--confirm"))) { errorOutput.write("restore-artifact requires a path and --confirm\n"); return exitCodes.invalid; }
    const positional = parsed.positional;
    const backupRestoreResult = await dispatchBackupRestore({ command, client, emit, args: positional, config, artifactCommands: async (name, args) => { const secretHandlers = { "secret-list": runSecretList, "secret-get": runSecretGet, "secret-verify": runSecretVerify, "secret-delete": runSecretDelete }; if (secretHandlers[name]) return secretHandlers[name]({ client, emit, name: args[0] }); await artifactCommands(name, args); return 0; }, operations: { native: ({ client: targetClient, emit: targetEmit, database, identity, file }) => (command === "dump" ? runDump : runRestore)({ client: targetClient, dump, restore, emit: targetEmit, database, identity, file }), backup: ({ client: targetClient, emit: targetEmit, database, identity, root, databases }) => runBackup({ client: targetClient, createBackup, emit: targetEmit, database, identity, root, databases }), verify: ({ client: targetClient, emit: targetEmit, database, identity, root }) => runBackupVerify({ client: targetClient, verifyBackup, emit: targetEmit, database, identity, root }), restoreVerify: ({ client: targetClient, emit: targetEmit, database, identity, root }) => runRestoreVerify({ client: targetClient, restoreVerify, emit: targetEmit, database, identity, root }), artifact: ({ client: targetClient, emit: targetEmit, database, identity, root }) => runRestoreArtifact({ client: targetClient, restoreArtifact: restoreArtifactOperation, emit: targetEmit, database, identity, root }), metadata: ({ client: targetClient, emit: targetEmit, command: operation, value }) => (operation === "restore-metadata-plan" ? runRestoreMetadataPlan : runRestoreMetadataApply)({ client: targetClient, emit: targetEmit, value }), accounts: ({ client: targetClient, emit: targetEmit, command: operation, value }) => (operation === "restore-accounts-plan" ? runRestoreAccountsPlan : operation === "restore-accounts-apply" ? runRestoreAccountsApply : runRestoreAccountsVerify)({ client: targetClient, emit: targetEmit, value }) } });
    if (backupRestoreResult !== undefined) return backupRestoreResult;
    if (command === "migration-check" || command === "preflight") {
      const diagnose = dependencies.migrationDiagnostics ?? createMigrationDiagnostics();
      const configPath = argv.slice(1).find((argument) => !argument.startsWith("--"));
      return await runMigrationDiagnostics({ diagnose, emit, endpoint: config.endpoint, configPath });
    }
    const readOnlyResult = await dispatchReadOnly({ command, client, emit, application: argv[1], identity: config.identity, handlers: { health: runHealthStatus, ready: runHealthReady, initializationStatus: runInitializationStatus, initializationVerify: runInitializationVerify, initializationPlan: runInitializationPlan, telemetry: runTelemetrySummary, telemetryDetail: runTelemetryDetail, connections: runTelemetryConnections, telemetryWatch: (value) => runTelemetryWatch({ ...value, endpoint: config.endpoint, token: config.token, identity: config.identity, once: argv.includes('--once') }), clusterStatus: runClusterStatus, clusterObservations: runClusterObservations, nodeEvidence: async ({ client: targetClient, emit: targetEmit }) => { targetEmit(await targetClient.coldBootstrapEvidence()); return 0; }, coldRecoveryEvidence: runColdRecoveryEvidence, coldRecoveryStatus: runColdRecoveryStatus, coldRecoveryPlan: runColdRecoveryPlan, clusterQuorum: runClusterQuorum, assignment: runAssignment, bundleVersion: runBundleVersion, routes: runRoutes, bundle: runBundle, resync: runResync, routingValidate: runRoutingValidate, routingEvents: runRoutingEvents, routingWatch: (value) => runRoutingWatch({ ...value, endpoint: config.endpoint, token: config.token, identity: config.identity, once: argv.includes('--once') }), recoveryStatus: runRecoveryStatus, recoveryEvents: runRecoveryEvents, configInspect: runConfigInspect, configVerify: runConfigVerify, metadataStatus: runMetadataStatus, metadataVerify: runMetadataVerify, databaseList: runDatabaseList, identityList: runIdentityList, accountList: runAccountList, tokenList: runTokenList } });
    if (readOnlyResult !== undefined) return readOnlyResult;
    const managementResult = await dispatchManagement({ command, client, controlClient, emit, args: positional, handlers: { initializationApply: runInitializationApply, standaloneInit: async ({ client: targetClient, emit: targetEmit }) => { const plan = await targetClient.initializationPlan(); if (argv.includes("--dry-run")) { targetEmit({ ok: plan.data?.database === "elera_meta", operation: "standalone-init", status: "planned", data: plan.data ?? plan }); return plan.data?.database === "elera_meta" ? 0 : 1; } targetEmit(await targetClient.initializationApply()); return 0; }, configApply: runConfigApply, metadataInitialize: runMetadataInitialize, reconcile: runReconcile, databaseCreate: runDatabaseCreate, databasePlan: runDatabasePlan, databaseVerify: runDatabaseVerify, identityCreate: runIdentityCreate, identityRotate: runIdentityRotate, accountCreate: runAccountCreate, accountRevoke: runAccountRevoke, accountVerify: runAccountVerify, tokenCreate: runTokenCreate, tokenRevoke: runTokenRevoke, tokenRotate: runTokenRotate, recoveryAcknowledge: runRecoveryAcknowledge, recoveryAbort: runRecoveryAbort, routingRebalance: runRoutingRebalance, coldRecoveryAuthorize: runColdRecoveryAuthorize, coldRecoveryBootstrap: runColdRecoveryBootstrap, coldRecoveryComplete: runColdRecoveryComplete } });
    if (managementResult !== undefined) return managementResult;
    if (command === "cold-bootstrap" || command === "cold-recover") {
      const result = await runColdBootstrap({ client: controlClient, confirm: argv.includes("--confirm"), dryRun: argv.includes("--dry-run"), operationId: argv.find((value) => value.startsWith("--operation-id="))?.split("=")[1] });
      emit(result);
      return result.ok === false ? 1 : 0;
    }
    const lifecycle = createLifecycleCommands({ client, timeoutMs: Number(environment.ELERA_DRAIN_TIMEOUT_MS ?? 60000) });
    const lifecycleResult = await dispatchLifecycle({ command, client, controlClient, lifecycle, emit, target: targetHost ?? argv[1], lifecycleCommands, handlers: { bootstrap: runClusterBootstrap, join: runClusterJoin, rejoin: async ({ client: targetClient, emit: targetEmit }) => { targetEmit(await targetClient.rejoin()); return 0; }, drain: runDrain, undrain: runUndrain, drainStatus: runDrainStatus, stop: runStop, status: runLifecycleStatus, recover: runLifecycleRecover } });
    if (lifecycleResult !== undefined) return lifecycleResult;
    if (command === "config-plan") return await runConfigPlan({ client, emit });
    if (command === "backup-plan") return await runBackupPlan({ client, emit, value: argv[1] });
    if (command === "restore-plan") return await runRestorePlan({ client, emit, value: argv[1] });
    if (command === "cluster-plan") {
      try { return await runClusterPlan({ client, emit, action: argv[1], target: argv[2] }); } catch (error) { errorOutput.write(`${error.message}\n`); return error.exitCode; }
    }
    return await runSqlSmoke({ client, createLive, createDb, emit, config });
  } catch (error) {
    errorOutput.write(`${error.message}\n`);
    return error.statusCode === 401 || error.statusCode === 403
      ? exitCodes.auth
      : (error.exitCode ?? exitCodes.network);
  }
}
