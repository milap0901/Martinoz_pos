const express = require("express");
const {
  FetchHoldOrders,
  PostHoldOrders,
  RemoveHoldOrder,
} = require("../controllers/holdOrder.controller");

const router = express.Router();

router.get("/holdOrder", FetchHoldOrders);
router.post("/holdOrder", PostHoldOrders);
router.delete("/holdOrder", RemoveHoldOrder);

module.exports = router;
