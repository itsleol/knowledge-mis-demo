const express = require("express");
const { listFeedbacks, upsertFeedback } = require("../controllers/feedbackController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get("/:knowledgeId", listFeedbacks);
router.post("/:knowledgeId", upsertFeedback);

module.exports = router;
