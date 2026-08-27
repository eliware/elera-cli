export function formatHuman(value) {
  if (value === null || value === undefined) return '';
  if (typeof value !== 'object') return String(value);
  return Object.entries(value).map(([key, item]) => key + ': ' + (typeof item === 'object' ? JSON.stringify(item) : item)).join('\n');
}
