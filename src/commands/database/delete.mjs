export async function runDatabaseDelete({ client, emit, databaseId, confirm, dryRun, idempotencyKey }) {
  emit(await client.deleteDatabase(databaseId, { confirm, dryRun, idempotencyKey }));
  return 0;
}
