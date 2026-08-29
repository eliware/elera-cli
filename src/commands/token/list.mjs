export async function runTokenList({ client, emit }) { emit(await client.tokens()); return 0; }
