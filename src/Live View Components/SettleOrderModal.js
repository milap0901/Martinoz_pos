import React, { useCallback, useEffect, useState } from "react";
import styles from "./SettleOrderModal.module.css";
import { Modal, Row, Col } from "react-bootstrap";
import OtherPaymentOptions from "./OtherPaymentOptions";
import MultipayOptions from "./MultipayOptions";

function SettleOrderModal({ show, hide, order, orderMutation, isLoading }) {
	const [paymentDetail, setPaymentDetail] = useState({
		paymentType: order.payment_type,
		customerPaid: "",
		customerReturn: "",
		tip: order.tip || 0,
		settleAmount: "",
		multipay: [
			{ name: "upi_phonepe", displayName: "PhonePe", amount: "" },
			{ name: "upi_gpay", displayName: "Paytm", amount: "" },
			{ name: "upi_paytm", displayName: "Paytm", amount: "" },
			{ name: "upi", displayName: "UPI", amount: "" },
			{ name: "card", displayName: "Card", amount: "" },
			{ name: "due", displayName: "Due", amount: "" },
			{ name: "cash", displayName: "Cash", amount: Math.round(order.total).toString() },
		],
	});

	useEffect(() => {
		if (order.payment_type === "multipay") {
			setPaymentDetail(prev => {
				const updatedMultipay = prev.multipay.map(pay => {
					const existingPay = order.multipay.find(orderPay => orderPay.payment_type === pay.name);
					if (existingPay) {
						return { ...pay, amount: existingPay.amount };
					} else {
						return pay;
					}
				});

				return { ...prev, multipay: updatedMultipay };
			});
		}
	}, []);

	const otherOptions = ["upi_gpay", "upi_paytm", "upi_phonepe", "upi"];

	const handleChange = useCallback(e => {
		const { name, value } = e.target;

		if (name === "paymentType") {
			setPaymentDetail(prev => {
				return { ...prev, [name]: value, customerPaid: "", customerReturn: "", settleAmount: "" };
			});
			return;
		}

		if (name === "customerPaid") {
			setPaymentDetail(prev => {
				const returnAmount = Math.round(value - order.total);
				const customerReturn = returnAmount < 0 ? "Amount is less" : `₹ ${returnAmount}`;
				return { ...prev, [name]: value, customerReturn: customerReturn };
			});
			return;
		} else {
			setPaymentDetail(prev => ({ ...prev, [name]: value }));
			return;
		}
	}, []);

	// console.log(paymentDetail);

	const handleSettle = async () => {
		await orderMutation({
			orderStatus: order.order_status,
			orderId: order.id,
			orderType: order.order_type,
			KOTId: order.KOTDetail.id,
			print_count: order.print_count,
			paymentType: paymentDetail.paymentType,
			customerPaid: paymentDetail.customerPaid,
			tip: paymentDetail.tip,
			settleAmount: paymentDetail.paymentType === "due" ? order.total : paymentDetail.settleAmount,
			multipay: paymentDetail.multipay,
			online_order_id: order.extra_data.online_order_id
		});

		hide();
	};

	return (
		<Modal show={show} onHide={hide} size="md" aria-labelledby="contained-modal-title-vcenter" centered animation={false}>
			<Modal.Header closeButton className={styles.settleModalHeader}>
				Save & Settle for - {order.dine_in_table_no} [ ₹ {order.total.toFixed(2)}]
			</Modal.Header>
			<Modal.Body className={styles.settleModalBody}>
				<Row>
					<Col>Payment Type</Col>
				</Row>
				<Row>
					<Col className={styles.paymentOptions}>
						<div className={styles.option}>
							<input type="radio" name="paymentType" id="cash" value="cash" onChange={handleChange} checked={paymentDetail.paymentType === "cash"} />
							<label htmlFor="cash">Cash</label>
						</div>
						<div className={styles.option}>
							<input type="radio" name="paymentType" id="card" value="card" onChange={handleChange} checked={paymentDetail.paymentType === "card"} />
							<label htmlFor="card">Card</label>
						</div>
						<div className={styles.option}>
							<input type="radio" name="paymentType" id="due" value="due" onChange={handleChange} checked={paymentDetail.paymentType === "due"} />
							<label htmlFor="due">Due</label>
						</div>
						<div className={styles.option}>
							<input type="radio" name="paymentType" id="other" value="upi_paytm" onChange={handleChange} checked={otherOptions.includes(paymentDetail.paymentType)} />
							<label htmlFor="other">Other</label>
						</div>
						<div className={styles.option}>
							<input type="radio" name="paymentType" id="multipay" value="multipay" onChange={handleChange} checked={paymentDetail.paymentType === "multipay"} />
							<label htmlFor="multipay">Multi-pay</label>
						</div>
					</Col>
				</Row>

				{otherOptions.includes(paymentDetail.paymentType) && <OtherPaymentOptions handleChange={handleChange} paymentType={paymentDetail.paymentType} />}

				{(paymentDetail.paymentType === "cash" || paymentDetail.paymentType === "card") && (
					<Row className={styles.field}>
						<Col xs={5}>Customer paid</Col>
						<Col xs={7}>
							<input type="number" name="customerPaid" onChange={handleChange} value={paymentDetail.customerPaid} />
						</Col>
					</Row>
				)}

				{paymentDetail.paymentType === "cash" && (
					<Row className={styles.field}>
						<Col xs={5}>Return to customer</Col>
						<Col xs={7}>
							<input type="text" disabled name="customerReturn" value={paymentDetail.customerReturn} className={styles.returnAmount} />
						</Col>
					</Row>
				)}
				{paymentDetail.paymentType !== "multipay" && (
					<Row className={styles.field}>
						<Col xs={5}>Tip </Col>
						<Col xs={7}>
							<input type="number" name="tip" onChange={handleChange} value={paymentDetail.tip} />
						</Col>
					</Row>
				)}

				{paymentDetail.paymentType !== "due" && paymentDetail.paymentType !== "multipay" && (
					<Row className={styles.field}>
						<Col xs={5}>Settle Amount</Col>
						<Col xs={7}>
							<input type="number" name="settleAmount" onChange={handleChange} value={paymentDetail.settleAmount} />
						</Col>
					</Row>
				)}
				{paymentDetail.paymentType === "multipay" && <MultipayOptions paymentDetail={paymentDetail} setPaymentDetail={setPaymentDetail} orderTotal={order.total} />}
			</Modal.Body>
			<Modal.Footer className={styles.footer}>
				<button
					className={styles.saveBtn}
					onClick={handleSettle}
					disabled={isLoading || paymentDetail.multipay[6].amount === "invalid amount" || paymentDetail.customerReturn === "Amount is less"}>
					{" "}
					Save & Settle
				</button>
				<button className={styles.cancelBtn} onClick={hide}>
					Close
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default SettleOrderModal;
