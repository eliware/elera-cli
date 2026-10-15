export function runMigrationPending({ action }) {
  throw new Error(`migration action contract pending: ${action}`);
}
