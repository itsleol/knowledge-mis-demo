const Feedback = require("../models/Feedback");
const Knowledge = require("../models/Knowledge");

async function recalculateRating(knowledgeId) {
  const rows = await Feedback.find({ knowledgeId });
  const avg = rows.length ? rows.reduce((sum, row) => sum + row.rating, 0) / rows.length : 0;
  await Knowledge.findByIdAndUpdate(knowledgeId, { averageRating: Number(avg.toFixed(1)) });
}

async function listFeedbacks(req, res, next) {
  try {
    const items = await Feedback.find({ knowledgeId: req.params.knowledgeId })
      .populate("userId", "name role")
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function upsertFeedback(req, res, next) {
  try {
    const rating = Number(req.body.rating);
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5." });
    }

    const knowledge = await Knowledge.findById(req.params.knowledgeId);
    if (!knowledge || knowledge.status !== "approved") {
      return res.status(404).json({ message: "Published knowledge item not found." });
    }

    const item = await Feedback.findOneAndUpdate(
      { knowledgeId: knowledge._id, userId: req.user._id },
      { rating, comment: req.body.comment || "", createdAt: new Date() },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );
    await recalculateRating(knowledge._id);
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

module.exports = { listFeedbacks, upsertFeedback, recalculateRating };
