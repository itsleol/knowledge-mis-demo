# Implementation Audit Report

## 1. Executive Summary

当前知识管理 MIS Demo 已基本实现最初系统设计计划中的核心业务闭环和六大子系统，能够支撑课堂展示“系统已经从逻辑设计进入开发实现”的目标。系统具备 B/S 架构、JWT 登录、简化 RBAC、MongoDB 文档模型、知识采集、部门审核、知识检索、附件上传、反馈收藏、统计 Dashboard、Docker Compose 部署和 seed data。

总体判断：**可支撑课堂展示，但测试体系和部分设计完整性仍需补强**。

主要完成点：

- 六大子系统均有对应前端页面、后端 API 和 MongoDB collection 支撑。
- 核心流程“员工提交知识 -> 系统校验 -> 部门知识管理员审核 -> 发布 -> 检索访问 -> 反馈收藏 -> 更新/归档”已具备可演示路径。
- 后端不仅依赖前端隐藏菜单，也在路由和 controller 层实现了认证与角色权限限制。
- MongoDB 模型覆盖 users、departments、categories、knowledge、reviews、feedbacks、searchLogs、favorites，并对 knowledge 建立了全文检索 text index。
- Docker Compose、自动 seed、本地 uploads volume 能支撑跨系统本地演示。

主要风险：

- **P1：缺少自动化测试框架和测试命令**，当前系统稳定性主要依赖手工验证。
- **P1：README 与当前接口轻微不同步**，例如已新增 `DELETE /api/users/:id`，但 README API 列表仍写作 `GET/POST/PUT /api/users`。
- **P1：seed data 中存在一条 system_admin 审核记录**，与“系统管理员负责运维，不负责知识审核”的后续设计表达存在轻微不一致。
- **P1：部分后端校验错误仍使用英文开发字段**，如 `Title is required.`，不完全符合面向业务用户的输入设计。
- **P2：模板套用、批量导入、多人在线协作、真实备份脚本等 slide 中出现的增强功能尚未实现**，可作为课程 Demo 的未来扩展说明。

审计限制：

- 已从 `小组汇报/MIS第六组期中汇报_修改后.pptx` 中提取文本线索作为原始设计基准，但未进行 PPT 视觉级复原。
- 本轮只生成审计报告，未新增测试、未修改业务代码、未运行破坏性命令。

## 2. Requirement Traceability Matrix

