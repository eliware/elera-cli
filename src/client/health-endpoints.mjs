export function createHealthEndpoints(request) {
  return { health: () => request('/healthz'), ready: () => request('/readyz') };
}
