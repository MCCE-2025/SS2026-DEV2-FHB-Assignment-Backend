# Snyk Container Scan

Published Docker images are scanned for known vulnerabilities in [`.github/workflows/docker.yml`](../.github/workflows/docker.yml) (`snyk-scan` job).

## Prerequisites

1. Create a free [Snyk](https://snyk.io) account (GitHub sign-in works).
2. Copy an API token from **Account settings → General → Auth Token**.
3. Add a repository secret **`SNYK_TOKEN`** under **Settings → Secrets and variables → Actions**.

Without `SNYK_TOKEN`, the scan job fails at the Snyk step.

## Flow

| Step | What happens |
|------|----------------|
| `build-and-push` | Builds and pushes the image to GHCR (unchanged) |
| `snyk-scan` | Pulls `ghcr.io/<repo>:sha-<short-sha>`, runs `snyk container test` |
| SARIF upload | Findings appear under **Security → Code scanning** (`category: snyk-container`) |
| Quality gate | Job fails when Snyk reports **high** or **critical** issues (`--severity-threshold=high`) |

The Snyk step uses `continue-on-error` so SARIF is uploaded before the job fails on vulnerabilities.

## Triggers

Same as the Docker workflow: push to `main`, or push of a semver tag `v*.*.*`.

## Branch protection (optional)

To block merges when the image has high/critical CVEs, add **Snyk container scan** as a required status check on `main` after at least one workflow run.

## References

- [Snyk Docker GitHub Action](https://github.com/snyk/actions/tree/master/docker)
- [Snyk container CLI](https://docs.snyk.io/scan-with-snyk/snyk-container)
