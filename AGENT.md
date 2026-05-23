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

### How to Add New Ecosystems

Add a new entry to `.github/dependabot.yml` following this pattern:

```yaml
- package-ecosystem: "ecosystem-name"
  directory: "/path/to/dependencies"
  schedule:
    interval: "weekly"
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
