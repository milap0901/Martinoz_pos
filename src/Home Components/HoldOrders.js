
import React from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useQueryClient } from "react-query";

import HoldOrderCard from "./HoldOrderCard";
import styles from "./HoldOrders.module.css";

import useSocket from "../Utils/useSocket";
import { useGetHoldOrdersQuery } from "../Utils/customQueryHooks";
import Loading from "../Feature Components/Loading";

function HoldOrders({ showHoldOrders, setShowHoldOrders }) {
  
  const queryClient = useQueryClient();

  // close holdorder sidebar
  const handleClose = () => setShowHoldOrders(false);


// custom hook for socket 
// get live update of hold orders 
// when hold order changes in server it will emit event of "holdOrders" and sent updated hold orders 

  useSocket("holdOrders", (holdOrders) => {

    //set hold order received via socket into react query with key of "hold order"
    queryClient.setQueryData("holdOrders", (prev) => ({
      ...prev,
      data: holdOrders,
    }));
  });


  // custom react query hook for fetching hold orders when sidebar opens/ component mounts
  // this returns state variable for holdorders.
  // via socket you can manually update query state as done above in useSocket hook in case of the update
 
  const {
    data: { data: holdOrders } = { data: null },
    // status,
    isLoading,
    isError,
  } = useGetHoldOrdersQuery();


  return (
    <Offcanvas
      className={styles.holdOrderSidebar}
      show={showHoldOrders}
      onHide={handleClose}
      placement="end"
    >
      <Offcanvas.Header closeButton className={styles.holdOrderHeader}>
        Hold Orders
      </Offcanvas.Header>
      <Offcanvas.Body className={styles.holdOrdersBody}>
        {isLoading && <Loading />}
        {isError && <div>sorry...something Went wrong..</div>}
        {holdOrders?.length ? (
          <div className={styles.holdOrders}>
            {holdOrders?.map((order, idx) => (
              <HoldOrderCard
                order={order}  // hold orders
                setShowHoldOrders={setShowHoldOrders}
                key={order.id}
                idx={idx}
              />
            ))}
          </div>
        ) : (
          <div>no hold orders.</div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default HoldOrders;
