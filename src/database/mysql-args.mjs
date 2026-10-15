import { validateDatabaseName } from "./validate-name.mjs";
export function mysqlArgs(credentialsFile, host) {
  return [`--defaults-extra-file=${credentialsFile}`, "--host", host];
}
export function dumpArgs(credentialsFile, host, database) {
  return [
    ...mysqlArgs(credentialsFile, host),
    "--single-transaction",
    "--routines",
    "--triggers",
    "--events",
    validateDatabaseName(database),
  ];
}
