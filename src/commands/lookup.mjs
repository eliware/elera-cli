export function resolveByName(records, name, label) {
  const matches = records.filter((record) => record.name === name || record.id === name);
  if (matches.length === 0) throw new Error(`${label} not found: ${name}`);
  if (matches.length > 1) throw new Error(`${label} is ambiguous: ${name}`);
  return matches[0].id;
}