| Original Design Requirement | Current Implementation | Status | Evidence in Code | Gap / Problem | Priority |
|---|---|---|---|---|---|
| 用户与权限管理子系统 | 登录、JWT、用户/部门管理、角色菜单、后端 authorize 中间件已实现 | Implemented with Issues | `server/src/controllers/authController.js`, `server/src/middleware/auth.js`, `server/src/routes/userRoutes.js`, `client/src/components/Layout.jsx`, `client/src/pages/UserManage.jsx` | 缺少自动化权限测试；README API 列表未同步删除用户接口 | P1: important for course presentation |
| 知识采集子系统 | 新建/编辑知识、保存草稿、提交审核、附件上传已实现 | Partially Implemented | `client/src/pages/KnowledgeForm.jsx`, `server/src/controllers/knowledgeController.js`, `server/src/routes/uploadRoutes.js`, `server/src/models/Knowledge.js` | 模板套用、批量导入未实现；草稿与提交校验已有但错误文案可改进 | P2: nice to have |
| 知识分类与审核子系统 | 分类管理、标签沉淀、待审核列表、审核详情、通过/驳回、审核记录已实现 | Implemented with Issues | `client/src/pages/CategoryManage.jsx`, `client/src/pages/ReviewList.jsx`, `client/src/pages/ReviewDetail.jsx`, `server/src/controllers/reviewController.js`, `server/src/models/Review.js` | 标签没有独立管理 collection；seed 中有 admin 审核记录与角色分工不一致 | P1: important for course presentation |
| 知识检索与推荐子系统 | 关键词、分类、标签、状态、排序检索；热门知识和相似知识推荐已实现 | Implemented | `server/src/controllers/knowledgeController.js`, `server/src/models/Knowledge.js`, `client/src/pages/KnowledgeList.jsx`, `client/src/components/KnowledgeCard.jsx` | 未接入 Elasticsearch，符合当前 Demo 约束；推荐逻辑为简化版 | P2: nice to have |
| 知识共享与协作子系统 | 收藏、评分、评论、反馈展示、我的收藏已实现 | Partially Implemented | `server/src/controllers/feedbackController.js`, `server/src/controllers/favoriteController.js`, `client/src/pages/KnowledgeDetail.jsx`, `client/src/pages/Favorites.jsx` | 多人在线编辑、实时沟通等 slide 扩展能力未实现 | P2: nice to have |
| 统计分析与系统管理子系统 | 统计总览、部门贡献、热门知识、高频搜索词、状态分布、系统设置/维护模拟已实现 | Implemented with Issues | `server/src/controllers/analyticsController.js`, `client/src/pages/Analytics.jsx`, `client/src/pages/SystemSettings.jsx` | 用户活跃度分析和真实备份脚本未实现；系统日志为前端模拟 | P2: nice to have |
| 核心闭环：员工提交知识 | 员工可创建 draft 并提交 pending | Implemented | `server/src/controllers/knowledgeController.js`, `client/src/pages/KnowledgeForm.jsx`, `client/src/pages/MyKnowledge.jsx` | 缺少自动化测试确认 | P1: important for course presentation |
| 核心闭环：系统格式校验 | submit 时校验 title/content/category/accessLevel | Implemented with Issues | `server/src/utils.js`, `client/src/pages/KnowledgeForm.jsx` | 后端错误数组仍为英文开发字段 | P1: important for course presentation |
| 核心闭环：部门知识管理员审核 | knowledge_manager 只能查看和审核本部门 pending 知识 | Implemented | `server/src/routes/reviewRoutes.js`, `server/src/controllers/reviewController.js`, `server/src/utils.js` | 需要 API 测试覆盖跨部门拒绝场景 | P1: important for course presentation |
| 核心闭环：审核通过发布 | approve 设置 `status=approved` 和 `publishedAt`，写入 Review/statusHistory | Implemented | `server/src/controllers/reviewController.js`, `server/src/models/Knowledge.js`, `server/src/models/Review.js` | 缺少测试覆盖 publishedAt/statusHistory | P1: important for course presentation |
| 核心闭环：用户检索访问 | approved 知识默认可检索，详情访问受 `canReadKnowledge` 控制，view API 增加浏览量 | Implemented | `server/src/controllers/knowledgeController.js`, `server/src/utils.js`, `client/src/pages/KnowledgeDetail.jsx` | 访问权限边界需要自动化测试 | P1: important for course presentation |
| 核心闭环：用户评价反馈 | 用户可评分评论，averageRating 自动重算 | Implemented | `server/src/controllers/feedbackController.js`, `server/src/models/Feedback.js` | 缺少 API 测试确认重复评分更新逻辑 | P1: important for course presentation |
| 核心闭环：管理员更新或归档 | 知识管理员可更新/归档本部门知识，版本记录写入 versions | Partially Implemented | `server/src/controllers/knowledgeController.js`, `client/src/pages/KnowledgeDetail.jsx` | 版本 note 较简化；归档仅 knowledge_manager 可做，system_admin 不参与知识归档 | P2: nice to have |
| employee 权限 | 可登录、创建/提交、查看可读知识、搜索、收藏、评论评分；不可审核/管理用户/看系统级管理 | Implemented | `client/src/App.jsx`, `client/src/components/Layout.jsx`, `server/src/routes/*.js` | 需要后端权限测试证明 | P1: important for course presentation |
| knowledge_manager 权限 | 可审核本部门知识、分类管理、统计查看、归档本部门知识 | Implemented | `server/src/routes/reviewRoutes.js`, `server/src/routes/categoryRoutes.js`, `server/src/routes/analyticsRoutes.js`, `server/src/controllers/knowledgeController.js` | 部门统计不是严格限定本部门，而 analytics 当前对 manager 返回全局统计 | P1: important for course presentation |
| system_admin 权限 | 可管理用户、部门、系统设置、查看全部知识；不负责审核 | Implemented with Issues | `server/src/routes/userRoutes.js`, `server/src/routes/departmentRoutes.js`, `client/src/pages/UserManage.jsx`, `client/src/pages/SystemSettings.jsx` | seed 中存在 admin 审核记录；README 接口未列 DELETE 用户 | P1: important for course presentation |
| decision_maker 权限 | 可查看统计 Dashboard 和知识库，不进入采集/审核/用户管理 | Implemented | `client/src/App.jsx`, `client/src/components/Layout.jsx`, `server/src/routes/analyticsRoutes.js` | 是否允许 decision_maker 阅读全部知识是当前实现选择，需在文档说明 | P2: nice to have |
| users collection | name/email/passwordHash/department/role/status/timestamps 已实现 | Implemented | `server/src/models/User.js` | 无明显缺口 | P3: future extension |
| departments collection | name/code/parentId/timestamps 已实现 | Implemented | `server/src/models/Department.js` | 组织架构同步未实现 | P2: nice to have |
| categories collection | name/code/parentId/description/timestamps 已实现 | Implemented | `server/src/models/Category.js` | 标签没有独立 collection | P2: nice to have |
| knowledge collection | knowledgeCode/title/summary/content/category/tags/attachments/creator/department/status/accessLevel/versionNo/versions/view/favorite/rating/publishedAt 已实现 | Implemented | `server/src/models/Knowledge.js` | statusHistory 也已补充；版本说明较简化 | P2: nice to have |
| reviews collection | knowledgeId/reviewerId/result/comment/reviewTime 已实现 | Implemented | `server/src/models/Review.js`, `server/src/controllers/reviewController.js` | seed 数据中 reviewer 角色存在一处不一致 | P1: important for course presentation |
| feedbacks collection | knowledgeId/userId/rating/comment/createdAt 已实现 | Implemented | `server/src/models/Feedback.js` | 无明显缺口 | P3: future extension |
| searchLogs collection | userId/keyword/filters/resultCount/searchTime 已实现 | Implemented with Issues | `server/src/models/SearchLog.js`, `server/src/controllers/knowledgeController.js` | 只有 keyword/category/tag 查询触发日志；普通列表不记录 | P2: nice to have |
| favorites collection | userId/knowledgeId/createdAt 和唯一索引已实现 | Implemented | `server/src/models/Favorite.js` | 无明显缺口 | P3: future extension |
| knowledge text index | title/summary/content/tags 全文索引已建立 | Implemented | `server/src/models/Knowledge.js` | 无明显缺口 | P3: future extension |
| 附件上传与本地存储 | multer 限制类型、大小、数量；Docker uploads volume 持久化 | Implemented | `server/src/routes/uploadRoutes.js`, `server/src/controllers/uploadController.js`, `docker-compose.yml`, `client/src/components/AttachmentList.jsx` | seed 附件是元数据，文件本身不一定存在 | P2: nice to have |
| 登录页 | 登录入口、账号输入、密码输入、常用账号候选已实现 | Implemented | `client/src/pages/Login.jsx` | 需要前端测试覆盖 | P1: important for course presentation |
| 首页 / Dashboard | 快捷入口、统计卡片、热门知识已实现 | Implemented | `client/src/pages/Dashboard.jsx` | 普通员工无 overview 统计，符合角色差异 | P3: future extension |
| 知识库列表页 | 搜索筛选、排序、知识卡片、空状态已实现 | Implemented | `client/src/pages/KnowledgeList.jsx`, `client/src/components/SearchFilterBar.jsx` | 需要测试回车搜索和筛选参数 | P1: important for course presentation |
| 知识详情页 | 文档阅读、元信息、附件、评论、审核记录、相似推荐已实现 | Implemented | `client/src/pages/KnowledgeDetail.jsx`, `client/src/components/MetadataPanel.jsx`, `client/src/components/AttachmentList.jsx` | 长文档和复杂附件预览未做自动化测试 | P2: nice to have |
| 新建 / 编辑知识页 | 编辑表单、附件上传、草稿/提交、校验提示已实现 | Implemented with Issues | `client/src/pages/KnowledgeForm.jsx`, `server/src/controllers/knowledgeController.js` | 错误文案仍可进一步业务化 | P1: important for course presentation |
| 我的知识页 | 展示个人知识、状态、最新审核意见、编辑/提交入口已实现 | Implemented | `client/src/pages/MyKnowledge.jsx` | 无明显缺口 | P3: future extension |
| 待审核知识页 | manager 审核任务队列已实现 | Implemented | `client/src/pages/ReviewList.jsx` | 需要跨部门权限测试 | P1: important for course presentation |
| 审核详情页 | 阅读内容、附件、元信息、审核意见、通过/驳回已实现 | Implemented | `client/src/pages/ReviewDetail.jsx` | 无明显缺口 | P3: future extension |
| 分类与标签管理页 | 分类树/表单/维护已实现，标签通过知识表单沉淀 | Partially Implemented | `client/src/pages/CategoryManage.jsx`, `server/src/controllers/categoryController.js` | 未提供独立标签 CRUD | P2: nice to have |
| 用户管理页 | 用户新增/编辑/禁用/删除、部门维护、搜索已实现 | Implemented with Issues | `client/src/pages/UserManage.jsx`, `server/src/controllers/userController.js`, `server/src/routes/userRoutes.js` | README API 未同步；删除用户需测试覆盖 | P1: important for course presentation |
| 统计分析 Dashboard | overview、部门贡献、热门知识、搜索词、状态分布已实现 | Implemented | `server/src/controllers/analyticsController.js`, `client/src/pages/Analytics.jsx` | 缺用户活跃度分析 | P2: nice to have |
| 系统设置 / 备份模拟 | 维护动作模拟、状态卡片、日志展示已实现 | Partially Implemented | `client/src/pages/SystemSettings.jsx` | 无真实备份脚本或后端运维日志 | P2: nice to have |
| Docker Compose 部署 | mongo/server/client/seed 服务已实现，uploads 和 mongo volume 已配置 | Implemented | `docker-compose.yml`, `README.md` | 没有生产版 Nginx compose；当前符合本地 Demo | P3: future extension |
| `.env.example` | 后端和前端关键环境变量已提供 | Implemented | `.env.example` | 无明显缺口 | P3: future extension |
| seed data | 4 部门、8 用户、6 分类、10 知识、多状态、反馈、收藏、搜索日志已实现 | Implemented with Issues | `server/src/seed/demoData.js` | seed 中有 admin 审核记录；seed 附件文件不一定真实存在 | P1: important for course presentation |
| 自动化测试 | 当前没有测试脚本和测试依赖 | Missing | `client/package.json`, `server/package.json`, `rg test` | 无法持续验证核心流程 | P1: important for course presentation |

