export async function runInitializationApply({ client, emit }) {
  const result = await client.initializationApply();
  emit(result);
  return result?.ok === true ? 0 : 1;
}
