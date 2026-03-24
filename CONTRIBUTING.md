# Contributing to envra

Thanks for helping improve envra. Small fixes and large refactors are welcome.

## Development

Requirements: Node 18+, pnpm 9.

```bash
pnpm install
pnpm build
pnpm test
```

- `packages/core` — schema, validation, generators, doctor helpers
- `packages/cli` — `envra` binary (Commander + jiti)
- `packages/next` — `defineNextEnv`
- `packages/eslint-plugin` — `no-process-env`

## Pull requests

1. Open an issue first if the change is large or API-shaping.
2. Keep commits focused; match existing style (TypeScript, minimal comments).
3. Add or update tests when behavior or public API changes.
4. Ensure `pnpm build` and `pnpm test` pass locally.

### Pre-release check (maintainers)

Before pushing a release or opening the version PR:

1. `pnpm install`
2. `pnpm build` (or `pnpm run build` from repo root)
3. `pnpm test`
4. From `packages/cli`, run `pnpm pack` and confirm `package/package.json` in the tarball lists a real semver for `@envra/core` (not `workspace:*`).

## Publishing (maintainers)

We use [Changesets](https://github.com/changesets/changesets) for versioning and npm releases of `@envra/*`.

### Trusted Publishing (OIDC) — recommended

We **do not** use `NPM_TOKEN` in GitHub Actions. Releases use [npm Trusted Publishing](https://docs.npmjs.com/trusted-publishers): short-lived OIDC from **GitHub-hosted** runners, no long-lived publish token in secrets.

**Requirements (from npm):** npm CLI **≥ 11.5.1**, Node **≥ 22.14**. The [Release workflow](.github/workflows/release.yml) pins a new enough `npm` globally after `setup-node`.

#### Monorepo / scope caveat

Trusted Publisher is configured **per package** on npm, but the **link is to one GitHub repo + one workflow file** (`release.yml`). For this repo you repeat the same publisher setup for each published package:

| Package                | On npm → Package → Settings → Trusted publishing    |
| ---------------------- | --------------------------------------------------- |
| `@envra/core`          | GitHub: `hasansmadix/envra`, workflow `release.yml` |
| `@envra/cli`           | same                                                |
| `@envra/next`          | same                                                |
| `@envra/eslint-plugin` | same                                                |

All must live under an npm org/user that allows those publishes. The workflow filename must match **exactly** (e.g. `release.yml`, case-sensitive).

#### GitHub Actions permissions

The Release job needs:

- `id-token: write` — OIDC for npm (no token secret).
- `contents: write` and `pull-requests: write` — **required by Changesets** to open/update the “Version packages” PR and push version bumps.  
  Using only `contents: read` would break that flow.

#### Optional hardening (npm UI)

After Trusted Publishing works, npm recommends restricting classic publish tokens for those packages. See npm docs: _Publishing access_ → require 2FA / disallow tokens where appropriate.

### Release flow

1. After meaningful changes: `pnpm changeset` — select affected `@envra/*` packages and semver bump (patch/minor/major), write a summary.
2. Commit and push the new file under `.changeset/`.
3. Merge to `main`. The Release action opens or updates the **Version packages** PR; when that merges, the next run runs `pnpm release` (`pnpm build` then `changeset publish`) using OIDC.

### First publish (nothing on npm yet)

If packages are not on the registry yet, you may need a **one-time** authenticated publish (npm login or a disposable token) so the packages exist; then attach Trusted Publishers on each package and switch fully to CI. Alternatively follow npm’s current UI for empty packages + trusted publisher.

After the first successful CI publish, prefer **Changesets + Release workflow** only.

### Manual (emergency only)

From a clean `main`, with local `npm login` (or token) and builds done:

```bash
pnpm build
pnpm exec changeset publish
```

Prefer the GitHub Action so versions and git tags stay aligned with changelogs.

### Troubleshooting local `changeset publish`

**`warn Received 404` for `npm info "@envra/..."`**

Often normal: Changesets checks whether the **new** version (e.g. `0.1.1`) is already on the registry; until it is published, that can return 404. Your previous release (e.g. `0.1.0`) can still be live — verify with:

```bash
npm view @envra/core version
```

**`packages failed to publish` with no npm error**

Changesets does not always print npm’s stderr. Run one package to see the real code:

```bash
pnpm build
pnpm --filter @envra/core publish --access public --no-git-checks
```

**`npm error code EOTP` (most common after 0.1.0 works)**

Your npm account uses **2FA for publishing**. Non-interactive `changeset publish` cannot prompt for an OTP.

- **Quick:** publish with a fresh code from your authenticator:  
  `pnpm --filter @envra/core publish --access public --no-git-checks --otp=123456`  
  (repeat for other packages in order: core → cli, next, eslint-plugin — or use an Automation token below and run `pnpm exec changeset publish` once.)
- **Better for repeated CLI publishes:** create an [**Automation**](https://docs.npmjs.com/creating-and-viewing-access-tokens#creating-granular-access-tokens-on-the-website) granular access token (publish-capable, no OTP), then `npm login` or set in user `.npmrc`:  
  `//registry.npmjs.org/:_authToken=npm_yourTokenHere`

GitHub Actions releases use **Trusted Publishing (OIDC)** and do not need this OTP when OIDC is configured on each package.

### Troubleshooting OIDC

- `ENEEDAUTH`: workflow file name on npm must match `.github/workflows/release.yml` exactly; repo slug must match; use **GitHub-hosted** runners.
- `workflow_call` / reusable workflows: npm validates the **caller** workflow name — avoid indirect publish flows that confuse that check (see [npm troubleshooting](https://docs.npmjs.com/trusted-publishers#troubleshooting)).
- **Private GitHub repo:** trusted publishing can still publish public packages, but npm may not generate provenance (npm documents this limitation).

## Community

Please be respectful. For reporting security issues, see [SECURITY.md](SECURITY.md).
