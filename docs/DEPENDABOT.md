# Dependabot Configuration

Automated dependency updates are managed via [`.github/dependabot.yml`](../.github/dependabot.yml).

## Current Setup

| Ecosystem | Directory | Schedule | Commit prefix |
|-----------|-----------|----------|---------------|
| `npm` | `/` | Weekly (Monday, 03:00 UTC) | `chore(deps)` / `chore(deps-dev)` |
| `github-actions` | `/` | Weekly (Monday, 03:00 UTC) | `chore(ci)` |

Open PR limit for `npm`: **5**.

## Adding a New Ecosystem

Append a new entry to `.github/dependabot.yml`:

```yaml
- package-ecosystem: "<ecosystem>"
  directory: "/<path>"
  schedule:
    interval: "weekly"
```

See [supported ecosystems](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#package-ecosystem).

## Auto-merge

Auto-merge is **not** configured in `dependabot.yml` (not supported there). To enable it, either:
- Enable "Allow auto-merge" in repository settings and use `gh pr merge --auto`, or
- Add a GitHub Actions workflow that auto-merges Dependabot PRs after CI passes.

## Dependency Audit on PRs

Dependabot only runs on a schedule — it does **not** scan PRs. To catch vulnerable dependencies *before* they're merged, the repo runs `npm audit` via [`.github/workflows/dependency-audit.yml`](../.github/workflows/dependency-audit.yml).

| Trigger | Pull requests targeting `main` |
|---------|--------------------------------|
| Command | `npm audit --audit-level=moderate` |
| Fails on | Vulnerabilities of `moderate` severity or higher |
| Permissions | `contents: read` |

This complements Dependabot:

- **Dependabot** → keeps existing dependencies up to date (scheduled)
- **`npm audit`** → blocks PRs that introduce known vulnerabilities (on PR events)

### Why `npm audit` instead of `actions/dependency-review-action`?

GitHub's [`dependency-review-action`](https://github.com/actions/dependency-review-action) requires either a **public repository** or **GitHub Advanced Security**. Since this repo is private without GHAS, we use `npm audit` — it's free, built into npm, and provides comparable CVE detection for npm dependencies.

### Tuning Severity

Adjust `--audit-level` in the workflow to `low`, `moderate`, `high`, or `critical` depending on how strict you want the check.

## References

- [Dependabot docs](https://docs.github.com/en/code-security/dependabot)
- [Configuration reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [`npm audit` docs](https://docs.npmjs.com/cli/v10/commands/npm-audit)
