const fs = require("fs");
const path = require("path");
const express = require("express");
const multer = require("multer");
const { uploadFiles } = require("../controllers/uploadController");
const { authenticate } = require("../middleware/auth");
const { uploadDir } = require("../config");

const router = express.Router();
fs.mkdirSync(uploadDir, { recursive: true });

const allowed = new Set([
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
  "text/plain"
]);

function decodeOriginalName(name = "附件") {
  const value = String(name);
  if (/[\u4e00-\u9fff]/.test(value)) return value;
  const decoded = Buffer.from(value, "latin1").toString("utf8");
  if (decoded && !decoded.includes("�") && /[\u4e00-\u9fff]/.test(decoded)) return decoded;
  return value;
}

function sanitizeFilePart(value, fallback) {
  return String(value || fallback)
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .replace(/\s+/g, " ")
    .replace(/[. ]+$/g, "")
    .trim()
    .slice(0, 80) || fallback;
}

function formatUploadStamp(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return [
    pad(date.getMonth() + 1),
    pad(date.getDate()),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds())
  ].join("");
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uploadedAt = new Date();
    const decodedOriginalName = decodeOriginalName(file.originalname);
    const ext = path.extname(decodedOriginalName) || path.extname(file.originalname);
    const originalBase = sanitizeFilePart(path.basename(decodedOriginalName, ext), "附件原文件");
    const knowledgeTitle = sanitizeFilePart(req.body.knowledgeTitle, "未命名知识");
    const baseCount = Number.parseInt(req.body.existingAttachmentCount || "0", 10) || 0;
    req.attachmentUploadIndex = (req.attachmentUploadIndex || 0) + 1;
    const sequence = String(baseCount + req.attachmentUploadIndex).padStart(2, "0");
    const stamp = formatUploadStamp(uploadedAt);
    const finalName = `${knowledgeTitle}-附件-${sequence}-${stamp}-${originalBase}${ext}`;
    file.decodedOriginalName = decodedOriginalName;
    file.businessFileName = finalName;
    file.uploadedAt = uploadedAt;
    cb(null, finalName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 5 },
  fileFilter: (req, file, cb) => {
    if (!allowed.has(file.mimetype)) return cb(new Error("Unsupported attachment type."));
    cb(null, true);
  }
});

router.post("/", authenticate, upload.array("files", 5), uploadFiles);

module.exports = router;
