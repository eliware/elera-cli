import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";

export function normalizeBundleCredentials(bundle) {
  const profile = {
    ...bundle,
    ...bundle?.credentials,
    host: bundle?.host ?? bundle?.routes?.primary?.[0]?.host,
    port: bundle?.port ?? bundle?.routes?.primary?.[0]?.port,
  };
  if (!profile.username || !profile.password || !profile.database || !profile.host)
    throw new TypeError("connection bundle credentials are required");
  return profile;
}

export async function withBundleCredentials(bundle, operation) {
  const profile = normalizeBundleCredentials(bundle);
  const directory = await mkdtemp(join(tmpdir(), "elera-cli-"));
  const file = join(directory, "my.cnf");
  await writeFile(
    file,
    `[client]\nhost=${profile.host}\nport=${profile.port ?? 3306}\nuser=${profile.username}\npassword=${profile.password}\n`,
    { mode: 0o600 },
  );
  try {
    return await operation(file, profile);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}
