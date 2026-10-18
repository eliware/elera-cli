import { commandTree } from "./command/tree.mjs";

export function bashCompletionScript() {
  const families = Object.keys(commandTree()).sort();
  const actions = Object.fromEntries(
    families.map((family) => [family, Object.keys(commandTree()[family]).sort()]),
  );
  const lines = [
    "# Bash helper for elera-cli.",
    "_elera_cli_complete() {",
    '  local current="${COMP_WORDS[COMP_CWORD]}"',
    '  local family="${COMP_WORDS[1]}"',
    "  if [[ ${COMP_CWORD} -eq 1 ]]",
    "  then",
    `    COMPREPLY=( $(compgen -W "${families.join(" ")} help --help --version" -- "$current") )`,
    "  else",
    '    case "$family" in',
    ...families.flatMap((family) => [
      `      ${family})`,
      `        COMPREPLY=( $(compgen -W "${actions[family].join(" ")} --help" -- "$current") )`,
      "        ;;",
    ]),
    "    esac",
    "  fi",
    "}",
    "complete -F _elera_cli_complete elera-cli",
  ];
  return `${lines.join("\n")}\n`;
}
