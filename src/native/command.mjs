import { runNativeClient } from "./client.mjs";

export async function runNativeCommand({ client, kind, args, run = runNativeClient }) {
  if (!client || typeof client.routingBundle !== "function")
    throw new TypeError("supervisor client is required");
  if (!["sql", "dump"].includes(kind)) throw new TypeError("native client kind is invalid");
  const bundle = await client.routingBundle();
  const route = bundle.writer;
  if (
    !route?.host ||
    !route?.port ||
    !bundle.credentials?.username ||
    !bundle.credentials?.password
  )
    throw new Error("routing bundle does not contain native SQL connection details");
  return run({
    binary: kind === "dump" ? "mysqldump" : "mysql",
    args,
    connection: {
      host: route.host,
      port: route.port,
      username: bundle.credentials.username,
      password: bundle.credentials.password,
    },
  });
}
