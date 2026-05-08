const mongoose = require("mongoose");

const searchLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  keyword: { type: String, default: "" },
  filters: { type: Object, default: {} },
  resultCount: { type: Number, default: 0 },
  searchTime: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SearchLog", searchLogSchema);
