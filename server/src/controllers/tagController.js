const Knowledge = require("../models/Knowledge");

function buildScope(user) {
  const base = { status: "approved", tags: { $exists: true, $ne: [] } };
  if (user.role === "knowledge_manager") {
    return { ...base, department: user.department?._id || user.department };
  }
  return base;
}

async function summary(req, res, next) {
  try {
    const items = await Knowledge.aggregate([
      { $match: buildScope(req.user) },
      { $unwind: "$tags" },
      { $match: { tags: { $ne: "" } } },
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
          lastUsedAt: { $max: "$updatedAt" }
        }
      },
      { $sort: { count: -1, lastUsedAt: -1, _id: 1 } },
      { $limit: Number(req.query.limit) || 30 },
      {
        $project: {
          _id: 0,
          tag: "$_id",
          count: 1,
          lastUsedAt: 1
        }
      }
    ]);

    res.json({ items });
  } catch (error) {
    next(error);
  }
}

module.exports = { summary };
