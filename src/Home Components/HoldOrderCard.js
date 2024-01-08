import React from "react";
import styles from "./HoldOrderCard.module.css";
import { useMutation, useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { holdToFinalOrder } from "../Redux/finalOrderSlice";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function HoldOrderCard({ order, setShowHoldOrders, idx }) {

  const holdOrder = order.holdOrder;
  const dispatch = useDispatch();
  const { IPAddress } = useSelector((state) => state.serverConfig);
  const navigate = useNavigate();



  const deleteHoldOrders = async (id) => {
    // let { data } = await axios.delete(`http://${IPAddress}:3001/holdOrder`, { params: { id } });
    let { data } = await axios.delete(
      `http://${IPAddress}:3001/api/v2/holdOrder`,
      { params: { id } }
    );
  };

  //mutation for deleting hold order
  const holdOrderMutation = useMutation({
    mutationFn: deleteHoldOrders,
  });

  // onclick handler for hold order card
  const setAsFinalOrder = async (holdOrder) => {
    // set hold orders into finalOrder slice 
    //holdToFinalOrder function convert hold order to orders
    dispatch(holdToFinalOrder({ holdOrder }));

    // delete that hold order from server database
    holdOrderMutation.mutate(order.id);

    //close hold order sidebar
    await setShowHoldOrders(false);

    // navigate to home screen in case not in home screen
    navigate("/Home");
  };

  return (
    <AnimatePresence initial={true}>
      <motion.div
        layout
        key="totalTiles"
        initial="collapsed"
        animate="open"
        exit="collapsed"
        variants={{
          open: { opacity: 1, scale: 1 },
          collapsed: { opacity: 0, scale: 0.4 },
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 20,
          delay: idx * 0.1,
        }}
        className={styles.holdOrderCard}
      >
        <div onClick={() => setAsFinalOrder(holdOrder)}>
          <div className={styles.cardHeader}>
            <div>
              HOLD NO : {order.id} | {holdOrder.orderType}
            </div>
            <div>{order.created_at_Time}</div>
          </div>
          <div className={styles.total}>₹ {holdOrder.cartTotal}</div>
          <div className={styles.customerDetail}>
            {holdOrder.customerName ? holdOrder.customerName : "----"} |
            {holdOrder.customerContact ? holdOrder.customerContact : "----"}
          </div>
        </div>

        <div className={styles.actions}>
          <div>
            kept on hold by :<br />
            {holdOrder.biller_name}
          </div>
          <button onClick={() => holdOrderMutation.mutate(order.id)}>
            Discard
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default HoldOrderCard;
