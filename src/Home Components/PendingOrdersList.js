import React, { memo } from "react";
import styles from "./PendingOrdersList.module.css";
import Loading from "../Feature Components/Loading";
import PendingOrderCard from "./PendingOrderCard";
import { useGetDefaultScreenQuery, useGetPrintersQuery } from "../Utils/customQueryHooks";
import sortPrinters from "../Utils/shortPrinters";
import { AnimatePresence } from "framer-motion";

function PendingOrdersList({ pendingOrders, isLoading }) {
	const { data: printerArr } = useGetPrintersQuery();
	const {data : defaultSettings} = useGetDefaultScreenQuery()
	const printers = printerArr?.length ? sortPrinters(printerArr) : [];

	if (isLoading) {
		return <Loading />;
	}

	return (
		<div className={styles.pendingOrderContainer}>
			<AnimatePresence>
				{pendingOrders.length ? (
					pendingOrders.map((order, idx) => <PendingOrderCard order={order} key={order.id} idx={idx} printers={printers} defaultSettings={defaultSettings} />)
				) : (
					<div className={styles.noPendingOrders}>There are no pending orders</div>
				)}
			</AnimatePresence>
		</div>
	);
}

export default memo(PendingOrdersList);
