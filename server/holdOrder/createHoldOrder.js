const { getDb } = require("../common/getDb");
const db2 = getDb();

const createHoldOrder = async order => {
	let restaurantId = 1;
	const {
		customerName,
		customerContact,
		customerAdd,
		customerLocality,
		deliveryCharge,
		packagingCharge,
		discount,
		paymentMethod,
		orderType,
		orderComment,
		cartTotal,
		tax,
		subTotal,
		tableNumber,
		orderCart,
	} = order;

	const { lastInsertRowid: holdOrderId } = db2
		.prepare(
			"INSERT INTO hold_orders (restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,landmark,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
		)
		.run([restaurantId, customerName, customerAdd, customerContact, orderType, tableNumber, subTotal, orderComment, discount, tax, deliveryCharge, cartTotal, paymentMethod, customerLocality]);

	// const holdOrderId = await dbRun(
	//       db,
	//       "INSERT INTO hold_orders (restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,total_tax,delivery_charges,total,payment_type,landmark,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))",
	//       [
	//             restaurantId,
	//             customerName,
	//             customerAdd,
	//             customerContact,
	//             orderType,
	//             tableNumber,
	//             subTotal,
	//             orderComment,
	//             discount,
	//             tax,
	//             deliveryCharge,
	//             cartTotal,
	//             paymentMethod,
	//             customerLocality,
	//       ]
	// );

	orderCart.forEach(item => {
		const {
			itemQty,
			itemId,
			itemName,
			variation_id,
			variantName,
			toppings,
			currentOrderItemId,
			basePrice,
			itemTotal,
			multiItemTotal,
			itemIdentifier,
			itemTax,
			variant_display_name,
			categoryId,
		} = item;

		const { lastInsertRowid: holdOrderItemId } = db2
			.prepare(
				"INSERT INTO hold_order_items (Hold_order_id,item_id,item_name,quantity,variation_name,variation_id,description,currentOrderItemId,basePrice,itemTotal,multiItemTotal,itemIdentifier,itemTax,category_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
			)
			.run([
				holdOrderId,
				itemId,
				itemName,
				itemQty,
				variant_display_name,
				variation_id,
				orderComment,
				currentOrderItemId,
				basePrice,
				itemTotal,
				multiItemTotal,
				itemIdentifier,
				JSON.stringify(itemTax),
				categoryId,
			]);

		// const holdOrderItemId = await dbRun(
		// 	db,
		// 	"INSERT INTO hold_order_items (Hold_order_id,item_id,item_name,quantity,variation_name,variation_id,description,currentOrderItemId,basePrice,itemTotal,multiItemTotal,itemIdentifier,itemTax,category_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
		// 	[
		// 		holdOrderId,
		// 		itemId,
		// 		itemName,
		// 		itemQty,
		// 		variant_display_name,
		// 		variation_id,
		// 		orderComment,
		// 		currentOrderItemId,
		// 		basePrice,
		// 		itemTotal,
		// 		multiItemTotal,
		// 		itemIdentifier,
		// 		JSON.stringify(itemTax),
		// 		categoryId,
		// 	]
		// );

		if (toppings) {
			toppings.forEach(topping => {
				const { id, type, price, qty } = topping;

				KOT_addonGroup = db2
					.prepare("INSERT INTO hold_order_item_addongroupitems (hold_order_item_id,addongroupitem_id,name,quantity,price) VALUES (?,?,?,?,?)")
					.run([holdOrderItemId, id, type, qty, price]);

				// KOT_addonGroup = dbRun(db, "INSERT INTO hold_order_item_addongroupitems (hold_order_item_id,addongroupitem_id,name,quantity,price) VALUES (?,?,?,?,?)", [
				// 	holdOrderItemId,
				// 	id,
				// 	type,
				// 	qty,
				// 	price,
				// ]);
			});
		}
	});
};

module.exports = { createHoldOrder };