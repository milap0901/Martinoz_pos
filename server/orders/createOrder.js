// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const createOrder = order => {
	// create new order number
	// printBill(order)
	// console.log(order);

	// const generateOrderNo = id => {
	// 	const numString = String(id);
	// 	const numZerosToAdd = 7 - numString.length;
	// 	const zeros = "0".repeat(numZerosToAdd);
	// 	return `ON${zeros}${id}`;
	// };

	const generateBillNo = (lastOrderTime, lastBillNo) => {
		if (!lastBillNo || !lastOrderTime) return 1;

		const currentOrderTime = new Date();
		const lastOrderMonth = lastOrderTime.getMonth() + 1;
		const cutOffYear = lastOrderMonth < 4 ? lastOrderTime.getFullYear() : lastOrderTime.getFullYear() + 1;
		const cutOffTime = new Date(`${cutOffYear}-03-31T23:59:59`);

		console.log(cutOffTime, "cutoff");
		console.log(currentOrderTime, "current");
		console.log(lastOrderTime, "last");

		let newBillNo = lastBillNo + 1;

		if (currentOrderTime > cutOffTime) {
			newBillNo = 1;
		}

		return newBillNo;
	};

	const lastOrderData = db2.prepare("SELECT bill_no, created_at FROM pos_orders ORDER BY created_at DESC LIMIT 1 ").get([]);

	const orderNo = lastOrderData?.created_at ? generateBillNo(new Date(lastOrderData.created_at), +lastOrderData.bill_no) : 1;

	// const lastEntry = await dbAll(db, "SELECT id FROM orders ORDER BY ID DESC LIMIT 1", []);
	// const { id } = db2.prepare("SELECT id FROM pos_orders ORDER BY ID DESC LIMIT 1").get([]) || { id: 0 };
	// const orderNo = `ON00${id + 1}`;
	// const currentId = id + 1 || 0;
	// const orderNo = generateOrderNo(currentId);

	let userId;
	let restaurantId = 1;
	let orderId;

	const {
		customerName = "",
		customerContact = "",
		customerAdd = "",
		customerLocality = "",
		deliveryCharge = 0,
		packagingCharge = 0,
		discount,
		paymentMethod,
		orderType,
		orderComment,
		cartTotal,
		tax,
		subTotal,
		tableNumber,
		orderCart,
		printCount,
		order_status,
		online_order_id = null,
		discount_type,
		discount_percent,
		promo_id = null,
		promo_discount = 0,
		promo_code = null,
		billPaid = 0,
		multipay = [],
		pending_order_id = null,
		taxDetails = [],
		biller_id = 1,
		biller_name = "biller",
	} = order;

	const extra_data_string = JSON.stringify({ online_order_id, pending_order_id });
	const tax_details = JSON.stringify(taxDetails);

	if (customerContact) {
		const existingUserInfo = db2.prepare("SELECT id FROM customers WHERE number = ?").get([customerContact.trim()]);

		if (!existingUserInfo) {
			db2.transaction(() => {
				const newUserInfo = db2
					.prepare(
						"INSERT INTO customers (name,number,created_at,updated_at) VALUES(?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
					)
					.run([customerName, customerContact]);
				userId = newUserInfo.lastInsertRowid;

				// db2.prepare("UPDATE customers SET old_id = ? WHERE id = ?" ).run([userId,userId]);

				db2.prepare(
					"INSERT INTO customer_addresses (customer_id,complete_address,landmark,created_at,updated_at) VALUES(?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
				).run([userId, customerAdd.trim(), customerLocality.trim()]);

				// db2.prepare("INSERT INTO users_groups (user_id,group_id) VALUES (?,?)").run([userId, 1]);
			})();
		} else {
			userId = existingUserInfo.id;

			if (customerAdd.trim() !== "") {
				db2.prepare(
					"INSERT INTO customer_addresses (customer_id, complete_address,landmark,created_at,updated_at) SELECT ?, ?, ?, datetime('now', 'localtime'), datetime('now', 'localtime') WHERE NOT EXISTS (SELECT 1 FROM customer_addresses WHERE customer_id= ? AND complete_address=? AND landmark=?)"
				).run([userId, customerAdd?.trim(), customerLocality?.trim(), userId, customerAdd?.trim(), customerLocality?.trim()]);
			}
		}
	}

	const orderTrans = db2.transaction(userId => {
		const orderInfo = db2
			.prepare(
				"INSERT INTO pos_orders (customer_id,bill_no,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,discount_percent,total_tax,delivery_charges,total,payment_type,order_status,print_count,promo_id,promo_code,promo_discount,bill_paid,extra_data,tax_details,biller_id,biller_name,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
			)
			.run([
				userId,
				orderNo,
				restaurantId,
				customerName,
				customerAdd,
				customerContact,
				orderType,
				tableNumber,
				subTotal,
				orderComment,
				discount,
				discount_percent,
				tax,
				deliveryCharge,
				cartTotal,
				paymentMethod,
				order_status,
				printCount,
				promo_id,
				promo_code,
				promo_discount,
				Number(billPaid),
				extra_data_string,
				tax_details,
				biller_id,
				biller_name,
			]);

		if (paymentMethod === "multipay") {
			const mutipayPrepare = db2.prepare("INSERT INTO multipays (pos_order_id,payment_type,amount) VALUES (?,?,?)");
			multipay.forEach(pay => {
				if (pay.amount > 0) {
					mutipayPrepare.run([orderInfo.lastInsertRowid, pay.name, pay.amount]);
				}
			});
		}

		const cartTrans = db2.transaction((orderCart, orderId) => {
			const prepareItem = db2.prepare(
				"INSERT INTO pos_order_items (pos_order_id,item_id,item_name,price,item_discount,final_price,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items,contains_free_item,main_order_item_id,discount_detail,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime', '+' || ? || ' seconds'),datetime('now', 'localtime', '+' || ? || ' seconds'))"
			);

			let main_order_item_id = null;

			orderCart.forEach((item, i, items) => {
				if (!["removed", "cancelled"].includes(item.itemStatus)) {
					const {
						itemQty,
						itemId,
						itemName,
						variation_id,
						variantName,
						itemTotal,
						item_discount,
						discount_detail,
						multiItemTotal,
						toppings,
						itemTax,
						variant_display_name,
						itemNotes,
						parent_tax,
						contains_free_item = 0,
						is_it_free_item = 0,
					} = item;

					let timeOffset = 0;

					const isDuplicate = items.findIndex(
						(item, idx) => item.itemId === itemId && item.variation_id === variation_id && idx !== i
					);
					if (isDuplicate !== -1) {
						timeOffset = i;
					}

					const final_price = itemTotal - item_discount;
					const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);

					const toppingsJson = JSON.stringify(toppings);
					const discount_detail_json = JSON.stringify(discount_detail);

					const itemInfo = prepareItem.run([
						orderId,
						itemId,
						itemName,
						itemTotal,
						item_discount,
						final_price,
						itemQty,
						variant_display_name,
						variation_id,
						itemNotes,
						parent_tax,
						totalItemTax,
						toppingsJson,
						contains_free_item,
						main_order_item_id,
						discount_detail_json,
						timeOffset,
						timeOffset,
					]);

					main_order_item_id = contains_free_item ? itemInfo.lastInsertRowid : null;
				}
			});
		});

		cartTrans(orderCart, orderInfo.lastInsertRowid);
		orderId = orderInfo.lastInsertRowid;
	});

	orderTrans(userId);

	return { userId, orderId, orderNo };
};

