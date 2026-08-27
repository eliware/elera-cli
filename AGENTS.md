# Agent guidance

Use Node.js 26 native ESM, `@eliware/common`, and `@eliware/elera-lib`.
Keep CLI parsing, supervisor API calls, backup orchestration, and SQL access
in focused modules. Tests belong under `tests/` and mirror `src/`. Never print
credentials or store plaintext secrets.
