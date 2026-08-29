export async function runAccountRevoke({ client, emit, user, host = '%' }) { emit(await client.revokeAccount({ user, host })); return 0; }
