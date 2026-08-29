export async function runConfigApply({ client, emit }) { const result = await client.intent(); emit(await client.apply(result.data?.intent)); return 0; }
