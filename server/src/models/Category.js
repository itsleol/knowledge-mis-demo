const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    description: { type: String, default: "" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);
