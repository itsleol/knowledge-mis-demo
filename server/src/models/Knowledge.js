const mongoose = require("mongoose");

const attachmentSchema = new mongoose.Schema(
  {
    originalName: String,
    fileName: String,
    type: String,
    size: Number,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const versionSchema = new mongoose.Schema(
  {
    versionNo: Number,
    editor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    editedAt: { type: Date, default: Date.now },
    note: String,
    title: String,
    summary: String,
    content: String
  },
  { _id: false }
);

const statusHistorySchema = new mongoose.Schema(
  {
    status: String,
    actor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    changedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const knowledgeSchema = new mongoose.Schema(
  {
    knowledgeCode: { type: String, required: true, unique: true, trim: true },
    title: { type: String, required: true, trim: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    tags: [{ type: String, trim: true }],
    attachments: [attachmentSchema],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    department: { type: mongoose.Schema.Types.ObjectId, ref: "Department", required: true },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "rejected", "archived"],
      default: "draft"
    },
    accessLevel: {
      type: String,
      enum: ["public", "department", "role", "private"],
      default: "department"
    },
    versionNo: { type: Number, default: 1 },
    versions: [versionSchema],
    statusHistory: [statusHistorySchema],
    viewCount: { type: Number, default: 0 },
    favoriteCount: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    publishedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

knowledgeSchema.index({ title: "text", summary: "text", content: "text", tags: "text" });
knowledgeSchema.index({ category: 1, status: 1, updatedAt: -1 });
knowledgeSchema.index({ creator: 1, createdAt: -1 });
knowledgeSchema.index({ department: 1, status: 1 });

module.exports = mongoose.model("Knowledge", knowledgeSchema);
