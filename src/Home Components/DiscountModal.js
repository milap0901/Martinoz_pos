import React, {useRef } from "react";
import styles from "./DiscountModal.module.css";
import { Modal } from "react-bootstrap";
import DiscountDetail from "./DiscountDetail";
import { useDispatch, useSelector } from "react-redux";
import { applyDiscount } from "../Redux/finalOrderSlice";

function DiscountModal({ show, hide }) {
	const dispatch = useDispatch();
	const subTotal = useSelector(state => state.finalOrder.subTotal);

	const flatDiscountRef = useRef();
	const percentDiscountRef = useRef();
	const discountRef = useRef();
	const errorRef = useRef();

	const addDiscount = () => {
		const discountType = flatDiscountRef.current.checked ? flatDiscountRef.current.value : percentDiscountRef.current.value;
		const discount = +discountRef.current.value;

		if (discount < 0 || (discountType === "percent" && discount > 100)) {
			errorRef.current.style.display = "block";
			return;
		}

		if (discount < 0 || (discountType === "flat" && discount > subTotal)) {
			errorRef.current.style.display = "block";
			return;
		}

		dispatch(applyDiscount({ discountType, discount ,id:null }));
		hide();
	};

	return (
		<Modal show={show} onHide={hide} size="md" aria-labelledby="contained-modal-title-vcenttyer" centered animation={false} backdrop="static">
			<Modal.Header closeButton className={styles.modelHeader}>
				Discount
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<DiscountDetail flatDiscountRef={flatDiscountRef} percentDiscountRef={percentDiscountRef} discountRef={discountRef} errorRef={errorRef} />
			</Modal.Body>
			<Modal.Footer className={styles.modelFooter}>
				<div className={styles.error} ref={errorRef}>
					please enter valid discount value
				</div>
				<button onClick={hide} className={styles.closeBtn}>
					Cancel
				</button>
				<button className={styles.saveBtn} onClick={() => addDiscount()}>
					{" "}
					Apply{" "}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default DiscountModal;
