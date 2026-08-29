export async function runAccountList({ client, emit }) { emit(await client.accounts()); return 0; }
