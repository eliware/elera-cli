export async function runRestorePlan({ client, emit, value }) {
  const desired = JSON.parse(value ?? '{}');
  emit(await client.planRestore(desired));
  return 0;
}
