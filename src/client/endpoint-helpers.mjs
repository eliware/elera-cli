export function jsonRequest(request, path, payload, method = 'POST') {
  return request(path, {
    method,
    body: JSON.stringify(payload),
    headers: { 'content-type': 'application/json' },
  });
}

export function encoded(value) {
  return encodeURIComponent(value ?? '');
}
