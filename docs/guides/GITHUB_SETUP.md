# GitHub Setup Checklist

Use this checklist when publishing the project for the first time.

## 1. Create an Empty Repository

Create a new GitHub repository, for example:

```text
knowledge-mis-demo
```

Do not add a GitHub-generated README, `.gitignore`, or license if you want to push this folder exactly as it is.

## 2. Initialize Git Locally

From this project folder:

```bash
git init
git add .
git status
git commit -m "chore: initial knowledge MIS demo"
git branch -M main
git remote add origin https://github.com/YOUR_ORG_OR_USER/knowledge-mis-demo.git
git push -u origin main
```

## 3. Verify Ignored Files

Before pushing, `git status` should not include:

- `.env`
- `.DS_Store`
- `node_modules/`
- `client/dist/`
- files uploaded into `server/uploads/`

The repository should include `server/uploads/.gitkeep` so the uploads folder exists after cloning.

## 4. Invite Teammates

In GitHub:

```text
Repository -> Settings -> Collaborators -> Add people
```

Suggested rule:

- `main` is the stable demo branch.
- New work should use feature branches and Pull Requests.

## 5. Teammate First Run

Each teammate runs:

```bash
git clone https://github.com/YOUR_ORG_OR_USER/knowledge-mis-demo.git
cd knowledge-mis-demo
docker compose up --build
```

Open <http://localhost:5173>.

## 6. Update Existing Local Copy

```bash
git pull
docker compose up --build
```

If local data is stale:

```bash
docker compose --profile seed run --rm seed
```

If a clean database is needed:

```bash
docker compose down -v
docker compose up --build
```
