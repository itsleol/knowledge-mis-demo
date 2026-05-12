# Knowledge Management MIS Demo

## 技术栈

- 前端: React + Vite
- 后端: Node.js + Express
- 数据库: MongoDB + Mongoose
- 验证: JWT
- 上传: multer + local `server/uploads`
- 部署: Docker Compose

## 项目结构

```text
knowledge-mis-demo/
  client/                 React + Vite frontend
  server/                 Express API and seed script
    src/models/           MongoDB document models
    src/controllers/      API business logic
    src/routes/           RESTful routes
    src/seed/seed.js      Demo data
    uploads/              Local attachments
  docker-compose.yml
  .env.example
  CONTRIBUTING.md         Team collaboration guide
```

## 依托于Github与Docker的项目团队协作

首次setup:

```bash
git clone https://github.com/itsleol/knowledge-mis-demo.git
cd knowledge-mis-demo
docker compose up --build
```

项目已克隆至本地后的日常运行:

```bash
git pull
docker compose up --build
```

访问网页:

- Frontend: <http://localhost:5173>
- API health check: <http://localhost:5001/api/health>


## Demo Accounts

All seeded accounts use `password123`.

| Role | Email |
| --- | --- |
| Employee | `employee@example.com` |
| Department Knowledge Manager | `manager@example.com` |
| System Administrator | `admin@example.com` |
| Decision Maker | `decision@example.com` |

## Run With Docker Compose

```bash
cd knowledge-mis-demo
docker compose up --build
```

Open:

- Frontend: <http://localhost:5173>
- API health check: <http://localhost:5001/api/health>

The backend has `AUTO_SEED=true` in `docker-compose.yml`. On first startup, if the `users` collection is empty, it automatically creates the demo accounts and knowledge data.

To reset demo data manually, run:

```bash
docker compose --profile seed run --rm seed
```

To fully reset containers and local MongoDB volume:

```bash
docker compose down -v
docker compose up --build
```

After changing backend code or Docker environment values, rebuild the containers:

```bash
docker compose down
docker compose up --build
```

## Run Locally

Docker Compose is the recommended way for team development. The manual Node.js workflow below is optional and mainly useful for debugging.

Start MongoDB first. If you have Docker, the simplest local database is:

```bash
docker run --name knowledge-mis-mongo -p 27017:27017 -d mongo:7
```

Backend:

```bash
cd knowledge-mis-demo/server
npm install
npm run seed
npm run dev
```

For local development you can also set `AUTO_SEED=true` in `server/.env`; the server will seed only when no users exist.

Frontend:

```bash
cd knowledge-mis-demo/client
npm install
npm run dev
```

Open <http://localhost:5173>.

## Demo Flow

1. Log in as `employee@example.com`.
2. Open **新建知识**, create a knowledge item, upload an attachment if needed, then submit for review.
3. Log in as `manager@example.com`.
4. Open **待审核**, review only this manager's department pending items, then approve one item.
5. Log in as employee or decision maker and open **知识库**, search the approved item by keyword/category/tag.
6. Open the knowledge detail page, collect it, rate it, and add a comment.
7. Log in as `decision@example.com`, open **统计分析 Dashboard**, view contribution ranking, hot knowledge, search keywords, and status distribution.
8. Log in as `admin@example.com`, open **用户管理** and **系统设置**, demonstrate RBAC and maintenance simulation.

## Login Troubleshooting

If the frontend is visible but login fails:

1. Check API health: <http://localhost:5001/api/health>
2. Use either <http://localhost:5173> or <http://127.0.0.1:5173>. The backend CORS configuration allows both.
3. Rebuild after this update:

   ```bash
   docker compose down
   docker compose up --build
   ```

4. Watch the server logs and confirm one of these messages appears:

   ```text
   AUTO_SEED inserted 8 users and 10 knowledge items.
   AUTO_SEED skipped: 8 users already exist.
   ```

5. Reset seed data if needed:

   ```bash
   docker compose --profile seed run --rm seed
   ```

## REST API

Main endpoints:

