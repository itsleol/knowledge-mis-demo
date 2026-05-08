const express = require("express");
const { pendingReviews, approve, reject } = require("../controllers/reviewController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("knowledge_manager", "system_admin"));
router.get("/pending", pendingReviews);
router.post("/:knowledgeId/approve", approve);
router.post("/:knowledgeId/reject", reject);

module.exports = router;
