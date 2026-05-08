function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((item) => item.message);
    return res.status(400).json({ message: "Validation failed.", errors });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value exists.", errors: err.keyValue });
  }

  if (err.name === "MulterError" || err.message === "Unsupported attachment type.") {
    return res.status(400).json({ message: err.message });
  }

  return res.status(err.status || 500).json({
    message: err.message || "Internal server error."
  });
}

module.exports = { notFound, errorHandler };
