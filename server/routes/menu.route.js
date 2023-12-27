const express = require("express");
const router = express.Router();
const { getMenu } = require("../controllers/menu.controller");
const {
  getCategories,
  getCategory,
} = require("../controllers/categories.controller");
const { getItem } = require("../controllers/item.controller");

router.get("/menu-data", getMenu);
router.get("/menu-data/categories", getCategories);
router.get("/menu-data/categories/:id", getCategory);
router.get("/menu-data/item/:id", getItem);

module.exports = router;