## 3. Functional Gaps

1. **自动化测试缺失（P1）**  
   当前 `client/package.json` 和 `server/package.json` 均没有 `test` script，也未引入 Jest/Vitest/Supertest/React Testing Library/Playwright。核心流程目前主要依赖手工测试。

2. **知识模板套用未实现（P2）**  
   PPT 文本中提到“灵活套用知识模板”，当前知识采集页支持标题、摘要、正文、分类、标签、访问级别、附件，但没有模板选择或模板预填能力。

3. **批量导入未实现（P2）**  
   PPT 文本中提到“支持批量导入，快速沉淀历史知识库”。当前有附件上传，但没有批量导入知识条目的 API 或前端入口。

4. **多人在线协作未实现（P2）**  
   PPT 文本中提到“多人在线编辑、评论互动与实时沟通”。当前已实现评论反馈，但没有实时协同编辑、在线沟通或通知。

5. **独立标签管理未实现（P2）**  
   当前 tags 为 `knowledge.tags` 字符串数组，符合 MongoDB 简化设计，但分类与标签管理页主要维护 categories，标签依赖知识条目输入沉淀，没有独立标签 CRUD。

6. **用户活跃度统计未实现（P2）**  
   统计 Dashboard 已有知识总数、状态分布、浏览量、部门贡献、热门知识、高频搜索词，但未统计用户活跃度、登录频次或贡献人排行。

