import { expect, test } from "@jest/globals";
import { createGitOpsInputs } from "../src/artifacts/gitops-inputs.mjs";

test("resolves mounted input paths without reading their contents", async () => {
    const checked = [];
    const inputs = createGitOpsInputs({
      environment: {
        ELERA_SSH_KEY_PATH: "/run/secrets/ssh",
        ELERA_KNOWN_HOSTS_PATH: "/run/secrets/known_hosts",
        ELERA_TLS_CERTIFICATE_PATH: "/run/secrets/tls",
        ELERA_BACKUP_CONFIG_PATH: "/run/config/backup",
      },
      check: async (path) => checked.push(path),
    });
    await expect(inputs.resolve()).resolves.toEqual({
      sshKey: "/run/secrets/ssh",
      knownHosts: "/run/secrets/known_hosts",
      tlsCertificate: "/run/secrets/tls",
      backupConfig: "/run/config/backup",
    });
    expect(checked).toEqual([
      "/run/secrets/ssh",
      "/run/secrets/known_hosts",
      "/run/secrets/tls",
      "/run/config/backup",
    ]);
});

test("returns an empty set when no optional mounts are configured", async () => {
  await expect(createGitOpsInputs({ environment: {} }).resolve()).resolves.toEqual({});
});
