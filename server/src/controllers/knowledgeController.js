const Knowledge = require("../models/Knowledge");
const Category = require("../models/Category");
const SearchLog = require("../models/SearchLog");
const Feedback = require("../models/Feedback");
const Favorite = require("../models/Favorite");
const Review = require("../models/Review");
const { parseTags, requireKnowledgeFields, canReadKnowledge, canManageKnowledge } = require("../utils");

async function generateKnowledgeCode(categoryDoc) {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const categoryPart = categoryDoc?.code?.replace(/^C/, "") || "00";
  const prefix = `K${categoryPart}-${yy}${mm}${dd}`;
  const count = await Knowledge.countDocuments({ knowledgeCode: new RegExp(`^${prefix}`) });
  return `${prefix}-${String(count + 1).padStart(3, "0")}`;
}

function buildQuery(req) {
  const { keyword, category, tag, status, onlyPublished = "true" } = req.query;
  const query = {};
  if (keyword) query.$text = { $search: keyword };
  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (status) query.status = status;
  else if (onlyPublished === "true") query.status = "approved";
  return query;
}

function sortQuery(sort) {
  if (sort === "views") return { viewCount: -1, updatedAt: -1 };
  if (sort === "rating") return { averageRating: -1, updatedAt: -1 };
  if (sort === "oldest") return { updatedAt: 1 };
  return { updatedAt: -1 };
}

async function listKnowledge(req, res, next) {
  try {
    const query = buildQuery(req);
    const raw = await Knowledge.find(query)
      .populate("category department creator", "name code email")
      .sort(sortQuery(req.query.sort))
      .limit(Number(req.query.limit) || 60);
    const items = raw.filter((item) => canReadKnowledge(req.user, item));

    if (req.query.keyword !== undefined || req.query.category || req.query.tag) {
      await SearchLog.create({
        userId: req.user._id,
        keyword: req.query.keyword || "",
        filters: { category: req.query.category, tag: req.query.tag, sort: req.query.sort },
        resultCount: items.length
      });
    }

    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function myKnowledge(req, res, next) {
  try {
    const items = await Knowledge.find({ creator: req.user._id })
      .populate("category department creator", "name code email")
      .sort({ updatedAt: -1 });
    const latestReviews = await Review.find({ knowledgeId: { $in: items.map((item) => item._id) } })
      .populate("reviewerId", "name role")
      .sort({ reviewTime: -1 });
    const reviewMap = new Map();
    latestReviews.forEach((review) => {
      const key = String(review.knowledgeId);
      if (!reviewMap.has(key)) reviewMap.set(key, review);
    });
    const withReviews = items.map((item) => ({
      ...item.toObject(),
      latestReview: reviewMap.get(String(item._id)) || null
    }));
    res.json({ items: withReviews });
  } catch (error) {
    next(error);
  }
}

async function getKnowledge(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.id).populate("category department creator", "name code email");
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (!canReadKnowledge(req.user, item)) return res.status(403).json({ message: "You cannot read this knowledge item." });

    const feedbacks = await Feedback.find({ knowledgeId: item._id }).populate("userId", "name role").sort({ createdAt: -1 });
    const reviews = await Review.find({ knowledgeId: item._id }).populate("reviewerId", "name role").sort({ reviewTime: -1 });
    const favorite = await Favorite.findOne({ userId: req.user._id, knowledgeId: item._id });
    const similar = await Knowledge.find({
      _id: { $ne: item._id },
      status: "approved",
      $or: [{ category: item.category?._id }, { tags: { $in: item.tags } }]
    })
      .select("title summary tags averageRating viewCount")
      .limit(5)
      .sort({ viewCount: -1, averageRating: -1 });

    res.json({ item, feedbacks, reviews, latestReview: reviews[0] || null, isFavorite: Boolean(favorite), similar });
  } catch (error) {
    next(error);
  }
}

async function createKnowledge(req, res, next) {
  try {
    const errors = req.body.status === "pending" ? requireKnowledgeFields(req.body) : [];
    if (errors.length) return res.status(400).json({ message: "Knowledge submission is incomplete.", errors });

    const category = req.body.category ? await Category.findById(req.body.category) : null;
    const knowledge = await Knowledge.create({
      knowledgeCode: await generateKnowledgeCode(category),
      title: req.body.title || "Untitled draft",
      summary: req.body.summary || "",
      content: req.body.content || "",
      category: req.body.category || null,
      tags: parseTags(req.body.tags),
      attachments: req.body.attachments || [],
      creator: req.user._id,
      department: req.user.department._id || req.user.department,
      status: req.body.status === "pending" ? "pending" : "draft",
      accessLevel: req.body.accessLevel || "department",
      statusHistory: [{ status: req.body.status === "pending" ? "pending" : "draft", actor: req.user._id, comment: "Created knowledge item." }]
    });

    res.status(201).json({ item: knowledge });
  } catch (error) {
    next(error);
  }
}

async function updateKnowledge(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });

    const ownsDraft = String(item.creator) === String(req.user._id) && ["draft", "rejected"].includes(item.status);
    if (!ownsDraft && !canManageKnowledge(req.user, item)) {
      return res.status(403).json({ message: "You cannot edit this knowledge item." });
    }

    item.versions.push({
      versionNo: item.versionNo,
      editor: req.user._id,
      note: req.body.versionNote || "Content updated.",
      title: item.title,
      summary: item.summary,
      content: item.content
    });
    item.versionNo += 1;
    item.title = req.body.title ?? item.title;
    item.summary = req.body.summary ?? item.summary;
    item.content = req.body.content ?? item.content;
    item.category = req.body.category || item.category;
    item.tags = req.body.tags !== undefined ? parseTags(req.body.tags) : item.tags;
    item.accessLevel = req.body.accessLevel || item.accessLevel;
    if (Array.isArray(req.body.attachments)) item.attachments = req.body.attachments;

    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function submitKnowledge(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (String(item.creator) !== String(req.user._id) && req.user.role !== "system_admin") {
      return res.status(403).json({ message: "Only the creator can submit this knowledge item." });
    }

    const errors = requireKnowledgeFields(item);
    if (errors.length) return res.status(400).json({ message: "Knowledge submission is incomplete.", errors });

    item.status = "pending";
    item.statusHistory.push({ status: "pending", actor: req.user._id, comment: "Submitted for department review." });
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function archiveKnowledge(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (!canManageKnowledge(req.user, item)) return res.status(403).json({ message: "You cannot archive this item." });

    item.status = "archived";
    item.statusHistory.push({ status: "archived", actor: req.user._id, comment: req.body.comment || "Archived for asset retention." });
    await item.save();
    res.json({ item });
  } catch (error) {
    next(error);
  }
}

async function recordView(req, res, next) {
  try {
    const item = await Knowledge.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Knowledge item not found." });
    if (!canReadKnowledge(req.user, item)) return res.status(403).json({ message: "You cannot read this knowledge item." });
    item.viewCount += 1;
    await item.save();
    res.json({ viewCount: item.viewCount });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listKnowledge,
  myKnowledge,
  getKnowledge,
  createKnowledge,
  updateKnowledge,
  submitKnowledge,
  archiveKnowledge,
  recordView
};
