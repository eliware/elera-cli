export function normalizeSqlArguments(argv, { knownCommand, stdinIsTty } = {}) {
  if (argv[0] === "-e" || argv[0] === "--execute") return ["sql", "query", argv[1] ?? ""];
  if (argv[0] === "dump") return ["sql", "dump", argv[1] ?? ""];
  if (argv.length === 1 && !knownCommand && stdinIsTty === false)
    return ["sql", "restore", argv[0]];
  return argv;
}
