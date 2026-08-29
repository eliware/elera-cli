import { commandNames, schemaFor, validateArguments } from '../../src/cli/command-spec.mjs';

test('provides a schema for every registered command', () => {
  expect(commandNames().every((command) => schemaFor(command).options.includes('json'))).toBe(true);
});

test('accepts complete arguments and rejects incomplete arguments', () => {
  expect(validateArguments('telemetry-detail', ['app'])).toEqual([]);
  expect(validateArguments('telemetry-detail', [])).toEqual(['telemetry-detail requires a application']);
  expect(validateArguments('not-registered', [])).toEqual([]);
});
