import { expect, test } from '@jest/globals';
import { validateBundle as validateCliBundle } from '@eliware/elera-lib';

const valid = () => ({ apiVersion: 'v1', application: 'app', database: 'db', identity: 'id', nodeIdentity: 'node-1', credentials: { username: 'u', password: 'p' }, bundleVersion: 1, ports: { sql: 3306, http: 8080 }, writer: { host: 'sql0', port: 3306 }, readers: [{ host: 'sql1', port: 3306 }], failover: [], expiresAt: '2099-01-01T00:00:00Z', routes: { primary: [{ host: 'sql0', port: 3306 }], balanced: [{ host: 'sql1', port: 3306 }] } });

test('accepts a complete bundle and returns the same object', () => { const bundle = valid(); expect(validateCliBundle(bundle)).toBe(bundle); });
test.each([undefined, null, 'bundle', 1])('rejects a non-object bundle: %p', (bundle) => { expect(() => validateCliBundle(bundle)).toThrow('routing bundle is required'); });
test('requires the shared identity fields', () => { expect(() => validateCliBundle({})).toThrow('apiVersion'); const bundle = valid(); delete bundle.database; expect(() => validateCliBundle(bundle)).toThrow('database is required'); });
test('requires a parseable expiry', () => { const bundle = valid(); delete bundle.expiresAt; expect(() => validateCliBundle(bundle)).toThrow('expiresAt is required'); bundle.expiresAt = 'not-a-date'; expect(() => validateCliBundle(bundle)).toThrow('expiresAt is required'); });
test.each(['primary', 'balanced'])('rejects a non-array %s route list', (route) => { const bundle = valid(); bundle.routes[route] = {}; expect(() => validateCliBundle(bundle)).toThrow(`bundle.routes.${route} must be an array`); });
test.each([{ host: '', port: 3306 }, { host: 'sql', port: 0 }, { host: 'sql', port: 65536 }, { host: 'sql', port: 'not-port' }, { port: 3306 }])('rejects invalid primary nodes: %p', (node) => { const bundle = valid(); bundle.routes.primary = [node]; expect(() => validateCliBundle(bundle)).toThrow('routing bundle primary node'); });
test('rejects invalid balanced nodes', () => { const bundle = valid(); bundle.routes.balanced = [{ host: 'sql', port: 3306.5 }]; expect(() => validateCliBundle(bundle)).toThrow('routing bundle balanced node'); });
