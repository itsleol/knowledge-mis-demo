const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department", default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Department", departmentSchema);
