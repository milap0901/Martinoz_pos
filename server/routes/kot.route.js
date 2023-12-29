const express = require("express");
const {
  getLiveKots,
  createNewKot,
  updateLiveKot,
  updateActiveKot,
} = require("../controllers/kot.controller");
const {
  checkExistingOrderMiddleware,
} = require("../middleware/checkExistingOrderMiddleware");
const router = express.Router();

router.post("/kots", checkExistingOrderMiddleware, createNewKot);
router.put("/kots/liveKot", updateLiveKot);
router.get("/kots/liveKot", getLiveKots);
router.put("/kots", updateActiveKot);

module.exports = router;
