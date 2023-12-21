import React from "react";
import styles from "./OrderArea.module.css";
import FinalOrder from "./FinalOrder";
import { useSelector } from "react-redux";
import { AnimatePresence } from "framer-motion";

function OrderArea() {
	const orderItems = useSelector(state => state.finalOrder.orderCart);
	const defaultPriceType = useSelector(state => state.bigMenu.defaultSettings.default_price_type);

	return (
		<div className={`${styles.orderArea} flex-shrink-1`}>
			<div className={`d-flex ${styles.orderInfo}`}>
				<div className={styles.name}>ITEMS</div>
				<div className={styles.qty}>QTY.</div>
				<div className={styles.total}>PRICE</div>
			</div>

			<div className={styles.finalOrder}>
				<AnimatePresence>
					{
						orderItems.length ? orderItems.map(item => <FinalOrder key={item.currentOrderItemId} {...item} defaultPriceType={defaultPriceType} />) : null
						// <div className={styles.emptyCart}> <img className={styles.noItemsImg} src={emptyCartImg} /> </div>
					}
				</AnimatePresence>
			</div>
		</div>
	);
}

export default OrderArea;
