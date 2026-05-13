# Knowledge Management MIS Demo

## 技术栈

- 前端: React + Vite
- 后端: Node.js + Express
- 数据库: MongoDB + Mongoose
- 验证: JSON Web Token (JWT)
- 上传: multer + local `server/uploads`
- 部署: Docker Compose

## UI Design Reference

前端界面遵循根目录 [`DESIGN.md`](./DESIGN.md)。本项目的视觉方向是：以 Notion-inspired 的知识文档工作区作为主基调，以 Airtable-inspired 的结构化表格和筛选作为管理界面语言，并使用 MongoDB-inspired green 作为主操作色和成功状态色。

本次 UI 重构将设计规范落到 `client/src/styles/tokens.css`、`client/src/styles/global.css` 和 `client/src/components/` 中，统一了颜色、字体、间距、圆角、阴影、按钮、卡片、状态标签、表格、表单、知识卡片、元信息面板和 Dashboard widget。界面没有复制 Notion、Airtable 或 MongoDB 的 logo、品牌资产、营销文案或官网布局，只借鉴适合课程 Demo 的产品体验原则。

## 项目结构

```text
knowledge-mis-demo/
  client/                 React + Vite 前端
  server/                 Express API 与 seed script
    src/models/           MongoDB 文档模型
    src/controllers/      API 业务逻辑
    src/routes/           RESTful 路由
    src/seed/seed.js      Demo 数据
    uploads/              本地附件
  docker-compose.yml
  .env.example
  CONTRIBUTING.md         团队协作指引
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


## Demo账户

所有预设账户密码均为`password123`.

| Role | Email |
| --- | --- |
| Employee | `employee@example.com` |
| Department Knowledge Manager | `manager@example.com` |
| System Administrator | `admin@example.com` |
| Decision Maker | `decision@example.com` |

## Docker Compose运行

```bash
cd knowledge-mis-demo
docker compose up --build
```

浏览器打开:

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

## 本地运行

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


## 登录失败问题排查方案

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

## 系统设计

- 用户与权限管理子系统: login, JWT middleware, RBAC route guards, **用户管理** page, `users` and `departments`.
- 知识采集子系统: **新建/编辑知识**, draft save, submit for review, upload API, `knowledge.attachments`.
- 知识分类与审核子系统: **分类与标签管理**, **待审核/审核详情**, `categories`, `reviews`, `knowledge.statusHistory`. Department knowledge managers review only their own department's pending knowledge; system administrators handle system maintenance rather than knowledge review.
- 知识检索与推荐子系统: **知识库列表**, keyword/category/tag filters, hot knowledge ranking, similar recommendation by category or tag, `searchLogs`.
- 知识共享与协作子系统: detail page comments, ratings, favorites, `feedbacks` and `favorites`.
- 统计分析与系统管理子系统: **统计分析 Dashboard**, department contribution, hot topics, status distribution, **系统设置/备份模拟**.

业务流映射:

```text
员工提交知识
  -> 前端表单和后端 submit 校验必填字段
  -> 部门知识管理员审核 approve/reject
  -> approved 后进入统一知识库
  -> 用户搜索、查看、收藏
  -> 用户评分评论
  -> 管理员更新版本或归档
```

数据流映射:

- User input enters REST APIs.
- Express controllers validate permissions and business status.
- Mongoose writes document collections.
- Analytics APIs aggregate knowledge, feedback, search logs, and departments into dashboard output.

数据库设计:

- Original `Knowledge_Tag` relation becomes `knowledge.tags` string array.
- Original `Attachment` relation becomes embedded `knowledge.attachments`.
- Version records and status transitions become embedded arrays in `knowledge`.
- Reviews, feedbacks, favorites, and search logs remain separate collections because they are high-volume behavior/process records.

输入设计:

- Drafts allow partial content for quick capture.
- Review submission checks title, content, category, and access level early.
- Upload restricts file count, size, and MIME type.
- Frontend displays validation errors directly near the form.

输出设计:

- Knowledge detail page outputs structured title, summary, content, tags, attachments, comments, and similar items.
- Review list outputs pending workflow tasks.
- Analytics dashboard outputs management-level reports.

实施设计:

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



---

## 技术栈说明

本系统采用典型的B/S 架构，即浏览器/服务器架构。用户通过浏览器访问前端页面，前端通过 HTTP 请求调用后端 REST API，后端负责业务逻辑、权限校验和数据库操作，MongoDB 负责持久化存储系统数据。整体技术架构如下：

```text
React + Vite 前端
        ↓ HTTP / REST API
