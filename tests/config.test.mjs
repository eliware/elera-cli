import { expect, test } from '@jest/globals';
import { loadCliConfig, redactCliConfig } from '../src/config.mjs';

test('loads and normalizes CLI configuration', () => { expect(loadCliConfig({ GALERA_API_ENDPOINT: 'https://db.example/', GALERA_API_TOKEN: 'token', GALERA_DATABASE: 'app', GALERA_IDENTITY: 'runtime' }).endpoint).toBe('https://db.example'); });
test('rejects incomplete CLI configuration', () => { expect(() => loadCliConfig({})).toThrow('GALERA_API_ENDPOINT'); });
test('redacts CLI token', () => { expect(redactCliConfig({ token: 'secret', endpoint: 'https://db.example' }).token).toBe('[redacted]'); });
