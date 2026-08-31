import { expect, test } from '@jest/globals';
import { classifyOperation } from '../../src/operations/classify-result.mjs';
test('classifies a successful result', () => { expect(classifyOperation({ ok: true })).toBe(0); });
