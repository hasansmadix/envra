# @envra/next

Next.js adapter for [envra](https://github.com/hasansmadix/envra): split **server** vs **client** env schemas, enforce `NEXT_PUBLIC_` on client keys, and block secrets on the client block.

## Install

```bash
pnpm add @envra/next @envra/core
# or
npm install @envra/next @envra/core
```

**Peers:** `next` >= 14 (optional for typing in non-Next contexts), **`@envra/core` ^0.1.2** (install explicitly so a single copy is used — avoids duplicate `FieldBuilder` types in TypeScript).

## Example (full server + client)

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

## Client-only helper (`defineNextPublicEnv`)

Use when you only validate `NEXT_PUBLIC_*` keys and want a module that is safe to import from **Client Components** (no server secrets in that file):

```ts
import { defineNextPublicEnv, url } from "@envra/next";

/** Each key must use `process.env.NEXT_PUBLIC_*` directly — see “Client bundles” below. */
const nextPublicRuntimeEnv = {
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
};

export const publicEnv = defineNextPublicEnv({
  client: {
    NEXT_PUBLIC_APP_URL: url(),
  },
  runtimeEnv: nextPublicRuntimeEnv,
});
```

For secrets and server-only variables, keep a separate module with `import "server-only"` and `defineNextEnv` (or `defineEnv` from `@envra/core`).

## Client bundles: why not `runtimeEnv: process.env` alone?

Next.js (webpack / Turbopack) **inlines** `NEXT_PUBLIC_*` into the **browser** bundle only when the code contains **static** access such as `process.env.NEXT_PUBLIC_APP_URL`.

If you pass **`process.env` as a whole** to `defineNextPublicEnv` (or any helper that reads keys dynamically), the bundler **cannot** inject those values for the client. At runtime, `publicEnv` may look correct on the server but be **empty or wrong in the browser**, even when `.env` / `.env.local` are set.

**Do this for client-imported env modules:**

- Build `runtimeEnv` as an object with **one explicit property per** `NEXT_PUBLIC_*` key your schema uses (as in the example above), or
- Read critical values with **direct** `process.env.NEXT_PUBLIC_*` in small modules (e.g. a single API base URL helper) that client code imports.

`runtimeEnv: process.env` remains fine for **server-only** modules (no Client Component import chain), because Node’s `process.env` is complete at runtime.

See also: [Next.js — Bundling Environment Variables for the Browser](https://nextjs.org/docs/app/guides/environment-variables#bundling-environment-variables-for-the-browser).

## Next.js App Router: server vs client modules

1. **Server env** — e.g. `lib/env.ts` with `import "server-only"` at the top, then `defineNextEnv` with both `server` and `client` (or server-only schema via `@envra/core`).
2. **Public env** — e.g. `lib/env-public.ts` **without** `server-only`, using `defineNextPublicEnv` or only the `client` block patterns above.
3. **Do not** import the server env module from code that is bundled for the client (Client Components, or shared `services/` / `lib/` pulled in by them). Use `publicEnv` for anything that needs env inside client bundles.

## pnpm / duplicate `@envra/core`

If TypeScript reports that `FieldBuilder` types are incompatible (*separate declarations of a private property*), you likely have **two versions** of `@envra/core` installed. Fix with a single version, for example:

```json
{
  "pnpm": {
    "overrides": {
      "@envra/core": "0.1.2"
    }
  }
}
```

## Re-exports

`@envra/next` re-exports common builders (`str`, `int`, `secret`, …), **`FieldBuilder`**, **`InferSchema`**, and `defineEnv` from `@envra/core` so you can use **one import path** in Next apps:

```ts
import { defineNextEnv, str, type InferSchema } from "@envra/next";
```

## Documentation

[github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

## License

MIT — see [LICENSE](https://github.com/hasansmadix/envra/blob/main/LICENSE) in the monorepo.
