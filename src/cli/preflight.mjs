import { exitCodes } from "../operations/exit-code-table.mjs";
import { shouldPlan, requiresConfirmation } from "./policy.mjs";

export function runPreflight({ command, argv, operationId, emit, errorOutput }) {
  if (
    ["cold-bootstrap", "cold-recover"].includes(command) &&
    !argv.includes("--confirm") &&
    !argv.includes("--dry-run")
  ) {
    errorOutput.write(`${command} requires --confirm or --dry-run\n`);
    return exitCodes.invalid;
  }
  if (shouldPlan({ command, argv })) {
    emit({
      ok: true,
      operation: command,
      status: "planned",
      operationId: operationId ?? null,
      data: { arguments: argv.slice(1).filter((value) => !value.startsWith("--")) },
    });
    return 0;
  }
  if (!requiresConfirmation({ command, argv })) return undefined;
  errorOutput.write(`${command} requires --confirm\n`);
  return exitCodes.invalid;
}
