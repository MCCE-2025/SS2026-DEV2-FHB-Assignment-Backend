# Docker Image

Container build and publish via [`.github/workflows/docker.yml`](../.github/workflows/docker.yml). Images are stored on [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) (`ghcr.io`).

## Image Layout

Multi-stage [Dockerfile](../Dockerfile):

| Stage | Base | Purpose |
|-------|------|---------|
| `deps` | `node:24.14.1-trixie-slim` | Install production npm dependencies only (`npm ci --omit=dev --ignore-scripts`) |
| `runtime` | `gcr.io/distroless/nodejs24-debian13:nonroot` | Run the app as non-root without shell or package manager |

Both stages run on the same **Node 24** Active LTS patch line and **Debian 13 (trixie)** family, so the `node_modules` produced in `deps` has a matching ABI and libc when copied into the distroless runtime. The supported Node version is also declared in [`package.json`](../package.json) via `engines.node`, and the CI workflows resolve `lts/*` to the same major automatically.

> Why not Node 26? Google's distroless project ships only LTS Node majors, and Node 26 (released April 2026) does not become Active LTS until October 2026. Dependabot is configured to ignore non-LTS and major Node image bumps (see [`DEPENDABOT.md`](./DEPENDABOT.md)); adopt the next LTS major manually once `gcr.io/distroless/nodejs<major>-debian13` is published and the line is Active LTS.

Hardening choices:

- **Distroless runtime** — no shell, `apt`, or extra OS utilities in the final image
- **Non-root user** (`nonroot`, UID 65532)
- **Digest-pinned base images** — both `FROM` lines reference `@sha256:…` with a trailing version comment, mirroring the GitHub-Actions SHA-pinning policy (see [`ACTIONS-SECURITY.md`](ACTIONS-SECURITY.md)). The floating `:nonroot` / `:26-alpine` tags would otherwise let a stale GHA build cache silently reintroduce a vulnerable layer that the Snyk scan already flagged
- **Production deps only** — devDependencies (ESLint, nodemon, etc.) never enter the image
- **`--ignore-scripts`** — lifecycle scripts from dependencies are not executed at image build time
- **[`.dockerignore`](../.dockerignore)** — keeps build context small and excludes docs, `.git`, local `node_modules`

## Triggers

| Event | When |
|-------|------|
| `push` to `main` | Build and push on every merge to main |
| `push` of tag `v*.*.*` | Build and push a versioned release (e.g. `v1.0.0`) |

## Tags

Tags are computed by [`docker/metadata-action`](https://github.com/docker/metadata-action) in the workflow.

| Trigger | Tags pushed |
|---------|-------------|
| Push to `main` (no git tag) | `sha-<short-sha>` only |
| Push of git tag `v1.2.3` | `1.2.3`, `1.2`, `1`, `sha-<short-sha>`, `latest` |

`latest` is only updated when a semver git tag is pushed (`latest=auto`). It always points at the most recently minted version, not at untagged commits on `main`.

Image name: `ghcr.io/<owner>/<repo>` (lowercased automatically).

## Releasing a Version

After merging to `main`:

```bash
git tag v1.0.0
git push origin v1.0.0
```

The workflow publishes semver tags and moves `latest` to that image.

## Pull and Run

Replace `<owner>` and `<repo>` with your GitHub org/user and repository name (lowercase):

```bash
# Latest released version
docker pull ghcr.io/<owner>/<repo>:latest
docker run --rm -p 3001:3001 ghcr.io/<owner>/<repo>:latest

# Specific commit on main
docker pull ghcr.io/<owner>/<repo>:sha-abc1234
```

GHCR packages may be private by default. Link the package to the repository under **Packages → Package settings → Manage Actions access**, or make the package public if needed.

## Container Security Scan

After each push, the **`snyk-scan`** job in the Docker workflow scans the image that was just published to GHCR. Setup and quality-gate behaviour are documented in [`SNYK.md`](SNYK.md).

## Dependency Updates

Docker base images are kept current by Dependabot ([`dependabot.yml`](../.github/dependabot.yml), `package-ecosystem: docker`). The `docker-all` group bumps every `FROM` digest (and the trailing version comment) in one weekly PR — see [`DEPENDABOT.md`](DEPENDABOT.md) for the schedule, auto-merge rules, and grouping convention.

When the Snyk container scan ([`SNYK.md`](SNYK.md)) flags a CVE introduced by a base layer, the fastest path back to green is to wait for the next Dependabot bump or to manually rerun the `docker buildx imagetools inspect <image>:<tag>` digest and update the `FROM` line — never replace the digest with a floating tag.

## References

- [Google distroless Node.js images](https://github.com/GoogleContainerTools/distroless/blob/main/nodejs/README.md)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
