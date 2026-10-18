import { runProcess } from "../runtime/process.mjs";
import { mysqlArgs } from "./mysql-args.mjs";
export async function discoverDatabases({
  credentialsFile,
  host,
  mysql = "mysql",
  run = runProcess,
}) {
  const result = await run(mysql, [
    ...mysqlArgs(credentialsFile, host),
    "-N",
    "-e",
    "SHOW DATABASES",
  ]);
  return result.stdout
    .split(/\r?\n/)
    .map((name) => name.trim())
    .filter(Boolean);
}
