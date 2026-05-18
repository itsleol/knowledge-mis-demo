const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const path = require("path");
const { clientOrigin, uploadDir } = require("./config");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

const configuredOrigins = clientOrigin.split(",").map((origin) => origin.trim()).filter(Boolean);
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (configuredOrigins.includes(origin)) return callback(null, true);
    if (/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(uploadDir));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Knowledge MIS Demo API" });
});

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/knowledge", require("./routes/knowledgeRoutes"));
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/feedbacks", require("./routes/feedbackRoutes"));
app.use("/api/favorites", require("./routes/favoriteRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/departments", require("./routes/departmentRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/analytics", require("./routes/analyticsRoutes"));
app.use("/api/uploads", require("./routes/uploadRoutes"));
app.use("/api/tags", require("./routes/tagRoutes"));

app.use(notFound);
app.use(errorHandler);

module.exports = app;
