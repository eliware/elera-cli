export function applicationStatusOutput(application) {
  return { ok: true, operation: "app-status", data: application };
}

export function databaseDeleteOutput(result) {
  return { ok: true, operation: "database-delete", data: result };
}
