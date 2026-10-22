import { readFile } from "node:fs/promises";
import { mysqlArgs } from "../database/mysql-args.mjs";
import { validateDatabaseName } from "../database/validate-name.mjs";
import { verificationDatabase } from "./verification-database.mjs";
import {
  appendFile,
  createGunzip,
  createReadStream,
  runRestore,
  runSql,
} from "./mysql-process.mjs";

export { runRestore, runSql } from "./mysql-process.mjs";
export async function restoreVerify({
  restoreRoot,
  credentialsFile,
  host = "localhost",
  mysql = "mariadb",
  prefix = "restore_verify_",
  logPath,
  execSql = runSql,
  restore = runRestore,
  read = readFile,
  writeLog = appendFile,
  stream = createReadStream,
  notify = async () => {},
  now = () => new Date().toISOString(),
}) {
  if (logPath) await writeLog(logPath, `restore verification started ${now()}\n`);
  let currentDatabase;
  try {
    const names = (await read(`${restoreRoot}/DATABASES`, "utf8")).split(/\r?\n/).filter(Boolean);
    let count = 0;
    for (const database of names) {
      currentDatabase = database;
      if (["sys", "mysql"].includes(database)) continue;
      validateDatabaseName(database);
      const target = verificationDatabase(database, prefix);
      try {
        await execSql(mysql, [...mysqlArgs(credentialsFile, host), "-e", target.drop]);
        await execSql(mysql, [...mysqlArgs(credentialsFile, host), "-e", target.create]);
        await restore(
          mysql,
          [...mysqlArgs(credentialsFile, host), target.name],
          stream(`${restoreRoot}/${database}.sql.gz`).pipe(createGunzip()),
        );
      } finally {
        await execSql(mysql, [...mysqlArgs(credentialsFile, host), "-e", target.drop]);
      }
      count += 1;
    }
    if (logPath)
      await writeLog(
        logPath,
        `restore verification passed: ${count} application schemas ${now()}\n`,
      );
    return count;
  } catch (error) {
    const message = `restore verification failed${currentDatabase ? ` for ${currentDatabase}` : ""}: ${error instanceof Error ? error.message : String(error)}`;
    if (logPath) await writeLog(logPath, `${message} ${now()}\n`);
    await notify(message);
    throw error;
  }
}