7. **真实备份脚本未实现（P2）**  
   系统设置页能模拟维护和备份动作，但没有后端备份 API、数据库 dump 脚本或定时任务。

8. **完整 E2E 测试未实现（P1/P2）**  
   尚未覆盖“员工提交 -> manager 审核 -> 搜索 -> 反馈 -> 收藏”的浏览器端自动化路径。

## 4. Design Defects

### 4.1 Business Process Defects

- 核心闭环已实现，但缺少自动化测试证明每次修改后仍能跑通。
- 版本记录已存在 `knowledge.versions`，但更新说明默认值较泛化，尚不能完整体现“知识动态迭代”的业务价值。
- 归档流程可用，但归档后的再利用、恢复或清理策略未实现，适合作为后续扩展。

### 4.2 Permission Control Defects

- 后端路由已实现 RBAC，普通员工无法访问审核、用户管理等接口，manager 审核也限定本部门知识。
- `analyticsRoutes` 对 knowledge_manager、system_admin、decision_maker 均返回全局统计；如果严格按“部门知识管理员查看本部门统计”，当前实现偏宽。
- `system_admin` 可通过 routes 创建/提交知识，但不能审核和归档。作为 Demo 可接受，但应在文档中说明系统管理员主要用于系统维护和用户管理。
- 权限控制缺少自动化测试，尤其是 employee 访问审核接口、manager 跨部门审核、decision_maker 访问系统管理接口等负面场景。

