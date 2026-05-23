# Build Workflow

Automated build via [`.github/workflows/build.yml`](../.github/workflows/build.yml).

## What It Does

| Step | Purpose |
|------|---------|
| `npm ci` | Install dependencies exactly as locked in `package-lock.json` |
| `node --check index.js` | Verify application entry point parses without running the server |

## Triggers

| Event | When |
|-------|------|
| `pull_request` | Every PR targeting `main` |
| `push` | Every push to `main` |

## How It Fits With Other CI

| Workflow | Role |
|----------|------|
| **Build** (this) | Dependency install + syntax check |
| **Lint** | ESLint quality gate ([`lint.yml`](../.github/workflows/lint.yml)) |
| **CodeQL** | Static security analysis ([`codeql.yml`](../.github/workflows/codeql.yml)) |
| **Dependency Audit** | `npm audit` on PRs ([`dependency-audit.yml`](../.github/workflows/dependency-audit.yml)) |
| **Docker** | Hardened image build and push to GHCR ([`docker.yml`](../.github/workflows/docker.yml)) |

Tests and coverage will be added to this workflow when implemented (see assignment requirements 11–13).

## Local Equivalent

```bash
npm ci
node --check index.js
```
