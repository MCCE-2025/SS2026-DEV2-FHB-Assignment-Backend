# ESLint Configuration

Linting is provided via [`.github/workflows/lint.yml`](../.github/workflows/lint.yml) and [`eslint.config.mjs`](../eslint.config.mjs).

## Current Setup

| Setting | Value |
|---------|-------|
| ESLint version | 10.x (flat config) |
| Config file | `eslint.config.mjs` |
| Module system | CommonJS (app code) + ESM (config files) |
| Runtime | Node.js (`globals.node`) |
| Quality gate | Job fails on any ESLint `error` **or** `warning` (`--max-warnings=0`) |

The baseline came from the `npm init @eslint/config` wizard (syntax + problem checking, CommonJS, no framework, no TypeScript, Node). The ruleset is then extended with the layers below.

### Active Rule Layers

| Layer | Source | Purpose |
|-------|--------|---------|
| Recommended | `@eslint/js` `recommended` | Core ESLint correctness rules |
| Node | `eslint-plugin-n` `flat/recommended-script` (CJS) / `flat/recommended-module` (ESM) | Node-specific checks (missing modules, deprecated APIs, etc.) |
| Security | `eslint-plugin-security` `recommended` | Lint-time patterns: unsafe regex, `eval`, `child_process`, etc. (complements CodeQL) |
| Style | `@stylistic/eslint-plugin` | Single quotes, 2-space indent, no semicolons, no-trailing-spaces, eol-last, etc. — matches existing `index.js` |
| Best practices | Built-in | `eqeqeq`, `no-var`, `prefer-const`, `curly`, `no-throw-literal`, `no-return-await`, `no-unused-expressions`, `no-implicit-globals`, `no-console` (warn, with `log/info/warn/error` allowed) |

### Overrides

- `n/no-unpublished-import` is disabled for `eslint.config.{js,mjs,cjs}` — flat-config files import devDependencies by design.

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

The `lint` script runs `eslint . --max-warnings=0`, so the workflow fails on **any** ESLint finding — errors *and* warnings cause a non-zero exit code. To block merges until ESLint passes, add it as a required status check on `main`:

1. Push or merge the Lint workflow to `main` and wait for at least one successful run.
2. Go to **Settings → Branches → Branch protection rules** for `main`.
3. Enable **Require status checks to pass before merging**.
4. Add **`eslint`** to the required checks list.

This step cannot be configured from repository files; it is a one-time repository setting.

## Ignored Paths

`node_modules/**` and `coverage/**` are excluded in `eslint.config.mjs`. Add more paths under the top-level `ignores` array if needed.

## References

- [ESLint flat config](https://eslint.org/docs/latest/use/configure/configuration-files)
- [Getting started with ESLint](https://eslint.org/docs/latest/use/getting-started)
- [`@stylistic/eslint-plugin`](https://eslint.style/)
- [`eslint-plugin-n`](https://github.com/eslint-community/eslint-plugin-n)
- [`eslint-plugin-security`](https://github.com/eslint-community/eslint-plugin-security)
