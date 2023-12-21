import React from "react";
import styles from "./KOTExistAlertModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import { useIncludeKotAndCreateOrderMutation } from "../Utils/customMutationHooks";

function KOTExistAlertModal({ show, hide, finalOrder, printers, shouldPrintOrder, setShouldPrintOrder,defaultSettings }) {
	const { mutate, isLoading } = useIncludeKotAndCreateOrderMutation(finalOrder, hide, shouldPrintOrder, setShouldPrintOrder, printers,defaultSettings);

	const handleCancel = () => {
		hide();
		setShouldPrintOrder(false);
	};

	return (
		<Modal show={show} onHide={hide} backdrop="static" centered animation={false}>
			<Modal.Body className={styles.modalBody}>
				<Row>
					<Col className={styles.message}>There are some older KOTs exist in mentioned table do you want to merge into current order</Col>
				</Row>
				<Row>
					<Col className={styles.modalControl}>
						<button className={styles.okBtn} onClick={() => mutate(finalOrder)} disabled={isLoading}>
							{isLoading ? "Loading" : "OK"}
						</button>
						<button className={styles.cancelBtn} onClick={handleCancel}>
							Cancel
						</button>
					</Col>
				</Row>
			</Modal.Body>
		</Modal>
	);
}

export default KOTExistAlertModal;
