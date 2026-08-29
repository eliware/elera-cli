export async function runTokenRevoke({ client, emit, token }) { emit(await client.revokeToken(token)); return 0; }
