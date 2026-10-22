import { schemaFor } from "../command/spec.mjs";

const flags = new Set(["--confirm", "--dry-run", "--json", "--quiet", "--verbose", "--once"]);
const valueOptions = new Set(["--operation-id", "--target", "--target-endpoint"]);
const commonOptions = new Set([...flags, "--help", "-h", ...valueOptions]);

function closestOption(value, knownOptions) {
  const candidate = [...knownOptions].find((option) => option.startsWith(value.slice(0, 5)));
  return candidate ? `. Did you mean ${candidate}?` : "";
}

export function normalizeOptions(values, command) {
  const normalized = [];
  const options = {};
  const errors = [];
  const schema = schemaFor(command);
  const commandOptions = new Set(schema.options.map((option) => `--${option}`));
  const knownOptions = new Set([...commonOptions, ...commandOptions]);
  const commandValueOptions = new Set([
    ...valueOptions,
    ...schema.options
      .filter(
        (option) =>
          (!flags.has(`--${option}`) ||
            command === "node-reset-data" ||
            command === "node-resync") &&
          !valueOptions.has(`--${option}`),
      )
      .map((option) => `--${option}`),
  ]);
  for (let index = 0; index < values.length; index += 1) {
    const value = values[index];
    if (!value.startsWith("--")) {
      normalized.push(value);
      continue;
    }
    const [name, ...inline] = value.split("=");
    if (!knownOptions.has(name))
      errors.push(`unknown option: ${name}${closestOption(name, knownOptions)}`);
    if (
      commandValueOptions.has(name) &&
      inline.length === 0 &&
      (!values[index + 1] || values[index + 1].startsWith("-"))
    ) {
      errors.push(`option requires a value: ${name}`);
      normalized.push(value);
      continue;
    }
    if (
      commandValueOptions.has(name) &&
      inline.length === 0 &&
      values[index + 1] &&
      !values[index + 1].startsWith("-")
    ) {
      const optionValue = values[++index];
      normalized.push(`${name}=${optionValue}`);
      options[name.slice(2)] = optionValue;
      continue;
    }
    normalized.push(value);
    if (inline.length > 0) {
      options[name.slice(2)] = inline.join("=");
      if (commandValueOptions.has(name) && options[name.slice(2)] === "")
        errors.push(`option requires a value: ${name}`);
    }
  }
  return { normalized, options, errors, flags };
}
