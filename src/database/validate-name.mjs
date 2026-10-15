export function validateDatabaseName(database) {
  if (!/^[A-Za-z0-9_$-]+$/.test(database)) throw new Error(`Invalid database name: ${database}`);
  return database;
}
