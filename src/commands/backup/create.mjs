export async function runBackup({
  client,
  createBackup,
  emit,
  database,
  identity,
  root,
  databases,
  token,
}) {
  const connection = client.sqlConnection ? await client.sqlConnection() : null;
  const sql = connection?.data;
  const rootAccount = sql?.username === "elera_root";
  const bundle = rootAccount
    ? { ...sql, password: token, database: "elera_meta" }
    : await client.lease(database, identity);
  const metadata = {
    ...(await client.metadataExport()).data,
    accounts: (await client.exportAccounts()).accounts ?? [],
  };
  const result = await createBackup({
    bundle,
    backupRoot: root,
    databases: rootAccount
      ? [...new Set([...metadataDatabases(metadata), "elera_meta"])]
      : (databases ?? [database]),
    metadata,
  });
  emit({ ok: true, operation: "backup", data: result });
  return 0;
}

const metadataDatabases = (metadata) => metadata.databases.map((item) => item.physical_name);
