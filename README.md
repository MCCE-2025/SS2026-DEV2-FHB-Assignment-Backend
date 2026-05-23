# Notes Backend

This repository is used as a starting point for an assignment. Originally it is from the amazing MOOC [FullStackOpen](https://fullstackopen.com/)

## Usage of this repository

### Inital installation
```bash
npm install
```

### Start the application
```bash
npm start
```

### Start with Hot-Reload
```bash
npm run dev
```

## Security & Quality

This repo uses **ESLint** for JavaScript linting, **CodeQL** for static analysis of application code, **Dependabot** for scheduled dependency updates, and **`npm audit`** on every PR to block vulnerable dependencies from being merged.

### ESlint

- ESLint workflow: [`.github/workflows/lint.yml`](.github/workflows/lint.yml)
- ESLint details: [`docs/ESLINT.md`](docs/ESLINT.md)

### CodeQL

- CodeQL workflow: [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml)
- CodeQL details: [`docs/CODEQL.md`](docs/CODEQL.md)

### Dependabot

- Dependabot config: [`.github/dependabot.yml`](.github/dependabot.yml)
- PR audit workflow: [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml)
- Dependabot details: [`docs/DEPENDABOT.md`](docs/DEPENDABOT.md)

### Dependency Audit

via `npm audit` on pull requests

- PR audit workflow: [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml)

### Build

- Build workflow: [`.github/workflows/build.yml`](.github/workflows/build.yml)
- Build details: [`docs/BUILD.md`](docs/BUILD.md)

### Docker

- Docker workflow: [`.github/workflows/docker.yml`](.github/workflows/docker.yml)
- Docker details: [`docs/DOCKER.md`](docs/DOCKER.md)
- Images are published to `ghcr.io/<owner>/<repo>` (see tag scheme in `docs/DOCKER.md`)

### Snyk (container)

- Runs in the Docker workflow after each image push (`snyk-scan` job)
- Requires repository secret `SNYK_TOKEN` — see [`docs/SNYK.md`](docs/SNYK.md)

> ⚠️ When adding new third-party components, update `.github/dependabot.yml`. See [`AGENTS.md`](AGENTS.md).