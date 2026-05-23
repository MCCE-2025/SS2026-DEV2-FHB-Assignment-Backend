# Tests & Coverage

Automated tests run via [`.github/workflows/build.yml`](../.github/workflows/build.yml) on every pull request targeting `main` and every push to `main`.

## Stack

| Tool | Role |
|------|------|
| [Vitest](https://vitest.dev/) | Test runner (unit + integration) |
| [@vitest/coverage-v8](https://vitest.dev/guide/coverage) | Coverage via V8 |
| [Supertest](https://github.com/ladjs/supertest) | HTTP assertions against the Express app |

## Project layout

| Path | Purpose |
|------|---------|
| [`app.js`](../app.js) | Express app (exported for tests, no `listen`) |
| [`index.js`](../index.js) | Server entry point (`app.listen`) |
| [`services/notesService.js`](../services/notesService.js) | In-memory notes store and business logic |
| [`tests/unit/`](../tests/unit/) | Unit tests (no HTTP) |
| [`tests/integration/`](../tests/integration/) | Integration tests (Supertest) |
| [`vitest.config.mjs`](../vitest.config.mjs) | Vitest + coverage configuration |

## Run locally

```bash
npm ci
npm test          # run all tests with coverage
npm run test:watch  # watch mode (no coverage by default)
```

Coverage output is written to `coverage/` (HTML report: `coverage/index.html`).

## CI

The **Build** workflow runs `npm test` in the same job as `npm ci` and the syntax check. On completion (pass or fail), the `coverage/` directory is uploaded as the **`coverage-report`** artifact (14-day retention).

There is no coverage threshold quality gate; the report is for inspection only.

## Assignment mapping

| Requirement | Implementation |
|-------------|----------------|
| ≥ 3 unit tests | `tests/unit/notesService.test.js` |
| ≥ 2 integration tests | `tests/integration/notes.api.test.js` |
| Tests on PR/push to `main` | Build workflow triggers |
| Coverage artifact in same build step | `npm test` + `upload-artifact` in `build.yml` |
