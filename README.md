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

This repo uses **CodeQL** for static analysis of application code, **Dependabot** for scheduled dependency updates, and **`npm audit`** on every PR to block vulnerable dependencies from being merged.

- CodeQL workflow: [`.github/workflows/codeql.yml`](.github/workflows/codeql.yml)
- CodeQL details: [`docs/CODEQL.md`](docs/CODEQL.md)
- Dependabot config: [`.github/dependabot.yml`](.github/dependabot.yml)
- PR audit workflow: [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml)
- Dependabot details: [`docs/DEPENDABOT.md`](docs/DEPENDABOT.md)

> ⚠️ When adding new third-party components, update `.github/dependabot.yml`. See [`AGENT.md`](AGENT.md).