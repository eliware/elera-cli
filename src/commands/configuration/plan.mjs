export async function runConfigPlan({ client, emit }) { const result = await client.intent(); emit(await client.plan(result.data?.intent)); return 0; }
