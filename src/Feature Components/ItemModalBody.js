import React from "react";
import Variant from "./Variant";
import styles from "./ItemModalBody.module.css";
import Topping from "./Topping";
import { useSelector } from "react-redux";
import { useGetMenuQuery2 } from "../Utils/customQueryHooks";

function ItemModalBody({ id, restaurantPriceVariations, totalTax }) {
	const menuItems = useSelector(state => state.menuItems.items);
	const { data: bigMenu } = useGetMenuQuery2();

	const selectedVariantId = useSelector(state => state.currentItem.variation_id);
	// const defaultPriceType = useSelector(state => state.bigMenu.defaultSettings.default_price_type);
	const defaultPriceType  = bigMenu?.defaultSettings?.default_price_type || "without_tax"


	const item = menuItems.find(item => item.id === id);
	const variants = item.variations;
	const addonGroups = variants.find(variant => variant.variation_id === selectedVariantId).addonGroups;

	return (
		<div className={styles.modalBody}>
			<div className={styles.variation}>
				<div className="ms-2 "> Variation</div>
				<div className="d-flex flex-wrap">
					{restaurantPriceVariations.map(variant => (
						<Variant key={variant.variation_id} totalTax={totalTax} {...variant} defaultPriceType={defaultPriceType} />
					))}
				</div>
			</div>
			{addonGroups.map(group => (
				<div key={group.addongroup_id} className={styles.addOnGroup}>
					<div className="ms-2">{group.name}</div>
					<div className="d-flex flex-wrap">
						{" "}
						{group.addonItems.map(item => (
							<Topping totalTax={totalTax} key={item.id} name={item.name} price={item.price} id={item.id} defaultPriceType={defaultPriceType} />
						))}{" "}
					</div>
				</div>
			))}
		</div>
	);
}

export default ItemModalBody;
