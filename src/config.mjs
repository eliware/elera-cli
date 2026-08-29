export function loadCliConfig(environment = process.env) {
  const endpoint = environment.ELERA_API_ENDPOINT;
  const token = environment.ELERA_API_TOKEN;
  const database = environment.ELERA_DATABASE;
  const identity = environment.ELERA_IDENTITY;
  if (!endpoint || !/^https?:\/\//i.test(endpoint)) throw new TypeError('ELERA_API_ENDPOINT must be an HTTP(S) URL');
  if (!token) throw new TypeError('ELERA_API_TOKEN is required');
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
