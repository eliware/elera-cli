import { readFile } from "node:fs/promises";
import { join, isAbsolute } from "node:path";

export async function runRestoreAccountsVerify({ client, emit, value, read = readFile }) {
  let accounts;
  try {
    accounts = JSON.parse(value ?? "[]");
  } catch {
    if (!isAbsolute(value)) throw new SyntaxError("restore accounts input is not valid JSON");
    const metadata = JSON.parse(await read(join(value, "SUPERVISOR-METADATA.json"), "utf8"));
    accounts = metadata.accounts ?? [];
  }
  const result = await client.restoreAccountsVerify(accounts);
  emit(result);
  return result.ok === false ? 1 : 0;
}
