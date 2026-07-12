# @datalackey/typescript-build-config

Shared build configuration presets for TypeScript-based projects.

## Purpose

This package centralises common build tooling configuration across all
TypeScript projects maintained under the `@datalackey` scope. The goal is a
single source of truth for settings that should be held constant across
projects, avoiding drift between repos over time.

## Installation

```bash
npm install --save-dev @datalackey/typescript-build-config
```

The postinstall script copies starter config files into your project root and
sets up the release pipeline (see below).

## Dependency Strategy

`eslint` and `prettier` are listed as `dependencies` and are pulled in
automatically. The `@typescript-eslint/*` plugins are listed in both
`dependencies` and `peerDependencies` — the peer declaration pins the minimum
version to `^8.57.1` to avoid a `ts-api-utils` incompatibility with TS 5.4+.

This package targets new projects. Use in existing projects that pin older
versions of these tools may produce peer dependency conflicts.

## Current Contents

- ESLint config
- Prettier config
- TypeScript config (`tsconfig.json`, `tsconfig.test.json`, `tsconfig.eslint.json`)
- Postinstall script that copies starter top-level config files into your
  project root, extending the configs installed under `node_modules`
- GitHub Actions release workflow (`.github/workflows/release.yml`)
- Changeset config (`.changeset/config.json`)
- Auto-changeset script (`scripts/auto-changeset.sh`)

## Release Pipeline

On install, the postinstall script copies the release pipeline files into your
project automatically. The package name in `auto-changeset.sh` is substituted
from your project's `package.json` at install time.

On `npm update`, the behavior per file is:

- **File absent** — copied into place
- **File identical to canonical** — skipped silently
- **File differs from canonical** — warning printed with a diff; local copy is
  left untouched for manual review

This means local customisations are never silently overwritten, but you are
notified when your copy has drifted from the upstream version.

The release pipeline requires an `NPM` secret stored at the GitHub organisation
level. All repos under the org inherit it automatically — no per-repo secret
configuration is needed.

## Publishing

Releases are automated via Changesets and GitHub Actions. On every push to
`main`:

1. `scripts/auto-changeset.sh` scans commits since the last tag and maps
   conventional commit prefixes to a bump level — `fix:` / `feat:` / `perf:`
   → patch, `feat!:` / `BREAKING CHANGE` → major. `chore:` / `docs:` / `ci:`
   etc. produce no release.
2. `npx changeset version` bumps `package.json` and writes `CHANGELOG.md`.
3. The version commit is pushed back to `main` with `[skip ci]` to avoid a
   loop.
4. `npx changeset publish` publishes to npm using the `NPM` org-level secret.

**For a patch release** — push a `fix:` commit to `main`. The workflow handles
the rest.

**For a minor release** — run `npx changeset` locally, commit the generated
`.changeset/*.md` file, then push. The auto-generation step is skipped when a
handwritten changeset is present.

**Manual publish (emergency):** trigger the workflow manually via
**GitHub Actions → CI / Release → Run workflow** on the `main` branch.

## License

MIT
