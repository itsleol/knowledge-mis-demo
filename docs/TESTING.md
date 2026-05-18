# Testing Guide

## Test Stack

The backend API integration tests use:

- Node.js built-in `node:test`
- Node.js built-in `assert`
- Node.js built-in `fetch`
- Express app started on an ephemeral local port
- Mongoose connected to an isolated MongoDB test database

No large test framework is introduced in this round. The goal is to keep the course demo easy to install and run while still covering the core MIS workflow.

## How To Run

Recommended Docker workflow:

```bash
docker compose up -d mongo server
docker compose exec server npm test
```

Local workflow:

```bash
cd server
npm install
npm test
```

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
- knowledge manager analytics limited to their department.

## Not Covered Yet

The following items remain future work:

- React component tests with Vitest and React Testing Library;
- Playwright end-to-end browser flow;
- upload endpoint tests with multipart files;
- visual regression tests;
- detailed backup/system-maintenance simulation tests.

These are intentionally left out of this round to avoid adding heavy tooling or expanding beyond P1 stabilization.
