# ESLint Configuration

Linting is provided via [`.github/workflows/lint.yml`](../.github/workflows/lint.yml) and [`eslint.config.mjs`](../eslint.config.mjs).

## Current Setup

| Setting | Value |
|---------|-------|
| ESLint version | 10.x (flat config) |
| Config file | `eslint.config.mjs` |
| Rule set | `@eslint/js` `recommended` |
| Module system | CommonJS |
| Runtime | Node.js (`globals.node`) |
| Quality gate | Job fails on any ESLint `error` (non-zero exit code) |

Configuration matches the choices from `npm init @eslint/config`: syntax and problem checking, CommonJS, no framework, no TypeScript, Node environment.

## Local Usage

```bash
npm run lint       # check all project files
npm run lint:fix   # auto-fix where possible
```

## Triggers

| Event | When |
|-------|------|
| `pull_request` | Every PR targeting `main` |
| `push` | Every push to `main` |

## How It Fits With Other Quality Tools

| Tool | Type | What it checks |
|------|------|----------------|
| **ESLint** | Linting | Style, syntax, and common JS mistakes (this workflow) |
| **CodeQL** | SAST | Security issues in source code ([`codeql.yml`](../.github/workflows/codeql.yml)) |
| **`npm audit`** | SCA | Known CVEs in npm dependencies ([`dependency-audit.yml`](../.github/workflows/dependency-audit.yml)) |
| **Dependabot** | Updates | Keeps npm and GitHub Actions dependencies current ([`dependabot.yml`](../.github/dependabot.yml)) |

ESLint complements CodeQL: ESLint catches everyday JavaScript issues during development; CodeQL focuses on security-oriented static analysis.

## Quality Gate (Branch Protection)

The workflow fails when ESLint reports any finding at **error** severity (`npm run lint` exits with code 1). To block merges until ESLint passes, add it as a required status check on `main`:

1. Push or merge the Lint workflow to `main` and wait for at least one successful run.
2. Go to **Settings → Branches → Branch protection rules** for `main`.
3. Enable **Require status checks to pass before merging**.
4. Add **`eslint`** to the required checks list.

This step cannot be configured from repository files; it is a one-time repository setting.

## Ignored Paths

`node_modules/**` is excluded in `eslint.config.mjs`. Add more paths under the top-level `ignores` array if needed.

## References

- [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Getting started with ESLint](https://eslint.org/docs/latest/use/getting-started)
