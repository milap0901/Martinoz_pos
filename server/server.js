const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const bodyParser = require("body-parser");
const cors = require("cors");
const { createOrder } = require("./orders/createOrder");
const { getUserSuggest } = require("./users/usersSuggest");
const { createKot } = require("./KOT/createKot");
const { getLiveKOT } = require("./KOT/getLiveKOT");
const { getLiveOrders } = require("./orders/getLiveOrders");
// const { updateKOT } = require("./KOT/updateKot");
const { updateLiveOrders } = require("./orders/updateLiveOrders");
const { createHoldOrder } = require("./holdOrder/createHoldOrder");
const { getHoldOrders } = require("./holdOrder/getHoldOrders");
const { deletHoldOrder } = require("./holdOrder/deletHoldOrder");
const { checkAndUpdateOrder } = require("./orders/checkAndUpdateOrder");
// const { checkExistingOrder } = require("./orders/checkExistingOrder");
const { getPrinters } = require("./printers/getPrinters");
// const { checkOldKOTs } = require("./KOT/checkOldKOTs");
const { mergeKOTandOrder } = require("./common/mergeKOTandOrder");
const { updateKOTUserId } = require("./KOT/updateKOTUserId");
const { updatePrinter } = require("./printers/updatePrinter");
const { getOldKOTs } = require("./KOT/getOldKOTs");
const { getMenuData } = require("./menuData/getMenuData");
const { setMenuData } = require("./menuData/setMenuData");
const { assignPrinterToBill } = require("./printers/assignPrinterToBill");
const {
  updateDefaultScreenData,
} = require("./settings/updateDefaultScreenData");
const { getDefaultScreenData } = require("./settings/getDefaultScreenData");
const { getOrder } = require("./orders/getOrder");
const { addOrderIdToOldKots } = require("./KOT/addOrderIdToOldKots");
const { getOrderSummary } = require("./reports/getOrderReports");
const { modifyExistingOrder } = require("./orders/modifyExistingOrder");
const { modifyKot } = require("./KOT/modifyKot");
const { updatePrintCount } = require("./orders/updatePrintCount");
const compression = require("compression");
const { setPendingOrders } = require("./pendingOrders/setPendingOrders");
const { getPendingOrders } = require("./pendingOrders/getPendingOrders");
const { getPendingOrder } = require("./pendingOrders/getPendingOrder");
const {
  convertPendingOrderToOrder,
} = require("./common/convertPendingOrderToOrder");
const { updatePendingOrder } = require("./pendingOrders/updatePendingOrder");
const {
  updateOnlineOrderOnMainServer,
} = require("./pendingOrders/updateOnlineOrderOnMainServer");
const { authenticateBiller } = require("./biller/authenticateBiller");
const { getDueOrders } = require("./orders/getDueOrders");
const { getMergedOrder } = require("./orders/getExistingOrder");
const { getMergedOrderAndKotData } = require("./KOT/getMergedOrderAndKotData");
// const { syncCustomers } = require("./sync/syncCustomers");
// const { syncCustomerAddresses } = require("./sync/syncCustomerAddresses");
// const { syncOrders } = require("./sync/syncOrders");
// const { syncKots } = require("./sync/syncKots");
const cookieParser = require("cookie-parser");

const menuRoute = require("./routes/menu.route");
const areaRoute = require("./routes/area.route");
const customerRoute = require("./routes/customer.route");
const kotRoute = require("./routes/kot.route");
const orderRoute = require("./routes/order.route");
const holdOrdersRoute = require("./routes/holdOrder.route");
const tableViewRoute = require("./routes/tableView.route");

