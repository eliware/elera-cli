export async function runConfigApply({ client, emit }) {
  const result = await client.intent();
  const applied = await client.apply(result.data?.intent);
  emit(applied);
  return applied?.ok === true ? 0 : 1;
}
