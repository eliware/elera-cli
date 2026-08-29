import * as subject from '../../../src/cli/dispatch/management.mjs';
test('exports management dispatch', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
