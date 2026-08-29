export async function runMetadataInitialize({ client, emit }) { emit(await client.metadataInitialize()); return 0; }
