const { getDb } = require("../common/getDb");
const db2 = getDb();

const getOrderToSync = () => {
	const ordersStmt = db2.prepare(
		"SELECT O.id, O.bill_no, O.restaurant_id,O.web_id, O.customer_name, O.complete_address, O.biller_name, O.biller_id, O.phone_number, O.city_id, O.order_type, O.dine_in_table_id, O.dine_in_table_no, O.description, O.item_total, O.total_discount, O.total_tax, O.tax_details,O.delivery_charges,O.total, O.promo_id, O.promo_code,O.promo_discount,O.platform,O.payment_type,O.order_status, O.created_at, O.updated_at, O.extra_data, O.print_count, O.settle_amount,O.tip, O.bill_paid, O.discount_percent, O.delivery_distance, C.web_id AS customer_id FROM pos_orders AS O JOIN customers AS C ON O.customer_id = C.id WHERE O.sync = 0 AND O.customer_id IS NOT NULL AND C.web_id IS NOT NULL LIMIT 10"
	);

	const itemsStmt = db2.prepare("SELECT * from pos_order_items WHERE pos_order_id = ? AND sync = 0");

	const orders = ordersStmt.all([]);

	let ordersTosync = [];

	orders.forEach(order => {
		let orderTosync = {
			bill_no: order.bill_no,
			biller: {
				biller_id: order.biller_id,
				biller_name: order.biller_name,
			},
			customer: {
				customer_id: order.customer_id,
				customer_name: order.customer_name,
				complete_address: order.complete_address,
				phone_number: order.phone_number,
			},
			order: {
				id: order.id,
				items: [],
				order_type: order.order_type,
				web_id: order.web_id,
				dine_in_table_id: order.dine_in_table_id,
				dine_in_table_no: order.dine_in_table_no,
				description: order.description,
				item_total: order.item_total,
				total_discount: order.total_discount,
				total_tax: order.total_tax,
				delivery_charges: order.delivery_charges,
				total: order.total,
				platform: order.platform,
				payment_type: order.payment_type,
				order_status: order.order_status,
				extra_data: { ...JSON.parse(order.extra_data), tax_details: JSON.parse(order.tax_details) },
				settle_amount: order.settle_amount,
				print_count: order.print_count,
				tip: order.tip,
				discount_percent: order.discount_percent,
				bill_paid: order.bill_paid,
				delivery_distance: order.delivery_distance,
				created_at: order.created_at,
				updated_at: order.updated_at,
			},
		};

		const items = itemsStmt.all([order.id]);

		items.forEach(item => {
			const itemTosync = {
				id: item.id,
				web_id: item.web_id,
				item_addonitems: JSON.parse(item.item_addon_items),
				contains_free_item: item.contains_free_item,
				discount_details: JSON.parse(item.discount_detail),
				description: item.description,
				final_price: item.final_price,
				item_id: item.item_id,
				item_discount: item.item_discount,
				tax: item.tax,
				tax_id: item.tax_id,
				variation_id: item.variation_id,
				variation_name: item.variation_name,
				price: item.price,
				item_name: item.item_name,
				quantity: item.quantity,
				created_at: item.created_at,
				updated_at: item.updated_at,
				main_order_item_id: item.main_order_item_id,
				status: item.status,
			};

			orderTosync.order.items.push(itemTosync);
		});

		ordersTosync.push(orderTosync);
	});

	// console.log(JSON.stringify(ordersTosync[5]));
	return ordersTosync;
};

module.exports = { getOrderToSync };

