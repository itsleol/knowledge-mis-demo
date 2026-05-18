# Testing Guide

## Test Stack

The backend API integration tests use:

- Node.js built-in `node:test`
- Node.js built-in `assert`
- Node.js built-in `fetch`
- Express app started on an ephemeral local port
- Mongoose connected to an isolated MongoDB test database

No large test framework is introduced in this round. The goal is to keep the course demo easy to install and run while still covering the core MIS workflow.

The frontend smoke test also uses Node.js built-in `node:test`. It checks that the Vite SPA shell is reachable on the key classroom demo routes. This is a lightweight substitute for browser E2E in the current Docker setup.

## How To Run

Recommended Docker workflow:

```bash
docker compose up -d mongo server client
docker compose exec -T server npm test
docker compose exec -T client npm run test:smoke
```

Local workflow:

```bash
cd server
npm install
npm test
```

Frontend smoke test:

```bash
cd client
npm install
npm run dev
CLIENT_BASE_URL=http://127.0.0.1:5173 npm run test:smoke
```

When running locally, keep `npm run dev` open in one terminal and run `npm run test:smoke` in another terminal.

By default, the test suite derives a test database from `MONGO_URI` and uses `km_mis_test`. You can override it explicitly:

```bash
MONGO_URI_TEST=mongodb://127.0.0.1:27017/km_mis_test npm test
```

## Database Safety

The tests do not use the demo seed database directly.

Each test run:

- connects to `MONGO_URI_TEST`, or a `km_mis_test` database derived from `MONGO_URI`;
- creates its own departments, users, categories, and knowledge records;
- clears only the test database collections before and after tests;
- does not call `resetDemoData`;
- does not depend on seed data ordering.

## Coverage

Current backend API tests cover:

- login success and login failure;
- `GET /api/auth/me`;
- employee draft creation;
- employee submission validation failure;
- employee submission to pending review;
- employee denial on review endpoints;
- department manager pending-review list;
- department manager approve and reject actions;
- cross-department manager review denial;
- approved knowledge search;
- knowledge detail access;
- view count increment;
- feedback/rating and `averageRating` recalculation;
- favorite and unfavorite behavior;
- system administrator user create/update/delete;
- knowledge manager analytics limited to their department;
- tag summary aggregation based on `knowledge.tags`, including department scope for knowledge managers.

Current frontend smoke coverage:

- `/login`
- `/`
- `/knowledge`
- `/knowledge/new`
- `/reviews`
- `/analytics`

The smoke test verifies that these routes return the React SPA shell. It does not click through browser interactions.

## Playwright E2E Status

Full Playwright E2E was evaluated for this round but not added to the default Docker workflow. The current `client` service runs on `node:20-alpine`; installing and running Chromium inside that container would add system browser dependencies that are heavier and more fragile than the rest of this course demo stack.

For this reason, the third round uses:

- backend API integration tests for the full business workflow and permission boundaries;
- frontend smoke tests for SPA route availability;
- manual browser verification using [`docs/DEMO_SCRIPT.md`](./DEMO_SCRIPT.md) before classroom presentation.

Future Playwright path:

```bash
cd client
npm install -D @playwright/test
npx playwright install
npm run test:e2e
```

If the team later adopts a non-Alpine test image or runs Playwright on host machines, the recommended E2E flow is:

```text
employee login
-> create unique knowledge
-> submit review
-> manager approve
-> employee search
-> open detail
-> feedback
-> favorite
```

## Not Covered Yet

The following items remain future work:

- React component tests with Vitest and React Testing Library;
- Playwright end-to-end browser flow;
- upload endpoint tests with multipart files;
- visual regression tests;
- detailed backup/system-maintenance simulation tests.

These are intentionally left out of this round to avoid adding heavy tooling or expanding beyond demo-level stabilization.
