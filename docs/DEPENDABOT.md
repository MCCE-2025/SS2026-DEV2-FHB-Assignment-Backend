# Dependabot Configuration

Automated dependency updates are managed via [`.github/dependabot.yml`](../.github/dependabot.yml).

## Current Setup

| Ecosystem | Directory | Schedule | Commit prefix |
|-----------|-----------|----------|---------------|
| `npm` | `/` | Weekly (Monday, 03:00 UTC) | `chore(deps)` / `chore(deps-dev)` |
| `github-actions` | `/` | Weekly (Monday, 03:00 UTC) | `chore(ci)` |
| `docker` | `/` | Weekly (Monday, 03:00 UTC) | `chore(docker)` |

Open PR limit for `npm`: **5**.

## Grouped Updates

To keep PR noise low, updates are consolidated via [Dependabot groups](https://docs.github.com/en/code-security/dependabot/dependabot-version-updates/configuration-options-for-the-dependabot.yml-file#groups):

| Group | Ecosystem | Includes |
|-------|-----------|----------|
| `npm-minor-patch` | `npm` | All minor & patch bumps in one PR |
| `npm-major` | `npm` | All major bumps in one PR (review carefully) |
| `actions-all` | `github-actions` | All workflow action bumps in one PR |
| `docker-all` | `docker` | All base-image digest bumps in one PR |

Major bumps are kept in a separate group because they may be breaking and warrant manual review.

> **GitHub Actions are SHA-pinned.** The `actions-all` group bumps the
> commit SHAs (and the version comment) rather than floating tags. See
> [`ACTIONS-SECURITY.md`](./ACTIONS-SECURITY.md) for the policy (enforced by
> zizmor's `unpinned-uses` audit) and other workflow security checks.

> **Docker base images are digest-pinned.** Every `FROM` in the
> [`Dockerfile`](../Dockerfile) is pinned by `@sha256:…` with a trailing
> version comment, so a stale GHA build cache cannot silently reintroduce a
> vulnerable layer. The `docker-all` group bumps both the digest and the
> comment. See [`DOCKER.md`](./DOCKER.md) and [`SNYK.md`](./SNYK.md) for the
> rebuild + container-scan flow.

> **Docker Node images stay on the pinned LTS major.** The `docker` entry
> ignores semver-major bumps for `node` and `distroless/nodejs*`, plus odd Node
> majors that are never LTS. This matches CI (`node-version: lts/*`) and
> distroless, which only ships LTS Node majors. Weekly PRs refresh digests
> within the current major; moving to the next Active LTS (e.g. `24` → `26`)
> is a deliberate `Dockerfile` + `engines.node` change after the new line is
> LTS and `gcr.io/distroless/nodejs<major>-debian13` is published.

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

Dependabot itself cannot auto-merge — `dependabot.yml` has no option for it. Auto-merge is wired up via [`.github/workflows/dependabot-auto-merge.yml`](../.github/workflows/dependabot-auto-merge.yml), which uses [`dependabot/fetch-metadata`](https://github.com/dependabot/fetch-metadata) to inspect each PR and arm GitHub's native auto-merge on safe updates.

| Update type | Behavior |
|-------------|----------|
| `semver-patch` | Auto-merge armed (squash) |
| `semver-minor` | Auto-merge armed (squash) |
| `semver-major` | **No** auto-merge — manual review |

GitHub still waits for required checks before merging, so the PR only merges once `Lint`, `CodeQL`, and `Dependency Audit` all pass.

### Required setup (one-time)

1. **Repo setting** — Settings → General → Pull Requests → enable **"Allow auto-merge"**.
2. **Branch protection on `main`** — mark the following as required status checks so a PR cannot auto-merge without them:
   - `Lint` (`eslint`)
   - `CodeQL` (`Analyze (javascript-typescript)`)
   - `Dependency Audit` (`npm-audit`)
   - `Actions Security` (`Audit workflows (zizmor)`)

Without required checks, an auto-merge workflow could land an untested PR.

### Permissions

The workflow needs `contents: write` and `pull-requests: write` to arm auto-merge. Those scopes are declared at the workflow level — other workflows in the repo keep their narrower `contents: read` scope.

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
