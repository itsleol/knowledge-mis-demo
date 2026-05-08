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

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
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