// const appPath = process.argv
// console.log(appPath)

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("A client has connected:", socket.id);

  // You can perform any necessary actions here when a client connects.

  socket.on("disconnect", () => {
    console.log("A client has disconnected:", socket.id);

    // You can perform cleanup or other actions when a client disconnects.
  });
});

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(cors("*"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(compression());

app.use("/api/v2", menuRoute);
app.use("/api/v2", areaRoute);
app.use("/api/v2", customerRoute);
app.use("/api/v2", kotRoute);
app.use("/api/v2", orderRoute);
app.use("/api/v2", holdOrdersRoute);
app.use("/api/v2", tableViewRoute);

app.get("/menuData", (req, res) => {
  const menuData = getMenuData();
  res.status(200).json(menuData);
});

app.get("/ping", async (req, res) => {
  res.status(200).json({ status: "success" });
});

// app.get("/liveOrders", (req, res) => {
//   const start = Date.now();
//   const orders = getLiveOrders();
//   res.status(200).json(orders);
// });

// app.get("/liveKOT", (req, res) => {
//   const liveKOTs = getLiveKOT();
//   res.status(200).json(liveKOTs);
// });

// app.put("/liveKot", async (req, res, next) => {
//   const { kot_status, online_order_id, order_type } = req.body;

//   if (online_order_id !== null && order_type !== "dine_in") {
//     console.log(online_order_id);
//     const onlineOrderDetail = {
//       pendingOrderId: null,
//       status: kot_status,
//       onlineOrderId: online_order_id,
//     };
//     const { success, error } = await updateOnlineOrderOnMainServer(
//       onlineOrderDetail
//     );
//     if (success) {
//       next();
//     } else {
//       res.status(404).json({ error });
//     }
//   } else {
//     next();
//   }
// });

// app.put("/liveKot", (req, res) => {
//   const { order_id, order_type, kot_status } = req.body;
//   updateKOT(req.body);
//   res.sendStatus(200);
//   const liveKOTs = getLiveKOT();
//   io.emit("KOTs", liveKOTs);

//   if (
//     order_id !== null &&
//     order_type !== "dine_in" &&
//     kot_status !== "cancelled"
//   ) {
//     const data = {
//       orderStatus: "accepted",
//       updatedStatus: "food_is_ready",
//       orderId: order_id,
//       orderType: order_type,
//     };
//     updateLiveOrders(data);
//     const orders = getLiveOrders();
//     io.emit("orders", orders);
//   }
// });

// app.post("/order", (req, res, next) => {
//   // middleware

//   //  for order type Dine In only check if same table number exist and is not setteled, if axist add items to that order only no need to create new KOT
//   const { orderId, customerId } = checkAndUpdateOrder(req.body.finalOrder);

//   if (orderId !== "") {
//     const order = getOrder(orderId);

//     res
//       .status(200)
//       .json({ isOldKOTsExist: false, order, isOldOrderExist: true });
//     const orders = getLiveOrders();
//     io.emit("orders", orders);
//   } else {
//     // for isUpdate = false move on to create new order kot
//     next();
//   }
// });

// app.post("/order", (req, res, next) => {
//   if (req.body.finalOrder.orderType === "dine_in") {
//     const isOldKOTsExist = checkOldKOTs(req.body.finalOrder.tableNumber);
//     if (isOldKOTsExist) {
//       res
//         .status(200)
//         .json({ isOldKOTsExist, order: {}, isOldOrderExist: false });
//     } else {
//       next();
//     }
//   } else {
//     next();
//   }
// });

// app.post("/order", (req, res) => {
//   const { userId, orderId, orderNo } = createOrder(req.body.finalOrder);
//   const kotTokenNo = createKot(req.body.finalOrder, userId, orderId);
//   const order = getOrder(orderId);
//   res.status(200).json({
//     isOldKOTsExist: false,
//     orderNo,
//     kotTokenNo,
//     order,
//     isOldOrderExist: false,
//   });
//   const orders = getLiveOrders();
//   io.emit("orders", orders);
//   const liveKOTs = getLiveKOT();
//   io.emit("KOTs", liveKOTs);
// });

// app.post("/KOT", (req, res, next) => {
//   const isOrderExist = checkExistingOrder(req.body);
//   if (!isOrderExist) {
//     next();
//   } else {
//     res.status(200).json({ orderExist: true });
//   }
// });

// app.post("/KOT", (req, res) => {
//   //  create KOT
//   const kotTokenNo = createKot(req.body);
//   res.status(200).json({ orderExist: false, kotTokenNo });
//   // emmit KOT
//   const liveKOTs = getLiveKOT();
//   io.emit("KOTs", liveKOTs);
// });

// app.put("/liveOrders", async (req, res, next) => {
//   const orderDetail = req.body;

//   if (
//     orderDetail.online_order_id !== null &&
//     orderDetail.orderType !== "dine_in"
//   ) {
//     const onlineOrderDetail = {
//       pendingOrderId: null,
//       status: orderDetail.updatedStatus,
//       onlineOrderId: orderDetail.online_order_id,
//     };
//     const { success, error } = await updateOnlineOrderOnMainServer(
//       onlineOrderDetail
//     );

//     if (success) {
//       next();
//     } else {
//       res.status(404).json({ error });
//     }
//   } else {
//     next();
//   }
// });

// app.put("/liveOrders", (req, res) => {
//   // update live order status

//   updateLiveOrders(req.body);
//   res.status(200).json("updated");

//   // emmit live orders after entry in table
//   const orders = getLiveOrders();
//   io.emit("orders", orders);

//   // only update and emmit KOT for pick up or delivery and status is "accepted"/ click on "food is redy"
//   if (
//     req.body.orderType !== "dine_in" &&
//     req.body.updatedStatus === "food_is_ready"
//   ) {
//     const liveKOTs = getLiveKOT();
//     io.emit("KOTs", liveKOTs);
//   }
// });

// app.get("/users", async (req, res) => {
//   const userSuggest = getUserSuggest(req.query);
//   res.status(200).json(userSuggest);
// });

// app.post("/existingOrder", (req, res) => {
//   const latestOrder = req.body;
//   const mergedOrderData = getMergedOrder(latestOrder);
//   if (mergedOrderData) {
//     res.status(200).json({ mergedOrderData, type: "order" });
//     return;
//   }

//   const MergedOrderAndKotData = getMergedOrderAndKotData(latestOrder);
//   if (MergedOrderAndKotData) {
//     res
//       .status(200)
//       .json({ mergedOrderData: MergedOrderAndKotData, type: "kot" });
//   }

//   res.status(200).json({ mergedOrderData: null, type: null });
// });

// app.post("/holdOrder", async (req, res) => {
//   createHoldOrder(req.body);
//   res.sendStatus(200);
//   const holdOrders = getHoldOrders();
//   io.emit("holdOrders", holdOrders);
// });

// app.get("/holdOrder", async (req, res) => {
//   const holdOrders = getHoldOrders();
//   res.status(200).json(holdOrders);
// });

// app.delete("/holdOrder", async (req, res) => {
//   deletHoldOrder(req.query.id);
//   res.sendStatus(200);
//   const holdOrders = getHoldOrders();
//   io.emit("holdOrders", holdOrders);
// });

// app.get("/pendingOrder", async (req, res) => {
//   const pendingOrders = getPendingOrders();
//   res.status(200).json(pendingOrders);
// });

app.get("/getPrinters", (req, res) => {
  const printers = getPrinters();
  res.status(200).json(printers);
});

app.put("/updatePrinter", (req, res) => {
  updatePrinter(req.body);
  res.sendStatus(200);
});

app.put("/assignPrinterToBill", (req, res) => {
  assignPrinterToBill(req.body);
  res.sendStatus(200);
});

// ========================= for adding kot to already existing order on same table =======================================

app.post("/updateOrderAndCreateKOT", (req, res) => {
  // const db = openDb();
  const { orderId, customerId } = checkAndUpdateOrder(req.body);
  let userId = customerId;
  const kotTokenNo = createKot(req.body, userId, orderId);
  res.status(200).json(kotTokenNo);
  const orders = getLiveOrders();
  io.emit("orders", orders);
  const liveKOTs = getLiveKOT();
  io.emit("KOTs", liveKOTs);
});

// ====================== for converting old KOTs on same table into order when save btn clicked ========================

app.post("/includeKOTsAndCreateOrder", (req, res) => {
  const oldKOTs = getOldKOTs(req.body.tableNumber);
  let kotTokenNo;

  if (req.body.orderCart.length) {
    kotTokenNo = createKot(req.body);
  }

  let newFinalOrder = mergeKOTandOrder(req.body, oldKOTs);
  const { userId, orderId, orderNo } = createOrder(newFinalOrder);
  addOrderIdToOldKots(orderId, req.body.tableNumber, userId);

  const order = getOrder(orderId);

  res.status(200).json({ kotTokenNo, orderNo, order });

  updateKOTUserId(orderId, userId, req.body.tableNumber);

  const orders = getLiveOrders();
  io.emit("orders", orders);
  const liveKOTs = getLiveKOT();
  io.emit("KOTs", liveKOTs);
});

app.post("/updateDatabase", (req, res) => {
  const { token } = req.body;
  setMenuData(token);
  res.sendStatus(200);
});

app.get("/defaultScreenData", (req, res) => {
  const options = getDefaultScreenData();
  res.status(200).json(options);
});

app.patch("/defaultScreenData", (req, res) => {
  updateDefaultScreenData(req, res);
});

app.get("/ordersSummary", (req, res) => {
  const filters = req.query;
  const orders = getOrderSummary(filters);
  res.status(200).json({
    success: true,
    error: null,
    orderData: orders.filterdOrders,
    orderSummary: orders.salesSummaryData,
    duration: orders.duration,
  });
});

// app.post("/modifyOrder", async (req, res, next) => {
//   if (req.body.finalOrder.order_status === "cancelled") {
//     const billerCred = req.body.finalOrder.billerCred;
//     const isValid = await authenticateBiller(billerCred);
//     if (isValid) {
//       next();
//     } else {
//       res.status(401).json({ message: "invalid password" });
//     }
//   } else {
//     next();
//   }
// });

// app.post("/modifyOrder", (req, res) => {
//   const data = req.body;
//   let orderData = modifyExistingOrder(data.finalOrder);
//   if (orderData.success === false) {
//     res.status(400).json({ orderData, order: {} });
//   } else {
//     const order = getOrder(orderData.orderId);
//     res
//       .status(200)
//       .json({ orderData, order, isOldKOTsExist: false, isOldOrderExist: true });
//   }
//   const orders = getLiveOrders();
//   io.emit("orders", orders);
// });

// app.post("/kotToOrder", (req, res) => {
//   const finalOrder = req.body.finalOrder;
//   const orderData = createOrder(finalOrder);
//   const kotdata = modifyKot(finalOrder, orderData);
//   const order = getOrder(orderData.orderId);
//   res.status(200).json({ order, ...kotdata });
//   const orders = getLiveOrders();
//   io.emit("orders", orders);
//   const liveKOTs = getLiveKOT();
//   io.emit("KOTs", liveKOTs);
// });

// app.post("/modifyKot", (req, res) => {
//   const order = req.body.finalOrder;
//   const orderData = { orderId: null, userId: null, orderNo: null };
//   const { kotTokenNo, newKotTokenNo } = modifyKot(order, orderData);
//   res.status(200).json({ kotTokenNo, newKotTokenNo });
//   const liveKOTs = getLiveKOT();
//   io.emit("KOTs", liveKOTs);
// });

app.put("/orderPrintCount", (req, res) => {
  const orderId = req.body.orderId;
  const printCount = req.body.printCount;
  updatePrintCount(orderId, printCount);
  res.sendStatus(200);
  const orders = getLiveOrders();
  io.emit("orders", orders);
});

app.post("/authenticateBiller", async (req, res) => {
  const billerCred = req.body.billerDetail;
  console.log(billerCred);
  const isValid = await authenticateBiller(billerCred);

  if (isValid) {
    res.status(200).json({ message: "success", error: null });
  } else {
    res
      .status(401)
      .json({ message: "invalide credentials", error: "invalide credentials" });
  }
});

app.post("/pendingOrderToOrder", async (req, res) => {
  //make api call to update status

  //if success
  const pendingOrderDetail = req.body.pendingOrderDetail;
  const biller = req.body.biller;
  const { success } = await updateOnlineOrderOnMainServer(pendingOrderDetail);
  //getpending order

  if (success) {
    const pendingOrder = getPendingOrder(pendingOrderDetail);
    let newOrder = convertPendingOrderToOrder(
      pendingOrder,
      pendingOrderDetail.status,
      biller
    );
    const { userId, orderId, orderNo } = createOrder(newOrder);

    if (pendingOrderDetail.status === "accepted") {
      const kotTokenNo = createKot(newOrder, userId, orderId);
      newOrder.kotTokenNo = kotTokenNo;
      newOrder.orderNo = orderNo;
    } else {
      newOrder.kotTokenNo = null;
      newOrder.orderNo = null;
    }
    const order = getOrder(orderId);
    res.status(200).json({ finalOrder: newOrder, order });
    updatePendingOrder(pendingOrderDetail.pendingOrderId);

    const pendingOrders = getPendingOrders();
    const isPending = false;
    const customerNames = [];
    io.emit("pendingOrders", pendingOrders, isPending, customerNames);
    if (pendingOrderDetail.status === "accepted") {
      const orders = getLiveOrders();
      io.emit("orders", orders);
      const liveKOTs = getLiveKOT();
      io.emit("KOTs", liveKOTs);
    }
  } else {
    res.sendStatus(404);
  }
});

app.get("/dueOrders", async (req, res) => {
  const orderDetail = req.query;
  const dueOrders = getDueOrders(orderDetail);
  if (dueOrders.success) {
    res.status(200).json(dueOrders);
  } else {
    res.status(500).json(dueOrders);
  }
});

httpServer.listen(3001, async (err) => {
  if (err) {
    console.log(err);
  } else {
    process.send({ status: "started" });
    const { isUpdated, customerNames } = await setPendingOrders();
    if (isUpdated) {
      const pendingOrders = getPendingOrders();
      io.emit("pendingOrders", pendingOrders, isUpdated, customerNames);
    }
  }
});

// const pendingOrderRefreshIterval = setInterval(async () => {
//   const { isUpdated, customerNames } = await setPendingOrders();
//   if (isUpdated) {
//     const pendingOrders = getPendingOrders();
//     io.emit("pendingOrders", pendingOrders, isUpdated, customerNames);
//   }
// }, 5000);

const syncCustomersInterval = setInterval(async () => {
  // await syncCustomers();
  // await syncCustomerAddresses();
  // await syncOrders();
  // await syncKots();
}, 12000);

process.on("message", (message) => {
  if (message.command === "shutdown") {
    console.log("shutting down");
    // clearInterval(pendingOrderRefreshIterval);
    // clearInterval(syncCustomersInterval);
    process.exit(0);
  }
});

// data: [
// 	{
// 		pos_order_id: 1, // pod order id,
// 		web_order_id: 12, // new generated id,
// 		updated_at: "date time", //will be same on pos and server,
// 		order_items: [
// 			{
// 				pos_item_id: 2, // pos item id
// 				web_item_id: 11, // new generated id,
// 				updated_at: "date time",
// 			},
// 			{
// 				pos_item_id: 2, // pos item id
// 				web_item_id: 11, // new generated id,
// 				updated_at: "date time",
// 			}, //..... other items
// 		],
// 	},
// 	//...other orders
// ];
