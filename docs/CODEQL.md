# CodeQL Configuration

Static application security testing (SAST) is provided via [`.github/workflows/codeql.yml`](../.github/workflows/codeql.yml).

## Current Setup

| Setting | Value |
|---------|-------|
| Language | `javascript-typescript` |
| Query suite | `security-extended` |
| Build mode | `none` (no autobuild step; JS/TS is extracted directly from source) |
| Quality gate | Job fails on `error`-severity findings (CodeQL default) |
| Workflow permissions | `contents: read`, `security-events: write`, `actions: read` |
| Concurrency | One run per ref; superseded PR runs are cancelled |

## Triggers

| Event | When |
|-------|------|
| `pull_request` | PRs targeting `main` that change application source (see [PR path filters](#pr-path-filters) below) |
| `push` | Every push to `main` |
| `schedule` | Weekly, Monday 05:23 UTC (`23 5 * * 1`) |

The scheduled run catches new vulnerabilities in the query pack even when no code changes.

### PR path filters

On pull requests, the full CodeQL scan is **skipped** when the diff only touches paths that cannot affect JavaScript/TypeScript analysis (a lightweight sibling job still reports check status):

| Ignored path | Reason |
|--------------|--------|
| `**/*.md` | Documentation only |
| `docs/**` | Documentation only |
| `.github/**` | Workflows, Dependabot, and other GitHub config (not scanned as JS/TS) |

Pushes to `main` and the weekly schedule still run CodeQL regardless of which files changed.

**Note:** A PR that only edits `.github/workflows/codeql.yml` runs the lightweight `analyze-skipped` job on the PR. The full scan runs on the first push to `main` after merge.

## Performance

| Mechanism | What it does |
|-----------|--------------|
| **Built-in CodeQL cache** | `github/codeql-action@v4` restores and saves the CodeQL CLI bundle and query pack automatically between runs (see the *Restore CodeQL cache* step in workflow logs). No manual `actions/cache` step is needed. |
| **`build-mode: none`** | Skips autobuild probing for this plain Node.js repo. |
| **`concurrency`** | Cancels outdated PR runs when new commits are pushed; `main` and scheduled runs are not cancelled. |
| **PR `paths-ignore`** | Avoids full scans for doc-only or CI-only PRs. |

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

### Required checks and PR path filters

If **`Analyze (javascript-typescript)`** is required and a PR only changes ignored paths (for example, `README.md` or `.github/workflows/build.yml`), the CodeQL job does not run. GitHub may then show the check as *Expected — waiting for status to be reported* and block the merge.

Options:

1. **Do not require CodeQL yet** — keep it informational until you need a hard gate.
2. **Include a trivial source change** in the same PR when you only edit docs or workflows (not ideal).
3. **Skipped sibling job (configured)** — [`codeql.yml`](../.github/workflows/codeql.yml) includes an `analyze-skipped` job with the same name as the real scan. On PRs that only touch ignored paths, that job reports success so required checks are satisfied without running a full analysis.

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

### CodeQL path ignores (optional)

PR [path filters](#pr-path-filters) control **when the workflow runs**. Separately, a [`.github/codeql/codeql-config.yml`](../.github/codeql/codeql-config.yml) file can exclude paths **from analysis** when a run does execute:

```yaml
paths-ignore:
  - "**/node_modules/**"
```

Not required for this repo today — the workflow has no custom CodeQL config file yet.

## Query Suite

`security-extended` includes the default security queries plus additional ones. It avoids the maintainability and style rules in `security-and-quality`, which keeps the PR gate focused on security issues.

To change the suite, edit the `queries:` input in `codeql.yml` (`security-extended`, `security-and-quality`, or a custom query pack path).

## References

- [CodeQL for JavaScript/TypeScript](https://codeql.github.com/docs/codeql-language-guides/javascript/)
- [Configuring code scanning](https://docs.github.com/en/code-security/code-scanning/automatically-scanning-your-code-for-vulnerabilities-and-errors/configuring-code-scanning-for-a-repository)
- [CodeQL query suites](https://docs.github.com/en/code-security/code-scanning/introduction-to-code-scanning/about-code-scanning-with-codeql#about-codeql-query-suites)
