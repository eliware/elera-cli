export async function sqlConnection(client, password, database) {
  const envelope = await client.sqlConnection();
  const connection = envelope.data ?? envelope;
  if (!connection.host || !connection.username)
    throw new Error("SQL connection details are unavailable for this token");
  return { ...connection, password, database };
}
