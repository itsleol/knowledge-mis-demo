const express = require("express");
const { myFavorites, addFavorite, removeFavorite } = require("../controllers/favoriteController");
const { authenticate } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);
router.get("/me", myFavorites);
router.post("/:knowledgeId", addFavorite);
router.delete("/:knowledgeId", removeFavorite);

module.exports = router;
