export async function runSecretVerify({ client, emit, name }) { emit(await client.verifySecret(name)); return 0; }
