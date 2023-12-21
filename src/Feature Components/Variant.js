import React, { useEffect, memo } from "react";
import styles from "./Variant.module.css";
import { useDispatch, useSelector } from "react-redux";
import { selectVariant } from "../Redux/currentItemSlice";

function Variant({ variation_id, price, name, display_name, totalTax, defaultPriceType }) {
	const dispatch = useDispatch();
	
	const selectedVariantId = useSelector(state => state.currentItem.variation_id);

	const priceWithTax = price * (1 + totalTax / 100);

	const setVariant = (variation_id, name, price, display_name) => {
		dispatch(selectVariant({ variation_id, name, price, display_name }));
	};

	return (
		<div className={`${styles.variant} ${selectedVariantId === variation_id ? styles.selected : ""}`} onClick={() => setVariant(variation_id, name, price, display_name)}>
			<div>{name}</div>
			<div> ₹ {defaultPriceType === "with_tax" ? priceWithTax.toFixed(2) : price.toFixed(2)}</div>
		</div>
	);
}

export default memo(Variant);
