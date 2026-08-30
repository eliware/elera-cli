# Source-to-test inventory

This inventory records the focused source/test path audit for the CLI. Barrel
files and composition entrypoints are intentionally covered by public API,
dispatch, integration, or contract tests rather than forced into one-to-one
unit files.

- Source modules audited: 128 `.mjs` files.
- Barrel/composition exceptions: `index.mjs`, command entrypoints, and
  orchestrators covered by their existing entrypoint/dispatch tests.
- Focused implementation gaps found: one.
- Gap resolved: `src/commands/initialization/standalone.mjs` is now covered by
  `tests/commands/initialization/standalone.test.mjs`; its existing test was
  moved from `apply.test.mjs` without changing behavior.
- Remaining unmapped focused implementation modules: none found by the audit.

The inventory should be rerun whenever source modules are added or moved.
