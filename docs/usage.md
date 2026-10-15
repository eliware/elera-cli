# Usage

## Requirements

Install Node.js 26 or later. Connect to an Elera supervisor. Get a CLI token from an administrator.

## Install

Install the public package for all projects:

```sh
npm install --global @eliware/elera-cli
```

Check the installed package:

```sh
elera-cli --version
elera-cli --help
```

Run the package without a global install:

```sh
npx @eliware/elera-cli --help
```

## First use

Copy `.env.example` to `.env` in the project directory. Set the supervisor URL and CLI token. Read [Configuration](configuration.md) for all values.

Check the supervisor connection:

```sh
elera-cli health status --json
```

Check service readiness:

```sh
elera-cli health ready --json
```

List database names that the token can access:

```sh
elera-cli database list --json
```

## Run a command

Use `elera-cli GROUP ACTION`. Use the action names in [Commands](commands.md).

Show help for one group:

```sh
elera-cli backup --help
```

Show help for one action:

```sh
elera-cli database delete --help
```

Add `--json` to return JSON output. Use `--operation-id ID` to set an operation ID where the supervisor supports it.

Set `ELERA_DATABASE` and `ELERA_IDENTITY` to choose default application context. A command argument can select a more specific resource.

Use `--target HOST` to send a directed cluster command to a host. Use `--target-endpoint URL` to set its full endpoint.

## Development

Install the locked dependencies with `npm ci`. Run `npm test` to check the repository.

Run `npm run lint` to check source rules. Run `npm run format:check` to check file format. Run `npm run audit` to check packages. Run `npm run pack` to check package contents.

## Package version

The CLI reports the version from the installed package metadata. The executable is `elera-cli`.
