import { readdir } from "node:fs/promises";
import { generate as generateSnowflake } from "@eliware/snowflake";
import { connect, sshExec } from "@eliware/ssh-client";

const quote = (value) => `'${String(value).replaceAll("'", "'\\''")}'`;
export async function withRetry(
  operation,
  { attempts = 3, delayMs = 250 } = {},
) {
  let last;
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      last = error;
      if (attempt < attempts)
        await new Promise((resolve) => setTimeout(resolve, delayMs * attempt));
    }
  }
  throw last;
}
export async function syncToNas({
  localPath,
  remotePath,
  sshOptions,
  rotateCommand,
  sshConnect = connect,
  sshRun = sshExec,
  list = readdir,
  retry = withRetry,
  dryRun = false,
  prepareRemote = true,
  finalizeRemote = true,
  notify = async () => {},
  stagePath = `${remotePath}.staging-${process.pid}-${generateSnowflake()}`,
}) {
  if (dryRun) return remotePath;
  try {
    await retry(async () => {
      await (prepareRemote
        ? prepareStaging({ sshOptions, stagePath, sshRun })
        : Promise.resolve());
      const connection = await sshConnect(sshOptions);
      try {
        for (const entry of await list(localPath))
          if (entry.isFile?.() ?? true)
            await connection.upload(
              `${localPath}/${entry.name ?? entry}`,
              `${stagePath}/${entry.name ?? entry}`,
            );
      } finally {
        await connection.close?.();
      }
      await (finalizeRemote
        ? finalizeStaging({
            sshOptions,
            stagePath,
            remotePath,
            rotateCommand,
            sshRun,
          })
        : Promise.resolve());
    });
    return remotePath;
  } catch (error) {
    await notify(error instanceof Error ? error.message : String(error));
    throw error;
  }
}

async function prepareStaging({ sshOptions, stagePath, sshRun }) {
  const results = await sshRun({
    ...sshOptions,
    commands: [
      `rm -rf -- ${quote(stagePath)}`,
      `mkdir -p -- ${quote(stagePath)}`,
    ],
  });
  if (results.some((result) => result.code && result.code !== 0))
    throw new Error("remote staging preparation failed");
}

async function finalizeStaging({
  sshOptions,
  stagePath,
  remotePath,
  rotateCommand,
  sshRun,
}) {
  const results = await sshRun({
    ...sshOptions,
    commands: [
      `cd ${quote(stagePath)} && sha256sum -c SHA256SUMS`,
      rotateCommand,
      `mv -- ${quote(stagePath)} ${quote(remotePath)}`,
    ],
  });
  if (results.some((result) => result.code && result.code !== 0))
    throw new Error("remote backup finalization failed");
}
