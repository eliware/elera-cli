import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

export const applicationDatabases = (databases) => databases.filter((name) => !['information_schema', 'performance_schema', 'mysql', 'sys'].includes(name));
export const manifestText = (entries) => `${entries.map(({ hash, name }) => `${hash}  ${name}`).join('\n')}\n`;
export const sha256 = async (path) => { const hash = createHash('sha256'); hash.update(await readFile(path)); return hash.digest('hex'); };