module.exports = { createOrder };

// const createOrder2 = order => {
// 	const generateOrderNo = id => `ON${String(id).padStart(7, "0")}`;

// 	const { id } = db2.prepare("SELECT id FROM orders ORDER BY ID DESC LIMIT 1").get([]) || { id: 0 };
// 	const currentId = id + 1 || 0;
// 	const orderNo = generateOrderNo(currentId);

// 	let userId;
// 	let orderId;
// 	const {
// 		customerName,
// 		customerContact,
// 		customerAdd,
// 		customerLocality,
// 		deliveryCharge,
// 		packagingCharge,
// 		discount,
// 		paymentMethod,
// 		orderType,
// 		orderComment,
// 		cartTotal,
// 		tax,
// 		subTotal,
// 		tableNumber,
// 		orderCart,
// 		printCount,
// 		order_status,
// 		online_order_id = null,
// 		discount_type,
// 		discount_percent,
// 		promo_id = null,
// 		promo_discount = 0,
// 		promo_code = null,
// 	} = order;

// 	if (customerContact) {
// 		const existingUserInfo = db2.prepare("SELECT id FROM users WHERE number = ?").get([customerContact.trim()]);

// 		if (!existingUserInfo) {
// 			db2.transaction(() => {
// 				const newUserInfo = db2.prepare("INSERT INTO users (name,number,password) VALUES(?,?,?)").run([customerName, customerContact, ""]);
// 				userId = newUserInfo.lastInsertRowid;

