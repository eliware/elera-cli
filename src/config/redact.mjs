export function redactCliConfig(config) { return { ...config, token: config?.token ? '[redacted]' : config?.token }; }
