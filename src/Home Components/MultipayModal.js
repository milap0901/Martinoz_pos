import React, { useEffect, useRef } from "react";
import { Modal } from "react-bootstrap";
import styles from "./MultipayModal.module.css";
import { useGetExistingOrdersQuery } from "../Utils/customQueryHooks";
import { useIncludeKotAndCreateOrderMutation, useUpdateOrderAndCreateKOTMutation } from "../Utils/customMutationHooks";

function MultipayModal({
	show,
	hide,
	kotToOrderMutate,
	kotToPrintOrderMutate,
	orderMutate,
	printOrderMutate,
	finalOrder,
	printers,
	shouldPrintOrder,
	setShouldPrintOrder,
	setMultipayControlType,
	multipayControlType,
	defaultSettings,
}) {
	let cartTotal = finalOrder.cartTotal;
	const orderMultipayData = finalOrder.multipay;
	const tableNumber = finalOrder.tableNumber;
	const shouldFetchExistingOrder = !!tableNumber && finalOrder.cartAction !== "modifyOrder";

	const upiPhonePeRef = useRef();
	const upiPaytmRef = useRef();
	const upiGpayRef = useRef();
	const upiRef = useRef();
	const cardRef = useRef();
	const dueRef = useRef();
	const cashRef = useRef();
	const errRef = useRef();
	const prevOrderTotalRef = useRef();
	const prevKotTotalRef = useRef();
	const currentOrderRef = useRef();

	const multipay = [
		{ name: "upi_phonepe", displayName: "PhonePe", amount: "", ref: upiPhonePeRef },
		{ name: "upi_gpay", displayName: "Paytm", amount: "", ref: upiGpayRef },
		{ name: "upi_paytm", displayName: "Paytm", amount: "", ref: upiPaytmRef },
		{ name: "upi", displayName: "UPI", amount: "", ref: upiRef },
		{ name: "card", displayName: "Card", amount: "", ref: cardRef },
		{ name: "due", displayName: "Due", amount: "", ref: dueRef },
		{ name: "cash", displayName: "Cash", amount: "", ref: cashRef },
	];

	const { mutate: includeKotAndCreateOrderMutate, isLoading: isMutationLoading } = useIncludeKotAndCreateOrderMutation(
		finalOrder,
		hide,
		shouldPrintOrder,
		setShouldPrintOrder,
		printers,
		defaultSettings
	);
	const { mutate: updateOrderAndCreateKOTMutate, isLoading: isUpdateOrderAndCreateKOTLoading } = useUpdateOrderAndCreateKOTMutation(
		printers,
		hide,
		finalOrder
	);

	const { data, isLoading: isExistingOrderLoading } = useGetExistingOrdersQuery(finalOrder, shouldFetchExistingOrder);
	console.log(data);

	if (data?.mergedOrderData && !isExistingOrderLoading) {
		let existingOrderMultipayTotal = 0;
		data?.mergedOrderData.existingOrderMultipayDetail.forEach(existingPay => {
			const matchPay = multipay.find(pay => pay.name === existingPay.payment_type && pay.name !== "cash");
			if (matchPay) {
				existingOrderMultipayTotal += existingPay.amount;
				matchPay.ref.current.value = existingPay.amount;
			}
		});

		cartTotal = data?.mergedOrderData.finalUpdatedCartTotal;
		const diff = data?.mergedOrderData.finalUpdatedCartTotal - existingOrderMultipayTotal;
		cashRef.current.value = diff;
		currentOrderRef.current.style.display = "block";

		if (data.type === "kot") {
			prevKotTotalRef.current.style.display = "block";
		}

		if (data.type === "order") {
			prevOrderTotalRef.current.style.display = "block";
		}
	}

	useEffect(() => {
		if (!shouldFetchExistingOrder) {
			let oldMultipayTotal = 0;
			orderMultipayData.forEach(orderPay => {
				const matchPay = multipay.find(localPay => localPay.name === orderPay.name);
				if (matchPay) {
					matchPay.ref.current.value = orderPay.amount === 0 ? "" : orderPay.amount;
					oldMultipayTotal += orderPay.amount;
					return;
				}
			});

			if (oldMultipayTotal !== cartTotal) {
				const diff = cartTotal - oldMultipayTotal;
				cashRef.current.value = +cashRef.current.value + diff;
			}
			return;
		}

		cashRef.current.value = cartTotal;
	}, []);

	const handleChange = e => {
		const { name, value } = e.target;
		let total = 0;

		multipay.forEach(pay => {
			if (pay.name === name && pay.name !== "cash") {
				pay.ref.current.value = value;
			}
			if (pay.name !== "cash") {
				total += +pay.ref.current.value || 0;
			}
		});

		cashRef.current.value = cartTotal - total;

		if (total > cartTotal || cardRef.current.value < 0) {
			errRef.current.style.display = "block";
		} else {
			errRef.current.style.display = "none";
		}
	};

	const handleSave = () => {
		let total = 0;
		const multipayDetail = multipay.map(pay => {
			total += +pay.ref.current.value;
			return { name: pay.name, amount: +pay.ref.current.value || 0 };
		});

		if (total < 0 || total > cartTotal || isNaN(total) || total === 0 || cashRef.current.value < 0) {
			errRef.current.style.display = "block";
			return;
		}

		if (finalOrder.cartAction === "modifyKot") {
			kotToOrderMutate({ ...finalOrder, multipay: multipayDetail });
			hide();
			return;
		}

		if (data?.type === "kot" && data?.mergedOrderData) {
			setShouldPrintOrder(true);
			includeKotAndCreateOrderMutate({ ...finalOrder, multipay: multipayDetail, printCount: finalOrder.printCount + 1 });
			return;
		}

		orderMutate({ ...finalOrder, multipay: multipayDetail });

		hide();
	};

	const handleSaveAndPrint = () => {
		let total = 0;
		const multipayDetail = multipay.map(pay => {
			total += +pay.ref.current.value;
			return { name: pay.name, amount: +pay.ref.current.value || 0 };
		});

		if (total < 0 || total > cartTotal || isNaN(total) || total === 0 || cashRef.current.value < 0) {
			errRef.current.style.display = "block";
			return;
		}

		if (finalOrder.cartAction === "modifyKot") {
			kotToPrintOrderMutate({ ...finalOrder, multipay: multipayDetail, printCount: finalOrder.printCount + 1 });
			hide();
			return;
		}

		if (data?.type === "kot" && data?.mergedOrderData) {
			setShouldPrintOrder(true);
			includeKotAndCreateOrderMutate({ ...finalOrder, multipay: multipayDetail, printCount: finalOrder.printCount + 1 });
			return;
		}

		printOrderMutate({ ...finalOrder, multipay: multipayDetail, printCount: finalOrder.printCount + 1 });
		hide();
	};

	const handleKotAndPrint = () => {
		let total = 0;
		const multipayDetail = multipay.map(pay => {
			total += +pay.ref.current.value;
			return { name: pay.name, amount: +pay.ref.current.value || 0 };
		});

		if (total < 0 || total > cartTotal || isNaN(total) || total === 0 || cashRef.current.value < 0) {
			errRef.current.style.display = "block";
			return;
		}

		updateOrderAndCreateKOTMutate({ ...finalOrder, multipay: multipayDetail });
		setMultipayControlType("order");
	};

	return (
		<Modal show={show} onHide={hide} size="md" centered animation={false} backdrop="static">
			<Modal.Header closeButton className={styles.modelHeader}>
				{
					<div className={styles.currentOrderTotalContainer} ref={currentOrderRef}>
						<div className={styles.totalTitle}>Current Order</div>
						<div className={styles.totalAmount}>₹ {data?.mergedOrderData?.updatedLatestOrderCartTotal.toFixed(2)}</div>
					</div>
				}
				{data?.mergedOrderData && <div className={styles.operator}> + </div>}
				{
					<div className={styles.prevOrderTotalContainer} ref={prevOrderTotalRef}>
						<div className={styles.totalTitle}>Previous Order</div>
						<div className={styles.totalAmount}>₹ {data?.mergedOrderData?.updatedExistionOrderCartTotal.toFixed(2)}</div>
					</div>
				}
				{
					<div className={styles.kotTotalContainer} ref={prevKotTotalRef}>
						<div className={styles.totalTitle}>Previous Kots</div>
						<div className={styles.totalAmount}>₹ {data?.mergedOrderData?.updatedExistionOrderCartTotal.toFixed(2)}</div>
					</div>
				}
				{data?.mergedOrderData && <div className={styles.operator}> = </div>}
				{
					<div className={styles.totalContainer}>
						<div className={styles.totalTitle}>Total</div>
						<div className={styles.totalAmount}>₹ {cartTotal.toFixed(2)}</div>
					</div>
				}
			</Modal.Header>
			<Modal.Body className={styles.modalBody}>
				<div className={styles.multipayListCotainer}>
					{multipay.map(pay => (
						<div key={pay.name} className={styles.multipayOption}>
							<label className={styles.multipayLabel}>{pay.displayName}</label>
							<input
								className={styles.multipayInput}
								type="number"
								ref={pay.ref}
								name={pay.name}
								min="0"
								disabled={pay.name === "cash"}
								onChange={handleChange}
							/>
						</div>
					))}
				</div>
			</Modal.Body>
			<Modal.Footer className={styles.modelFooter}>
				<div className={styles.error} ref={errRef}>
					invalid input
				</div>
				{multipayControlType === "order" && (
					<>
						<button className={styles.saveBtn} onClick={handleSave}>
							{" "}
							Save
						</button>
						<button className={styles.saveBtn} onClick={handleSaveAndPrint}>
							Save & Print
						</button>
					</>
				)}
				{multipayControlType === "kot" && (
					<>
						<button className={styles.kotBtn} onClick={handleKotAndPrint}>
							{" "}
							Kot
						</button>
						<button className={styles.kotBtn} onClick={handleKotAndPrint}>
							Kot & Print
						</button>
					</>
				)}
				<button onClick={hide} className={styles.closeBtn}>
					Cancel
				</button>
			</Modal.Footer>
		</Modal>
	);
}

export default MultipayModal;
