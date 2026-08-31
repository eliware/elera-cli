export function createSupervisorRequest({ endpoint, token, fetchImpl = fetch, operationId } = {}) {
  if (!endpoint || !token) throw new TypeError('supervisor endpoint and token are required');
  return async function request(path, options = {}) {
    const response = await fetchImpl(`${endpoint.replace(/\/$/, '')}${path}`, {
      ...options,
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${token}`,
        ...(operationId ? { 'x-elera-operation-id': operationId } : {}),
        ...options.headers,
      },
    });
    const contentType = response.headers?.get?.('content-type') ?? '';
    const body = contentType.includes('json') || !contentType
      ? await response.json()
      : { ok: response.ok, status: (await response.text()).trim() };
    if (!response.ok) {
      const errorCode = body.error?.code ?? body.code;
      const rawMessage = body.error?.message ?? body.error ?? body.message ?? `supervisor request failed: ${response.status}`;
      const message = errorCode === 'duplicate_resource' || /duplicate|already exists/i.test(String(rawMessage))
        ? `resource already exists: ${rawMessage}`
        : String(rawMessage);
      throw Object.assign(new Error(message), { statusCode: response.status, body });
    }
    return body;
  };
}
