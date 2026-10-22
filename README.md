# [![eliware.org](https://eliware.org/logos/brand.png)](https://discord.gg/M6aTR9eTwN)

## @eliware/elera-cli [![npm](https://img.shields.io/npm/v/@eliware/elera-cli)](https://www.npmjs.com/package/@eliware/elera-cli) [![License](https://img.shields.io/github/license/eliware/elera-cli)](https://github.com/eliware/elera-cli/blob/main/LICENSE) [![CI](https://github.com/eliware/elera-cli/actions/workflows/ci.yaml/badge.svg)](https://github.com/eliware/elera-cli/actions/workflows/ci.yaml)

Agent-friendly CLI for Elera database operations, backup, restore, and metadata management

## Table of Contents

- [Features](#features)
- [Requirements](#requirements)
- [Setup](#setup)
- [Usage](#usage)
- [Development](#development)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Security](#security)
- [Configuration](#configuration)
- [Operations](#operations)
- [Commands](#commands)
- [Exit codes](#exit-codes)
- [Support](#support)
- [Links](#links)
- [License](#license)

## Features

Use the Elera supervisor CLI to manage applications, databases, identities, tokens, routing, backups, and restores.

## Requirements

- Install Node.js 26 or later.
- Get a CLI token from an Elera administrator.

## Setup

Install the public package:

```sh
npm install --global @eliware/elera-cli
```

## Usage

Run `elera-cli --help` to list command groups. Read the [usage guide](docs/usage.md) to start.
Read [RELEASE_NOTES.md](RELEASE_NOTES.md) for package changes.
Read [docs/README.md](docs/README.md) for all user guides.

## Development

Read [AGENTS.md](AGENTS.md) before you change this repository.

## Testing

Run `npm test` to check the repository.

## Troubleshooting

Read the [troubleshooting guide](docs/troubleshooting.md) when a command fails.

## Security

Keep CLI tokens, age keys, database dumps, and backup files safe. Read the [token guide](docs/security.md).

## Configuration

Set the supervisor URL and CLI token in the process environment or `.env`. Read the [configuration guide](docs/configuration.md).

## Operations

Read the [access model](docs/access-model.md) before you use root or app-admin commands. Read the [backup and restore guide](docs/backup-restore.md) before you move data.

## Commands

Run `elera-cli GROUP ACTION --help` for action details. Read the [command reference](docs/commands.md) for all groups and options. Read the [specification index](specs/README.md) for repository rules.

## Exit codes

| Code | Meaning                                                       |
| ---- | ------------------------------------------------------------- |
| `0`  | The command completed.                                        |
| `1`  | The operation did not complete or returned a negative result. |
| `2`  | The command, option, or input is invalid.                     |
| `3`  | The token lacks access or has expired.                        |
| `4`  | The CLI could not complete a network request.                 |
| `5`  | The supervisor reports an unsafe operation.                   |
| `6`  | The cluster is not in a primary state.                        |
| `7`  | The operation was forced or escalated.                        |

## Support

For help, questions, or to chat with the author and community, visit:

[![Discord](https://eliware.org/logos/discord_96.png)](https://discord.gg/M6aTR9eTwN)[![eliware.org](https://eliware.org/logos/eliware_96.png)](https://discord.gg/M6aTR9eTwN)

**[eliware.org on Discord](https://discord.gg/M6aTR9eTwN)**

## Links

- [Home Page](https://eliware.org)
- [GitHub Org](https://github.com/eliware)
- [GitHub Repo](https://github.com/eliware/elera-cli)
- [Bug Reports](https://github.com/eliware/elera-cli/issues)
- [npm](https://www.npmjs.com/package/@eliware/elera-cli)
- [Discord](https://discord.gg/M6aTR9eTwN)

## License

[MIT © Eliware](LICENSE)
