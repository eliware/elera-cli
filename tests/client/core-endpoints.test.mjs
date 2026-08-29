import * as subject from '../../src/client/core-endpoints.mjs';
test('exports core endpoint operations', () => expect(Object.keys(subject).length).toBeGreaterThan(0));
