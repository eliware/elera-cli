import { createMaterializer } from "@eliware/elera-lib";

const AGE_HEADER = "age-encryption.org/";

function validateCiphertext(ciphertext) {
  if (typeof ciphertext !== "string" || !ciphertext.startsWith(AGE_HEADER))
    throw new TypeError("artifact must contain age ciphertext");
  return ciphertext;
}

export function createEncryptedArtifactStore({
  api,
  encrypt,
  decrypt,
  materializer = createMaterializer(),
} = {}) {
  if (
    !api ||
    typeof api.putSecret !== "function" ||
    typeof api.getSecret !== "function"
  )
    throw new TypeError("artifact API is required");
  if (typeof encrypt !== "function" || typeof decrypt !== "function")
    throw new TypeError("age encrypt and decrypt functions are required");
  return {
    async put(name, plaintext, metadata = {}) {
      const ciphertext = validateCiphertext(await encrypt(plaintext));
      return api.putSecret(name, { ...metadata, ciphertext });
    },
    async get(name) {
      const response = await api.getSecret(name);
      const artifact = response.data ?? response;
      validateCiphertext(artifact.ciphertext);
      return artifact;
    },
    async verify(name) {
      const artifact = await this.get(name);
      await decrypt(artifact.ciphertext);
      return { name, verified: true, keyVersion: artifact.keyVersion };
    },
    async withMaterialized(name, operation) {
      const artifact = await this.get(name);
      return materializer.withFile(
        await decrypt(artifact.ciphertext),
        operation,
      );
    },
  };
}
