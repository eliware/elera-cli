import { commandTree } from './command-tree.mjs';

export function bashCompletionScript() {
  const families = Object.keys(commandTree()).sort();
  const actions = Object.fromEntries(families.map((family) => [family, Object.keys(commandTree()[family]).sort()]));
  return `# bash completion for elera-cli\n_elera_cli_complete() {\n  local current=\"\${COMP_WORDS[COMP_CWORD]}\"\n  local family=\"\${COMP_WORDS[1]}\"\n  if [[ \${COMP_CWORD} -eq 1 ]]; then\n    COMPREPLY=( $(compgen -W \"${families.join(' ')} help --help --version\" -- \"$current\") )\n  else\n    case \"$family\" in\n${families.map((family) => `      ${family}) COMPREPLY=( $(compgen -W \"${actions[family].join(' ')} --help\" -- \"$current\") ) ;;`).join('\n')}\n    esac\n  fi\n}\ncomplete -F _elera_cli_complete elera-cli\n`;
}