### 4.3 Data Model Defects

- MongoDB 文档模型整体完整，适配知识内容、附件、标签、版本和状态历史。
- `SearchLog` 只在带 keyword/category/tag 的检索请求中记录，普通列表访问不记日志。若要做更完整行为分析，应补充更多行为日志。
- seed 中第一条审核记录 reviewer 为 `admin@example.com`，与当前“系统管理员不负责知识审核”的产品分工不一致。
- seed 附件目前主要是元数据引用，如 `/uploads/seed-K03-260426-001.pdf`，不保证对应实体文件存在；课堂展示真实附件上传应使用运行时上传文件。

### 4.4 API Design Defects

- README 的用户 API 列表未同步近期新增的 `DELETE /api/users/:id`。
- 部分后端错误信息仍偏开发语言，例如 `Title is required.`、`Content is required.`、`Access level is required.`。
- `GET /api/knowledge` 的 `onlyPublished` 默认行为合理，但 README 可进一步说明 system_admin/decision_maker/manager 在可读范围上的差异。

### 4.5 Frontend Interaction Defects

- 页面清单基本齐全，UI 已较适合课程展示。
- 缺少前端自动化测试保障页面渲染、角色菜单和表单校验。
- 分类与标签管理页面名称包含“标签”，但主要交互是分类维护，容易被老师追问“标签在哪里管理”。建议下一轮补充标签说明或轻量标签汇总视图。

### 4.6 Testing Defects

- 当前没有后端 API 测试、前端组件测试、E2E 测试。
- 没有测试数据库策略，若直接测试当前 MongoDB volume，可能污染演示数据。
- 缺少 `docs/TESTING.md`，团队成员不知道如何验证改动。

### 4.7 Deployment Defects

- Docker Compose 本地部署可用，适合当前团队协作和课堂演示。
- 当前 Compose 是开发式部署，client 使用 Vite dev server，不是 Nginx + React build 的正式部署形态。对课程 Demo 可接受。
- 系统维护/备份仅为前端模拟，没有真实运维脚本。

## 5. Bug List

| Priority | Bug / Issue | Evidence | Impact | Suggested Fix |
|---|---|---|---|---|
| P1 | 无自动化测试，无法持续验证核心闭环 | `client/package.json`, `server/package.json` 无 test script | 每次 UI/API 修改都可能引入回归 | 增加后端 API 集成测试，后续补前端和 E2E |
| P1 | README 用户接口列表未同步删除用户接口 | README REST API 仍写 `GET/POST/PUT /api/users`，代码已有 `router.delete("/:id")` | 团队协作和答辩说明不一致 | 更新 README API 列表 |
| P1 | seed 审核记录中包含 system_admin 审核 | `server/src/seed/demoData.js` 中第一条 Review reviewer 为 `admin@example.com` | 与“admin 不负责知识审核”分工不一致 | 将该 reviewer 改为对应部门 knowledge_manager 或在报告中说明历史数据 |
| P1 | 后端提交校验错误仍为英文开发字段 | `server/src/utils.js` 返回 `Title is required.` 等 | 用户侧错误体验不统一，影响输入设计展示 | 改为中文业务提示，并补测试 |
| P1 | knowledge_manager 统计接口返回全局统计 | `server/src/routes/analyticsRoutes.js`, `server/src/controllers/analyticsController.js` | 如果老师追问“部门管理员只能看本部门统计”，当前偏宽 | 根据角色过滤 analytics，或文档说明当前 Dashboard 为全局视图 |
| P2 | 分类与标签管理缺少独立标签维护 | tags 存在于 `knowledge.tags`，无 Tag model/page CRUD | 页面名称和功能期待略有差距 | 增加标签汇总/热门标签管理，或调整文案 |
| P2 | 系统设置/备份为模拟页面，无真实脚本 | `client/src/pages/SystemSettings.jsx` | 不影响 Demo，但实施方案完整度有限 | 增加 `mongodump` 文档或模拟后端日志 API |
| P2 | seed 附件元数据未保证真实文件存在 | `server/src/seed/demoData.js` | 点击 seed 附件可能 404 | seed 时写入占位文件，或文档说明上传附件用于真实预览 |

