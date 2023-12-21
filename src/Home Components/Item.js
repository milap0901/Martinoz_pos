import React, { useState } from "react";
import styles from "./Item.module.css";
import CenteredModal from "../Feature Components/CenteredModal";
import ItemModalBody from "../Feature Components/ItemModalBody";
import { useDispatch, useSelector } from "react-redux";
import { addCurrentItem, clearCurrentItem } from "../Redux/currentItemSlice";
import { addOrderItem } from "../Redux/finalOrderSlice";
import { v4 } from "uuid";
import { motion } from "framer-motion";
import { getIdentifier } from "../Utils/getIdentifier";

function Item({ name, id, variations, has_variation, price, display_name, item_tax, restaurantPrices, category_id, parent_tax }) {
	const dispatch = useDispatch();
	const [modalShow, setModalShow] = useState(false);
	const [err, setErr] = useState("");
	const currentItem = useSelector(state => state.currentItem);
	const [flipped,setFlipper] = useState(false)

	const { restaurantPriceId } = useSelector(state => state.UIActive);
	const restaurantPriceVariations = variations.filter(variation => variation.restaurantPriceId === restaurantPriceId);
	const totalTax = item_tax.reduce((acc, tax) => (acc += tax.tax), 0);

	const addItem = (id, name) => {
		let orderItemId = v4();
		if (has_variation === 1) {
			setModalShow(true);
			let defaultVariantName = restaurantPriceVariations[0].name;
			let defaultVariantId = restaurantPriceVariations[0].variation_id;
			let defaultVariantPrice = restaurantPriceVariations[0].price;
			let defaultVariantDisplayName = restaurantPriceVariations[0].display_name;

			dispatch(addCurrentItem({ id, name, orderItemId, defaultVariantName, defaultVariantId, defaultVariantPrice, defaultVariantDisplayName, category_id, parent_tax }));
		} else {
			const restaurantItemPrice = restaurantPriceId ? restaurantPrices.find(price => price.restaurant_price_id === restaurantPriceId).price : price;
			let currentItem = {
				currentOrderItemId: orderItemId,
				itemQty: 1,
				itemId: id,
				itemName: display_name,
				variation_id: "",
				variantName: "",
				variant_display_name: "",
				categoryId: category_id,
				basePrice: restaurantItemPrice,
				toppings: [],
				itemTotal: restaurantItemPrice,
				multiItemTotal: restaurantItemPrice,
				itemIdentifier: id.toString(),
				itemNotes: "",
				parent_tax: parent_tax,
				kotId: null,
				item_discount: 0,
				discount_detail: [],
			};

			const itemTax = item_tax.map(tax => {
				return { id: tax.id, name: tax.name, tax: (currentItem.itemTotal * tax.tax) / 100, tax_percent: tax.tax };
			});

			dispatch(addOrderItem({ ...currentItem, itemTax }));
		}
	};

	const handleCancel = () => {
		dispatch(clearCurrentItem());
		setModalShow(false);
	};

	const handleSave = () => {
		let itemIdentifier = getIdentifier(currentItem.itemId, currentItem.variation_id, currentItem.toppings);

		const itemTax = item_tax.map(tax => {
			return { id: tax.id, name: tax.name, tax: (currentItem.itemTotal * tax.tax) / 100, tax_percent: tax.tax };
		});

		dispatch(addOrderItem({ ...currentItem, itemIdentifier, itemTax }));
		dispatch(clearCurrentItem());
		setModalShow(false);
	};

	return (
		<>
			<motion.div
				className={`bg-white ${styles.item}`}
				onClick={() => addItem(id, name)}
				initial={{ opacity: 0.5, scale: 0.8 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 0.15 }}>
				{display_name}
			</motion.div>
			{modalShow && (
				<CenteredModal
					show={modalShow}
					onHide={handleCancel}
					handleCancel={handleCancel}
					handleSave={handleSave}
					name={name}
					err={err}
					setErr={setErr}
					totalTax={totalTax}
					total={currentItem.itemTotal}
					body={<ItemModalBody id={id} restaurantPriceVariations={restaurantPriceVariations} totalTax={totalTax} />}
				/>
			)}
		</>
	);
}

export default Item;
