const Favorite = require("../models/Favorite");
const Knowledge = require("../models/Knowledge");

async function myFavorites(req, res, next) {
  try {
    const items = await Favorite.find({ userId: req.user._id })
      .populate({
        path: "knowledgeId",
        populate: [
          { path: "category", select: "name code" },
          { path: "department", select: "name code" }
        ]
      })
      .sort({ createdAt: -1 });
    res.json({ items });
  } catch (error) {
    next(error);
  }
}

async function addFavorite(req, res, next) {
  try {
    const knowledge = await Knowledge.findById(req.params.knowledgeId);
    if (!knowledge || knowledge.status !== "approved") {
      return res.status(404).json({ message: "Published knowledge item not found." });
    }
    const item = await Favorite.findOneAndUpdate(
      { userId: req.user._id, knowledgeId: knowledge._id },
      { createdAt: new Date() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    knowledge.favoriteCount = await Favorite.countDocuments({ knowledgeId: knowledge._id });
    await knowledge.save();
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
}

async function removeFavorite(req, res, next) {
  try {
    await Favorite.deleteOne({ userId: req.user._id, knowledgeId: req.params.knowledgeId });
    const count = await Favorite.countDocuments({ knowledgeId: req.params.knowledgeId });
    await Knowledge.findByIdAndUpdate(req.params.knowledgeId, { favoriteCount: count });
    res.json({ message: "Favorite removed." });
  } catch (error) {
    next(error);
  }
}

module.exports = { myFavorites, addFavorite, removeFavorite };