## 6. Recommended Fix Plan

### P0: Blocks Core Demo

暂未从代码审计中发现会阻断系统启动、登录、知识提交、部门审核、发布检索、反馈收藏或统计 Dashboard 的明确 P0 问题。

### P1: Important for Course Presentation

1. 增加后端 API 集成测试：
   - 登录成功/失败、`/auth/me`
   - employee 创建草稿、提交审核、缺字段提交失败
   - manager 获取本部门待审核、通过、驳回
   - employee 无法访问审核接口
   - manager 无法审核其他部门知识
   - approved 知识检索、详情访问、viewCount 增加
   - feedback 更新 averageRating
   - favorite 收藏和取消收藏
   - system_admin 用户管理新增/更新/删除

2. 补充测试基础设施：
   - 后端优先使用 Jest 或 Vitest + Supertest。
   - 使用独立 test MongoDB 数据库或测试前后清理 collections，避免污染开发演示数据。
   - 在 `server/package.json` 增加 `test` script。

3. 修正文档与数据一致性：
   - README API 列表补 `DELETE /api/users/:id`。
   - README 增加测试运行命令和推荐课堂演示路径。
   - 新增 `docs/TESTING.md`。
   - 将 seed 中 admin 审核记录改为 knowledge_manager，或在 seed 注释中说明为历史迁移数据。

4. 统一核心错误信息：
   - `requireKnowledgeFields` 返回中文业务提示。
   - 登录、权限、提交审核、评分、上传类型错误保持中文或前端统一映射。

5. 明确 analytics 权限策略：
   - 推荐最小修复：knowledge_manager 的部门贡献/overview 可按本部门过滤，decision_maker/system_admin 保持全局。
   - 如果不改行为，则在 README 和审计报告中说明当前统计 Dashboard 是全局管理视图。

### P2: Nice to Have

1. 增加前端基础测试：
   - 登录页渲染
   - 角色菜单差异
   - 知识列表渲染
   - 新建知识表单校验
   - Dashboard 统计卡片

2. 增加 Playwright E2E：
   - employee 登录 -> 创建并提交知识
   - manager 登录 -> 审核通过
   - employee/其他用户搜索 -> 查看详情 -> 评分 -> 收藏

3. 完善功能：
   - 标签汇总或标签管理视图
   - 轻量模板选择
   - 批量导入作为后续接口或文档化未来扩展
   - 系统备份脚本说明或模拟后端日志 API
   - seed 附件占位文件生成

## 7. Demo Readiness

当前系统已具备课堂展示条件。

推荐演示路径：

1. 使用 `employee@example.com / password123` 登录。
2. 进入“新建知识”，创建知识草稿，尝试提交缺字段内容以展示输入校验。
3. 补全标题、正文、分类、访问级别和附件，提交审核。
4. 退出后使用 `manager@example.com / password123` 登录。
5. 进入“待审核”，查看本部门待审核知识，填写审核意见并通过。
6. 回到 employee 或其他普通用户账号，进入“知识库”，通过关键词检索刚发布的知识。
7. 打开知识详情，展示正文、元信息、附件、审核记录、相似推荐。
8. 提交评分评论，并收藏知识。
9. 使用 `decision@example.com / password123` 登录，展示统计分析页面，包括知识总数、状态分布、部门贡献、热门知识、高频搜索词。
10. 使用 `admin@example.com / password123` 登录，展示用户管理、部门维护、系统设置/维护日志。

课堂展示注意事项：

- 如果展示 seed 附件，可能只显示元数据；真实预览建议使用新建知识时上传本地 PDF 或图片。
- 如果老师追问模板、批量导入、实时协作，可说明当前版本按 Demo 范围实现核心闭环，这些属于后续扩展。
- 如果老师追问测试，应说明当前审计已识别测试缺口，下一轮将优先补后端 API 集成测试和核心 E2E。

## Evidence Sources

