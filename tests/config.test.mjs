import { expect, test } from '@jest/globals';
import { loadCliConfig, redactCliConfig } from '../src/config.mjs';

test('loads and normalizes CLI configuration', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example/', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }).endpoint).toBe('https://db.example'); });
test('derives protocol and default port while accepting explicit API settings', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' })).toMatchObject({ protocol: 'https', port: 443 }); expect(loadCliConfig({ ELERA_API_ENDPOINT: 'http://db.example:8080', ELERA_API_PROTOCOL: 'http', ELERA_API_PORT: '9090', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' })).toMatchObject({ protocol: 'http', port: 9090 }); });
test('rejects incomplete CLI configuration', () => { expect(() => loadCliConfig({})).toThrow('ELERA_API_ENDPOINT'); });
test('rejects invalid endpoint and missing required connection values while allowing token-bound context', () => { const base = { ELERA_API_ENDPOINT: 'https://db', ELERA_API_TOKEN: 't' }; expect(() => loadCliConfig({ ...base, ELERA_API_ENDPOINT: 'db' })).toThrow('HTTP(S)'); expect(() => loadCliConfig({ ...base, ELERA_API_TOKEN: '' })).toThrow('TOKEN'); expect(loadCliConfig(base)).not.toHaveProperty('database'); expect(loadCliConfig(base)).not.toHaveProperty('identity'); });
test('redacts CLI token', () => { expect(redactCliConfig({ token: 'secret', endpoint: 'https://db.example' }).token).toBe('[redacted]'); });
test('preserves absent token redaction value', () => { expect(redactCliConfig({ endpoint: 'https://db.example' }).token).toBeUndefined(); });
