# envra — Next.js App Router

Copy `env.ts` into your Next.js project (e.g. `src/env.ts` or project root).

- Import `env` only from **server** code for server fields; `NEXT_PUBLIC_*` values are safe to reference where Next inlines them.
- Run CLI from the app root with `--config` pointing at this file:

```bash
pnpm envra check -c ./env.ts
pnpm envra doctor -c ./env.ts
```

Add `@envra/core`, `@envra/next`, and `@envra/cli` to your app.