Node.js + Express 后端
        ↓ Mongoose
MongoDB 数据库
```

### 1. 前端：React + Vite

前端采用 **React + Vite** 开发。

**React** 是用于构建用户界面的 JavaScript 框架，其核心思想是组件化开发。系统中的登录页、知识库列表、知识详情页、知识提交表单、审核页面、统计分析 Dashboard、用户管理页面等，都可以被拆分为独立的 React 组件。这样可以提高代码复用性，也便于后续维护和扩展。

React 的基本原理是通过状态驱动页面更新。当前端数据发生变化时，例如用户登录状态变化、知识列表刷新、审核状态更新，React 会自动重新渲染相关页面组件，而不需要手动操作 DOM。

**Vite** 是现代前端构建工具，主要用于本地开发和项目打包。它可以快速启动前端开发服务器，支持热更新，使开发者修改代码后能立即在浏览器中看到效果。选择 Vite 是因为其配置较轻、启动速度快，适合课程项目和团队协作开发。

在本系统中，React + Vite 主要承担以下功能：

```text
页面展示
用户交互
表单输入
知识检索与筛选
审核操作界面
统计图表展示
调用后端 API
```

### 2. 后端：Node.js + Express

后端采用 **Node.js + Express** 开发。

**Node.js** 是 JavaScript 的服务端运行环境，使 JavaScript 不仅可以运行在浏览器中，也可以运行在服务器端。因此，本项目可以使用同一种语言完成前后端开发，降低团队学习和协作成本。

**Express** 是基于 Node.js 的 Web 应用框架，主要用于编写后端 API。前端页面本身不直接访问数据库，而是通过调用 Express 提供的接口完成登录、知识提交、知识检索、审核、评论、收藏和统计分析等操作。

Express 的基本运行逻辑是：

```text
前端发送请求
    -> Express 路由接收请求
    -> Controller 执行业务逻辑
    -> Mongoose 操作 MongoDB
    -> 后端返回 JSON 数据
    -> 前端更新页面
```

例如，用户登录时，前端会向后端发送：

```text
POST /api/auth/login
```

后端接收邮箱和密码，验证用户身份后返回 JWT 和用户信息。前端保存登录状态，并根据用户角色显示不同的功能菜单。

在本系统中，Node.js + Express 主要承担以下功能：

```text
用户登录与身份认证
知识条目的增删改查
知识提交与审核流程
评论、评分、收藏处理
分类、部门、用户管理
统计分析数据计算
文件上传接口
权限校验与错误处理
```

### 3. 数据库：MongoDB + Mongoose

数据库采用 **MongoDB + Mongoose**。

**MongoDB** 是文档型数据库，数据以类似 JSON 的文档形式保存。相比传统关系型数据库，MongoDB 更适合存储结构较灵活的数据。本系统中的知识条目不仅包含标题、正文、摘要，还包含标签、附件、版本记录、状态历史、访问统计等信息，这些内容与知识条目高度相关，适合放在同一个文档结构中管理。

本系统中的主要数据集合包括：

```text
users：用户信息
departments：部门信息
categories：知识分类
knowledge：知识条目
reviews：审核记录
feedbacks：评论与评分
favorites：收藏记录
searchLogs：搜索日志
```

其中，`knowledge` 是系统的核心集合，用于保存知识标题、内容、标签、附件、版本、状态流转记录、访问次数、评分等信息。附件、标签、版本记录等与知识条目紧密相关的数据被嵌入在 knowledge 文档中；而审核、反馈、收藏、搜索日志等高频行为数据则单独建立集合，便于后续统计和管理。

**Mongoose** 是 Node.js 操作 MongoDB 的 ODM 工具。它可以为 MongoDB 数据定义模型结构、字段类型、校验规则和索引。通过 Mongoose，后端可以更规范地操作数据库，避免直接书写零散的数据库操作代码。

选择 MongoDB + Mongoose 的理由主要有三点：

```text
知识内容结构较灵活，适合文档型数据库
标签、附件、版本等数据可以自然嵌入知识文档
Mongoose 可以提供模型约束和查询封装，便于后端开发
```

### 4. 身份认证：JWT

系统采用 **JWT，即 JSON Web Token**，实现用户登录认证。

用户登录成功后，后端会生成一个 token 返回给前端。前端将 token 保存在浏览器中，并在后续请求中通过请求头携带该 token：

```text
Authorization: Bearer token
```

后端接收到请求后，会通过中间件验证 token 是否有效，并解析出当前用户身份。这样系统就可以判断“当前是谁在访问接口”。

在 JWT 的基础上，系统进一步实现了基于角色的权限控制，即 RBAC。系统中设置了四类用户角色：

```text
employee：普通员工
knowledge_manager：部门知识管理员
system_admin：系统管理员
decision_maker：决策者
```

不同角色拥有不同权限。例如，普通员工可以提交知识、评论和收藏；部门知识管理员可以审核本部门知识；系统管理员可以管理用户、部门和系统设置；决策者可以查看统计分析结果。

JWT 的用途是解决身份认证问题，RBAC 的用途是解决权限分配问题。二者结合，可以保证不同用户只能访问与其角色相匹配的系统功能。

### 5. 文件上传：multer + local uploads

系统采用 **multer + 本地 uploads 目录** 实现文件上传。

**multer** 是 Express 生态中常用的文件上传中间件，用于接收前端上传的附件。用户在提交知识时，可以上传 PDF、Word、PPT、图片等文件。后端接收到文件后，将文件保存到本地的 `server/uploads` 目录，并将文件的元数据保存到 MongoDB 中。

上传流程如下：

```text
前端选择文件
    -> 调用 POST /api/uploads
    -> multer 接收并保存文件
    -> 返回文件名、大小、类型、路径等信息
    -> 知识条目保存附件元数据
