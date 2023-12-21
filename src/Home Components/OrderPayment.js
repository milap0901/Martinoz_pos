import React from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import styles from "./OrderPayment.module.css";
import PaymentBreakdown from "./PaymentBreakdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { resetFinalOrder, setPaymentMethod } from "../Redux/finalOrderSlice";
import { modifyCartData } from "../Redux/finalOrderSlice";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import OrderExistAlertModal from "./OrderExistAlertModal";
import KOTExistAlertModal from "./KOTExistAlertModal";
import notify from "../Feature Components/notify";
import { useSearchParams } from "react-router-dom";
import { useGetDefaultScreenQuery, useGetPrintersQuery } from "../Utils/customQueryHooks";
import sortPrinters from "../Utils/shortPrinters";
import { validateOrder } from "../Utils/validateOrder";
import {
	useKotMutation,
	useKotToOrderMutation,
	useKotToPrintOrderMutation,
	useModifyKotMutation,
	useOrderMutation,
	usePrintOrderMutation,
} from "../Utils/customMutationHooks";
import OrderCancelAlertModal from "./OrderCancelAlertModal";
import MultipayModal from "./MultipayModal";
import Item from "./Item";

function OrderPayment() {
	const finalOrder = useSelector(state => state.finalOrder);

	const { data: printerArr } = useGetPrintersQuery();
	// const { data: bigMenu } = useGetMenuQuery2();
	const { data: defaultSettings } = useGetDefaultScreenQuery();
	const activeOrderBtns = useSelector(state => state.UIActive.activeOrderBtns);
	const customerPhoneMandatory =
		defaultSettings?.customer_phone_mandatory.split(",").map(orderType => {
			if (orderType === "1") {
				return "dine_in";
			}
			if (orderType === "2") {
				return "delivery";
			} else {
				return "pick_up";
			}
		}) || [];

	const printers = printerArr?.length ? sortPrinters(printerArr) : [];
	// const defaultSettings = bigMenu?.defaultSettings || {};

	let [searchParams, setSearchParams] = useSearchParams();
	const [shouldPrintOrder, setShouldPrintOrder] = useState(false);
	const [showOrderExistModal, setShowOrderExistModal] = useState(false);
	const [showKOTExistMOdal, setShowKOTExistModal] = useState(false);
	const [showCancelModal, setShowCancelModal] = useState(false);
	const [showMultipay, setShowMultipay] = useState(false);
	const [multipayControlType, setMultipayControlType] = useState("order");

	const { IPAddress } = useSelector(state => state.serverConfig);
	const dispatch = useDispatch();

	// add payment method to finalOrder redux state
	const handleChange = e => {
		let { name, value, checked } = e.target;
		if (name === "isPaid") {
			dispatch(modifyCartData({ billPaid: checked }));
			return;
		}

		dispatch(setPaymentMethod({ method: value }));
	};

	const { mutate: orderMutate } = useOrderMutation(setShowKOTExistModal);

	const { mutate: kotToOrderMutate } = useKotToOrderMutation();

	const { mutate: kotMutate } = useKotMutation(printers, setShowOrderExistModal, setShowMultipay, setMultipayControlType);

	const { mutate: modifyKotMutate } = useModifyKotMutation(printers);

	const { mutate: printOrderMutate } = usePrintOrderMutation(setShowKOTExistModal, setShouldPrintOrder, printers, defaultSettings);

	const { mutate: kotToPrintOrderMutate } = useKotToPrintOrderMutation(printers, defaultSettings);

	const saveOrder = async finalOrder => {
		const isValid = validateOrder(finalOrder, setSearchParams, customerPhoneMandatory);
		if (!isValid) {
			return;
		}

		if (finalOrder.paymentMethod === "multipay") {
			setShowMultipay(true);
			return;
		}

		if (finalOrder.cartAction === "modifyKot") {
			kotToOrderMutate(finalOrder);
		} else {
			orderMutate(finalOrder);
		}
	};

	const saveAndPrintOrder = async finalOrder => {
		const isValid = validateOrder(finalOrder, setSearchParams, customerPhoneMandatory);

		if (!isValid) {
			return;
		}

		if (finalOrder.paymentMethod === "multipay") {
			setShowMultipay(true);
			return;
		}

		if (finalOrder.cartAction === "modifyKot") {
			kotToPrintOrderMutate({ ...finalOrder, printCount: finalOrder.printCount + 1 });
		} else {
			printOrderMutate({ ...finalOrder, printCount: finalOrder.printCount + 1 });
		}
	};

	const holdOrder = async () => {
		if (finalOrder.orderCart.length !== 0) {
			let res = await axios.post(`http://${IPAddress}:3001/holdOrder`, finalOrder);
			if (res.statusText === "OK") {
				notify("success");
				// set finalorder redux state to initial state after api call completion
				dispatch(resetFinalOrder());
			}
		} else {
			notify("err", "Cart is Empty");
		}
	};

	const createKOT = async (finalOrder, printers) => {
		const isValid = validateOrder(finalOrder, setSearchParams, customerPhoneMandatory);
		if (!isValid) {
			return;
		}

		if (finalOrder.cartAction === "modifyKot") {
			modifyKotMutate(finalOrder);
			return;
		}

		kotMutate(finalOrder);
	};

	const handleCancel = () => {
		setShowCancelModal(true);
		//  cancelOrderMutate({...finalOrder,order_status: "cancelled"})
	};

	const [showPaymentBreakdown, setShowPaymentBreakdown] = useState(false);

	const chevronPosition = showPaymentBreakdown ? <FontAwesomeIcon icon={faCaretDown} /> : <FontAwesomeIcon icon={faCaretUp} />;

	return (
		<div className={styles.orderPayment}>
			<PaymentBreakdown showPaymentBreakdown={showPaymentBreakdown} setShowPaymentBreakdown={setShowPaymentBreakdown} />

			<button
				className={styles.paymentBreakdownToggle}
				name="toggleBreakdown"
				onClick={() => setShowPaymentBreakdown(!showPaymentBreakdown)}>
				{chevronPosition}
			</button>

			<div className={`${styles.total} d-flex justify-content-end`}>
				<div className="m-2 my-3 text-light fs-6">Total</div>
				<div className="mx-3 my-3 text-warning fw-bold"> ₹ {finalOrder.cartTotal.toFixed(2)} </div>
			</div>

			<div className={`${styles.paymentModes} d-flex justify-content-around`}>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="cash"
						checked={finalOrder.paymentMethod === "cash"}
					/>
					Cash
				</label>

				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="card"
						checked={finalOrder.paymentMethod === "card"}
					/>
					Card
				</label>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="due"
						checked={finalOrder.paymentMethod === "due"}
					/>
					Due
				</label>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="other"
						checked={finalOrder.paymentMethod === "other"}
					/>
					Other
				</label>
				<label>
					<input
						className="mx-2 my-2"
						type="radio"
						name="paymentMethod"
						onChange={handleChange}
						value="multipay"
						checked={finalOrder.paymentMethod === "multipay"}
					/>
					Multipay
				</label>
			</div>
			<div className={`${styles.paymentModesCheck} d-flex justify-content-center p-2  text-white`}>
				<input type="checkbox" checked={finalOrder.billPaid} name="isPaid" onChange={handleChange} />
				<label className="ms-3">its paid</label>
			</div>

			<div className={`${styles.ProcessOrderBtns} d-flex justify-content-center bg-light pt-3 pb-3 flex-wrap`}>
				<>
					{activeOrderBtns.includes("save") ? (
						<>
							<Button
								variant="danger"
								size="sm"
								className="mx-1 py-1 px-4 fw-bold text-nowrap rounded-1"
								onClick={() => saveOrder(finalOrder)}>
								{" "}
								Save{" "}
							</Button>
							<Button
								variant="danger"
								size="sm"
								className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1"
								onClick={() => saveAndPrintOrder(finalOrder, printers)}>
								{" "}
								Save & Print
							</Button>
						</>
					) : null}

					{/* <Button variant="danger" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> Save & eBill </Button> */}
					{/* <Button variant="secondary" size="sm" className="mx-1 py-1 fw-light px-2 fw-normal text-nowrap rounded-1"> KOT </Button> */}
					{activeOrderBtns.includes("kot") ? (
						<>
							<Button
								variant="secondary"
								size="sm"
								className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1"
								onClick={() => createKOT(finalOrder, printers)}>
								{" "}
								KOT & Print{" "}
							</Button>
							<Button
								variant="secondary"
								size="sm"
								className="mx-1 py-1 px-2 fw-bold text-nowrap rounded-1"
								onClick={() => {}}>
								{" "}
								KOT{" "}
							</Button>
						</>
					) : null}

					{activeOrderBtns.includes("hold") ? (
						<>
							<Button
								variant="white"
								size="sm"
								className="mx-1 py-1 px-2 fw-bold border-1 border border-dark text-nowrap rounded-1"
								onClick={holdOrder}>
								{" "}
								HOLD{" "}
							</Button>
						</>
					) : null}

					{activeOrderBtns.includes("cancel") ? (
						<>
							<Button
								variant="white"
								size="sm"
								className="mx-1 pe-auto py-1 px-3 fw-bold border-1 border border-dark text-nowrap rounded-1"
								onClick={handleCancel}>
								Cancel
							</Button>
						</>
					) : null}
				</>
			</div>
			{showOrderExistModal && (
				<OrderExistAlertModal
					show={showOrderExistModal}
					hide={() => setShowOrderExistModal(false)}
					IPAddress={IPAddress}
					finalOrder={finalOrder}
					printers={printers}
					notify={notify}
				/>
			)}
			{showKOTExistMOdal && (
				<KOTExistAlertModal
					show={showKOTExistMOdal}
					hide={() => {
						setShowKOTExistModal(false);
					}}
					shouldPrintOrder={shouldPrintOrder}
					setShouldPrintOrder={setShouldPrintOrder}
					printers={printers}
					defaultSettings={defaultSettings}
					IPAddress={IPAddress}
					finalOrder={finalOrder}
					notify={notify}
				/>
			)}
			{showCancelModal && <OrderCancelAlertModal show={showCancelModal} hide={() => setShowCancelModal(false)} finalOrder={finalOrder} />}
			{showMultipay && (
				<MultipayModal
					show={showMultipay}
					hide={() => setShowMultipay(false)}
					kotToOrderMutate={kotToOrderMutate}
					kotToPrintOrderMutate={kotToPrintOrderMutate}
					orderMutate={orderMutate}
					printOrderMutate={printOrderMutate}
					finalOrder={finalOrder}
					printers={printers}
					defaultSettings={defaultSettings}
					shouldPrintOrder={shouldPrintOrder}
					setShouldPrintOrder={setShouldPrintOrder}
					multipayControlType={multipayControlType}
					setMultipayControlType={setMultipayControlType}
				/>
			)}
		</div>
	);
}

export default OrderPayment;
