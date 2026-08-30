import { readFileSync } from 'node:fs';

export function projectEnvironment(environment, { readFile = readFileSync, path = '.env' } = {}) {
  if (environment !== process.env) return environment;
  try {
    const values = Object.fromEntries(readFile(path, 'utf8').split(/\r?\n/).filter((line) => line && !line.trim().startsWith('#')).map((line) => {
      const separator = line.indexOf('=');
      return separator < 0 ? [line.trim(), ''] : [line.slice(0, separator).trim(), line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, '$2')];
    }));
    return { ...values, ...environment };
  } catch { return environment; }
}

export function loadCliConfig(environment = process.env) {
  environment = projectEnvironment(environment);
  const endpoint = environment.ELERA_API_ENDPOINT;
  const token = environment.ELERA_CLI_TOKEN;
  const database = environment.ELERA_DATABASE;
  const identity = environment.ELERA_IDENTITY;
  if (!endpoint || !/^https?:\/\//i.test(endpoint)) throw new TypeError('ELERA_API_ENDPOINT must be an HTTP(S) URL');
  if (!token) throw new TypeError('ELERA_CLI_TOKEN is required');
  const parsed = new URL(endpoint);
  return {
    endpoint: endpoint.replace(/\/$/, ''),
    protocol: environment.ELERA_API_PROTOCOL ?? parsed.protocol.replace(':', ''),
    port: Number(environment.ELERA_API_PORT || parsed.port || (parsed.protocol === 'https:' ? 443 : 80)),
    token,
    ...(database ? { database } : {}),
    ...(identity ? { identity } : {}),
  };
}

export function redactCliConfig(config) { return { ...config, token: config?.token ? '[redacted]' : config?.token }; }
