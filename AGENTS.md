# Agent Guidelines

## Project Overview

A minimal Node.js/Express REST API for managing notes. Notes are kept in-memory (no database) and exposed via the following endpoints:

- `GET /api/notes` — list all notes
- `GET /api/notes/:id` — fetch a single note
- `POST /api/notes` — create a note (`content` required, `important` optional)
- `DELETE /api/notes/:id` — remove a note

Entry point: `index.js` · Server runs on port `3001`.

## ⚠️ Dependabot Configuration Required

**When adding third-party components or libraries, update `.github/dependabot.yml`.**

### Current Dependencies
- **npm** (Node.js) at root (`/`)
- **github-actions** at root (`/`)

### How to Add New Ecosystems

Add a new entry to `.github/dependabot.yml` following this pattern. Include a `groups` block so updates land in one PR per ecosystem (matches the existing convention — see `docs/DEPENDABOT.md`):

```yaml
- package-ecosystem: "ecosystem-name"
  directory: "/path/to/dependencies"
  schedule:
    interval: "weekly"
  groups:
    ecosystem-name-minor-patch:
      patterns: ["*"]
      update-types: ["minor", "patch"]
    ecosystem-name-major:
      patterns: ["*"]
      update-types: ["major"]
```

### Supported Ecosystems
- `npm` (Node.js)
- `pip` (Python)
- `cargo` (Rust)
- `bundler` (Ruby)
- `composer` (PHP)
- `docker` (Docker images)
- `github-actions` (GitHub Actions)
- And more... see [Dependabot docs](https://docs.github.com/en/code-security/dependabot)

### Example: Adding Python
```yaml
- package-ecosystem: "pip"
  directory: "/"
  schedule:
    interval: "weekly"
```

See `docs/DEPENDABOT.md` for full configuration details.

## CodeQL (SAST)

Static code analysis runs via [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml) on PRs and pushes to `main`. See `docs/CODEQL.md` for triggers, quality gate, and triage.

## GitHub Actions security (zizmor)

Every workflow under `.github/workflows/**` is statically audited on each PR by [`zizmor`](https://docs.zizmor.sh) via [`.github/workflows/actions-security.yml`](.github/workflows/actions-security.yml). The gate fails on findings of `medium` severity or higher.

Most importantly: every `uses:` reference MUST be pinned to a full 40-character commit SHA with the version as a trailing comment:

```yaml
- uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

Float refs like `@v6`, `@main`, or `@master` are rejected by the `unpinned-uses` audit. Dependabot keeps the SHAs updated automatically on the weekly `github-actions` schedule. When adding a new action, run `zizmor --fix .github/workflows/` locally before committing — see [`docs/ACTIONS-SECURITY.md`](docs/ACTIONS-SECURITY.md) for the full audit catalog, severity policy, and bumping instructions.
