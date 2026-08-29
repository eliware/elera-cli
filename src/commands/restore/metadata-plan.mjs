export async function runRestoreMetadataPlan({ client, emit, value }) { const result = await client.restoreMetadataPlan(JSON.parse(value ?? '{}')); emit(result); return result.ok === false ? 1 : 0; }
