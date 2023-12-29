const {
  updateOnlineOrderOnMainServer,
} = require("../pendingOrders/updateOnlineOrderOnMainServer");

const updateOnlineOrderOnMainServerMiddleware = async (req, res, next) => {
  try {
    const orderDetail = req.body;
    if (
      orderDetail.online_order_id !== null &&
      orderDetail.orderType !== "dine_in"
    ) {
      const onlineOrderDetail = {
        pendingOrderId: null,
        status: orderDetail.updatedStatus,
        onlineOrderId: orderDetail.online_order_id,
      };
      const { success, error } = await updateOnlineOrderOnMainServer(
        onlineOrderDetail
      );

      if (success) {
        next();
      } else {
        res.status(500).json({
          status: false,
          message: "update live order Failed",
          data: undefined,
          error,
        });
      }
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "update live order Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { updateOnlineOrderOnMainServerMiddleware };