```

系统不会将文件本体直接存入 MongoDB，而是只在数据库中保存文件路径和元数据。这样做可以避免数据库体积过大，也更符合“结构化数据存数据库，非结构化文件存文件系统”的设计思路。

在本课程 Demo 中，使用本地 `server/uploads` 目录已经能够满足附件上传和展示需求。未来如果系统扩展到真实生产环境，可以进一步替换为对象存储服务或独立文件服务器。

### 6. 部署与协作：Docker Compose

系统采用 **Docker Compose** 进行部署和团队协作。

**Docker** 可以将应用及其运行环境打包成容器，避免不同电脑之间因为 Node.js 版本、依赖包、MongoDB 安装方式不同而产生环境问题。**Docker Compose** 则可以同时管理多个服务，例如前端、后端和数据库。

本系统通过一条命令即可启动完整运行环境：

```bash
docker compose up --build
```

系统中的主要服务包括：

```text
client：React + Vite 前端服务
server：Node.js + Express 后端服务
mongo：MongoDB 数据库服务
seed：演示数据初始化服务
```

选择 Docker Compose 的主要原因是：

```text
降低组员本地配置成本
统一开发和演示环境
避免 MongoDB、Node.js 版本差异
便于课堂展示和项目移交
支持一键启动前端、后端和数据库
```

这也符合系统实施阶段的要求，使本项目不仅停留在静态原型，而是可以运行、可以登录、可以提交知识、可以审核、可以统计分析的完整 Demo 系统。

### 7. 前后端连接方式：REST API + JSON

本系统前后端通过 **REST API** 进行连接，数据交换格式为 **JSON**。

前端负责展示页面和收集用户操作，后端负责处理业务逻辑和数据库操作。两者之间通过 HTTP 请求传递数据。

例如，知识管理相关接口包括：

```text
GET    /api/knowledge        获取知识列表
GET    /api/knowledge/:id    获取知识详情
POST   /api/knowledge        新建知识
PUT    /api/knowledge/:id    修改知识
POST   /api/knowledge/:id/submit    提交审核
```

当前端需要展示知识库列表时，会调用后端的 `GET /api/knowledge` 接口。后端从 MongoDB 查询数据后，以 JSON 格式返回给前端，前端再将这些数据渲染为知识卡片或列表。

这种前后端分离的设计具有较好的扩展性。前端和后端可以分别开发、分别调试，只要双方约定好 API 格式，就能完成系统集成。

### 8. 技术选型总结

总体来看，本系统的技术栈选择服务于课程项目的三个目标：一是能够真实跑通知识管理业务流程，二是便于团队协作和本地部署，三是结构清晰、便于在系统设计报告中解释。

```text
React + Vite：负责页面展示和用户交互
Node.js + Express：负责后端接口和业务逻辑
MongoDB + Mongoose：负责数据存储和模型管理
JWT：负责登录认证和角色权限控制
multer + uploads：负责知识附件上传
Docker Compose：负责统一部署和团队协作
REST API + JSON：负责前后端数据通信
```

通过这一技术栈，本系统可以实现从“员工提交知识—部门管理员审核—知识入库—用户检索访问—评论收藏—统计分析”的完整业务闭环，较好地支撑了知识管理系统的功能设计与课堂演示需求。
