const { getLiveOrders } = require("../orders/getLiveOrders");
const { getLiveKOT } = require("../KOT/getLiveKOT");
const { createOrder } = require("../orders/createOrder");
const { createKot } = require("../KOT/createKot");
const { getOrder } = require("../orders/getOrder");

const getActiveOrders = (req, res) => {
  try {
    const activeOrders = getLiveOrders();
    console.log(activeOrders);
    res.status(200).json({
      status: true,
      message: "Active Orders Data Success",
      data: activeOrders,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Active Orders Data Failed",
      data: undefined,
      error,
    });
  }
};

const createActiveOrder = (req, res) => {
  try {
    const { userId, orderId, orderNo } = createOrder(req.body.finalOrder);
    const kotTokenNo = createKot(req.body.finalOrder, userId, orderId);
    const order = getOrder(orderId);
    res.status(200).json({
      status: true,
      message: "Orders Created success",
      data: {
        isOldKOTsExist: false,
        orderNo,
        kotTokenNo,
        order,
        isOldOrderExist: false,
      },
      error: false,
    });
    const orders = getLiveOrders();
    req.io.emit("orders", orders);
    const liveKOTs = getLiveKOT();
    req.io.emit("KOTs", liveKOTs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Orders Created Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { getActiveOrders, createActiveOrder };
