import { spawn } from "node:child_process";
import { once } from "node:events";

async function runAge(
  args,
  input,
  { spawnImpl = spawn, environment = process.env } = {},
) {
  const child = spawnImpl("age", args, {
    env: environment,
    stdio: ["pipe", "pipe", "pipe"],
  });
  const output = [];
  const errors = [];
  child.stdout.on("data", (chunk) => output.push(chunk));
  child.stderr.on("data", (chunk) => errors.push(chunk));
  child.stdin.end(input);
  const [code] = await once(child, "close");
  if (code !== 0)
    throw new Error(
      Buffer.concat(errors).toString() || `age exited with ${code}`,
    );
  return Buffer.concat(output).toString();
}

export function createAgeProcess({
  spawnImpl = spawn,
  environment = process.env,
} = {}) {
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
