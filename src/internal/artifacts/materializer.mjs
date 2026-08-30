import { generate as generateSnowflake } from "@eliware/snowflake";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export function createMaterializer({ makeTemp = mkdtemp, write = writeFile, remove = rm, id = generateSnowflake } = {}) {
  return {
    async withFile(content, operation) {
      if (typeof operation !== "function") throw new TypeError("materializer operation is required");
      const directory = await makeTemp(join(tmpdir(), "elera-material-") );
      const path = join(directory, id());
      try { await write(path, content, { mode: 0o600 }); return await operation(path); }
      finally { await remove(directory, { recursive: true, force: true }); }
    }
  };
}
