export async function runSecretGet({ client, emit, name }) { emit(await client.getSecret(name)); return 0; }