- `AGENTS.md`
- `README.md`
- `DESIGN.md`
- `docker-compose.yml`
- `.env.example`
- `server/src/models/*.js`
- `server/src/routes/*.js`
- `server/src/controllers/*.js`
- `server/src/seed/demoData.js`
- `client/src/App.jsx`
- `client/src/components/Layout.jsx`
- `client/src/pages/*.jsx`
- `小组汇报/MIS第六组期中汇报_修改后.pptx` extracted text

## Initial Test Status Before Round 2

当前项目没有正式测试框架和测试命令：

- `server/package.json` 仅包含 `dev`、`start`、`seed`。
- `client/package.json` 仅包含 `dev`、`build`、`preview`。
- 未发现 Jest、Vitest、Supertest、React Testing Library 或 Playwright 测试文件。

本轮只生成审计报告，未新增测试、未运行会修改代码的命令。下一轮建议优先补充后端 API 集成测试，因为它最直接覆盖业务流程、权限控制、数据状态变化和统计聚合。

## Round 2 Fix Notes

第二轮系统改进已处理审计报告中确认存在的 P1 问题：

- 已在 `server/package.json` 增加 `npm test`，测试使用 Node.js 内置 `node:test`，不引入大型测试框架。
- 已新增 `server/tests/api.test.js`，使用独立 `km_mis_test` 测试库，测试自行创建并清理数据，不污染演示数据库。
- 已覆盖登录成功/失败、`/auth/me`、知识草稿创建、提交审核校验、部门管理员审核通过/驳回、employee 权限拒绝、跨部门 manager 审核拒绝、知识检索、详情访问、viewCount、评分均值、收藏/取消收藏、system_admin 用户管理、knowledge_manager 部门级统计过滤。
- 已将 `server/src/utils.js` 中知识提交必填校验改为中文业务提示：`请输入知识标题`、`请输入知识正文`、`请选择知识分类`、`请选择访问权限`。
- 已将 `server/src/seed/demoData.js` 中 system_admin 审核记录改为 knowledge_manager 审核记录，使 seed data 与“系统管理员负责运维，不负责知识审核”的角色分工保持一致。
- 已对 `server/src/controllers/analyticsController.js` 做最小修复：knowledge_manager 查看 overview、department stats、hot knowledge 和 search keywords 时限定在本部门相关数据范围内；system_admin 和 decision_maker 保持全局统计视图。
- 已同步 `README.md`，补充 `DELETE /api/users/:id`、测试运行命令、核心闭环和推荐课堂演示路径。
- 已新增 `docs/TESTING.md`，说明测试框架、运行方式、数据库安全策略、覆盖范围和后续未覆盖项目。

第二轮测试结果：

```text
docker compose exec -T server npm test

tests 6
pass 6
fail 0
```

仍保留为后续扩展的 P2 项：

- 知识模板套用
- 批量导入
- 多人在线协作
- 独立 Tag collection 或完整标签 CRUD
- 真实备份脚本
- 前端组件测试和 Playwright E2E

## Round 3 Hardening Notes

第三轮系统完善处理了部分低风险 P2 和演示级稳定性工作：

- 已新增 `GET /api/tags/summary`，基于现有 `knowledge.tags` 聚合标签使用次数和最近使用时间，不新增独立 Tag collection，不修改 MongoDB schema。
- 已在分类与标签管理页增加“标签汇总”视图，点击标签可进入知识库按标签筛选。
- 已在知识新建/编辑页增加轻量静态模板：项目复盘模板、培训资料模板、制度文档模板，用于展示“模板套用”的采集辅助能力。
- 已调整 seed 附件策略：seed 脚本会生成真实 `.txt` 占位文件，使 seed 附件路径可访问，避免课堂演示中出现 404。
- 已新增前端 smoke 测试 `client/tests/smoke.test.js` 和 `npm run test:smoke`，用于验证 Vite SPA 关键路由入口可访问。
- 已新增 `docs/DEMO_SCRIPT.md` 和 `docs/RELEASE_CHECKLIST.md`，补强课堂展示路径和展示前检查流程。

第三轮仍保留为未来扩展的项目：

- 完整 Playwright 浏览器 E2E。当前 client Docker 服务使用 Alpine 镜像，安装 Chromium 系统依赖会显著增加环境复杂度，因此本轮采用后端 API 集成测试 + 前端 smoke + 手工演示脚本组合。
- 完整批量导入。
- 多人实时协作和 WebSocket。
- 独立 Tag collection 与完整标签 CRUD。
- 真实生产级备份脚本和恢复流程。
