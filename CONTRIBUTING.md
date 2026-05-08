# Collaboration Guide

This project is intended for a mixed Mac and Windows student team. Use GitHub for code sharing and Docker Desktop for a consistent local runtime.

## Required Tools

- Git
- Docker Desktop
- A code editor such as VS Code

You do not need to install MongoDB or Node.js to run the Docker version.

## First-Time Setup

```bash
git clone https://github.com/YOUR_ORG_OR_USER/knowledge-mis-demo.git
cd knowledge-mis-demo
docker compose up --build
```

Open:

- Frontend: <http://localhost:5173>
- API health: <http://localhost:5001/api/health>

The backend automatically seeds demo data on first startup when no users exist.

## Daily Workflow

Before starting work:

```bash
git pull
docker compose up --build
```

When code changes are merged by teammates:

```bash
git pull
docker compose up --build
```

If dependencies or Docker settings changed, rebuild cleanly:

```bash
docker compose down
docker compose up --build
```

## Branch Workflow

Do not commit directly to `main` unless your team has agreed to do so.

```bash
git checkout -b feature/short-feature-name
git add .
git commit -m "feat: describe the change"
git push origin feature/short-feature-name
```

Then open a Pull Request on GitHub.

Recommended branch names:

- `feature/review-flow`
- `feature/analytics-page`
- `fix/login-seed`
- `docs/demo-script`

## Reset Local Demo Data

Reset seed data but keep containers and volumes:

```bash
docker compose --profile seed run --rm seed
```

Completely remove local MongoDB data and recreate everything:

```bash
docker compose down -v
docker compose up --build
```

Warning: `docker compose down -v` deletes local database data and uploaded files stored in Docker volumes.

## Useful Docker Commands

```bash
docker compose ps
docker compose logs -f server
docker compose logs -f client
docker compose restart server
docker compose down
```

## Mac and Windows Notes

- Use Docker Desktop on both systems.
- On Windows, run commands in PowerShell, Windows Terminal, Git Bash, or VS Code Terminal.
- Keep Docker Desktop running before `docker compose up`.
- If ports are occupied, stop the conflicting local service or change ports in `docker-compose.yml`.
- Do not commit `.env`, `node_modules`, `dist`, `.DS_Store`, or files uploaded into `server/uploads`.

## Demo Accounts

All seeded accounts use `password123`.

```text
employee@example.com
manager@example.com
admin@example.com
decision@example.com
```
