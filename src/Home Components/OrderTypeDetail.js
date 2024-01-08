import React, { useState, useEffect } from "react";
import {
  faLocationDot,
  faUser,
  faUsers,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TableNumber from "./TableNumber";
import CustomerDetail from "./CustomerDetail";
import PersonCount from "./PersonCount";
import OrderComment from "./OrderComment";
import styles from "./OrderType.module.css";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const orderDetailsMap = [
  { name: "tableNumber", icon: faLocationDot, displayInOrderType: ["dine_in"] },
  { name: "personCount", icon: faUsers, displayInOrderType: ["dine_in"] },
  {
    name: "customerDetail",
    icon: faUser,
    displayInOrderType: ["dine_in", "pick_up", "delivery"],
  },
  {
    name: "orderComment",
    icon: faPenToSquare,
    displayInOrderType: ["dine_in", "pick_up", "delivery"],
  },
];

function OrderTypeDetail({ type, cartAction, orderId, kotsDetail }) {

  // state for order detail type (tableNumber , personCount, customerDetail, orderComment)
  const [showDetailType, setShowDetailType] = useState(null);

  let [searchParams, setSearchParams] = useSearchParams();

  const kots = kotsDetail.map((kot) => kot.token_no).join(",");


  //for pick_up and delivery order there are only two detail type field (orderComment, customerDetail )
  // so if other detailType (tableNumber or customerCount ) is open close the popup when changing order type to puch_up or delivery
  useEffect(() => {

    if (
      showDetailType &&
      showDetailType !== "orderComment" &&
      showDetailType !== "customerDetail"
    ) {
      if (type === "delivery" || type === "pick_up") {
        setShowDetailType(null);
      }
    }
  }, [type, setShowDetailType]);


// for opening tableNumber detail when searchPramas (in url) has  openTable = true
//this is the case when user saves dine_in type order and forgot to add table number, in that case table_number detail type will open 
  useEffect(() => { 
    if (searchParams.get("openTable") === "true") {
      setShowDetailType("tableNumber");
      return;
    }
    if (searchParams.get("openCustomerDetail") === "true") {
      setShowDetailType("customerDetail");
      return;
    }
  }, [searchParams]);


  // handle change for opening and closing detail types 
  const handleDetailChange = (detailName) => {
    setShowDetailType((prev) => (prev === detailName ? null : detailName));

    // reset search params if search params exist on every time order type changes 
    if (
      searchParams.get("openTable") === "true" ||
      searchParams.get("openCustomerDetail") === "true"
    ) {
      setSearchParams({});
    }
  };


  // filter detailtypes to show base on order type 
  const filteredDetails = orderDetailsMap.filter((detail) =>
    detail.displayInOrderType.includes(type)
  );

  return (
    <div>
      <div className={`${styles.orderTypeDetail} d-flex`}>
        {filteredDetails.map((detail, idx) => (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            key={detail.name}
            className={`${styles.orderIcon} ${
              showDetailType === detail.name ? "text-danger" : ""
            }`}
            onClick={() => handleDetailChange(detail.name)}
          >
            <FontAwesomeIcon icon={detail.icon} />
          </motion.div>
        ))}
        { // show order number on right while modifying order
         cartAction === "modifyOrder" && ( 
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={styles.order}
          >
            <div className={styles.orderTitle}>Order No</div>
            <div className={styles.number}>{orderId}</div>
          </motion.div>
        )}
        { // show kot token no on right while modifying kots
        cartAction === "modifyKot" && (
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className={styles.order}
          >
            <div className={styles.orderTitle}>KOT No</div>
            <div className={styles.number}>{kots}</div>
          </motion.div>
        )}
      </div>

      <TableNumber showDetailType={showDetailType} />
      <CustomerDetail showDetailType={showDetailType} />
      <PersonCount showDetailType={showDetailType} />
      <OrderComment showDetailType={showDetailType} />
    </div>
  );
}

export default OrderTypeDetail;