- `POST /api/auth/login`
- `GET /api/auth/me`
- `GET /api/knowledge`
- `GET /api/knowledge/:id`
- `POST /api/knowledge`
- `PUT /api/knowledge/:id`
- `POST /api/knowledge/:id/submit`
- `POST /api/knowledge/:id/archive`
- `POST /api/knowledge/:id/view`
- `GET /api/reviews/pending`
- `POST /api/reviews/:knowledgeId/approve`
- `POST /api/reviews/:knowledgeId/reject`
- `POST /api/feedbacks/:knowledgeId`
- `GET /api/feedbacks/:knowledgeId`
- `POST /api/favorites/:knowledgeId`
- `DELETE /api/favorites/:knowledgeId`
- `GET /api/favorites/me`
- `GET/POST/PUT/DELETE /api/categories`
- `GET/POST/PUT/DELETE /api/departments`
- `GET/POST/PUT /api/users`
- `GET /api/analytics/overview`
- `GET /api/analytics/departments`
- `GET /api/analytics/hot-knowledge`
- `GET /api/analytics/search-keywords`
- `POST /api/uploads`

## MongoDB Collections

- `users`: account, department, role, status.
- `departments`: organization tree.
- `categories`: tree categories.
- `knowledge`: core knowledge document with attachments, tags, versions, status history, counters, ratings.
- `reviews`: approval/rejection records.
- `feedbacks`: one rating/comment per user per knowledge item.
- `searchLogs`: keyword, filters, result count.
- `favorites`: user collection records.

`knowledge` has a MongoDB text index on `title`, `summary`, `content`, and `tags`. Elasticsearch is intentionally not included in v1; it is a future extension when the demo evolves toward larger-scale retrieval.

## Mapping to MIS Design Slides

- 用户与权限管理子系统: login, JWT middleware, RBAC route guards, **用户管理** page, `users` and `departments`.
- 知识采集子系统: **新建/编辑知识**, draft save, submit for review, upload API, `knowledge.attachments`.
- 知识分类与审核子系统: **分类与标签管理**, **待审核/审核详情**, `categories`, `reviews`, `knowledge.statusHistory`. Department knowledge managers review only their own department's pending knowledge; system administrators handle system maintenance rather than knowledge review.
- 知识检索与推荐子系统: **知识库列表**, keyword/category/tag filters, hot knowledge ranking, similar recommendation by category or tag, `searchLogs`.
- 知识共享与协作子系统: detail page comments, ratings, favorites, `feedbacks` and `favorites`.
- 统计分析与系统管理子系统: **统计分析 Dashboard**, department contribution, hot topics, status distribution, **系统设置/备份模拟**.

Business flow mapping:

```text
员工提交知识
  -> 前端表单和后端 submit 校验必填字段
  -> 部门知识管理员审核 approve/reject
  -> approved 后进入统一知识库
  -> 用户搜索、查看、收藏
  -> 用户评分评论
  -> 管理员更新版本或归档
```

Data flow mapping:

- User input enters REST APIs.
- Express controllers validate permissions and business status.
- Mongoose writes document collections.
- Analytics APIs aggregate knowledge, feedback, search logs, and departments into dashboard output.

Relational-to-document conversion:

- Original `Knowledge_Tag` relation becomes `knowledge.tags` string array.
- Original `Attachment` relation becomes embedded `knowledge.attachments`.
- Version records and status transitions become embedded arrays in `knowledge`.
- Reviews, feedbacks, favorites, and search logs remain separate collections because they are high-volume behavior/process records.

Input design:

- Drafts allow partial content for quick capture.
- Review submission checks title, content, category, and access level early.
- Upload restricts file count, size, and MIME type.
- Frontend displays validation errors directly near the form.

Output design:

- Knowledge detail page outputs structured title, summary, content, tags, attachments, comments, and similar items.
- Review list outputs pending workflow tasks.
- Analytics dashboard outputs management-level reports.

Implementation design:

- Docker Compose represents the demo deployment plan with app, database, upload volume, and seed job.
- Local `/uploads` replaces a dedicated file server for classroom demonstration.
- Single-node deployment matches the slides' “Demo 单体节点” implementation strategy.

## Acceptance Checklist

- Seed data includes 4 departments, 8 users, 6 categories, 10 knowledge items, multiple statuses, feedbacks, favorites, search logs, and attachment metadata.
- Four roles see different navigation and permissions.
- Employees can create and submit knowledge.
- Knowledge managers can approve or reject only their own department's pending knowledge.
- System administrators manage users, departments, and maintenance pages, but do not perform knowledge review.
- Approved knowledge is searchable and readable.
- Users can favorite, rate, and comment.
- Decision makers can view statistics.
- System administrators can manage users and run maintenance simulations.
