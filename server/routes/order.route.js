const express = require("express");
const {
  getActiveOrders,
  createActiveOrder,
} = require("../controllers/orders.controller");
const {
  checkAndUpdateOrderMiddleware,
} = require("../middleware/checkAndUpdateOrderMiddleware");
const {
  checkOldKOTsMiddleware,
} = require("../middleware/checkOldKOTsMiddleware");

const router = express.Router();

router.get("/orders/liveOrder", getActiveOrders);

router.post(
  "/orders",
  checkAndUpdateOrderMiddleware,
  checkOldKOTsMiddleware,
  createActiveOrder
);

module.exports = router;