// 				db2.prepare("INSERT INTO user_addresses (user_id,complete_address,landmark) VALUES(?,?,?)").run([userId, customerAdd, customerLocality]);
// 				db2.prepare("INSERT INTO users_groups (user_id,group_id) VALUES (?,?)").run([userId, 1]);
// 			})();
// 		} else {
// 			userId = existingUserInfo.id;
// 			if (customerAdd.trim() !== "") {
// 				db2.prepare(
// 					"INSERT INTO user_addresses (user_id, complete_address,landmark) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT 1 FROM user_addresses WHERE user_id=? AND complete_address=? AND landmark=?)"
// 				).run([userId, customerAdd?.trim(), customerLocality?.trim(), userId, customerAdd?.trim(), customerLocality?.trim()]);
// 			}
// 		}
// 	}

// 	const orderTrans = db2.transaction(userId => {
// 		const orderInfo = db2
// 			.prepare(
// 				"INSERT INTO orders (user_id,order_number,restaurant_id,customer_name,complete_address,phone_number,order_type,dine_in_table_no,item_total,description,total_discount,discount_percent,total_tax,delivery_charges,total,payment_type,order_status,print_count,online_order_id,promo_id,promo_code,promo_discount,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime'),datetime('now', 'localtime'))"
// 			)
// 			.run([
// 				userId,
// 				orderNo,
// 				1,
// 				customerName,
// 				customerAdd,
// 				customerContact,
// 				orderType,
// 				tableNumber,
// 				subTotal,
// 				orderComment,
// 				discount,
// 				discount_percent,
// 				tax,
// 				deliveryCharge,
// 				cartTotal,
// 				paymentMethod,
// 				order_status,
// 				printCount,
// 				online_order_id,
// 				promo_id,
// 				promo_code,
// 				promo_discount,
// 			]);

// 		const cartTrans = db2.transaction((orderCart, orderId) => {
// 			const prepareItem = db2.prepare(
// 				"INSERT INTO order_items (order_id,item_id,item_name,price,item_discount,final_price,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items,contains_free_item,main_order_item_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)"
// 			);

// 			let main_order_item_id = null;
// 			orderCart.forEach(item => {
// 				if (!["removed", "cancelled"].includes(item.itemStatus)) {
// 					const {
// 						itemQty,
// 						itemId,
// 						itemName,
// 						variation_id,
// 						variantName,
// 						itemTotal,
// 						item_discount,
// 						multiItemTotal,
// 						toppings,
// 						itemTax,
// 						variant_display_name,
// 						itemNotes,
// 						parent_tax,
// 						contains_free_item = 0,
// 						is_it_free_item = 0,
// 					} = item;
// 					const final_price = itemTotal - item_discount;
// 					const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
// 					const toppingsJson = JSON.stringify(toppings);
// 					const itemInfo = prepareItem.run([
// 						orderId,
// 						itemId,
// 						itemName,
// 						itemTotal,
// 						item_discount,
// 						final_price,
// 						itemQty,
// 						variant_display_name,
// 						variation_id,
// 						itemNotes,
// 						parent_tax,
// 						totalItemTax,
// 						toppingsJson,
// 						contains_free_item,
// 						main_order_item_id,
// 					]);
// 					main_order_item_id = contains_free_item ? itemInfo.lastInsertRowid : null;
// 				}
// 			});
// 		});

// 		cartTrans(orderCart, orderInfo.lastInsertRowid);
// 		orderId = orderInfo.lastInsertRowid;
// 	});

// 	orderTrans(userId);
// 	return { userId, orderId, orderNo };
// };

// module.exports = { createOrder2 };
