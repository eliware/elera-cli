import { resolveCommand, helpFor } from './command-tree.mjs';
import { schemaFor, validateArguments } from './command-spec.mjs';

const flags = new Set(['--confirm', '--dry-run', '--json', '--quiet', '--verbose', '--once']);
const valueOptions = new Set(['--operation-id', '--target', '--target-endpoint']);
const commonOptions = new Set([...flags, '--help', '-h', ...valueOptions]);

function closestOption(value, knownOptions) {
  const candidate = [...knownOptions].find((option) => option.startsWith(value.slice(0, 5)));
  return candidate ? `; did you mean ${candidate}?` : '';
}

function normalizeOptions(values, command) {
  const normalized = [];
  const options = {};
  const errors = [];
  const schema = schemaFor(command);
  const commandOptions = new Set(schema.options.map((option) => `--${option}`));
  const knownOptions = new Set([...commonOptions, ...commandOptions]);
  const commandValueOptions = new Set([
    ...valueOptions,
    ...schema.options
      .filter((option) => (!flags.has(`--${option}`) || command === 'node-reset-data' || command === 'node-resync') && !valueOptions.has(`--${option}`))
      .map((option) => `--${option}`),
  ]);
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith('--')) {
      normalized.push(value);
      continue;
    }
    const [name, ...inline] = value.split('=');
    if (!knownOptions.has(name)) {
      errors.push(`unknown option: ${name}${closestOption(name, knownOptions)}`);
    }
    if (commandValueOptions.has(name) && inline.length === 0 && (!values[index + 1] || values[index + 1].startsWith('-'))) {
      errors.push(`option requires a value: ${name}`);
      normalized.push(value);
      continue;
    }
    if (commandValueOptions.has(name) && inline.length === 0 && values[index + 1] && !values[index + 1].startsWith('-')) {
      const optionValue = values[++index];
      normalized.push(`${name}=${optionValue}`);
      options[name.slice(2)] = optionValue;
      continue;
    }
    normalized.push(value);
    if (inline.length > 0) {
      options[name.slice(2)] = inline.join('=');
      if (commandValueOptions.has(name) && options[name.slice(2)] === '') errors.push(`option requires a value: ${name}`);
    }
  }
  return { normalized, options, errors };
}

export function parseArguments(argv = []) {
  const values = [...argv];
  const path = [];
  while (values.length && !values[0].startsWith('-') && path.length < 2) {
    if (path.length === 1 && helpFor([path[0]]).length === 0) break;
    path.push(values.shift());
    if (path.length === 2) break;
    if (values.length === 0 || values[0].startsWith('-')) break;
  }
  const command = resolveCommand(path);
  const { normalized, options, errors } = normalizeOptions(values, command);
  const help = normalized.includes('--help') || normalized.includes('-h');
  const positional = normalized.filter((value) => !value.startsWith('--'));
  const parsedFlags = new Set(normalized.filter((value) => flags.has(value)));
  return { path, command, positional, flags: parsedFlags, options, errors: [...errors, ...validateArguments(command, positional)], help, argv: command ? [command, ...normalized] : argv };
}

export function helpPaths(path = []) { return helpFor(path); }
