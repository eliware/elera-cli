import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
export const sha256 = async (path) => { const hash = createHash('sha256'); hash.update(await readFile(path)); return hash.digest('hex'); };
