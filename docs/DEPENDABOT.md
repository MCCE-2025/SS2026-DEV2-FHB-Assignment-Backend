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

## Dependency Review on PRs

Dependabot only runs on a schedule — it does **not** scan PRs. To catch vulnerable or problematic dependencies *before* they're merged, the repo also runs [`actions/dependency-review-action`](https://github.com/actions/dependency-review-action) via [`.github/workflows/dependency-review.yml`](../.github/workflows/dependency-review.yml).

| Trigger | Pull requests targeting `main` |
|---------|--------------------------------|
| Fails on | Vulnerabilities of `moderate` severity or higher |
| Permissions | `contents: read` |

This complements Dependabot:

- **Dependabot** → keeps existing dependencies up to date (scheduled)
- **Dependency Review** → blocks new vulnerable dependencies in PRs (on PR events)

### Requirements

The action requires either a **public repository** or **GitHub Advanced Security** enabled for private repos. Without one of these, the workflow will fail.

### Tuning Severity

Adjust `fail-on-severity` in the workflow to `low`, `moderate`, `high`, or `critical` depending on how strict you want the check.

## References

- [Dependabot docs](https://docs.github.com/en/code-security/dependabot)
- [Configuration reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
- [Dependency Review Action](https://github.com/actions/dependency-review-action)
