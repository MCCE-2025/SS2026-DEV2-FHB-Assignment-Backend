# Dependabot Configuration

Automated dependency updates are managed via [`.github/dependabot.yml`](../.github/dependabot.yml).

## Current Setup

| Setting | Value |
|---------|-------|
| Ecosystem | npm |
| Directory | `/` |
| Schedule | Weekly (Monday, 03:00 UTC) |
| Open PR limit | 5 |
| Commit prefix | `chore(deps)` / `chore(deps-dev)` |

Updates are grouped into **production** and **development** dependencies to reduce PR noise.

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

## References

- [Dependabot docs](https://docs.github.com/en/code-security/dependabot)
- [Configuration reference](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file)
