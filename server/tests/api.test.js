process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const assert = require("node:assert/strict");
const { before, beforeEach, after, test } = require("node:test");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const app = require("../src/app");

const Category = require("../src/models/Category");
const Department = require("../src/models/Department");
const Favorite = require("../src/models/Favorite");
const Feedback = require("../src/models/Feedback");
const Knowledge = require("../src/models/Knowledge");
const Review = require("../src/models/Review");
const SearchLog = require("../src/models/SearchLog");
const User = require("../src/models/User");

function testMongoUri() {
  if (process.env.MONGO_URI_TEST) return process.env.MONGO_URI_TEST;
  const source = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/knowledge_mis_demo";
  return source.replace(/\/([^/?]+)(\?.*)?$/, "/km_mis_test$2");
}

let server;
let baseUrl;
let seed;

async function request(path, { token, method = "GET", body } = {}) {
  const res = await fetch(`${baseUrl}/api${path}`, {
    method,
    headers: {
      ...(body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

async function login(email, password = "password123") {
  const { res, data } = await request("/auth/login", { method: "POST", body: { email, password } });
  assert.equal(res.status, 200);
  assert.ok(data.token);
  return data.token;
}

async function clearDatabase() {
  await Promise.all([
    Category.deleteMany({}),
    Department.deleteMany({}),
    Favorite.deleteMany({}),
    Feedback.deleteMany({}),
    Knowledge.deleteMany({}),
    Review.deleteMany({}),
    SearchLog.deleteMany({}),
    User.deleteMany({})
  ]);
}

async function seedBaseData() {
  await clearDatabase();
  const [deptA, deptB] = await Department.insertMany([
    { name: "研发中心", code: "T01" },
    { name: "客户服务部", code: "T02" }
  ]);
  const [category] = await Category.insertMany([
    { name: "技术文档", code: "TC01", description: "测试分类" }
  ]);
  const passwordHash = await bcrypt.hash("password123", 10);
  const [employee, manager, otherManager, admin, decision] = await User.insertMany([
    { name: "测试员工", email: "employee.test@example.com", passwordHash, department: deptA._id, role: "employee" },
    { name: "测试知识管理员", email: "manager.test@example.com", passwordHash, department: deptA._id, role: "knowledge_manager" },
    { name: "其他部门管理员", email: "other.manager.test@example.com", passwordHash, department: deptB._id, role: "knowledge_manager" },
    { name: "测试系统管理员", email: "admin.test@example.com", passwordHash, department: deptA._id, role: "system_admin" },
    { name: "测试决策者", email: "decision.test@example.com", passwordHash, department: deptB._id, role: "decision_maker" }
  ]);
  seed = { deptA, deptB, category, employee, manager, otherManager, admin, decision };
}

async function createKnowledge(overrides = {}) {
  return Knowledge.create({
    knowledgeCode: overrides.knowledgeCode || `KT-${Date.now()}-${Math.round(Math.random() * 10000)}`,
    title: overrides.title || "测试知识",
    summary: overrides.summary || "测试摘要",
    content: overrides.content || "测试正文内容",
    category: overrides.category || seed.category._id,
    tags: overrides.tags || ["测试", "流程"],
    creator: overrides.creator || seed.employee._id,
    department: overrides.department || seed.deptA._id,
    status: overrides.status || "approved",
    accessLevel: overrides.accessLevel || "public",
    viewCount: overrides.viewCount || 0,
    averageRating: overrides.averageRating || 0,
    publishedAt: overrides.status === "approved" || !overrides.status ? new Date() : null
  });
}

before(async () => {
  await mongoose.connect(testMongoUri());
  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(async () => {
  await seedBaseData();
});

after(async () => {
  await clearDatabase();
  await mongoose.disconnect();
  await new Promise((resolve) => server.close(resolve));
});

test("auth login succeeds, login failure is rejected, and /auth/me returns current user", async () => {
  const { res: badRes, data: badData } = await request("/auth/login", {
    method: "POST",
    body: { email: "employee.test@example.com", password: "wrong" }
  });
  assert.equal(badRes.status, 401);
  assert.equal(badData.message, "账号或密码错误。");

  const token = await login("employee.test@example.com");
  const { res, data } = await request("/auth/me", { token });
  assert.equal(res.status, 200);
  assert.equal(data.user.email, "employee.test@example.com");
  assert.equal(data.user.role, "employee");
});

test("employee creates a draft, cannot submit incomplete knowledge, then submits complete knowledge for review", async () => {
  const token = await login("employee.test@example.com");

  const draft = await request("/knowledge", {
    token,
    method: "POST",
    body: { title: "草稿知识" }
  });
  assert.equal(draft.res.status, 201);
  assert.equal(draft.data.item.status, "draft");

  const invalid = await request(`/knowledge/${draft.data.item._id}/submit`, { token, method: "POST" });
  assert.equal(invalid.res.status, 400);
  assert.deepEqual(invalid.data.errors.sort(), ["请选择知识分类", "请输入知识正文"].sort());

  const update = await request(`/knowledge/${draft.data.item._id}`, {
    token,
    method: "PUT",
    body: {
      title: "完整测试知识",
      content: "这是一条可提交审核的完整知识内容。",
      category: seed.category._id,
      accessLevel: "public",
      tags: "测试,审核"
    }
  });
  assert.equal(update.res.status, 200);

  const submit = await request(`/knowledge/${draft.data.item._id}/submit`, { token, method: "POST" });
  assert.equal(submit.res.status, 200);
  assert.equal(submit.data.item.status, "pending");
});

test("review permissions enforce employee denial, manager department scope, approve, and reject", async () => {
  const employeeToken = await login("employee.test@example.com");
  const managerToken = await login("manager.test@example.com");
  const otherManagerToken = await login("other.manager.test@example.com");

  const pending = await createKnowledge({ status: "pending", title: "待审核知识 A" });
  const otherDeptPending = await createKnowledge({
    status: "pending",
    title: "其他部门待审核知识",
    creator: seed.otherManager._id,
    department: seed.deptB._id
  });

  const denied = await request("/reviews/pending", { token: employeeToken });
  assert.equal(denied.res.status, 403);

  const pendingList = await request("/reviews/pending", { token: managerToken });
  assert.equal(pendingList.res.status, 200);
  assert.ok(pendingList.data.items.some((item) => item._id === String(pending._id)));
  assert.ok(!pendingList.data.items.some((item) => item._id === String(otherDeptPending._id)));

  const crossDept = await request(`/reviews/${pending._id}/approve`, {
    token: otherManagerToken,
    method: "POST",
    body: { comment: "不应通过" }
  });
  assert.equal(crossDept.res.status, 403);

  const approve = await request(`/reviews/${pending._id}/approve`, {
    token: managerToken,
    method: "POST",
    body: { comment: "内容完整，同意发布。" }
  });
  assert.equal(approve.res.status, 200);
  assert.equal(approve.data.item.status, "approved");
  assert.ok(approve.data.item.publishedAt);

  const rejected = await createKnowledge({ status: "pending", title: "待驳回知识" });
  const reject = await request(`/reviews/${rejected._id}/reject`, {
    token: managerToken,
    method: "POST",
    body: { comment: "请补充正文结构。" }
  });
  assert.equal(reject.res.status, 200);
  assert.equal(reject.data.item.status, "rejected");

  const reviews = await Review.find({ knowledgeId: { $in: [pending._id, rejected._id] } });
  assert.equal(reviews.length, 2);
});

test("published knowledge can be searched, viewed, rated, favorited, and unfavorited", async () => {
  const token = await login("employee.test@example.com");
  const knowledge = await createKnowledge({ title: "流程检索测试知识", content: "包含唯一关键词 alpha-flow" });

  const search = await request("/knowledge?keyword=alpha-flow", { token });
  assert.equal(search.res.status, 200);
  assert.ok(search.data.items.some((item) => item._id === String(knowledge._id)));
  assert.equal(await SearchLog.countDocuments({ keyword: "alpha-flow" }), 1);

  const detail = await request(`/knowledge/${knowledge._id}`, { token });
  assert.equal(detail.res.status, 200);
  assert.equal(detail.data.item.title, "流程检索测试知识");

  const view = await request(`/knowledge/${knowledge._id}/view`, { token, method: "POST" });
  assert.equal(view.res.status, 200);
  assert.equal(view.data.viewCount, 1);

  const feedback = await request(`/feedbacks/${knowledge._id}`, {
    token,
    method: "POST",
    body: { rating: 5, comment: "很有帮助" }
  });
  assert.equal(feedback.res.status, 201);
  const rated = await Knowledge.findById(knowledge._id);
  assert.equal(rated.averageRating, 5);

  const favorite = await request(`/favorites/${knowledge._id}`, { token, method: "POST" });
  assert.equal(favorite.res.status, 201);
  assert.equal(await Favorite.countDocuments({ knowledgeId: knowledge._id }), 1);
  assert.equal((await Knowledge.findById(knowledge._id)).favoriteCount, 1);

  const remove = await request(`/favorites/${knowledge._id}`, { token, method: "DELETE" });
  assert.equal(remove.res.status, 200);
  assert.equal(await Favorite.countDocuments({ knowledgeId: knowledge._id }), 0);
  assert.equal((await Knowledge.findById(knowledge._id)).favoriteCount, 0);
});

test("system_admin can create, update, disable, and delete users", async () => {
  const token = await login("admin.test@example.com");

  const created = await request("/users", {
    token,
    method: "POST",
    body: {
      name: "新增用户",
      email: "new.user.test@example.com",
      password: "password123",
      department: seed.deptA._id,
      role: "employee",
      status: "active"
    }
  });
  assert.equal(created.res.status, 201);
  assert.equal(created.data.item.email, "new.user.test@example.com");

  const updated = await request(`/users/${created.data.item._id}`, {
    token,
    method: "PUT",
    body: { name: "更新用户", status: "disabled" }
  });
  assert.equal(updated.res.status, 200);
  assert.equal(updated.data.item.name, "更新用户");
  assert.equal(updated.data.item.status, "disabled");

  const deleted = await request(`/users/${created.data.item._id}`, { token, method: "DELETE" });
  assert.equal(deleted.res.status, 200);
  assert.equal(await User.countDocuments({ email: "new.user.test@example.com" }), 0);
});

test("knowledge_manager analytics are limited to the manager department", async () => {
  const managerToken = await login("manager.test@example.com");
  await createKnowledge({ title: "本部门已发布", department: seed.deptA._id, status: "approved", viewCount: 7 });
  await createKnowledge({
    title: "其他部门已发布",
    department: seed.deptB._id,
    creator: seed.otherManager._id,
    status: "approved",
    viewCount: 11
  });
  await createKnowledge({ title: "本部门待审核", department: seed.deptA._id, status: "pending", viewCount: 3 });

  const overview = await request("/analytics/overview", { token: managerToken });
  assert.equal(overview.res.status, 200);
  assert.equal(overview.data.total, 2);
  assert.equal(overview.data.approved, 1);
  assert.equal(overview.data.pending, 1);
  assert.equal(overview.data.totalViews, 10);

  const departments = await request("/analytics/departments", { token: managerToken });
  assert.equal(departments.res.status, 200);
  assert.equal(departments.data.items.length, 1);
  assert.equal(departments.data.items[0].departmentName, "研发中心");

  const hot = await request("/analytics/hot-knowledge", { token: managerToken });
  assert.equal(hot.res.status, 200);
  assert.equal(hot.data.items.length, 1);
  assert.equal(hot.data.items[0].title, "本部门已发布");
});
