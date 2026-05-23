# GitHub Actions Security

Every workflow file in `.github/workflows/**` (and any composite action under
`.github/actions/**`) is statically audited on every PR by
[**zizmor**](https://docs.zizmor.sh) — a Rust-based security scanner for
GitHub Actions, written and maintained by Trail of Bits.

The gate lives in [`.github/workflows/actions-security.yml`](../.github/workflows/actions-security.yml).

## What zizmor checks

Zizmor runs ~25 audits on every workflow. The ones that bite most often:

| Audit | What it catches |
|-------|-----------------|
| `unpinned-uses` | A `uses:` clause that isn't pinned to a 40-char commit SHA |
| `ref-version-mismatch` | A SHA whose `# vX.Y.Z` comment doesn't match the upstream tag |
| `excessive-permissions` | A `permissions:` block broader than the job needs |
| `artipacked` | `actions/checkout` without `persist-credentials: false`, which can leak the `GITHUB_TOKEN` if the working tree (`.git/`) is later uploaded as an artifact |
| `template-injection` | `${{ github.event.* }}` interpolated directly into a `run:` block (shell-injection vector) |
| `dangerous-triggers` | `pull_request_target` + checkout of untrusted refs (the classic GHA RCE pattern) |
| `impostor-commit` | A commit SHA that looks legit but doesn't exist in the claimed action's repo |
| `cache-poisoning` | Cache restore patterns that can be hijacked by attackers |
| `obfuscation` | Suspicious encoding / hidden `run:` payloads |

Full list and remediation guides: <https://docs.zizmor.sh/audits/>

## SHA-pinning policy

Since zizmor v1.20, `unpinned-uses` defaults to a **blanket hash-pin
policy** — every `uses:` clause in every workflow must reference a full
40-character commit SHA, with the human-readable tag preserved as a
trailing comment:

```yaml
- uses: actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2
```

Float refs like `@v6`, `@main`, or `@master` are **rejected by CI** with
`error[unpinned-uses]: action is not pinned to a hash (required by blanket
policy)`. Dependabot understands SHA-pinned actions and bumps both the
SHA and the comment in lockstep on the weekly `github-actions` schedule
(see [`DEPENDABOT.md`](./DEPENDABOT.md)).

## Severity threshold

The CI job fails on findings of **`medium` severity or higher**. Lower
findings (informational, low) still appear as PR annotations but don't
block merging. Adjust the `min-severity` input in
[`actions-security.yml`](../.github/workflows/actions-security.yml) if
you want stricter or more lenient gating.

| Severity | CI behavior |
|----------|-------------|
| `high`, `error` | ❌ Fails the job |
| `medium`, `warning` | ❌ Fails the job |
| `low` | ✓ Annotated only |
| `informational` | ✓ Annotated only |

## Why not just GitHub's built-in workflow validation?

GitHub itself only validates **syntax**. It will happily run a workflow that
checks out untrusted PR refs with `pull_request_target`, hands `secrets`
to a third-party action pinned to `@master`, and writes them to an
attacker-controlled artifact. Zizmor is the (open-source) equivalent of
CodeQL but for the workflow files themselves.

## Adding a new action

1. Add it with its normal tag, e.g. `uses: foo/bar@v3`.
2. Run zizmor locally with `--fix` (`zizmor --fix .github/workflows/`) to
   auto-hash-pin it, or pin manually by replacing the tag with the SHA
   from the action's release page.
3. Push. The `Actions Security / Audit workflows (zizmor)` job will tell
   you if you missed anything.

### Install zizmor locally

```bash
brew install zizmor                 # macOS / Homebrew
cargo install zizmor                # Rust toolchain
pipx install zizmor                 # via PyPI wheel

# Or grab a release binary
# https://github.com/zizmorcore/zizmor/releases
```

## Bumping zizmor

Two values, in two places:

1. **The action wrapper** (`zizmorcore/zizmor-action@<sha> # v0.5.6`) — bumped
   automatically by Dependabot's `github-actions` ecosystem.
2. **The zizmor binary version** (`version: "1.25.2"` input on the action) —
   bump manually when you want a newer engine. Pinning it explicitly keeps
   audit results reproducible across runs.

## Why no SARIF / Code Scanning upload?

The action *can* upload findings to the repo's Security tab as SARIF, but
that requires **GitHub Advanced Security**, which this private repo doesn't
have (same reason `dependency-audit.yml` uses `npm audit` instead of
GitHub's `dependency-review-action` — see [`DEPENDABOT.md`](./DEPENDABOT.md#why-npm-audit-instead-of-actionsdependency-review-action)).
We use `annotations: true` instead, which surfaces findings as inline
review comments on the PR diff. If GHAS is enabled later, flip
`advanced-security: true` and findings will flow into the Security tab.

## Special case: actions that don't ship SemVer tags

Some upstream actions only ship `@master` (e.g. older `snyk/actions/*`
paths). In that case:

1. Check if a release tag *does* exist — `snyk/actions` has `v1` even though
   their README recommends `@master`. Prefer the tag.
2. If truly no tag exists, pin to a specific commit SHA manually and add a
   `# master@YYYY-MM-DD` comment so future maintainers understand the source.
   Dependabot can't update it automatically; set a calendar reminder.

## References

- [zizmor docs](https://docs.zizmor.sh)
- [zizmor audit catalog](https://docs.zizmor.sh/audits/)
- [GitHub: Security hardening for GitHub Actions](https://docs.github.com/en/actions/security-guides/security-hardening-for-github-actions)
- [OpenSSF Scorecard — `Pinned-Dependencies` check](https://github.com/ossf/scorecard/blob/main/docs/checks.md#pinned-dependencies)
