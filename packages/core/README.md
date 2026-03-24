# @envra/core

Define, validate, and safely consume environment variables in TypeScript — schema, inferred types, secret masking, and helpers for docs / `.env.example` / `doctor`.

## Install

```bash
pnpm add @envra/core
# or
npm install @envra/core
```

## Quick example

```ts
import { defineEnv, str, url, int, bool, secret, oneOf } from "@envra/core";

export const env = defineEnv({
  NODE_ENV: oneOf(["development", "test", "production"] as const),
  APP_URL: url(),
  DB_URL: secret(url()).serverOnly(),
  PORT: int().default(3000),
  REDIS_ENABLED: bool().default(false),
});
```

Use `env.values`, `env.get`, `env.has`, and `env.meta`. See the [full documentation](https://github.com/hasansmadix/envra#readme) on GitHub.

## NestJS / `Record<string, unknown>`

`@nestjs/config` passes a plain object into `validate`. Use `unknownRecordToEnvSource` so nested values become JSON strings instead of `[object Object]`:

```ts
import { defineEnv, unknownRecordToEnvSource } from "@envra/core";

return defineEnv(schema, { source: unknownRecordToEnvSource(config) }).values;
```

## `runDoctor`

`runDoctor({ schema, env, profile, undeclaredPolicy?: 'all' | 'ignore-system' | 'loaded-only', loadedEnvKeys? })` — use `ignore-system` on developer machines to avoid hundreds of `UNDECLARED_ENV` warnings from OS/shell keys.

## CLI

For `check`, `sync`, `docs`, and `doctor`, add [`@envra/cli`](https://www.npmjs.com/package/@envra/cli) as a dev dependency.

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
