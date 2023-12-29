const { getLiveOrders } = require("../orders/getLiveOrders");
const { getLiveKOT } = require("../KOT/getLiveKOT");
const { createOrder } = require("../orders/createOrder");
const { createKot } = require("../KOT/createKot");
const { getOrder } = require("../orders/getOrder");
const { updateLiveOrders } = require("../orders/updateLiveOrders");
const { getMergedOrder } = require("../orders/getExistingOrder");
const { getMergedOrderAndKotData } = require("../KOT/getMergedOrderAndKotData");
const { getPendingOrders } = require("../pendingOrders/getPendingOrders");
const { modifyExistingOrder } = require("../orders/modifyExistingOrder");
const { modifyKot } = require("../KOT/modifyKot");

const getActiveOrders = (req, res) => {
  try {
    const activeOrders = getLiveOrders();
    // console.log(activeOrders);
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

const updateActiveOrders = (req, res) => {
  updateLiveOrders(req.body);
  res.status(200).json({
    status: true,
    message: "Orders updates Success",
    data: undefined,
    error: false,
  });

  // emmit live orders after entry in table
  const orders = getLiveOrders();
  req.io.emit("orders", orders);

  // only update and emmit KOT for pick up or delivery and status is "accepted"/ click on "food is redy"
  if (
    req.body.orderType !== "dine_in" &&
    req.body.updatedStatus === "food_is_ready"
  ) {
    const liveKOTs = getLiveKOT();
    req.io.emit("KOTs", liveKOTs);
  }
};

const ExistingOrderPaymentDetail = (req, res) => {
  try {
    const latestOrder = req.body;
    const mergedOrderData = getMergedOrder(latestOrder);
    if (mergedOrderData) {
      res.status(200).json({
        status: true,
        message: "Multi Pay Success",
        data: { mergedOrderData, type: "order" },
        error: false,
      });
      return;
    }

    const MergedOrderAndKotData = getMergedOrderAndKotData(latestOrder);
    if (MergedOrderAndKotData) {
      res.status(200).json({
        status: true,
        message: "Multi Pay Success",
        data: { mergedOrderData: MergedOrderAndKotData, type: "kot" },
        error: false,
      });
    }

    res.status(200).json({
      status: true,
      message: "Multi Pay Success",
      data: { mergedOrderData: null, type: null },
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Multi Pay Failed",
      data: undefined,
      error,
    });
  }
};

const FetchPendingOrders = (req, res) => {
  try {
    const pendingOrders = getPendingOrders();
    res.status(200).json({
      status: true,
      message: "Fetch Pending orders Success",
      data: pendingOrders,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Fetch Pending orders Failed",
      data: undefined,
      error,
    });
  }
};

const updateExistingOrders = (req, res) => {
  try {
    const data = req.body;
    let orderData = modifyExistingOrder(data.finalOrder);
    if (orderData.success === false) {
      res.status(400).json({
        status: true,
        message: "update orders success",
        data: { orderData, order: {} },
        error: false,
      });
    } else {
      const order = getOrder(orderData.orderId);
      res.status(200).json({
        status: false,
        message: "update orders Failed",
        data: {
          orderData,
          order,
          isOldKOTsExist: false,
          isOldOrderExist: true,
        },
        error: true,
      });
    }
    const orders = getLiveOrders();
    req.io.emit("orders", orders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "update orders Failed",
      data: undefined,
      error,
    });
  }
};

const kotToOrder = (req, res) => {
  try {
    const finalOrder = req.body.finalOrder;
    const orderData = createOrder(finalOrder);
    const kotdata = modifyKot(finalOrder, orderData);
    const order = getOrder(orderData.orderId);
    res.status(200).json({
      status: true,
      message: "kot to order success",
      data: { order, ...kotdata },
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
      message: "kot to order Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = {
  getActiveOrders,
  createActiveOrder,
  updateActiveOrders,
  ExistingOrderPaymentDetail,
  FetchPendingOrders,
  updateExistingOrders,
  kotToOrder,
};
