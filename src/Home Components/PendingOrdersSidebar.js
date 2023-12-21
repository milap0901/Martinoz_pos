import React from "react";
import styles from "./PendingOrdersSidebar.module.css";
import Offcanvas from "react-bootstrap/Offcanvas";
import Loading from "../Feature Components/Loading";
import PendingOrdersList from "./PendingOrdersList";

function PendingOrdersSidebar({ showPendingOrders, setShowPendingOrders, pendingOrders, isLoading }) {
	const handleClose = () => setShowPendingOrders(false);

	return (
		<Offcanvas className={styles.holdOrderSidebar} show={showPendingOrders} onHide={handleClose} placement="start" backdrop={false} scroll={true}>
			<Offcanvas.Header closeButton className={styles.holdOrderHeader}>
				Pending Orders
			</Offcanvas.Header>
			<Offcanvas.Body className={styles.holdOrdersBody}>
				<PendingOrdersList pendingOrders={pendingOrders} isLoading={isLoading} />
			</Offcanvas.Body>
		</Offcanvas>
	);
}

export default PendingOrdersSidebar;

const finalOrder = {
	kotsDetail: [],
	id: "",
	cartAction: "default",
	printCount: 0,
	customerName: "emerging coders",
	customerContact: "8238267210",
	customerAdd: "Rk Empire nr nana Mauva circle 9th floor 905 rajkot ",
	customerLocality: "Rajkot 360004",
	tableArea: "Other",
	orderCart: [
		{
			currentOrderItemId: "bb9aabd1-0a81-415c-914b-ea73b19bd065",
			itemQty: 2,
			itemId: 118,
			itemName: "Jalapeno, Golden Corn, Paneer & Cheese Pizza",
			variation_id: "",
			variantName: "",
			variant_display_name: "",
			categoryId: 36,
			basePrice: 278,
			toppings: [],
			itemTotal: 278,
			multiItemTotal: 556,
			itemIdentifier: "118",
			itemNotes: "",
			parent_tax: 56,
			kotId: null,
			itemTax: [
				{
					id: 3,
					name: "CGST",
					tax: 6.95,
				},
				{
					id: 4,
					name: "SGST",
					tax: 6.95,
				},
			],
			itemStatus: "default",
		},
		{
			currentOrderItemId: "ca28dcce-8111-4d40-afe3-e9c6c5ad2cac",
			itemQty: 2,
			itemId: 119,
			itemName: "Jalapeno, Olives & Cheese Pizza",
			variation_id: "",
			variantName: "",
			variant_display_name: "",
			categoryId: 36,
			basePrice: 250,
			toppings: [],
			itemTotal: 250,
			multiItemTotal: 500,
			itemIdentifier: "119",
			itemNotes: "",
			parent_tax: 56,
			kotId: null,
			itemTax: [
				{
					id: 3,
					name: "CGST",
					tax: 6.25,
				},
				{
					id: 4,
					name: "SGST",
					tax: 6.25,
				},
			],
			itemStatus: "default",
		},
		{
			itemStatus: "default",
			currentOrderItemId: "c2fdf7ac-afce-4b8b-9d67-88889854e5ee",
			itemQty: 1,
			itemId: 154,
			categoryId: 27,
			itemName: "Margherita Pizza",
			variation_id: 9,
			variantName: "Medium [serve 2][24 Cm]",
			variant_display_name: "Medium",
			basePrice: 590,
			toppings: [
				{
					id: 166,
					name: "Onion",
					price: 60,
					quantity: 1,
				},
				{
					id: 168,
					name: "Paneer",
					price: 60,
					quantity: 1,
				},
				{
					id: 167,
					name: "Capsicum",
					price: 60,
					quantity: 1,
				},
			],
			itemTotal: 770,
			multiItemTotal: 770,
			parent_tax: 56,
			itemTax: [
				{
					id: 3,
					name: "CGST",
					tax: 19.25,
				},
				{
					id: 4,
					name: "SGST",
					tax: 19.25,
				},
			],
			itemNotes: "",
			kotId: null,
			itemIdentifier: "154_9_166_1_167_1_168_1",
		},
	],
	subTotal: 1826,
	tax: 91.3,
	deliveryCharge: 0,
	packagingCharge: 0,
	discount: 0,
	paymentMethod: "card",
	tableNumber: "",
	personCount: 0,
	orderType: "dine_in",
	orderComment: "",
	cartTotal: 1917.3,
	order_status: "accepted",
};