// data = {
// 	bill_no: 1234,
// 	biller: { biller_id: 1, biller_name: "abcd" },
// 	customer: { customer_id: 1, customer_name: "abcd", complete_address: "rajkot", phone_number: 1234567891 },
// 	order: {
// 		id: "local_id",
// 		web_id: 123,
// 		items: [
// 			{
// 				id: "local_id",
// 				web_id: 12,
// 				addonItems: [{ id: 125 }, { id: 126 }, { id: 127 }],
// 				contains_free_item: 0,
// 				discount_details: [{ id: 2, type: "promo", name: "Flat ₹50 OFF", discount: "8.139620061532451" }],
// 				description: "dsds",
// 				final_price: 58.53037993846755,
// 				item_id: 80,
// 				item_discount: 8.139620061532451,
// 				item_tax: [
// 					{ amount: 1.46, tax_id: 30, name: "SGST", tax: "2.5" },
// 					{ amount: 1.46, tax_id: 31, name: "CGST", tax: "2.5" },
// 				],
// 				variation_id: 7,
// 				variation_name: "Slice",
// 				price: 70.0,
// 				quantity: 4,
// 				created_at: "",
// 				updated_at: "",
// 			},
// 			{
// 				id: "local_id",
// 				web_id: 12,
// 				contains_free_item: 0,
// 				discount_details: [{ id: 2, type: "promo", name: "Flat ₹50 OFF", discount: "17.441519753870196" }],
// 				description: "dsds",
// 				final_price: 125.41848024612982,
// 				item_id: 88,
// 				item_discount: 17.441519753870196,
// 				item_tax: [
// 					{ amount: 3.14, tax_id: 30, name: "SGST", tax: "2.5" },
// 					{ amount: 3.14, tax_id: 31, name: "CGST", tax: "2.5" },
// 				],
// 				variation_id: 7,
// 				variation_name: "Slice",
// 				price: 150.0,
// 				quantity: 1,
// 				created_at: "",
// 				updated_at: "",
// 			},
// 		],
// 		order_type: "pick_up",
// 		dine_in_table_id: 1,
// 		dine_in_table_no: 1,
// 		description: "abc",
// 		item_total: 123,
// 		total_discount: 125,
// 		total_tax: 12,
// 		delivery_charges: 10,
// 		total: 500,
// 		platform: "web",
// 		payment_type: "cod",
// 		order_status: "pending",
// 		extra_data: {},
// 		settle_amount: 12.3,
// 		print_count: 12,
// 		tip: 12,
// 		discount_percent: 22,
// 		bill_paid: 1,
// 		delivery_distance: 5,
// 		created_at: "",
// 		updated_at: "",
// 	},
// };

// orderSyncModal = {
// 	bill_no: order.bill_no,
// 	biller: {
// 		biller_id: order.biller_id,
// 		biller_name: order.biller_name,
// 	},
// 	customer: {
// 		customer_id: order.customer_id,
// 		customer_name: order.customer_name,
// 		complete_address: order.complete_address,
// 		phone_number: order.phone_number,
// 	},
// 	order: {
// 		items: [
// 			{
// 				id: item.id,
// 				web_id: item.web_id,
// 				addonItems: [
// 					{
// 						id: 128,
// 						name: "Olives",
// 						price: 30,
// 						quantity: 1,
// 					},
// 					{
// 						id: 130,
// 						name: "Red Paprika",
// 						price: 30,
// 						quantity: 2,
// 					},
// 					{
// 						id: 3315,
// 						name: "Broccoli",
// 						price: 30,
// 						quantity: 1,
// 					},
// 				],
// 				contains_free_item: item.contains_free_item,
// 				discount_details: [
// 					{
// 						discount: 11.6164112703905,
// 						id: null,
// 						name: "pos_discount",
// 						type: "special_discount",
// 					},
// 					{
// 						discount: 10,
// 						id: 2,
// 						name: "bogo",
// 						type: "offer",
// 					},
// 				],
// 				description: item.description,
// 				final_price: item.final_price,
// 				item_id: item.item_id,
// 				item_discount: item.item_discount,
// 				tax: item.tax,
// 				variation_id: item.variation_id,
// 				variation_name: item.variation_name,
// 				price: item.price,
// 				quantity: item.quantity,
// 				created_at: item.created_at,
// 				updated_at: item.updated_at,
// 			},
// 			//....items
// 		],
// 		order_type: order.order_type,
// 		web_id: order.web_id,
// 		dine_in_table_id: order.dine_in_table_id,
// 		dine_in_table_no: order.dine_in_table_no,
// 		description: order.description,
// 		item_total: order.item_total,
// 		total_discount: order.total_discount,
// 		total_tax: order.total_tax,
// 		delivery_charges: order.delivery_charges,
// 		total: order.total,
// 		platform: order.platform,
// 		payment_type: order.payment_type,
// 		order_status: order.order_status,
// 		extra_data: { online_order_id: null, pending_order_id: null, server_version, client_version, cancel_reason: "" },
// 		settle_amount: order.settle_amount,
// 		print_count: order.print_count,
// 		tip: order.tip,
// 		discount_percent: order.discount_percent,
// 		bill_paid: order.bill_paid,
// 		delivery_distance: order.delivery_distance,
// 		tax_details: [
// 			{
// 				id: 3,
// 				name: "CGST",
// 				tax: 3.125,
// 				tax_amount: null,
// 				tax_percent: 2.5,
// 			},
// 			{
// 				id: 4,
// 				name: "SGST",
// 				tax: 3.125,
// 				tax_amount: null,
// 				tax_percent: 2.5,
// 			},
// 		],
// 		created_at: order.created_at,
// 		updated_at: order.updated_at,
// 	},
// };
