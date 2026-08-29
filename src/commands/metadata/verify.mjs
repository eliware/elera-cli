export async function runMetadataVerify({ client, emit }) { const result = await client.metadataVerify(); emit(result); return result.ok ? 0 : 1; }
