const express = require("express");
const controller = require("../controllers/analyticsController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("knowledge_manager", "system_admin", "decision_maker"));
router.get("/overview", controller.overview);
router.get("/departments", controller.departmentStats);
router.get("/hot-knowledge", controller.hotKnowledge);
router.get("/search-keywords", controller.searchKeywords);

module.exports = router;
