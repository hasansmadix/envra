# envra

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![CI](https://github.com/hasansmadix/envra/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/hasansmadix/envra/actions/workflows/ci.yml)
[![Node.js](https://img.shields.io/node/v-lts/node.svg)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/maintained%20with-pnpm-f69220.svg)](https://pnpm.io/)

Repository: [github.com/hasansmadix/envra](https://github.com/hasansmadix/envra)

**Type-safe environment variables for TypeScript — schema, validation, docs sync, and a CLI that actually helps in production.**

Not just parsing `process.env`: envra gives you a **contract** (metadata + types), **runtime safety** (masking, fail-fast or collect mode), **tooling** (`check` / `sync` / `docs` / `doctor`), and **clear server vs client boundaries** (plus a Next.js adapter).

---

## Table of contents

- [Why envra](#why-envra)
- [Install](#install)
- [Quick example](#quick-example)
- [CLI](#cli)
- [Packages](#packages)
- [Comparison](#comparison-high-level)
- [Examples](#framework-examples)
- [ESLint](#eslint)
- [Contributing](#contributing)
- [License](#license)

---

## Why envra

Config breaks in production for boring, repeatable reasons:

| Problem                         | How envra helps                                      |
| ------------------------------- | ---------------------------------------------------- |
| Missing or mistyped keys        | Validated schema, clear errors                       |
| Wrong formats                 | Built-in parsers (URL, int, bool, JSON, …)          |
| Stale `.env.example`          | `envra sync` from the same schema                    |
| Leaked secrets to the client  | `secret()`, `serverOnly()`, Next client rules          |
| Drift between environments    | `envra doctor` (undeclared vars, typos, deprecations) |

Other libraries validate well; envra adds **generated docs**, **`.env.example` sync**, **`doctor` hygiene**, and a **rich result object** (`values`, `get`, `has`, `meta`) instead of a plain map.

---

## Install

```bash
pnpm add @envra/core
pnpm add -D @envra/cli
```

Optional: `@envra/next`, `@envra/eslint-plugin` — see [Packages](#packages).

Releases use **Changesets** + GitHub Actions (see [CONTRIBUTING.md](CONTRIBUTING.md)). CI publishes with **[npm Trusted Publishing (OIDC)](https://docs.npmjs.com/trusted-publishers)** — no long-lived `NPM_TOKEN` in secrets. Each `@envra/*` package must register the same repo + `release.yml` on npm.

---

## Quick example

```ts
import { defineEnv, str, url, int, bool, secret, oneOf } from "@envra/core";

export const env = defineEnv({
  NODE_ENV: oneOf(["development", "test", "production"] as const).describe(
    "Current runtime environment",
  ),
  APP_URL: url().describe("Public URL").example("https://example.com"),
  DB_URL: secret(url()).serverOnly().describe("Database URL"),
  PORT: int().default(3000),
  REDIS_ENABLED: bool().default(false),
});
```

```ts
env.values.DB_URL;
env.get("PORT");
env.has("REDIS_ENABLED");
env.meta("APP_URL");
```

---

## CLI

```text
pnpm envra check  -c ./env.config.ts
pnpm envra sync   -c ./env.config.ts -o .env.example
pnpm envra docs   -c ./env.config.ts -o ENVIRONMENT.md
pnpm envra doctor -c ./env.config.ts
```

Loads TypeScript configs via **jiti** (no separate compile step for the config file). Your app should depend on `@envra/core`; add `@envra/cli` as a dev dependency.

| Command   | Use case                          |
| --------- | --------------------------------- |
| `check`   | CI / preflight — validate `process.env` |
| `sync`    | Regenerate `.env.example`         |
| `docs`    | Regenerate `ENVIRONMENT.md`      |
| `doctor`  | Undeclared vars, typos, deprecations, profile rules |

---

## Packages

| Package                | Role                                                              |
| ---------------------- | ----------------------------------------------------------------- |
| `@envra/core`          | Schema DSL, `defineEnv`, validation, generators, `doctor` helpers |
| `@envra/cli`           | `envra` binary                                                    |
| `@envra/next`          | `defineNextEnv({ server, client, runtimeEnv })`                   |
| `@envra/eslint-plugin` | `envra/no-process-env`                                            |

---

## Comparison (high level)

| Capability                       | envra | t3-env  | envalid | znv |
| -------------------------------- | ----- | ------- | ------- | --- |
| Validation                       | yes   | yes     | yes     | yes |
| Type inference                   | yes   | yes     | partial | yes |
| Docs / `.env.example` generation | yes   | limited | no      | no  |
| Doctor-style hygiene             | yes   | no      | no      | no  |
| Framework adapter (Next)         | yes   | yes     | limited | no  |

Treat this as directional; versions and features change over time.

---

## Framework examples

- **Node**: [examples/node-basic](examples/node-basic)
- **Next.js App Router**: [examples/next-app-router](examples/next-app-router)
- **NestJS**: [examples/nestjs](examples/nestjs) — `defineEnv` with `options.source` from `ConfigModule.validate`

---

## ESLint

```js
// eslint.config.js
import { flatRecommended } from "@envra/eslint-plugin";

export default [
  ...flatRecommended,
  {
    rules: {
      "envra/no-process-env": [
        "error",
        { allowGlobs: ["**/env.config.ts", "**/env.ts"] },
      ],
    },
  },
];
```

---

## Monorepo layout

```text
envra/
  packages/
    core/
    cli/
    next/
    eslint-plugin/
  examples/
    node-basic/
    next-app-router/
    nestjs/
```

---

## Roadmap (ideas)

- Optional Zod bridge package
- More framework entrypoints
- Explicit dotenv file as a source (alongside `process.env`)
- Richer `doctor` policies

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). [SECURITY.md](SECURITY.md) for responsible disclosure. [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md) applies to all interaction.

### Growing the project (maintainers)

On GitHub, **Topics** help discovery. Consider: `typescript`, `environment-variables`, `config`, `validation`, `nextjs`, `nodejs`, `eslint`, `12-factor`, `devtools`, `monorepo`.

A clear **repository social preview** (Settings → Social preview) and a short **demo GIF** in the README (optional) also improve click-through from social feeds.

---

## License

MIT — see [LICENSE](LICENSE).
