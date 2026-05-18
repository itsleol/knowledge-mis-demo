const Knowledge = require("../models/Knowledge");
const SearchLog = require("../models/SearchLog");
const Department = require("../models/Department");
const User = require("../models/User");

function knowledgeScope(user) {
  if (user.role === "knowledge_manager") {
    return { department: user.department._id || user.department };
  }
  return {};
}

async function overview(req, res, next) {
  try {
    const scope = knowledgeScope(req.user);
    const [total, approved, pending, archived, stats, statusRows] = await Promise.all([
      Knowledge.countDocuments(scope),
      Knowledge.countDocuments({ ...scope, status: "approved" }),
      Knowledge.countDocuments({ ...scope, status: "pending" }),
      Knowledge.countDocuments({ ...scope, status: "archived" }),
      Knowledge.aggregate([
        { $match: scope },
        { $group: { _id: null, totalViews: { $sum: "$viewCount" }, averageRating: { $avg: "$averageRating" } } }
      ]),
      Knowledge.aggregate([{ $match: scope }, { $group: { _id: "$status", count: { $sum: 1 } } }])
    ]);

    res.json({
      total,
      approved,
      pending,
      archived,
      totalViews: stats[0]?.totalViews || 0,
      averageRating: Number((stats[0]?.averageRating || 0).toFixed(1)),
      statusDistribution: statusRows.map((row) => ({ status: row._id, count: row.count }))
    });
  } catch (error) {
    next(error);
  }
}

async function departmentStats(req, res, next) {
  try {
    const scope = knowledgeScope(req.user);
    const rows = await Knowledge.aggregate([
      { $match: scope },
      { $group: { _id: "$department", total: { $sum: 1 }, approved: { $sum: { $cond: [{ $eq: ["$status", "approved"] }, 1, 0] } }, views: { $sum: "$viewCount" } } },
      { $sort: { approved: -1, total: -1 } }
    ]);
    const departments = await Department.find({ _id: { $in: rows.map((row) => row._id) } });
    const nameMap = new Map(departments.map((dept) => [String(dept._id), dept.name]));
    res.json({ items: rows.map((row) => ({ ...row, departmentName: nameMap.get(String(row._id)) || "Unknown" })) });
  } catch (error) {
    next(error);
  }
}

async function hotKnowledge(req, res, next) {
  try {
    const items = await Knowledge.find({ ...knowledgeScope(req.user), status: "approved" })
      .populate("category department", "name code")
      .select("title knowledgeCode viewCount averageRating favoriteCount category department")
      .sort({ viewCount: -1, averageRating: -1 })
      .limit(5);
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function searchKeywords(req, res, next) {
  try {
    const match = { keyword: { $ne: "" } };
    if (req.user.role === "knowledge_manager") {
      const users = await User.find({ department: req.user.department._id || req.user.department }).select("_id");
      match.userId = { $in: users.map((user) => user._id) };
    }
    const items = await SearchLog.aggregate([
      { $match: match },
      { $group: { _id: "$keyword", count: { $sum: 1 }, lastSearchTime: { $max: "$searchTime" } } },
      { $sort: { count: -1, lastSearchTime: -1 } },
      { $limit: 10 }
    ]);
    res.json({ items: items.map((row) => ({ keyword: row._id, count: row.count, lastSearchTime: row.lastSearchTime })) });
  } catch (error) {
    next(error);
  }
}

module.exports = { overview, departmentStats, hotKnowledge, searchKeywords };
