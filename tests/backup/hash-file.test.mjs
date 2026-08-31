import { expect, test } from '@jest/globals';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { sha256 } from '../../src/backup/hash-file.mjs';
test('hashes a file', async () => { const root = await mkdtemp(join(tmpdir(), 'elera-cli-')); const file = join(root, 'file'); await writeFile(file, 'data'); await expect(sha256(file)).resolves.toHaveLength(64); });
