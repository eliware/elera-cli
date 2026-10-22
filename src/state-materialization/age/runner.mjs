import { once } from "node:events";

export async function runAge(args, input, { spawnImpl, environment }) {
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
  if (code !== 0) throw new Error(Buffer.concat(errors).toString() || `age exited with ${code}`);
  return Buffer.concat(output).toString();
}
