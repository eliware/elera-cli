import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { gunzip } from 'node:zlib';
import { promisify } from 'node:util';
import { applicationDatabases, sha256 } from './manifests.mjs';

const testGzip = promisify(gunzip);
export async function backupExists(backupPath, read = readFile) { try { await read(join(backupPath, 'SHA256SUMS')); return true; } catch { return false; } }
export async function verifyBackup({ backupPath, databases, read = readFile }) { const listed = (await read(join(backupPath, 'DATABASES'), 'utf8')).split(/\r?\n/).filter(Boolean); const expected = applicationDatabases(databases ?? listed); for (const database of expected) { const file = join(backupPath, `${database}.sql.gz`); await testGzip(await read(file)); } return { databases: listed, host: undefined }; }
