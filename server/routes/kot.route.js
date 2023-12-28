const express = require("express");
const {
  getLiveKots,
  createNewKot,
  updateLiveKot,
} = require("../controllers/kot.controller");
const {
  checkExistingOrderMiddleware,
} = require("../middleware/checkExistingOrderMiddleware");
const router = express.Router();

router.post("/kots", checkExistingOrderMiddleware, createNewKot);
router.put("/kots/liveKot", updateLiveKot);
router.get("/kots/liveKot", getLiveKots);

module.exports = router;
