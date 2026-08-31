export function resolveByName(records, name, label) {
  const matches = records.filter((record) => record.name === name || record.id === name);
  if (matches.length === 0) throw new Error(`${label} not found: ${name}`);
  if (matches.length > 1) throw new Error(`${label} is ambiguous: ${name}`);
  return matches[0].id;
}

export function applicationStatusOutput(application) { return { ok: true, operation: 'app-status', data: application }; }
export function databaseDeleteOutput(result) { return { ok: true, operation: 'database-delete', data: result }; }
