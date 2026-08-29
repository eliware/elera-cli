export async function runInitializationVerify({ client, emit }) { const result = await client.initializationVerify(); emit(result); return result.ok === false ? 1 : 0; }
