const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  knowledgeId: { type: mongoose.Schema.Types.ObjectId, ref: "Knowledge", required: true },
  reviewerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  result: { type: String, enum: ["approved", "rejected"], required: true },
  comment: { type: String, default: "" },
  reviewTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Review", reviewSchema);
