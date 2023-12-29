const express = require("express");
const {
  getActiveOrders,
  createActiveOrder,
  updateActiveOrders,
  ExistingOrderPaymentDetail,
  FetchPendingOrders,
} = require("../controllers/orders.controller");
const {
  checkAndUpdateOrderMiddleware,
} = require("../middleware/checkAndUpdateOrderMiddleware");
const {
  checkOldKOTsMiddleware,
} = require("../middleware/checkOldKOTsMiddleware");
const {
  updateOnlineOrderOnMainServerMiddleware,
} = require("../middleware/updateOnlineOrderOnMainServerMiddleware");

const router = express.Router();

router.get("/orders/liveOrder", getActiveOrders);

router.post(
  "/orders",
  checkAndUpdateOrderMiddleware,
  checkOldKOTsMiddleware,
  createActiveOrder
);

router.put(
  "/orders/liveOrder",
  updateOnlineOrderOnMainServerMiddleware,
  updateActiveOrders
);

router.get("/orders/pendingOrder", FetchPendingOrders);

router.post("/orders/ExistingOrderPaymentDetail", ExistingOrderPaymentDetail);

module.exports = router;
