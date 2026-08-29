export async function runDatabaseVerify({ client, emit, value }) {
  const desired = JSON.parse(value ?? '{}');
  const result = await client.verifyDatabases(desired);
  emit(result);
  return result.ok === false ? 1 : 0;
}
