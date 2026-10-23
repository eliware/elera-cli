export async function runRestoreArtifact({
  client,
  restoreArtifact,
  emit,
  database,
  identity,
  root,
  token,
}) {
  const connectionEnvelope = client.sqlConnection ? await client.sqlConnection() : null;
  const connection = connectionEnvelope?.data ?? connectionEnvelope;
  const rootBundle =
    connection?.username === "elera_root"
      ? { ...connection, password: token, database: "elera_meta" }
      : undefined;
  const result = await restoreArtifact({
    root,
    client,
    lease: () => rootBundle ?? client.lease(database, identity),
    confirm: true,
  });
  emit({ ok: true, operation: "restore-artifact", data: result });
  return 0;
}
