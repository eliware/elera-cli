import { expect, test } from '@jest/globals';
import { runMigrationPending } from '../../../src/commands/migration/pending.mjs';
test('reports pending migration contracts', () => { expect(() => runMigrationPending({ action: 'future' })).toThrow('migration action contract pending: future'); });
