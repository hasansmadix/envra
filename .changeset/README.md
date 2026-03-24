# Changesets

This monorepo uses [Changesets](https://github.com/changesets/changesets) to version and publish `@envra/*` packages.

## Maintainers

1. After merging features, run: `pnpm changeset` (pick packages + bump type + summary).
2. Commit the generated files under `.changeset/`.
3. On `main`, the Release workflow opens a **Version packages** PR or publishes when versions are bumped (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

## Contributors

You do not need to run Changesets unless a maintainer asks you to add a changeset with your PR.
