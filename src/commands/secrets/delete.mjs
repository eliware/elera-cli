export async function runSecretDelete({ client, emit, name }) { emit(await client.removeSecret(name)); return 0; }
