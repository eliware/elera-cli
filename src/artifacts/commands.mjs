import { readFile } from "node:fs/promises";

export function createArtifactCommands({
  client,
  age,
  read = readFile,
  emit,
} = {}) {
  if (!client || !age || typeof emit !== "function")
    throw new TypeError("artifact command dependencies are required");
  return async function run(command, args = []) {
    if (!command.startsWith("secret-")) return false;
    const name = args[0];
    if (command !== "secret-list" && !name)
      throw new TypeError(`${command} requires a name`);
    if (command === "secret-list") {
      emit(await client.listSecrets());
      return true;
    }
    if (command === "secret-get") {
      emit(await client.getSecret(name));
      return true;
    }
    if (command === "secret-verify") {
      emit(await client.verifySecret(name));
      return true;
    }
    if (command === "secret-delete") {
      emit(await client.removeSecret(name));
      return true;
    }
    if (command === "secret-put") {
      const file = args[1];
      if (!file) throw new TypeError("secret-put requires a file path");
      const plaintext = await read(file, "utf8");
      emit(
        await client.putSecret(name, {
          kind: args[2] ?? "opaque",
          keyVersion: args[3] ?? "default",
          ciphertext: await age.encrypt(plaintext),
        }),
      );
      return true;
    }
    return false;
  };
}
