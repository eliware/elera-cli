import { expect, test } from '@jest/globals';
import * as api from '../src/index.mjs';

test('does not expose the application SQL client', () => {
  expect(api.createDb).toBeUndefined();
  expect(api.createDbFromBundle).toBeUndefined();
  expect(api.classifyQuery).toBeUndefined();
  expect(api.routeFor).toBeUndefined();
});
