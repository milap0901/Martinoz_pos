import React, { useEffect } from "react";
import styles from "./DiscountDetail.module.css";
import { useSelector } from "react-redux";

function DiscountDetail({ flatDiscountRef, percentDiscountRef, discountRef, errorRef }) {
	const discount = useSelector(state => state.finalOrder.discount);
	const discount_percent = useSelector(state => state.finalOrder.discount_percent);
	const discount_type = useSelector(state => state.finalOrder.discount_type);

	useEffect(() => {
		if (discount_type === "flat") {
			discountRef.current.value = discount;
			flatDiscountRef.current.checked = true;
			percentDiscountRef.current.checked = false;
		} else {
			if (discount_percent === null) {
				flatDiscountRef.current.checked = false;
				percentDiscountRef.current.checked = true;
				discountRef.current.value = 0;
			} else {
				flatDiscountRef.current.checked = false;
				percentDiscountRef.current.checked = true;
				discountRef.current.value = discount_percent;
			}
		}
	}, []);

	return (
		<div className={styles.discountContainer}>
			<header>Custom Discount</header>
			<input type="text" placeholder="Reason" />
			<div className={styles.discountDetailContainer}>
				<div className={styles.discountType}>
					<input type="radio" id="percent" name="discountType" value="percent" ref={percentDiscountRef} onChange={() => (errorRef.current.style.display = "none")} />
					<label htmlFor="percent">Percentage</label>
				</div>
				<div className={styles.discountType}>
					<input type="radio" id="flat" name="discountType" value="flat" ref={flatDiscountRef} onChange={() => (errorRef.current.style.display = "none")} />
					<label htmlFor="flat">Flat</label>
				</div>
				<input className={styles.discount} type="number" ref={discountRef} onChange={() => (errorRef.current.style.display = "none")} />
			</div>
		</div>
	);
}

export default DiscountDetail;
