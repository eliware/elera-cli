import { expect, test } from '@jest/globals';
import { loadCliConfig, projectEnvironment, redactCliConfig } from '../src/config.mjs';

test('parses project environment files and preserves explicit values', () => {
  const environment = projectEnvironment(process.env, { path: 'fixture.env', readFile: () => '# comment\nELERA_API_ENDPOINT="https://from-file"\nELERA_CLI_TOKEN=file-token\nMALFORMED\n' });
  expect(environment.ELERA_API_ENDPOINT).toBe('https://from-file');
  expect(environment.ELERA_CLI_TOKEN).toBe(process.env.ELERA_CLI_TOKEN ?? 'file-token');
});
test('ignores unreadable project environment files', () => {
  expect(projectEnvironment(process.env, { readFile: () => { throw new Error('missing'); } })).toBe(process.env);
});

test('loads and normalizes CLI configuration', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example/', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }).endpoint).toBe('https://db.example'); });
test('uses the administrative CLI token', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example', ELERA_CLI_TOKEN: 'cli-token' }).token).toBe('cli-token'); });
test('derives protocol and default port while accepting explicit API settings', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' })).toMatchObject({ protocol: 'https', port: 443 }); expect(loadCliConfig({ ELERA_API_ENDPOINT: 'http://db.example:8080', ELERA_API_PROTOCOL: 'http', ELERA_API_PORT: '9090', ELERA_CLI_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' })).toMatchObject({ protocol: 'http', port: 9090 }); });
test('rejects incomplete CLI configuration', () => { expect(() => loadCliConfig({})).toThrow('ELERA_API_ENDPOINT'); });
test('rejects invalid endpoint and missing required connection values while allowing token-bound context', () => { const base = { ELERA_API_ENDPOINT: 'https://db', ELERA_CLI_TOKEN: 't' }; expect(() => loadCliConfig({ ...base, ELERA_API_ENDPOINT: 'db' })).toThrow('HTTP(S)'); expect(() => loadCliConfig({ ...base, ELERA_CLI_TOKEN: '' })).toThrow('TOKEN'); expect(loadCliConfig(base)).not.toHaveProperty('database'); expect(loadCliConfig(base)).not.toHaveProperty('identity'); });
test('redacts CLI token', () => { expect(redactCliConfig({ token: 'secret', endpoint: 'https://db.example' }).token).toBe('[redacted]'); });
test('preserves absent token redaction value', () => { expect(redactCliConfig({ endpoint: 'https://db.example' }).token).toBeUndefined(); });
