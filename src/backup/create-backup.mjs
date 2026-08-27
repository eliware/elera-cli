import { createWriteStream } from "node:fs";
import {
  mkdtemp,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { join } from "node:path";
import { createGzip, gunzip } from "node:zlib";
import { spawn } from "node:child_process";
import { pipeline } from "node:stream/promises";
import { promisify } from "node:util";
import { applicationDatabases, manifestText, sha256 } from "./manifests.mjs";
import { dumpArgs } from "../database/commands.mjs";
import { rotateBackups } from "./rotate-backups.mjs";

const testGzip = promisify(gunzip);
export function dumpToGzip(binary, args, destination) {
  return new Promise((resolve, reject) => {
    const child = spawn(binary, args, {
      shell: false,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => {
      stderr += chunk;
    });
    const exited = new Promise((done, fail) =>
      child.once("close", (code) =>
        code === 0
          ? done()
          : fail(new Error(stderr.trim() || `dump exited with ${code}`)),
      ),
    );
    Promise.all([
      pipeline(child.stdout, createGzip(), createWriteStream(destination)),
      exited,
    ]).then(() => resolve(), reject);
    child.once("error", reject);
  });
}
export async function createBackup({
  backupRoot,
  databases,
  credentialsFile,
  host,
  mysqlDump = "mysqldump",
  mktemp = mkdtemp,
  dump = dumpToGzip,
  lock,
  notify = async () => {},
  rotate = rotateBackups,
}) {
  const eligible = applicationDatabases(databases);
  if (!eligible.length) throw new Error("No eligible databases backed up.");
  let acquired;
  let staging;
  try {
    acquired = lock ? await lock() : undefined;
    await mkdir(backupRoot, { recursive: true });
    staging = await mktemp(join(backupRoot, ".staging-"));
    const entries = [];
    for (const database of eligible) {
      const path = join(staging, `${database}.sql.gz`);
      await dump(mysqlDump, dumpArgs(credentialsFile, host, database), path);
      await testGzip(await readFile(path));
      entries.push({ hash: await sha256(path), name: `${database}.sql.gz` });
    }
    await writeFile(join(staging, "DATABASES"), `${eligible.join("\n")}\n`);
    await writeFile(join(staging, "SHA256SUMS"), manifestText(entries));
    const latest = join(backupRoot, "1");
    await rotate({ backupRoot, keep: 7 });
    await rename(staging, latest);
    return { path: latest, databases: eligible };
  } catch (error) {
    await (staging
      ? rm(staging, { recursive: true, force: true })
      : Promise.resolve());
    await notify(error instanceof Error ? error.message : String(error));
    throw error;
  } finally {
    await acquired?.release();
  }
}
