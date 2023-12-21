import React, { useState } from "react";
import styles from "./KOTCards.module.css";
import { v4 as uuidv4 } from "uuid";
import { useMutation } from "react-query";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import getDisplayName from "../Utils/getDisplayName";
import KotEditDeniedModal from "./KotEditDeniedModal";
import { liveKotToCart } from "../Redux/finalOrderSlice";
import { useNavigate } from "react-router-dom";
import { modifyUIActive } from "../Redux/UIActiveSlice";

function KOTCards({ KOT, idx }) {
	const { IPAddress } = useSelector(state => state.serverConfig);
	const dispatch = useDispatch();
	const [showOrderExistModal, setShowOrderExistModal] = useState(false);
	const navigate = useNavigate();

	const updateKOT = async kotData => {
		let { data } = await axios.put(`http://${IPAddress}:3001/liveKot`, kotData);
		return data;
	};

	const {
		mutate: KOTmutation,
		isLoading,
		isError,
	} = useMutation({
		mutationFn: updateKOT,
	});

	const moveKotToCart = KOT => {
		if (KOT.pos_order_id) {
			setShowOrderExistModal(true);
			return;
		}

		const kotsDetail = [{ id: KOT.id, token_no: KOT.token_no }];
		let activeOrderBtns = ["kot", "save"];
		if (KOT.order_type === "dine_in") {
			activeOrderBtns = ["kot"];
		}
		dispatch(liveKotToCart({ KOT, kotsDetail }));
		dispatch(modifyUIActive({ restaurantPriceId: KOT.restaurantPriceId, activeOrderBtns, isCartActionDisable: false }));
		navigate("/Home");
	};

	const getColor = type => (type !== "dine_in" ? { backgroundColor: "rgba(116, 116, 0, 0.87)" } : null);

	return (
		<motion.div
			layout
			className={styles.KOTCard}
			initial={{ opacity: 0, scale: 0.9 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ duration: 0.1, delay: idx * 0.03 }}>
			<div className={styles.CardHeader} style={getColor(KOT.order_type)} onClick={() => moveKotToCart(KOT)}>
				<div>
					{KOT.table_no && <div>{KOT.table_no}</div>}
					<div>{getDisplayName(KOT.order_type)} </div>
				</div>
				<div className={styles.token}>
					<div>{KOT.token_no}</div>
					<div>Token No.</div>
				</div>
				<div>10:10</div>
			</div>
			{KOT.customer_name && (
				<div className={styles.KOTCustomerDetail}>
					<div>{KOT.customer_name}</div>
					<div>{KOT.phone_number}</div>
				</div>
			)}
			<div className={styles.KOTItemHeader}>
				<div>Item</div>
				<div>QTY.</div>
			</div>
			<div className={styles.KOTBiller}>
				<div>Biller (biller)</div>
			</div>
			{KOT.items.map(item => {
				return (
					<div className={styles.KOTItemsDetail} key={uuidv4()}>
						<div className={`${styles.KOTItemName} ${item.status === 0 ? styles.strikeThrough : null}`}>
							{item.item_name} {item.variation_name ? `- ${item.variation_name}` : null}{" "}
							{item.item_addons.length
								? item.item_addons.map(addon => (
										<span key={uuidv4()}>
											/ {addon.name} ({addon.quantity})
										</span>
								  ))
								: null}
						</div>
						<div className={`${styles.KOTItemQty} ${item.status === 0 ? styles.strikeThrough : null}`}>{item.quantity}</div>
					</div>
				);
			})}
			<div className={styles.footer}>
				<button
					onClick={() => KOTmutation({ id: KOT.id, order_id: KOT.pos_order_id, order_type: KOT.order_type, kot_status: "food_is_ready", online_order_id: KOT.online_order_id })}
					disabled={isLoading}>
					{isLoading ? "loading..." : "Food Is Ready"}
				</button>
				{!KOT.pos_order_id && (
					<button
						className={styles.cancelBtn}
						disabled={isLoading}
						onClick={() => KOTmutation({ id: KOT.id, order_id: KOT.pos_order_id, order_type: KOT.order_type, kot_status: "cancelled", online_order_id: KOT.online_order_id })}>
						Cancel
					</button>
				)}
			</div>
			{showOrderExistModal && (
				<KotEditDeniedModal hide={() => setShowOrderExistModal(false)} show={showOrderExistModal} message={"Bill is Already generated for this KOT. This KOT can not be edited"} />
			)}
		</motion.div>
	);
}

export default KOTCards;

// const days = [
// 	{ day: 0, status: 1 },
// 	{ day: 1, status: 1 },
// 	{ day: 2, status: 1 },
// ];

// const excluded_category_ids = [1, 2, 3];

// const excluded_offer_ids = [1, 2];

// const order_types = ["dine_in", "pick_up"];

// const promp = {
// 	id: 1,
// 	brand_id: 1,
// 	restaurant_id: 1,
// 	main_promo_id: 1,
// 	title: "abc",
// 	description: "abc",
// 	promo_code: "MARTINOZ50",
// 	start_date: "date",
// 	end_date: "date",
// 	start_time: "",
// 	end_time: "",
// 	all_day: "",
// 	days_of_week: "",
// 	type: "",
// 	discount_value: "",
// 	min_order_value: "",
// 	max_discount: "",
// 	item_id: "",
// 	variation_id: "",
// 	usage_limit: "",
// 	max_limit: "",
// 	no_of_orders: "",
// 	total_order_amount: "",
// 	total_discount: "",
// 	visibility: "",
// 	status: "",
// 	created_at: "",
// 	updated_at: "",
// 	other_detail_json: {
// 		days: [
// 			{ day: 1, status: "" },
// 			{ day: 2, status: "" },
// 			{ day: 3, status: 1 },
// 			{ day: 4, status: 1 },
// 		],
// 		excluded_categories:[1,2,3,7],
// 		excluded_offers:[1,2],
// 		order_types:["delivery","pick_up","dine_in"]
// 	}
// };
