import { exitCodes } from '../operations/exit-codes.mjs';
import { helpPaths, parseArguments } from './parser.mjs';
import { schemaFor } from './command-spec.mjs';
import { suggestCommand } from './command-tree.mjs';

export function handleEarlyExit({ argv, parsed = parseArguments(argv), emit, output, errorOutput }) {
  if (argv[0] === '--version') {
    output.write('0.1.0\n');
    return 0;
  }
  if (parsed.help) {
    if (parsed.path.length === 0) emit(`elera-cli commands: ${helpPaths().join(' ')}`);
    else if (parsed.path.length === 1) emit({ ok: true, command: parsed.path.join(' '), commands: helpPaths(parsed.path) });
    else emit({ ok: true, command: parsed.path.join(' '), canonical: parsed.command, commands: helpPaths([parsed.path[0]]), positional: schemaFor(parsed.command).label, options: schemaFor(parsed.command).options });
    return 0;
  }
  if (parsed.errors.length > 0) {
    errorOutput.write(`${parsed.errors.join('\n')}\n`);
    return exitCodes.invalid;
  }
  if (parsed.command === undefined) {
    if (argv.length === 0) { emit('elera-cli --help'); return 0; }
    const suggestion = suggestCommand(parsed.path);
    errorOutput.write(`unknown command: ${parsed.path.join(' ')}${suggestion ? `; did you mean ${suggestion}?` : ''}\n`);
    return exitCodes.invalid;
  }
  return undefined;
}
