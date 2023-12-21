import React, { useRef } from "react";
import styles from "./FinalOrderItemModal.module.css";
import Modal from "react-bootstrap/Modal";
import { Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { addItemNotes } from "../Redux/finalOrderSlice";

function FinalOrderItemModal({ hideModal, show, itemName, itemTax, toppings, currentOrderItemId, variantName, itemNotes }) {
	const itemNoteRef = useRef();
	const dispatch = useDispatch();

	const handleSave = () => {
		const notes = itemNoteRef.current.value;
		dispatch(addItemNotes({ currentOrderItemId, notes }));
		hideModal();
	};

	return (
		<Modal show={show} onHide={hideModal} size="lg" aria-labelledby="contained-modal-title-vcenttyer" centered animation={false}>
			<Modal.Header closeButton className={styles.modelHeader}>
				<div className={styles.modalTital}>
					{itemName} {variantName ? variantName : null}
				</div>
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<Row className={styles.addonTital}>
					<Col>Addons</Col>
				</Row>
				<Row>
					<Col className={styles.addonsName}>
						{toppings.length
							? toppings
									.map(topping => {
										return `${topping.name} (${topping.quantity})`;
									})
									.join(", ")
							: "No Toppings"}
					</Col>
				</Row>
				<Row className={styles.addonTital}>
					<Col>Special Notes</Col>
				</Row>
				<Row>
					<Col>
						<textarea ref={itemNoteRef} className={styles.itemNote} defaultValue={itemNotes || ""} />
					</Col>
				</Row>
				<Row className={styles.addonTital}>
					<Col>Taxes</Col>
				</Row>

				{itemTax.map(tax => {
					return (
						<Row key={tax.id}>
							<Col className={styles.addonsTaxes}>
								{tax.name}(2.5%) - {tax.tax.toFixed(2)}
							</Col>
						</Row>
					);
				})}
			</Modal.Body>
			<Modal.Footer>
				<button onClick={hideModal} className={styles.closeBtn}>
					Close
				</button>
				<button className={styles.saveBtn} onClick={handleSave}>
					{" "}
					Save{" "}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default FinalOrderItemModal;
