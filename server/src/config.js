const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

module.exports = {
  mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/knowledge_mis_demo",
  jwtSecret: process.env.JWT_SECRET || "dev_only_change_me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  port: process.env.PORT || 5001,
  clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
  uploadDir: process.env.UPLOAD_DIR || path.resolve(__dirname, "../uploads"),
  autoSeed: process.env.AUTO_SEED === "true"
};
