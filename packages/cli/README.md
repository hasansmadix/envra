# @envra/cli

Command-line tools for [envra](https://github.com/hasansmadix/envra): validate `process.env`, generate `.env.example` and `ENVIRONMENT.md`, and run hygiene checks (`doctor`).

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

Export `defineEnv(...)` as `default` or `env`, or export `envraSchema` / `schema` as field builders so the CLI can read the schema.

## Documentation

[github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
