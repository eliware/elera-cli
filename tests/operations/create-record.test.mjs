import { expect, test } from '@jest/globals';
import { createOperationRecord } from '../../src/operations/create-record.mjs';
test('creates an operation record', () => { expect(createOperationRecord('test', { value: 1 }, () => 'now')).toMatchObject({ action: 'test', input: { value: 1 }, requestedAt: 'now', operationId: expect.any(String) }); });
