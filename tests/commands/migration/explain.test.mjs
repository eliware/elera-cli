import { expect, jest, test } from '@jest/globals';
import { runMigrationExplain } from '../../../src/commands/migration/explain.mjs';
test('emits migration mapping explanation', () => { const emit = jest.fn(); expect(runMigrationExplain({ emit })).toBe(0); expect(emit).toHaveBeenCalledWith(expect.objectContaining({ operation: 'migration-explain' })); });
