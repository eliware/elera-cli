import { readdir } from "node:fs/promises";
import { generate as generateSnowflake } from "@eliware/snowflake";
import { connect, sshExec } from "@eliware/ssh-client";
import { withRetry } from './retry.mjs';
import { prepareStaging, finalizeStaging } from './nas-staging.mjs';

export { withRetry } from './retry.mjs';
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
