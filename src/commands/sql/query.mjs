import { sqlConnection } from "./connection.mjs";
import { runProcess } from "../../runtime/process.mjs";

export async function runSqlQuery({
  client,
  config,
  query,
  output,
  errorOutput = process.stderr,
  run = runProcess,
}) {
  if (typeof query !== "string" || !query.trim()) throw new TypeError("sql requires a query");
  const profile = await sqlConnection(client, config.token);
  const result = await run(
    "mariadb",
    [
      "--host",
      profile.host,
      "--port",
      String(profile.port ?? 3306),
      "--user",
      profile.username,
      "-e",
      query,
    ],
    { env: { MYSQL_PWD: profile.password } },
  );
  output.write(result.stdout);
  if (result.stderr) errorOutput.write(result.stderr);
  return 0;
}
