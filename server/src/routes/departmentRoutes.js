const express = require("express");
const controller = require("../controllers/departmentController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("system_admin"));
router.get("/", controller.listDepartments);
router.post("/", controller.createDepartment);
router.put("/:id", controller.updateDepartment);
router.delete("/:id", controller.deleteDepartment);

module.exports = router;
