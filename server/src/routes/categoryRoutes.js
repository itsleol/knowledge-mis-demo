const express = require("express");
const controller = require("../controllers/categoryController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get("/", controller.listCategories);
router.post("/", authorize("knowledge_manager", "system_admin"), controller.createCategory);
router.put("/:id", authorize("knowledge_manager", "system_admin"), controller.updateCategory);
router.delete("/:id", authorize("knowledge_manager", "system_admin"), controller.deleteCategory);

module.exports = router;
