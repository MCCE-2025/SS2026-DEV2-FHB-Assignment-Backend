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
- **docker** (base images in `Dockerfile`) at root (`/`)

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

## Docker base images (digest-pinned)

Every `FROM` line in the [`Dockerfile`](Dockerfile) MUST be pinned to a `@sha256:…` digest with the human-readable tag as a trailing comment — same convention as `uses:` for GitHub Actions:

```dockerfile
FROM gcr.io/distroless/nodejs22-debian12:nonroot@sha256:13593b7570658e8477de39e2f4a1dd25db2f836d68a0ba771251572d23bb4f8e AS runtime
```

Floating tags (`:nonroot`, `:22-alpine`, …) let the GHA build cache silently keep a vulnerable base layer that the Snyk container scan ([`docs/SNYK.md`](docs/SNYK.md)) has already flagged. Dependabot's `docker-all` group bumps digests (and trailing version comments) within the pinned **LTS** Node major only — major bumps are ignored so non-LTS lines (e.g. Node 26 before its LTS window) are not proposed automatically. To resolve a current digest manually:

```bash
docker buildx imagetools inspect gcr.io/distroless/nodejs22-debian12:nonroot
```

See [`docs/DOCKER.md`](docs/DOCKER.md) for the full image layout and [`docs/DEPENDABOT.md`](docs/DEPENDABOT.md) for the grouping and auto-merge rules.
