export async function runSecretList({ client, emit }) { emit(await client.listSecrets()); return 0; }
