import { expect, test } from '@jest/globals';
import { validateDatabaseName } from '../../src/database/validate-name.mjs';
test('validates database identifiers', () => { expect(validateDatabaseName('app_1')).toBe('app_1'); expect(() => validateDatabaseName('app;drop')).toThrow('Invalid database name'); });
