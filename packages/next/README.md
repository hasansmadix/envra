# @envra/next

Next.js adapter for [envra](https://github.com/hasansmadix/envra): split **server** vs **client** env schemas, enforce `NEXT_PUBLIC_` on client keys, and block secrets on the client block.

## Install

```bash
pnpm add @envra/next
# or
npm install @envra/next
```

Peer: `next` >= 14 (optional peer for typing; install `next` in your app).

## Example

```ts
import { defineNextEnv, str, url, secret } from "@envra/next";

export const env = defineNextEnv({
  server: {
    DB_URL: secret(url()),
  },
  client: {
    NEXT_PUBLIC_APP_URL: url(),
  },
  runtimeEnv: process.env,
});
```

## Documentation

[github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
