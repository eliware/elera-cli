export async function runAccountVerify({ client, emit, user, host = '%' }) { emit(await client.verifyAccount({ user, host })); return 0; }
