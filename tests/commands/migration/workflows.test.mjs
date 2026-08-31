import { expect, test } from '@jest/globals';
import { migrationWorkflows } from '../../../src/commands/migration/workflows.mjs';
test('exposes migration workflow mappings', () => { expect(Object.keys(migrationWorkflows)).toEqual(['database', 'identity', 'token', 'inspect', 'verify']); });
