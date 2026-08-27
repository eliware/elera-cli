import { expect, test } from '@jest/globals';
import { formatHuman } from '../src/output/format.mjs';

test('formats scalar and object operation results for operators', () => {
  expect(formatHuman('ok')).toBe('ok');
  expect(formatHuman({ status: 'completed', data: { drained: true } })).toContain('status: completed');
});

test('formats empty values', () => {
  expect(formatHuman(null)).toBe('');
  expect(formatHuman(undefined)).toBe('');
});
