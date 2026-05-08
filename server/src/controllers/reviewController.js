const Knowledge = require("../models/Knowledge");
const Review = require("../models/Review");
const { canManageKnowledge } = require("../utils");

async function pendingReviews(req, res, next) {
  try {
    const query = { status: "pending" };
    if (req.user.role === "knowledge_manager") {
      query.department = req.user.department._id || req.user.department;
    }
    const items = await Knowledge.find(query)
      .populate("category department creator", "name code email")
      .sort({ updatedAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function approve(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.knowledgeId);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (!canManageKnowledge(req.user, item)) return res.status(403).json({ message: "You cannot review this item." });

    item.status = "approved";
    item.publishedAt = new Date();
    item.statusHistory.push({ status: "approved", actor: req.user._id, comment: req.body.comment || "Approved and published." });
    await item.save();
    await Review.create({
      knowledgeId: item._id,
      reviewerId: req.user._id,
      result: "approved",
      comment: req.body.comment || "Approved."
    });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function reject(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.knowledgeId);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (!canManageKnowledge(req.user, item)) return res.status(403).json({ message: "You cannot review this item." });

    item.status = "rejected";
    item.statusHistory.push({ status: "rejected", actor: req.user._id, comment: req.body.comment || "Rejected for revision." });
    await item.save();
    await Review.create({
      knowledgeId: item._id,
      reviewerId: req.user._id,
      result: "rejected",
      comment: req.body.comment || "Rejected."
    });
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

module.exports = { pendingReviews, approve, reject };
