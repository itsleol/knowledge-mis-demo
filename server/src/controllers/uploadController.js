function uploadFiles(req, res) {
  const items = (req.files || []).map((file) => ({
    originalName: file.originalname,
    fileName: file.filename,
    type: file.mimetype,
    size: file.size,
    path: `/uploads/${file.filename}`,
    uploadedAt: new Date()
  }));
  res.status(201).json({ items });
}

module.exports = { uploadFiles };
