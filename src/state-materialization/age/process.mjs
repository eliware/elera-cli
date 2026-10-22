import { spawn } from "node:child_process";
import { runAge } from "./runner.mjs";

export function createAgeProcess({ spawnImpl = spawn, environment = process.env } = {}) {
  return {
    async encrypt(plaintext, recipient) {
      recipient ??= environment.AGE_RECIPIENT;
      if (!recipient) throw new TypeError("age recipient is required");
      return runAge(["-a", "-r", recipient], String(plaintext), {
        spawnImpl,
        environment,
      });
    },
    async decrypt(ciphertext, identityFile) {
      identityFile ??= environment.AGE_IDENTITY_FILE;
      if (!identityFile) throw new TypeError("age identity file is required");
      return runAge(["-d", "-i", identityFile], String(ciphertext), {
        spawnImpl,
        environment,
      });
    },
  };
}
