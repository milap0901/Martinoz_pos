import React, { useState } from "react";
import styles from "./PendingOrderLink.module.css";
import { faGlobe } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PendingOrdersSidebar from "./PendingOrdersSidebar";
import useSocket from "../Utils/useSocket";
import { useQueryClient } from "react-query";
import { useGetPendingOrdersQuery } from "../Utils/customQueryHooks";

function PendingOrderLink() {
	const [showPendingOrders, setShowPendingOrders] = useState(false);
	const queryClient = useQueryClient();
	const { data: pendingOrders, isLoading } = useGetPendingOrdersQuery();

	const pendingOrderCount = pendingOrders?.length || 0;

	useSocket("pendingOrders", (orders, isPending, customerNames) => {
		queryClient.setQueryData("pendingOrders", orders);

		if (!showPendingOrders && isPending) {
			setShowPendingOrders(true);
		}

		if (isPending) {
			try {
				window.apiKey.request("newOnlineOrder", { customerNames });
			} catch (error) {
				console.log("erroe");
			}
		}
	});
	return (
		<>
			<div className={styles.Link} onClick={() => setShowPendingOrders(true)}>
				<FontAwesomeIcon className={styles.LinkIcon} icon={faGlobe} />
				{pendingOrderCount !== 0 ? <div className={styles.pendingOrderCountBadge}>{pendingOrderCount}</div> : null}
			</div>
			<PendingOrdersSidebar showPendingOrders={showPendingOrders} setShowPendingOrders={setShowPendingOrders} pendingOrders={pendingOrders} isLoading={isLoading} />
		</>
	);
}

export default PendingOrderLink;
