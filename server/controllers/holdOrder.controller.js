const { createHoldOrder } = require("../holdOrder/createHoldOrder");
const { deletHoldOrder } = require("../holdOrder/deletHoldOrder");
const { getHoldOrders } = require("../holdOrder/getHoldOrders");

const FetchHoldOrders = (req, res) => {
  try {
    const holdOrders = getHoldOrders();
    res.status(200).json({
      status: true,
      message: "Get Hold Orders succcess",
      data: holdOrders,
      error: false,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Get Hold Orders Failed",
      data: undefined,
      error,
    });
  }
};

const PostHoldOrders = (req, res) => {
  try {
    createHoldOrder(req.body);
    res.status(200).json({
      status: true,
      message: "Post Hold Orders succcess",
      data: undefined,
      error: false,
    });
    const holdOrders = getHoldOrders();
    req.io.emit("holdOrders", holdOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Post Hold Orders Failed",
      data: undefined,
      error,
    });
  }
};

const RemoveHoldOrder = (req, res) => {
  try {
    deletHoldOrder(req.query.id);
    res.status(200).json({
      status: true,
      message: "Remove Hold Orders succcess",
      data: undefined,
      error: false,
    });
    const holdOrders = getHoldOrders();
    req.io.emit("holdOrders", holdOrders);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: false,
      message: "Remove Hold Orders Failed",
      data: undefined,
      error,
    });
  }
};

module.exports = { FetchHoldOrders, PostHoldOrders, RemoveHoldOrder };
