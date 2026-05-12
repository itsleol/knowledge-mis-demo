const express = require("express");
const controller = require("../controllers/knowledgeController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get("/", controller.listKnowledge);
router.get("/mine", controller.myKnowledge);
router.get("/:id", controller.getKnowledge);
router.post("/", authorize("employee", "knowledge_manager", "system_admin"), controller.createKnowledge);
router.put("/:id", authorize("employee", "knowledge_manager", "system_admin"), controller.updateKnowledge);
router.post("/:id/submit", authorize("employee", "knowledge_manager", "system_admin"), controller.submitKnowledge);
router.post("/:id/archive", authorize("knowledge_manager"), controller.archiveKnowledge);
router.post("/:id/view", controller.recordView);

module.exports = router;
