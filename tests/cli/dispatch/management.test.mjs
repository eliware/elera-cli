import * as subject from '../../../src/cli/dispatch/management.mjs';
import { dispatchManagement } from '../../../src/cli/dispatch/management.mjs';
import { jest } from '@jest/globals';
test('exports management dispatch', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
test('dispatches cold recovery JSON operations', async () => {
  const calls = { authorize: jest.fn(async () => 0), bootstrap: jest.fn(async () => 0), complete: jest.fn(async () => 0) };
  const handlers = { coldRecoveryAuthorize: ({ input }) => calls.authorize(input), coldRecoveryBootstrap: ({ input }) => calls.bootstrap(input), coldRecoveryComplete: ({ input }) => calls.complete(input) };
  for (const [command, method] of [['cold-recovery-authorize', 'authorize'], ['cold-recovery-bootstrap', 'bootstrap'], ['cold-recovery-complete', 'complete']]) await dispatchManagement({ command, client: {}, controlClient: {}, emit: jest.fn(), args: ['{"epoch":"e"}'], handlers });
  for (const command of ['cold-recovery-authorize', 'cold-recovery-bootstrap', 'cold-recovery-complete']) await dispatchManagement({ command, client: {}, controlClient: {}, emit: jest.fn(), args: [], handlers });
  expect(calls.authorize).toHaveBeenCalledWith({ epoch: 'e' }); expect(calls.bootstrap).toHaveBeenCalledWith({ epoch: 'e' }); expect(calls.complete).toHaveBeenCalledWith({ epoch: 'e' });
});
