# `elera-cli` alignment drifts

Checklist against the revised Core Flow, supervisor plan, and applicable
repository conventions. Findings are recorded before implementation changes.

## Current status

- [x] Administrative command-family ownership and shared-library boundary are established.
- [ ] Recovery authorization, temporary dependency cleanup, and final release gates remain open.

## Actionable drifts

- [x] CLI configuration requires `ELERA_CLI_TOKEN`; the example environment
  and all CLI fixtures use it, and missing-token errors report that name.
- [x] `ELERA_API_TOKEN` remains reserved exclusively for application runtime
  clients and is not accepted by the administrative CLI.
- [x] Project-root `.env` discovery is implemented for direct, installed, and
  symlinked invocations; explicit environment values take precedence.
- [x] Add focused harness coverage for `.env` parser success, malformed lines,
  comments, quoting, precedence, and file-read failure branches.
- [x] Audited authorization routing: CLI confirmation gates protect local
  operator mistakes, while supervisor remains authoritative for root versus
  app-admin scopes. Platform operations use the control client; application
  resource operations use the target client. No second client-side role model
  was added.
- [x] Added CLI regression coverage mapping supervisor `401`/`403` responses
  to the documented authentication exit code without exposing token contents.
- [x] Verified the supervisor authorization fixtures already cover root-only
  rejection, scoped management permissions, recovery scopes, and
  application-bound routing/metadata access; supervisor tests pass at 100×4.
- [x] Audited root-only and app-admin command routing for initialization,
  bootstrap, recovery, drain, node lifecycle, secrets, backup, and restore.
  Mutating operations are confirmation-gated and delegated to the supervisor;
  application-scoped operations use the target client, while platform/recovery
  operations use the control client.
- [x] Confirmed CLI recovery commands inspect and authorize the supervisor’s
  single-authority, quorum-backed state machine without implementing a second
  recovery authority. Cold-recovery plan/authorize/bootstrap/complete and
  recovery acknowledge/abort all delegate through supervisor endpoints.
- [x] Verified SQL and dump passthrough injects bundle credentials internally,
  blocks connection overrides, preserves pipelines, and never exposes secrets
  in arguments, logs, shell history, or persistent files. Regression coverage
  asserts child-only `MYSQL_PWD` transport.
- [x] Reviewed and approved passthrough credential transport: credentials are
  excluded from argument vectors, shell execution is disabled, streams
  preserve stdin/stdout pipelines, and passwords are supplied only through the
  spawned child’s `MYSQL_PWD` environment. No persistent credential file is
  created and the parent environment is not modified. Release validation must
  continue to confirm that supported process-inspection tools do not expose
  child environment values to unauthorized users.
- [x] Removed the CLI-local routing-bundle validator; supervisor-client now
  uses `validateBundle` from `@eliware/elera-lib`. Updated supervisor-client,
  main-entrypoint, and focused validator fixtures to the complete shared
  bundle shape and shared validation messages.
- [x] Reviewed `src/index.mjs` and the public-export tests. The CLI package
  intentionally exposes its administrative, backup, restore, artifact, and
  supervisor-client helpers for programmatic CLI integration, while exporting
  no application-client internals such as `createDb` or route selection. No
  export change is required for this private CLI package.
- [x] Created `docs/source-test-inventory.md` and reconciled the source/test
  paths. The standalone initialization test was moved to its matching focused
  path without rewriting it; no unmapped focused implementation modules remain.
- [x] Removed the non-barrel Istanbul ignore from the backup rotation re-export;
  the complete suite continues to reach 100×4 coverage with zero warnings.
- [x] Add focused routing-bundle validation tests covering malformed bundles,
  expiry, route lists, hosts, and port boundaries.
- [x] Add focused routing-stream tests covering URL construction, updates,
  malformed messages, socket errors, close state, and unavailable WebSocket
  support.
- [x] Add focused materializer tests covering successful writes, cleanup, and
  operation failure handling.
- [x] Add main-entrypoint tests for management, plan, recovery, and preflight
  dispatch paths.
- [x] Reconciled stale CLI expectations with the current strict routing-bundle
  contract, standalone initialization response shape, and `createLiveDb`
  dependency contract. Focused initialization and routing-watch coverage was
  also reviewed, and dispatcher, main-entrypoint, and routing-bundle validation
  tests were expanded. The large entrypoint composition object was decomposed
  by moving standalone initialization to its focused module, and routing watch
  no longer carries an unused bundle-fetch callback. Lifecycle aliases have an
  injected, non-blocking entrypoint test seam; direct dispatcher coverage is
  also present. The complete suite now passes at 100×4 with zero warnings.
- [x] Run complete tests, lint, syntax/type checks, contract validation, audit,
  package dry-run, and CI validation after the boundary changes.
- [ ] Replace the temporary `file:../elera-lib` dependency with the published
  semver dependency before release packaging.
- [x] Reconciled the README development gates and documented the intentional
  local shared-library link used before lab validation. Release metadata,
  lockfile, and release notes remain unchanged until the lab-validated release
  candidate is selected.

## Verified or intentional boundaries

- [x] CLI owns administrative workflows, SQL passthrough, backup, restore,
  migration guidance, diagnostics, and human/agent-facing command parsing.
- [x] Cluster recovery and node lifecycle requests are directed to supervisor;
  CLI does not own Galera state or local root-socket SQL.
- [x] Application SQL pools and WebSocket client behavior remain in
  `@eliware/elera-client`, not in the CLI.
- [x] The CLI uses `@eliware/elera-lib` as the shared contract boundary.
- [x] Contract verification uses the canonical `validateBundle` export from
  `@eliware/elera-lib`; the former CLI-local routing-bundle JSON schema was
  removed. The retained fixture is sample data only.
- [x] Existing command families cover application, database, identity, token,
  routing, telemetry, cluster, recovery, backup, restore, and secrets work.
- [x] Lint, typecheck, contract validation, audit, package dry-run, and the
  complete test suite pass locally at 100×4 with zero warnings.
