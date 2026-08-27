import { runProcess } from '../runtime/process.mjs';

export function mysqlArgs(credentialsFile, host) { return [`--defaults-extra-file=${credentialsFile}`, '--host', host]; }
export function validateDatabaseName(database) { if (!/^[A-Za-z0-9_$-]+$/.test(database)) throw new Error(`Invalid database name: ${database}`); return database; }
export async function discoverDatabases({ credentialsFile, host, mysql = 'mysql', run = runProcess }) { const result = await run(mysql, [...mysqlArgs(credentialsFile, host), '-N', '-e', 'SHOW DATABASES;']); return result.stdout.split(/\r?\n/).map((name) => name.trim()).filter(Boolean); }
export function dumpArgs(credentialsFile, host, database) { return [...mysqlArgs(credentialsFile, host), '--single-transaction', '--routines', '--triggers', '--events', validateDatabaseName(database)]; }
