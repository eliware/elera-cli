import { access } from "node:fs/promises";

const inputNames = ["sshKey", "knownHosts", "tlsCertificate", "backupConfig"];

export function createGitOpsInputs({ environment = process.env, check = access } = {}) {
  return {
    async resolve() {
      const inputs = Object.fromEntries(
        inputNames
          .map((name) => [name, environment[`ELERA_${name.replace(/[A-Z]/g, (c) => `_${c}`).toUpperCase()}_PATH`]])
          .filter(([, path]) => path),
      );
      for (const path of Object.values(inputs)) await check(path);
      return inputs;
    },
  };
}
