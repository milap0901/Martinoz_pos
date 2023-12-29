const { io } = require("socket.io-client");
const { checkAndUpdateOrder } = require("../orders/checkAndUpdateOrder");
const { getOrder } = require("../orders/getOrder");
const { getLiveOrders } = require("../orders/getLiveOrders");

const checkAndUpdateOrderMiddleware = (req, res, next) => {
  try {
    const { orderId, customerId } = checkAndUpdateOrder(req.body.finalOrder);
    if (orderId !== "") {
      const order = getOrder(orderId);

      res.status(200).json({
        status: true,
        data: { isOldKOTsExist: false, order, isOldOrderExist: true },
        message: "order update success",
        error: false,
      });
      const orders = getLiveOrders();
      req.io.emit("orders", orders);
    } else {
      // for isUpdate = false move on to create new order kot
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "order update Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { checkAndUpdateOrderMiddleware };
