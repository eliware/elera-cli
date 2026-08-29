export async function runDatabasePlan({ client, emit, value }) {
  const desired = JSON.parse(value ?? '{}');
  emit(await client.planDatabases(desired));
  return 0;
}
