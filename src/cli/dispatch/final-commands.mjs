import { createLifecycleCommands } from "../../commands/lifecycle.mjs";
import { runColdBootstrap } from "../../commands/cold-bootstrap.mjs";
import { runConfigPlan } from "../../commands/configuration/plan.mjs";
import { runBackupPlan } from "../../commands/backup/plan.mjs";
import { runRestorePlan } from "../../commands/restore/plan.mjs";
import { runClusterPlan } from "../../commands/cluster/lifecycle.mjs";
import { dispatchLifecycle } from "./lifecycle.mjs";
import { createLifecycleHandlers } from "../handlers/lifecycle.mjs";
import { exitCodes } from "../../operations/exit-code-table.mjs";

export async function dispatchFinalCommands(input) {
  const {
    command,
    client,
    controlClient,
    emit,
    argv,
    environment,
    dependencies,
    targetHost,
    errorOutput,
  } = input;
  if (command === "cold-bootstrap" || command === "cold-recover") {
    const result = await runColdBootstrap({
      client: controlClient,
      confirm: argv.includes("--confirm"),
      dryRun: argv.includes("--dry-run"),
      operationId: argv.find((value) => value.startsWith("--operation-id="))?.split("=")[1],
    });
    emit(result);
    return result.ok === false ? 1 : 0;
  }
  const lifecycle = (dependencies.createLifecycleCommands ?? createLifecycleCommands)({
    client,
    timeoutMs: Number(environment.ELERA_DRAIN_TIMEOUT_MS ?? 60000),
  });
  const lifecycleResult = await dispatchLifecycle({
    command,
    controlClient,
    lifecycle,
    emit,
    target: targetHost ?? argv[1],
    lifecycleCommands: {
      "cluster-bootstrap": "bootstrap",
      "cluster-join": "join",
      "cluster-leave": "leave",
      "cluster-recover": "recover",
    },
    handlers: createLifecycleHandlers(),
  });
  if (lifecycleResult !== undefined) return lifecycleResult;
  if (command === "config-plan") return runConfigPlan({ client, emit });
  if (command === "backup-plan") return runBackupPlan({ client, emit, value: argv[1] });
  if (command === "restore-plan") return runRestorePlan({ client, emit, value: argv[1] });
  if (command === "cluster-plan") return runClusterPlanResult({ client, emit, argv, errorOutput });
  errorOutput.write(`unknown command: ${command}\n`);
  return exitCodes.invalid;
}

async function runClusterPlanResult({ client, emit, argv, errorOutput }) {
  try {
    return await runClusterPlan({ client, emit, action: argv[1], target: argv[2] });
  } catch (error) {
    errorOutput.write(`${error.message}\n`);
    return error.exitCode;
  }
}
