import { expect, test } from '@jest/globals';
import { projectEnvironment } from '../../src/config/project-environment.mjs';
test('projects dotenv values without overriding explicit environment values', () => { const environment = { EXISTING: 'explicit' }; const readFile = () => 'FROM_FILE=value\nEXISTING=file\n'; expect(projectEnvironment(process.env, { readFile })).toMatchObject({ FROM_FILE: 'value' }); expect(projectEnvironment(environment, { readFile })).toBe(environment); });
