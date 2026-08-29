export async function runIdentityList({ client, emit, application }) { emit(await client.identities(application)); return 0; }
