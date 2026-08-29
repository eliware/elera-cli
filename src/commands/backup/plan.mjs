export async function runBackupPlan({ client, emit, value }) {
  const desired = JSON.parse(value ?? '{}');
  emit(await client.planBackup(desired));
  return 0;
}
