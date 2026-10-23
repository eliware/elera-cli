import { randomUUID } from "node:crypto";

export async function applyArtifactMetadata(metadata, client) {
  const accounts = metadata.accounts ?? [];
  await client.restoreMetadataApply(
    {
      databases: metadata.databases ?? [],
      identities: metadata.identities ?? [],
      ...(metadata.metadataSnapshot ? { metadataSnapshot: metadata.metadataSnapshot } : {}),
    },
    { idempotencyKey: randomUUID() },
  );
  if (accounts.length)
    await client.restoreAccountsApply(accounts, { idempotencyKey: randomUUID() });
  for (const artifact of metadata.artifacts ?? []) await client.putSecret(artifact.name, artifact);
  return accounts.length;
}
