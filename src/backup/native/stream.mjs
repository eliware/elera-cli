import { createReadStream, createWriteStream } from "node:fs";
import { runNative } from "../native-process.mjs";
import { normalizeBundleCredentials } from "../bundle-credentials.mjs";

export function dumpDatabase(bundle, destination, { runImpl = runNative } = {}) {
  const profile = normalizeBundleCredentials(bundle);
  const file = typeof destination === "string" ? createWriteStream(destination) : destination;
  return runImpl(
    "mariadb-dump",
    [
      "--host",
      profile.host,
      "--port",
      String(profile.port ?? 3306),
      "--user",
      profile.username,
      "--single-transaction",
      "--routines",
      "--events",
      profile.database,
    ],
    { env: { MYSQL_PWD: profile.password }, output: file },
  );
}

export function restoreDatabase(bundle, source, { runImpl = runNative } = {}) {
  const profile = normalizeBundleCredentials(bundle);
  const file = typeof source === "string" ? createReadStream(source) : source;
  return runImpl(
    "mariadb",
    [
      "--host",
      profile.host,
      "--port",
      String(profile.port ?? 3306),
      "--user",
      profile.username,
      profile.database,
    ],
    { env: { MYSQL_PWD: profile.password }, input: file },
  );
}
