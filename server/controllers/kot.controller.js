const { io } = require("../server");
const { createKot } = require("../KOT/createKot");
const { getLiveKOT } = require("../KOT/getLiveKOT");
const { getDb } = require("../common/getDb");
const {
  updateOnlineOrderOnMainServer,
} = require("../pendingOrders/updateOnlineOrderOnMainServer");
const { updateKOT } = require("../KOT/updateKot");
const { getLiveOrders } = require("../orders/getLiveOrders");
const { updateLiveOrders } = require("../orders/updateLiveOrders");
const { modifyKot } = require("../KOT/modifyKot");

const db2 = getDb();

const createNewKot = (req, res) => {
  try {
    const kotTokenNo = createKot(req.body);
    res.status(200).json({
      status: true,
      message: "kot Data Success",
      data: { kotTokenNo, isOrderExist: false },
      error: false,
    });
    const liveKOTs = getLiveKOT();
    req.io.emit("KOTs", liveKOTs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "kot Data Failed",
      data: undefined,
      error,
    });
  }
};

const getLiveKots = (req, res) => {
  try {
    const liveKOTs = getLiveKOT();
    res.status(200).json({
      status: true,
      message: "kot Data Success",
      data: liveKOTs,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "kot Data Failed",
      data: undefined,
      error,
    });
  }
};

const updateLiveKot = async (req, res) => {
  try {
    const { kot_status, online_order_id, order_type, order_id } = req.body;

    if (online_order_id !== null && order_type !== "dine_in") {
      // console.log(online_order_id);
      const onlineOrderDetail = {
        pendingOrderId: null,
        status: kot_status,
        onlineOrderId: online_order_id,
      };
      const { success, error } = await updateOnlineOrderOnMainServer(
        onlineOrderDetail
      );
      if (!success) {
        res.status(500).json({
          status: false,
          message: "kot Data update Failed",
          data: undefined,
          error,
        });
      }
    }
    updateKOT(req.body);

    res.status(200).json({
      status: true,
      message: "kot Data update Success",
      data: "",
      error: false,
    });

    const liveKOTs = getLiveKOT();
    req.io.emit("KOTs", liveKOTs);

    if (
      order_id !== null &&
      order_type !== "dine_in" &&
      kot_status !== "cancelled"
    ) {
      const data = {
        orderStatus: "accepted",
        updatedStatus: "food_is_ready",
        orderId: order_id,
        orderType: order_type,
      };
      updateLiveOrders(data);
      const orders = getLiveOrders();
      req.io.emit("orders", orders);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "kot Data update Failed",
      data: undefined,
      error,
    });
  }
};

const updateActiveKot = (req, res) => {
  try {
    const order = req.body.finalOrder;
    const orderData = { orderId: null, userId: null, orderNo: null };
    const { kotTokenNo, newKotTokenNo } = modifyKot(order, orderData);
    res
      .status(200)
      .json({
        status: true,
        message: "kot Data update Success",
        data: { kotTokenNo, newKotTokenNo },
        error: false,
      });
    const liveKOTs = getLiveKOT();
    req.io.emit("KOTs", liveKOTs);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "kot Data update Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { createNewKot, getLiveKots, updateLiveKot, updateActiveKot };
