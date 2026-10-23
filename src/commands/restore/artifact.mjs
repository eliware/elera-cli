export async function runRestoreArtifact({
  client,
  restoreArtifact,
  emit,
  database,
  identity,
  root,
}) {
  const result = await restoreArtifact({
    root,
    client,
    lease: () => client.lease(database, identity),
    confirm: true,
  });
  emit({ ok: true, operation: "restore-artifact", data: result });
  return 0;
}
