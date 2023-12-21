import axios from "axios";
import React, { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import { useQuery, useQueryClient } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import HoldOrderCard from "./HoldOrderCard";
import styles from "./HoldOrders.module.css";
import { v4 } from "uuid";
// import getSocket from "../Utils/Socket";
import { setActive } from "../Redux/UIActiveSlice";
import useSocket from "../Utils/useSocket";
import { useGetHoldOrdersQuery } from "../Utils/customQueryHooks";
import Loading from "../Feature Components/Loading";

function HoldOrders({ showHoldOrders, setShowHoldOrders }) {
	const { IPAddress, refetchInterval } = useSelector(state => state.serverConfig);
	// const dispatch = useDispatch();
	const queryClient = useQueryClient();

	const handleClose = () => setShowHoldOrders(false);

	// const getHoldOrders = async () => {
	// 	let { data } = await axios.get(`http://${IPAddress}:3001/holdOrder`);
	// 	return data;
	// };

	useSocket("holdOrders", holdOrders => {
		queryClient.setQueryData("holdOrders", holdOrders);
	});


	const {
		data: holdOrders,
		status,
		isLoading,
		isError,
	} = useGetHoldOrdersQuery() 
      

	return (
		<Offcanvas className={styles.holdOrderSidebar} show={showHoldOrders} onHide={handleClose} placement="end">
			<Offcanvas.Header closeButton className={styles.holdOrderHeader}>
				Hold Orders
			</Offcanvas.Header>
			<Offcanvas.Body className={styles.holdOrdersBody}>
				{isLoading && <Loading/>}
				{isError && <div>sorry...something Went wrong..</div>}
				{holdOrders?.length ? (
					<div className={styles.holdOrders}>
						{holdOrders?.map((order, idx) => (
							<HoldOrderCard order={order} setShowHoldOrders={setShowHoldOrders} key={order.id} idx={idx} />
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
