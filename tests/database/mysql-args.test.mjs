import { expect, test } from '@jest/globals';
import { dumpArgs, mysqlArgs } from '../../src/database/mysql-args.mjs';
test('builds safe database command arguments', () => { expect(mysqlArgs('my.cnf', 'db')).toEqual(['--defaults-extra-file=my.cnf', '--host', 'db']); expect(dumpArgs('my.cnf', 'db', 'app')).toContain('app'); });
