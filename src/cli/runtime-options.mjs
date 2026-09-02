import { isDirectedCommand } from './policy.mjs';

export function deriveRuntimeOptions({ argv, command, parsed }) {
  const commandArgv = parsed.argv;
  const operationId = parsed.options?.['operation-id'] ?? commandArgv.find((value) => value.startsWith('--operation-id='))?.slice('--operation-id='.length);
  const explicitTarget = commandArgv
    .find((value) => value.startsWith('--target-endpoint='))
    ?.slice('--target-endpoint='.length);
  const targetHost = isDirectedCommand(command) && parsed.positional[0] && !parsed.positional[0].startsWith('--')
    ? parsed.positional[0]
    : undefined;
  return {
    commandArgv,
    jsonOutput: argv.includes('--json'),
    operationId,
    explicitTarget,
    targetHost,
  };
}
