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

## CLI

For `check`, `sync`, `docs`, and `doctor`, add [`@envra/cli`](https://www.npmjs.com/package/@envra/cli) as a dev dependency.

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
