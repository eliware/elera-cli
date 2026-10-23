import { sqlConnection } from "./connection.mjs";

export async function runSqlDump({ client, config, database, output, dump }) {
  await dump(await sqlConnection(client, config.token, database), output);
  return 0;
}

export async function runSqlRestore({ client, config, database, input, restore }) {
  await restore(await sqlConnection(client, config.token, database), input);
  return 0;
}
