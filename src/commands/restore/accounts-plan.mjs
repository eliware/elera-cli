export async function runRestoreAccountsPlan({ client, emit, value }) { const result = await client.restoreAccountsPlan(JSON.parse(value ?? '[]')); emit(result); return result.ok === false ? 1 : 0; }
