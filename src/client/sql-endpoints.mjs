export function createSqlEndpoints(request) {
  return { sqlConnection: () => request("/api/v1/sql/connection") };
}
