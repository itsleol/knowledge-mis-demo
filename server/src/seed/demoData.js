const bcrypt = require("bcryptjs");
const Department = require("../models/Department");
const User = require("../models/User");
const Category = require("../models/Category");
const Knowledge = require("../models/Knowledge");
const Review = require("../models/Review");
const Feedback = require("../models/Feedback");
const SearchLog = require("../models/SearchLog");
const Favorite = require("../models/Favorite");

const password = "password123";

async function resetDemoData() {
  await Promise.all([
    Department.deleteMany({}),
    User.deleteMany({}),
    Category.deleteMany({}),
    Knowledge.deleteMany({}),
    Review.deleteMany({}),
    Feedback.deleteMany({}),
    SearchLog.deleteMany({}),
    Favorite.deleteMany({})
  ]);
}

async function seedDemoData({ reset = false } = {}) {
  if (reset) {
    await resetDemoData();
  } else {
    const users = await User.countDocuments();
    if (users > 0) return { skipped: true, users };
  }

  const depts = await Department.insertMany([
    { name: "人力资源部", code: "D01" },
    { name: "研发中心", code: "D02" },
    { name: "市场运营部", code: "D03" },
    { name: "客户服务部", code: "D04" }
  ]);
  const dept = Object.fromEntries(depts.map((item) => [item.code, item]));

  const passwordHash = await bcrypt.hash(password, 10);
  const users = await User.insertMany([
    { name: "员工 张晨", email: "employee@example.com", passwordHash, department: dept.D02._id, role: "employee" },
    { name: "研发员工 李敏", email: "engineer@example.com", passwordHash, department: dept.D02._id, role: "employee" },
    { name: "HR 员工 王佳", email: "hr.employee@example.com", passwordHash, department: dept.D01._id, role: "employee" },
    { name: "市场员工 陈宇", email: "marketing@example.com", passwordHash, department: dept.D03._id, role: "employee" },
    { name: "研发知识管理员", email: "manager@example.com", passwordHash, department: dept.D02._id, role: "knowledge_manager" },
    { name: "客服知识管理员", email: "service.manager@example.com", passwordHash, department: dept.D04._id, role: "knowledge_manager" },
    { name: "系统管理员", email: "admin@example.com", passwordHash, department: dept.D01._id, role: "system_admin" },
    { name: "决策者 刘总", email: "decision@example.com", passwordHash, department: dept.D03._id, role: "decision_maker" }
  ]);
  const user = Object.fromEntries(users.map((item) => [item.email, item]));

  const categories = await Category.insertMany([
    { name: "制度规范", code: "C01", description: "组织制度、流程规范与管理办法" },
    { name: "项目案例", code: "C02", description: "项目复盘、实施经验与案例沉淀" },
    { name: "培训资料", code: "C03", description: "课程、课件、岗位培训与学习材料" },
    { name: "技术文档", code: "C04", description: "研发规范、接口说明和运维文档" },
    { name: "客户经验", code: "C05", description: "客户问题、服务话术和解决方案" },
    { name: "数据分析", code: "C06", description: "经营分析、指标说明和管理报表" }
  ]);
  const cat = Object.fromEntries(categories.map((item) => [item.code, item]));

  const attachment = (name, type = "application/pdf", size = 245760) => ({
    originalName: name,
    fileName: `seed-${name}`,
    type,
    size,
    path: `/uploads/seed-${name}`,
    uploadedAt: new Date()
  });

  const rows = [
    ["K03-260426-001", "新人入职培训材料整理规范", "统一新员工培训材料的收集、审核和发布方式。", "培训资料由 HR 发起，部门知识管理员补充岗位相关内容，发布后供新员工检索学习。", cat.C03, ["培训", "入职", "制度"], user["hr.employee@example.com"], dept.D01, "approved", 96, 4.6],
    ["K04-260426-002", "研发接口文档提交模板", "说明接口文档的最小字段与审批规则。", "接口文档必须包含接口地址、请求参数、响应字段、错误码和调用示例，提交后由研发知识管理员审核。", cat.C04, ["接口", "模板", "研发"], user["employee@example.com"], dept.D02, "approved", 148, 4.8],
    ["K02-260426-003", "CRM 二期项目复盘", "记录 CRM 二期上线过程中的问题、经验和改进点。", "复盘围绕需求确认、测试验收、用户培训、上线支持四个阶段展开，为后续 MIS 项目实施提供参考。", cat.C02, ["项目复盘", "实施", "CRM"], user["engineer@example.com"], dept.D02, "approved", 122, 4.4],
    ["K05-260426-004", "客户投诉处理话术库", "沉淀常见投诉场景下的处理口径。", "客服人员可按场景检索话术，处理完成后补充反馈评价，管理员定期更新。", cat.C05, ["客户服务", "话术", "投诉"], user["marketing@example.com"], dept.D04, "approved", 185, 4.7],
    ["K06-260426-005", "月度知识利用率看板说明", "解释统计 Dashboard 的指标口径。", "指标包括知识总量、已发布数量、浏览量、收藏量、评分均值和高频搜索词。", cat.C06, ["统计", "指标", "Dashboard"], user["manager@example.com"], dept.D02, "approved", 80, 4.2],
    ["K04-260426-006", "生产故障应急处理清单", "一线故障响应流程与记录要求。", "待审核：清单包含告警确认、影响评估、临时止血、根因分析和复盘归档。", cat.C04, ["应急", "运维", "流程"], user["employee@example.com"], dept.D02, "pending", 12, 0],
    ["K02-260426-007", "跨部门协作会议纪要模板", "统一项目会议纪要结构。", "待审核：包含议题、结论、负责人、截止日期和风险提醒。", cat.C02, ["协作", "会议", "模板"], user["engineer@example.com"], dept.D02, "pending", 6, 0],
    ["K01-260426-008", "知识库命名规则草稿", "说明知识编号与分类编号的编码规则。", "草稿：K + 分类码 + 日期码 + 三位流水号，方便课堂展示系统代码设计。", cat.C01, ["编码", "制度"], user["employee@example.com"], dept.D02, "draft", 0, 0],
    ["K03-260426-009", "旧版线下培训签到表", "旧流程资料，保留作历史参考。", "该知识已被新版在线培训流程替代，归档后仍可由管理员查看。", cat.C03, ["归档", "培训"], user["hr.employee@example.com"], dept.D01, "archived", 44, 3.8],
    ["K05-260426-010", "客户满意度问卷初稿", "因题项不完整被退回修改。", "问卷缺少售后响应速度和知识库自助解决率指标，需补充后再次提交。", cat.C05, ["问卷", "客户"], user["marketing@example.com"], dept.D03, "rejected", 9, 0]
  ];

  const knowledge = await Knowledge.insertMany(
    rows.map(([knowledgeCode, title, summary, content, category, tags, creator, department, status, viewCount, averageRating], index) => ({
      knowledgeCode,
      title,
      summary,
      content,
      category: category._id,
      tags,
      attachments: [index % 2 === 0 ? attachment(`${knowledgeCode}.pdf`) : attachment(`${knowledgeCode}.pptx`, "application/vnd.openxmlformats-officedocument.presentationml.presentation", 530000)],
      creator: creator._id,
      department: department._id,
      status,
      accessLevel: status === "approved" ? "public" : "department",
      versionNo: status === "approved" ? 2 : 1,
      versions: status === "approved" ? [{ versionNo: 1, editor: creator._id, note: "Seeded first version.", title, summary, content }] : [],
      statusHistory: [
        { status: "draft", actor: creator._id, comment: "Initial creation." },
        ...(status !== "draft" ? [{ status, actor: user["manager@example.com"]._id, comment: `Seed status: ${status}.` }] : [])
      ],
      viewCount,
      favoriteCount: index < 5 ? 2 : 0,
      averageRating,
      publishedAt: status === "approved" ? new Date("2026-04-26T10:00:00+08:00") : null
    }))
  );

  await Review.insertMany([
    { knowledgeId: knowledge[0]._id, reviewerId: user["admin@example.com"]._id, result: "approved", comment: "内容完整，可发布。" },
    { knowledgeId: knowledge[1]._id, reviewerId: user["manager@example.com"]._id, result: "approved", comment: "模板适合研发部门使用。" },
    { knowledgeId: knowledge[2]._id, reviewerId: user["manager@example.com"]._id, result: "approved", comment: "复盘质量较高。" },
    { knowledgeId: knowledge[9]._id, reviewerId: user["service.manager@example.com"]._id, result: "rejected", comment: "问卷指标不完整，请补充。" }
  ]);

  await Feedback.insertMany([
    { knowledgeId: knowledge[0]._id, userId: user["employee@example.com"]._id, rating: 5, comment: "适合新人快速理解流程。" },
    { knowledgeId: knowledge[0]._id, userId: user["manager@example.com"]._id, rating: 4, comment: "建议补充岗位差异。" },
    { knowledgeId: knowledge[1]._id, userId: user["engineer@example.com"]._id, rating: 5, comment: "字段要求很清楚。" },
    { knowledgeId: knowledge[1]._id, userId: user["admin@example.com"]._id, rating: 5, comment: "可以作为输入设计样例。" },
    { knowledgeId: knowledge[2]._id, userId: user["decision@example.com"]._id, rating: 4, comment: "复盘对管理决策有参考价值。" },
    { knowledgeId: knowledge[2]._id, userId: user["employee@example.com"]._id, rating: 5, comment: "实施阶段问题总结具体。" },
    { knowledgeId: knowledge[3]._id, userId: user["hr.employee@example.com"]._id, rating: 5, comment: "话术很实用。" },
    { knowledgeId: knowledge[3]._id, userId: user["service.manager@example.com"]._id, rating: 4, comment: "后续增加更多场景。" },
    { knowledgeId: knowledge[4]._id, userId: user["decision@example.com"]._id, rating: 4, comment: "指标口径清楚。" },
    { knowledgeId: knowledge[4]._id, userId: user["admin@example.com"]._id, rating: 4, comment: "适合课堂统计展示。" }
  ]);

  await Favorite.insertMany([
    { knowledgeId: knowledge[1]._id, userId: user["employee@example.com"]._id },
    { knowledgeId: knowledge[2]._id, userId: user["employee@example.com"]._id },
    { knowledgeId: knowledge[0]._id, userId: user["engineer@example.com"]._id },
    { knowledgeId: knowledge[3]._id, userId: user["hr.employee@example.com"]._id },
    { knowledgeId: knowledge[4]._id, userId: user["decision@example.com"]._id }
  ]);

  await SearchLog.insertMany(["接口", "模板", "复盘", "统计", "审核", "客户", "培训", "话术", "运维", "知识利用率"].map((keyword, index) => ({
    userId: users[index % users.length]._id,
    keyword,
    filters: {},
    resultCount: Math.max(1, index % 3)
  })));

  return { skipped: false, users: users.length, knowledge: knowledge.length };
}

module.exports = { seedDemoData, resetDemoData, password };
