# CodeQL Configuration

Static application security testing (SAST) is provided via [`.github/workflows/codeql.yml`](../.github/workflows/codeql.yml).

## Current Setup

| Setting | Value |
|---------|-------|
| Language | `javascript-typescript` |
| Query suite | `security-extended` |
| Quality gate | Job fails on `error`-severity findings (CodeQL default) |
| Workflow permissions | `contents: read`, `security-events: write`, `actions: read` |

## Triggers

| Event | When |
|-------|------|
| `pull_request` | Every PR targeting `main` |
| `push` | Every push to `main` |
| `schedule` | Weekly, Monday 05:23 UTC (`23 5 * * 1`) |

The scheduled run catches new vulnerabilities in the query pack even when no code changes.

## How It Fits With Other Security Tools

| Tool | Type | What it checks |
|------|------|----------------|
| **CodeQL** | SAST | First-party source code (this workflow) |
| **`npm audit`** | SCA | Known CVEs in npm dependencies ([`dependency-audit.yml`](../.github/workflows/dependency-audit.yml)) |
| **Dependabot** | Updates | Keeps npm and GitHub Actions dependencies current ([`dependabot.yml`](../.github/dependabot.yml)) |

CodeQL does not replace dependency scanning — the three layers complement each other.

## Quality Gate (Branch Protection)

The workflow fails when CodeQL reports findings at **error** severity. To block merges until CodeQL passes, add it as a required status check on `main`:

1. Push or merge the CodeQL workflow to `main` and wait for at least one successful run.
2. Go to **Settings → Branches → Branch protection rules** for `main`.
3. Enable **Require status checks to pass before merging**.
4. Add **`Analyze (javascript-typescript)`** to the required checks list.

This step cannot be configured from repository files; it is a one-time repository setting.

## Viewing Results

- **Security → Code scanning** — all findings and history
- **Pull request checks** — inline annotations on changed lines when applicable

Requires a **public repository** or **GitHub Advanced Security** on a private repo for full SARIF upload and PR integration.

## Triage and Suppression

### Dismiss in the Security tab

Use **Dismiss** on a finding when it is a false positive or accepted risk. Document the reason in the dismissal dialog.

### Inline suppression

Suppress a specific rule on a line:

```javascript
eval(userInput); // codeql[js/eval-call]
```

### Path ignores (optional)

For broader exclusions, add [`.github/codeql/codeql-config.yml`](../.github/codeql/codeql-config.yml):

```yaml
paths-ignore:
  - "**/node_modules/**"
```

Not required for this repo today — the workflow has no custom config file yet.

## Query Suite

`security-extended` includes the default security queries plus additional ones. It avoids the maintainability and style rules in `security-and-quality`, which keeps the PR gate focused on security issues.

To change the suite, edit the `queries:` input in `codeql.yml` (`security-extended`, `security-and-quality`, or a custom query pack path).

## References

- [CodeQL for JavaScript/TypeScript](https://codeql.github.com/docs/codeql-language-guides/javascript/)
- [Configuring code scanning](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning-for-a-repository)
- [CodeQL query suites](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql#about-codeql-query-suites)
