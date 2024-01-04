import { motion } from "framer-motion";
import React, { useMemo } from "react";
import MinTimer from "./MinTimer";
import styles from "./ActiveKotTableCard.module.css";
import saveAndPrint from "../icons/save-print.png";
import { useMutation } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
// import { convertOrder } from "../Utils/convertOrder";
import { executeBillPrint } from "../Utils/executePrint";
import notify from "../Feature Components/notify";
import {
  liveKotToCart,
  modifyCartData,
  resetFinalOrder,
} from "../Redux/finalOrderSlice";
import { modifyUIActive } from "../Redux/UIActiveSlice";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEye } from "@fortawesome/free-regular-svg-icons";

function ActiveKotTableCard({ orders, areaId, printers, defaultSettings }) {
  const IPAddress = useSelector((state) => state.serverConfig.IPAddress);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const allKotOnTableTotal = useMemo(
    () =>
      orders.reduce((acc1, order) => {
        return (acc1 += order.items.reduce((acc2, item) => {
          if (item.status === -1) {
            return acc2;
          }
          return (acc2 += (item.price + item.tax) * item.quantity);
        }, 0));
      }, 0),
    [orders]
  );

  const convertKotsToOrder = async (emptyOrder) => {
    let { data } = await axios.post(
      `http://${IPAddress}:3001/includeKOTsAndCreateOrder`,
      emptyOrder
    );
    return data;
  };

  const { mutate } = useMutation({
    mutationKey: "includeKOTsAndCreateOrder",
    mutationFn: convertKotsToOrder,
    onSuccess: async (data) => {
      const { order } = data;
      const orderToPrint = order;

      try {
        await executeBillPrint(orderToPrint, printers, defaultSettings);
        notify("success", "order Created");
      } catch (error) {
        console.log(error);
      }
    },
  });

  const moveKotToCart = (orders) => {
    let KOT = orders[0];
    // console.log(orders)
    const kotData = orders.reduce(
      (data, order) => {
        data.kotsDetail.push({ id: order.id, token_no: order.token_no });
        const items = order.items.map((item) => ({ ...item, kotId: order.id }));
        data.items.push(...items);
        return data;
      },
      { kotsDetail: [], items: [] }
    );

    KOT.items = kotData.items;
    KOT.kot_status = "accepted";

    console.log(KOT);

    let activeOrderBtns = ["kot", "save"];

    dispatch(liveKotToCart({ KOT, kotsDetail: kotData.kotsDetail }));
    dispatch(
      modifyUIActive({
        restaurantPriceId: KOT.restaurantPriceId,
        activeOrderBtns,
      })
    );
    navigate("/Home");
  };

  const selectTable = (order) => {
    const kot = order[0];
    dispatch(resetFinalOrder());
    dispatch(
      modifyUIActive({
        restaurantPriceId: kot.restaurantPriceId,
        isCartActionDisable: false,
        activeOrderBtns: ["save", "kot", "hold"],
      })
    );
    dispatch(
      modifyCartData({
        tableNumber: kot.table_no,
        orderType: "dine_in",
        tableArea: kot.areaName,
      })
    );
    navigate("..?openTable=true");
  };

  const saveAndPrintOrder = (orders) => {
    const emptyOrder = {
      id: "",
      printCount: 1,
      customerName: orders[0].customer_name,
      customerContact: orders[0].phone_number.toString(),
      customerAdd: orders[0].address,
      customerLocality: orders[0].landmark,
      tableArea: areaId,
      orderCart: [],
      subTotal: 0,
      tax: 0,
      deliveryCharge: 0,
      packagingCharge: 0,
      discount: 0,
      discount_percent: null,
      paymentMethod: "cash",
      tableNumber: orders[0].table_no.toString(),
      personCount: 0,
      orderType: "dine_in",
      orderComment: "",
      cartTotal: 0,
      order_status: "accepted",
    };

    mutate(emptyOrder);
  };

  return (
    <motion.div
      layout
      className={styles.container}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.15 }}
      onClick={() => selectTable(orders)}
    >
      <div className={styles.tableCard}>
        <div>
          <MinTimer startTime={orders[0].created_at} />
        </div>
        <div className={styles.tableNo}>{orders[0].table_no}</div>
        <div className={styles.total}>₹ {allKotOnTableTotal.toFixed(2)}</div>
      </div>
      <img
        className={styles.printIcon}
        alt=""
        src={saveAndPrint}
        onClick={(e) => {
          e.stopPropagation();
          saveAndPrintOrder(orders);
        }}
      />
      <FontAwesomeIcon
        icon={faEye}
        className={styles.eyeIcon}
        onClick={(e) => {
          e.stopPropagation();
          moveKotToCart(orders);
        }}
      />
    </motion.div>
  );
}

export default ActiveKotTableCard;
