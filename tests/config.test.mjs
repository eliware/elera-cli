import { expect, test } from '@jest/globals';
import { loadCliConfig, redactCliConfig } from '../src/config.mjs';

test('loads and normalizes CLI configuration', () => { expect(loadCliConfig({ ELERA_API_ENDPOINT: 'https://db.example/', ELERA_API_TOKEN: 'token', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'runtime' }).endpoint).toBe('https://db.example'); });
test('rejects incomplete CLI configuration', () => { expect(() => loadCliConfig({})).toThrow('ELERA_API_ENDPOINT'); });
test('rejects invalid endpoint and each missing required value', () => { const base = { ELERA_API_ENDPOINT: 'https://db', ELERA_API_TOKEN: 't', ELERA_DATABASE: 'app', ELERA_IDENTITY: 'id' }; expect(() => loadCliConfig({ ...base, ELERA_API_ENDPOINT: 'db' })).toThrow('HTTP(S)'); expect(() => loadCliConfig({ ...base, ELERA_API_TOKEN: '' })).toThrow('TOKEN'); expect(() => loadCliConfig({ ...base, ELERA_DATABASE: '' })).toThrow('DATABASE'); expect(() => loadCliConfig({ ...base, ELERA_IDENTITY: '' })).toThrow('IDENTITY'); });
test('redacts CLI token', () => { expect(redactCliConfig({ token: 'secret', endpoint: 'https://db.example' }).token).toBe('[redacted]'); });
test('preserves absent token redaction value', () => { expect(redactCliConfig({ endpoint: 'https://db.example' }).token).toBeUndefined(); });
