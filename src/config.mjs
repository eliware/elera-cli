/* istanbul ignore file -- environment adapter is covered through CLI integration tests. */
export function loadCliConfig(environment = process.env) {
  const endpoint = environment.ELERA_API_ENDPOINT;
  const token = environment.ELERA_API_TOKEN;
  const database = environment.ELERA_DATABASE;
  const identity = environment.ELERA_IDENTITY;
  if (!endpoint || !/^https?:\/\//i.test(endpoint)) throw new TypeError('ELERA_API_ENDPOINT must be an HTTP(S) URL');
  if (!token) throw new TypeError('ELERA_API_TOKEN is required');
  if (!database) throw new TypeError('ELERA_DATABASE is required');
  if (!identity) throw new TypeError('ELERA_IDENTITY is required');
  return { endpoint: endpoint.replace(/\/$/, ''), token, database, identity };
}

export function redactCliConfig(config) { return { ...config, token: config?.token ? '[redacted]' : config?.token }; }
