const express = require("express");
const controller = require("../controllers/userController");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate, authorize("system_admin"));
router.get("/", controller.listUsers);
router.post("/", controller.createUser);
router.put("/:id", controller.updateUser);

module.exports = router;
