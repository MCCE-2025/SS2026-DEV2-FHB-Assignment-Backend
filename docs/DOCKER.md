# Docker Image

Container build and publish via [`.github/workflows/docker.yml`](../.github/workflows/docker.yml). Images are stored on [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry) (`ghcr.io`).

## Image Layout

Multi-stage [Dockerfile](../Dockerfile):

| Stage | Base | Purpose |
|-------|------|---------|
| `deps` | `node:22-alpine` | Install production npm dependencies only (`npm ci --omit=dev --ignore-scripts`) |
| `runtime` | `gcr.io/distroless/nodejs22-debian12:nonroot` | Run the app as non-root without shell or package manager |

Hardening choices:

- **Distroless runtime** — no shell, `apt`, or extra OS utilities in the final image
- **Non-root user** (`nonroot`, UID 65532)
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

## Dependency Updates

Docker base images are kept current by Dependabot ([`dependabot.yml`](../.github/dependabot.yml), `package-ecosystem: docker`).

## References

- [Google distroless Node.js images](https://github.com/GoogleContainerTools/distroless/blob/main/nodejs/README.md)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)
