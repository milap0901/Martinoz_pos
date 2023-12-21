import React from "react";
import styles from "./PendingOrderCard.module.css";
import { AnimatePresence, motion } from "framer-motion";
import martinozLogo from "../icons/Matinoz_logo.png";
import Timer from "../Live View Components/Timer";
import { usePendingOrderToOrderMutation } from "../Utils/customMutationHooks";
const orderTypeMap = { pick_up: "Pick Up", delivery: "Delivery", dine_in: "Dine In" };
const orderBgColorMap = { pick_up: "#0d323f", delivery: "#3f0d0d", dine_in: "#383f0d" };

function PendingOrderCard({ order, idx, printers,defaultSettings }) {
	const { mutate, isLoading } = usePendingOrderToOrderMutation(printers,defaultSettings);

	const pendingOrderToOrder = (pendingOrderId, status, onlineOrderId) => {
		mutate({ pendingOrderId, status, onlineOrderId });
	};

	return (
		<motion.article
			layoutId={order.id}
			layout
			key="totalTiles"
			initial="initial"
			animate="open"
			exit="close"
			variants={{
				open: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 500, damping: 20, delay: 0.25 + 0.1 * idx } },
				initial: { opacity: 0, scale: 0.3, transition: { type: "spring", stiffness: 500, damping: 20, delay: 0 } },
				close: { opacity: 0, scale: 0.6, transition: { type: "spring", stiffness: 500, damping: 20, delay: 0 } },
			}}
			// transition={{ type: "spring", stiffness: 500, damping: 20, delay: 0.25 + 0.1 * idx }}
			className={styles.cardBody}>
			<header className={styles.cardHeader} style={{ backgroundColor: orderBgColorMap[order?.order_json.order.order_type] }}>
				<div className={styles.title}>
					{" "}
					<img src={martinozLogo} className={styles.logo} /> Martinozz
				</div>
				<Timer startTime={order.created_at} />
				<div className={styles.orderType}> {orderTypeMap[order?.order_json.order.order_type]}</div>
				{order?.order_json.order.order_type === "dine_in" && order?.order_json.order.table_no ? <div className={styles.tableNumber}>{order?.order_json.order.table_no}</div> : null}
			</header>
			<section className={styles.orderDetail}>
				<div>
					<div>
						{order?.order_json.customer?.customer_name} | {order?.order_json.customer?.phone}
					</div>
					<div>{order?.order_json.customer?.address ? order?.order_json.customer?.address : "------------------"} </div>
				</div>
				<div>
					<div className={styles.orderNumber}>{order?.online_order_number}</div>
				</div>
			</section>
			<main className={styles.orderItems}>
				{order.order_json.order_item.map((item, idx) => {
					return (
						<div className={styles.itemContainer} key={idx}>
							<div className={styles.itemQty}>{item.quantity} x</div>
							<div className={styles.itemName}>
								{item.item_name} {item.variation_name ? `- ${item.variation_name} ` : null}{" "}
								{item.addongroupitems.length
									? item.addongroupitems.map((addon, idx) => {
											return (
												<div key={idx} className={styles.addon}>
													{addon.name} x {addon.quantity},
												</div>
											);
									  })
									: null}{" "}
							</div>
						</div>
					);
				})}
			</main>
			<footer className={styles.orderFooter}>
				<div className={styles.total}>₹ {(+order.order_json.order.total).toFixed(2)}</div>
				<button className={styles.rejectBtn} onClick={() => pendingOrderToOrder(order.id, "rejected", order.online_order_id)} disabled={isLoading}>
					{isLoading ? "Loading" : "Reject"}
				</button>
				<button className={styles.acceptBtn} onClick={() => pendingOrderToOrder(order.id, "accepted", order.online_order_id)} disabled={isLoading}>
					{isLoading ? "Loading" : "Accept"}
				</button>
			</footer>
		</motion.article>
	);
}

export default PendingOrderCard;
