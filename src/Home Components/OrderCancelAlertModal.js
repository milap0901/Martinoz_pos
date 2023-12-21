import React, { useRef, useState } from "react";
import styles from "./OrderCancelAlertModal.module.css";
import { Modal } from "react-bootstrap";
import { useAuthenticateMutation, useCancelOrderMutation } from "../Utils/customMutationHooks";
import { useSelector } from "react-redux";

function OrderCancelAlertModal({ show, hide, finalOrder }) {
	const passwordRef = useRef();
	const [errorMessage, setErrorMessage] = useState("");
	const biller = useSelector(state => state.serverConfig.biller);
	
	const { mutate: cancelOrderMutate } = useCancelOrderMutation(hide,setErrorMessage);
	
	const cancelOrder = finalOrder => {
		const billerCred = {
			name: biller,
			id: 1,
			password: passwordRef.current.value,
		};

	 cancelOrderMutate({ ...finalOrder, order_status: "cancelled", billerCred });
	
	
	};

	return (
		<Modal show={show} onHide={hide} backdrop="static" centered animation={false}>
			<Modal.Header closeButton>
				<div className={styles.modalTital}>You want to cancel order !</div>
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<label>Please enter password :</label>
				<input
					ref={passwordRef}
					type="password"
					placeholder="Password"
					onChange={e => {
						setErrorMessage("");
					}}
				/>
			</Modal.Body>
			<Modal.Footer className={styles.footer}>
				{errorMessage !== "" && <div className={styles.errMsg}>{errorMessage}</div>}

				<button onClick={hide} className={styles.noBtn}>
					NO
				</button>
				<button className={styles.yesBtn} onClick={() => cancelOrder(finalOrder)}>
					{" "}
					Yes{" "}
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default OrderCancelAlertModal;
