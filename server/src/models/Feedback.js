const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  knowledgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Knowledge", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

feedbackSchema.index({ knowledgeId: 1, userId: 1 }, { unique: true });

module.exports = mongoose.model("Feedback", feedbackSchema);
