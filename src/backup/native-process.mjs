import { spawn } from "node:child_process";

export function runNative(command, args, { env, input, output, spawnImpl = spawn } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawnImpl(command, args, {
      // MYSQL_PWD is scoped to the child because MariaDB tools require an
      // environment or option-based password for non-interactive execution.
      env: { ...process.env, ...env },
      stdio: [input ? "pipe" : "ignore", output ? "pipe" : "inherit", "inherit"],
    });
    if (input) input.pipe(child.stdin);
    if (output) child.stdout.pipe(output);
    child.once("error", reject);
    child.once("close", (code, signal) => {
      if (code === 0) resolve({ code });
      else
        reject(
          Object.assign(new Error(`${command} exited with ${code ?? signal}`), {
            code: code ?? 1,
            signal,
          }),
        );
    });
  });
}
