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

## Dependency Management

This repo uses **Dependabot** for scheduled dependency updates and **`npm audit`** on every PR to block vulnerable dependencies from being merged.

- Dependabot config: [`.github/dependabot.yml`](.github/dependabot.yml)
- PR audit workflow: [`.github/workflows/dependency-audit.yml`](.github/workflows/dependency-audit.yml)
- Full details: [`docs/DEPENDABOT.md`](docs/DEPENDABOT.md)

> ⚠️ When adding new third-party components, update `.github/dependabot.yml`. See [`AGENT.md`](AGENT.md).