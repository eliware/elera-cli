import { spawn } from "node:child_process";
import { once } from "node:events";
import { createEncryptedArtifactStore } from "./encrypted-store.mjs";

function runProcess(command, args, spawnImpl) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, { stdio: "inherit" });
    child.once("error", reject);
    once(child, "close").then(([code]) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} exited with code ${code}`));
    });
  });
}

export function createMaterializeCommand({ client, age, spawnImpl = spawn } = {}) {
  const store = createEncryptedArtifactStore({
    api: client,
    encrypt: age?.encrypt,
    decrypt: age?.decrypt,
  });
  return async function materialize(name, command, args = []) {
    if (!name || !command) throw new TypeError("secret-materialize requires name and command");
    return store.withMaterialized(name, (path) => runProcess(command, [...args, path], spawnImpl));
  };
}
