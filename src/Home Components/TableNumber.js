import React, { useEffect, useRef } from "react";
import styles from "./TableNumber.module.css";
import { useSelector, useDispatch } from "react-redux";
import { changePriceOnAreaChange, modifyCartData } from "../Redux/finalOrderSlice";
import { modifyUIActive } from "../Redux/UIActiveSlice";
import { useGetMenuQuery2 } from "../Utils/customQueryHooks";
import { useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAutofocus } from "../Utils/useAutofocus";

function TableNumber({ showDetailType }) {
	const orderCart = useSelector(state => state.finalOrder.orderCart);
	const tableNumber = useSelector(state => state.finalOrder.tableNumber);

	const autoFocusRef = useAutofocus(showDetailType, "tableNumber");

	const { data: bigMenu } = useGetMenuQuery2();

	const restaurantPriceId = useSelector(state => state.UIActive.restaurantPriceId);

	const dispatch = useDispatch();

	const hanndleChange = e => {
		let tableNo = e.target.value;
		let area = bigMenu.areas.find(area => area.tables.some(table => table.table_no === tableNo));
		let areaName = area?.area || "Other";
		let updatedRestaurantPriceId = area?.restaurant_price_id || +bigMenu.defaultSettings.default_restaurant_price || null;
		dispatch(modifyUIActive({ restaurantPriceId: updatedRestaurantPriceId }));
		dispatch(modifyCartData({ tableNumber: tableNo, tableArea: areaName }));
	};

	useEffect(() => {
		let timeOut = setTimeout(() => {
			console.log("table changed");
			if (orderCart.length > 0) {
				const newCartItems = orderCart.map(cartItem => {
					for (const category of bigMenu?.categories) {
						for (const item of category.items) {
							if (item.id === cartItem.itemId) {
								let newPrice = null;

								if (cartItem.variation_id) {
									for (const variation of item.variations) {
										if (variation.variation_id === cartItem.variation_id && variation.restaurantPriceId === restaurantPriceId) {
											newPrice = variation.price;
											// return { ...cartItem, basePrice: variation.price };
										}
									}
								} else {
									if (restaurantPriceId === null) {
										newPrice = item.price;
										// return { ...cartItem, basePrice: item.price };
									} else {
										for (const restaurantPrice of item.restaurantPrices) {
											if (restaurantPrice.restaurant_price_id === restaurantPriceId) {
												newPrice = restaurantPrice.price;
												// return { ...item, basePrice: restaurantPrice.price };
											}
										}
									}
								}

								let toppingPrice = cartItem.itemTotal - cartItem.basePrice;
								let newitemTotal = newPrice + toppingPrice;
								let newMultiItemTotal = cartItem.itemQty * newitemTotal;
								let newTaxes = item.item_tax.map(tax => {
									return { id: tax.id, name: tax.name, tax: (tax.tax / 100) * newitemTotal, tax_percent: tax.tax };
								});

								return { ...cartItem, basePrice: newPrice, itemTotal: newitemTotal, multiItemTotal: newMultiItemTotal, itemTax: newTaxes };
							}
						}
					}
				});

				dispatch(changePriceOnAreaChange({ newCartItems }));
			}
		}, 300);

		return () => clearTimeout(timeOut);
	}, [restaurantPriceId, bigMenu]);

	return (
		<AnimatePresence initial={true}>
			{showDetailType === "tableNumber" && (
				<motion.div
					layout
					key="tableNumber"
					initial="collapsed"
					animate="open"
					exit="collapsed"
					variants={{
						open: { opacity: 1, originY: 0, height: 55, padding: 12 },
						collapsed: { opacity: 0, originY: 0, height: 0, padding: 0 },
					}}
					transition={{ duration: 0.2 }}
					className={styles.tableNumber}>
					<span className="mx-2">please enter Table No.</span>
					<input className="px-2" ref={autoFocusRef} type="number" min={0} step={1} pattern="[0-9]*" inputMode="numeric" value={tableNumber} onChange={e => hanndleChange(e)} />
				</motion.div>
			)}
		</AnimatePresence>
	);
}

export default TableNumber;
