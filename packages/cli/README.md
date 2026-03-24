# @envra/cli

Command-line tools for [envra](https://github.com/hasansmadix/envra): validate env, generate `.env.example` and `ENVIRONMENT.md`, and run hygiene checks (`doctor`).

## Install

```bash
pnpm add -D @envra/cli
# or
npm install -D @envra/cli
```

Your project should also depend on [`@envra/core`](https://www.npmjs.com/package/@envra/core). The CLI loads your config with [jiti](https://github.com/unjs/jiti) (TypeScript without a separate build step for the config file).

## Commands

```bash
pnpm envra check  -c ./env.config.ts
pnpm envra sync   -c ./env.config.ts -o .env.example
pnpm envra docs   -c ./env.config.ts -o ENVIRONMENT.md
pnpm envra doctor -c ./env.config.ts
```

Export `defineEnv(...)` as `default` or `env`, or export field builders as `envraSchema`, `schema`, `environmentFields`, or `envFields`.

## `check` and `doctor` — env loading

- **`--env-file <path>`** — repeatable; each file is parsed with [dotenv](https://github.com/motdotla/dotenv) and merged (later overrides earlier). Starts from `process.env`.
- **`--env-dir <dir>`** — after `--env-file`, loads `<dir>/.env` then `<dir>/.env.<node-env>` if they exist.
- **`--node-env <name>`** — segment for `.env.<name>` (default: `NODE_ENV` or `development`).
- **`--env-preset nest`** — sets default `--env-dir` to `env` (matches many Nest `ConfigModule` layouts).

`--profile` / `-p` is the **schema** profile for envra rules (`requiredIn` / `onlyIn`), not the env file name.

## `doctor`

- **`--undeclared <policy>`** — `ignore-system` (default), `all`, or `loaded-only` (only warn on extra keys that appeared in loaded files).
- **`--json`** — print structured JSON for CI.

## Windows

If `envra` fails when run via `node` on Windows, call the entry file directly, e.g. `node node_modules/@envra/cli/dist/cli.js check -c ./env.config.ts`.

## Documentation

[github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
