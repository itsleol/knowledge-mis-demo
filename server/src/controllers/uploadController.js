const fs = require("fs/promises");
const path = require("path");
const { execFile } = require("child_process");
const { promisify } = require("util");
const { uploadDir } = require("../config");

const execFileAsync = promisify(execFile);

function isWordFile(file) {
  return file.mimetype === "application/msword"
    || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
}

async function createWordPreview(file) {
  if (!isWordFile(file)) return {};

  const ext = path.extname(file.filename);
  const sourcePath = path.join(uploadDir, file.filename);
  const previewFileName = `${path.basename(file.filename, ext)}.pdf`;
  const previewFilePath = path.join(uploadDir, previewFileName);

  try {
    await execFileAsync("soffice", [
      "--headless",
      "--nologo",
      "--nofirststartwizard",
      "--convert-to",
      "pdf",
      "--outdir",
      uploadDir,
      sourcePath
    ], {
      timeout: 30000,
      env: { ...process.env, HOME: "/tmp" }
    });
    await fs.access(previewFilePath);
    return {
      previewPath: `/uploads/${previewFileName}`,
      previewType: "application/pdf"
    };
  } catch (error) {
    console.warn(`Word preview conversion failed for ${file.filename}: ${error.message}`);
    return {};
  }
}

async function uploadFiles(req, res, next) {
  try {
    const items = await Promise.all((req.files || []).map(async (file) => {
      const preview = await createWordPreview(file);
      return {
        originalName: file.businessFileName || file.decodedOriginalName || file.originalname,
        fileName: file.filename,
        type: file.mimetype,
        size: file.size,
        path: `/uploads/${file.filename}`,
        ...preview,
        uploadedAt: file.uploadedAt || new Date()
      };
    }));
    res.status(201).json({ items });
  } catch (error) {
    next(error);
  }
}

module.exports = { uploadFiles };
