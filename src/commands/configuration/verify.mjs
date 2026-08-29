export async function runConfigVerify({ client, emit }) { emit(await client.verify()); return 0; }
