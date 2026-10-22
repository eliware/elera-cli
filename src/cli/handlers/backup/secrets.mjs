import { runSecretList } from "../../../commands/protected-settings/list.mjs";
import { runSecretGet } from "../../../commands/protected-settings/get.mjs";
import { runSecretVerify } from "../../../commands/protected-settings/verify.mjs";
import { runSecretDelete } from "../../../commands/protected-settings/delete.mjs";

const secretHandlers = {
  "secret-list": runSecretList,
  "secret-get": runSecretGet,
  "secret-verify": runSecretVerify,
  "secret-delete": runSecretDelete,
};

export function createSecretCommandHandler({ client, emit, artifactCommands }) {
  return async (name, values) => {
    if (secretHandlers[name]) return secretHandlers[name]({ client, emit, name: values[0] });
    await artifactCommands(name, values);
    return 0;
  };
}
