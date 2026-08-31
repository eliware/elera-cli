export async function runColdRecoveryEvidence({ client, emit }) { const result = await client.coldRecoveryEvidence(); emit(result); return result.ok === false ? 1 : 0; }
