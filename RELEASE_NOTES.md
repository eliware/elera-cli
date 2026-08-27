# Release notes

## 0.1.0

- Initial CLI package scaffold using the local `@eliware/elera-lib` client.
- Added age-encrypted artifact CRUD and verification commands using the
  supervisor’s scoped REST API.
- Added safe `secret-materialize` execution and GitOps-mounted input
  resolution; plaintext is confined to a cleaned temporary operation.
- Added Docker-only HTTP migration diagnostics for probe and legacy-config
  validation.
