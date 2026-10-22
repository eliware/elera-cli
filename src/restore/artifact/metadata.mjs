export async function applyArtifactMetadata(metadata, client) {
  const accounts = metadata.accounts ?? [];
  await client.restoreMetadataApply({
    databases: metadata.databases ?? [],
    identities: metadata.identities ?? [],
  });
  if (accounts.length) await client.restoreAccountsApply(accounts);
  for (const artifact of metadata.artifacts ?? []) await client.putSecret(artifact.name, artifact);
  return accounts.length;
}
