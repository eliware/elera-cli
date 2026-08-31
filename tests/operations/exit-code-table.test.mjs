import { expect, test } from '@jest/globals';
import { exitCodes } from '../../src/operations/exit-code-table.mjs';
test('defines stable exit codes', () => { expect(exitCodes).toMatchObject({ ok: 0, invalid: 2, network: 4 }); });
