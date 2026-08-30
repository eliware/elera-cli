export async function runStandaloneInitialization({ client, emit }) {
  const result = await client.initializationApply();
  emit(result);
  return result.ok === false ? 1 : 0;
}
