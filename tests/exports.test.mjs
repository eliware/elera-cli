import { expect, test } from '@jest/globals';
import * as api from '../src/index.mjs';

test('exports the local SQL client contract', () => {
  expect(api.createDb).toBeDefined();
  expect(api.createDbFromEnvironment).toBeDefined();
  expect(api.classifyQuery).toBeDefined();
  expect(api.routeFor).toBeDefined();
});
