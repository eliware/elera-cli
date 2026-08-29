export async function runMetadataStatus({ client, emit }) { emit(await client.metadataStatus()); return 0; }
