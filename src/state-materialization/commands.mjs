import { readFile } from "node:fs/promises";
import { createMaterializeCommand } from "./materialize-command.mjs";
import { createSecretCommands } from "./secret-commands.mjs";

export function createArtifactCommands({
  client,
  age,
  read = readFile,
  materialize,
  createMaterializer = createMaterializeCommand,
  emit,
} = {}) {
  if (!client || !age || typeof emit !== "function")
    throw new TypeError("artifact command dependencies are required");
  const runMaterialize = materialize ?? ((...args) => createMaterializer({ client, age })(...args));
  return createSecretCommands({ client, age, read, runMaterialize, emit });
}
