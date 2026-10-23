import { loadCliConfig } from "../config.mjs";
import { createSupervisorClient } from "../supervisor-client.mjs";
import { dumpDatabase, restoreDatabase } from "../backup/native/stream.mjs";
import {
  createBackupFromBundle,
  verifyBackupFromBundle,
  restoreVerifyFromBundle,
} from "../backup/db-backups-adapter.mjs";
import { restoreArtifact } from "../restore/artifact/restore.mjs";
import { exitCodes } from "../operations/exit-code-table.mjs";
import { formatHuman } from "../output/format.mjs";
import { parseArguments } from "./parser.mjs";
import { deriveRuntimeOptions } from "./runtime-options.mjs";
import { runPreflight } from "./preflight.mjs";
import { handleEarlyExit } from "./early-exit.mjs";
import { createClientContext, resolveTargetEndpoint } from "./client-context.mjs";
import { dispatchPrimaryCommands } from "./dispatch/primary-commands.mjs";
import { dispatchFinalCommands } from "./dispatch/final-commands.mjs";
import { runNativeCommand } from "../native/command.mjs";

export async function runCli({
  argv = process.argv.slice(2),
  environment = process.env,
  output = process.stdout,
  errorOutput = process.stderr,
  dependencies = {},
} = {}) {
  const supervisorClient = dependencies.createSupervisorClient ?? createSupervisorClient;
  const runNative = dependencies.runNativeCommand ?? runNativeCommand;
  const dump = dependencies.dumpDatabase ?? dumpDatabase;
  const restore = dependencies.restoreDatabase ?? restoreDatabase;
  const createBackup = dependencies.createBackupFromBundle ?? createBackupFromBundle;
  const verifyBackup = dependencies.verifyBackupFromBundle ?? verifyBackupFromBundle;
  const restoreVerify = dependencies.restoreVerifyFromBundle ?? restoreVerifyFromBundle;
  const restoreArtifactOperation = dependencies.restoreArtifact ?? restoreArtifact;
  if (argv[0] === "sql" || argv[0] === "dump") {
    try {
      const config = loadCliConfig(environment);
      const client = supervisorClient(config);
      return await runNative({ client, kind: argv[0], args: argv.slice(1) });
    } catch (error) {
      errorOutput.write(`${error.message}\n`);
      return error.statusCode === 401 || error.statusCode === 403
        ? exitCodes.auth
        : (error.exitCode ?? exitCodes.network);
    }
  }
  const parsed = parseArguments(argv);
  const command = parsed.command;
  const { commandArgv, jsonOutput, operationId, explicitTarget, targetHost } = deriveRuntimeOptions(
    { argv, command, parsed },
  );
  const emit = (value) =>
    output.write(jsonOutput ? JSON.stringify(value) + "\n" : formatHuman(value) + "\n");
  const earlyExit = handleEarlyExit({ argv, parsed, emit, output, errorOutput });
  if (earlyExit !== undefined) return earlyExit;
  argv = commandArgv;
  const preflight = runPreflight({ command, argv: commandArgv, operationId, emit, errorOutput });
  if (preflight !== undefined) return preflight;
  try {
    const config = loadCliConfig(environment);
    const targetEndpoint = resolveTargetEndpoint({ config, explicitTarget, targetHost });
    const { client, controlClient } = createClientContext({
      config,
      createClient: supervisorClient,
      targetEndpoint,
      operationId,
    });
    const positional = parsed.positional;
    const commandDependencies = {
      age: dependencies.age,
      materialize: dependencies.materialize,
      dump,
      restore,
      createBackup,
      verifyBackup,
      restoreVerify,
      restoreArtifact: restoreArtifactOperation,
      migrationDiagnostics: dependencies.migrationDiagnostics,
      createLiveDb: dependencies.createLiveDb,
      createDb: dependencies.createDb,
    };
    const primaryResult = await dispatchPrimaryCommands({
      command,
      client,
      controlClient,
      emit,
      args: positional,
      config,
      dependencies: commandDependencies,
      environment,
      argv,
      parsed,
      operationId,
    });
    if (primaryResult !== undefined) return primaryResult;
    return dispatchFinalCommands({
      command,
      client,
      controlClient,
      emit,
      argv,
      environment,
      dependencies,
      targetHost,
      errorOutput,
    });
  } catch (error) {
    errorOutput.write(`${error.message}\n`);
    return error.statusCode === 401 || error.statusCode === 403
      ? exitCodes.auth
      : (error.exitCode ?? exitCodes.network);
  }
}
