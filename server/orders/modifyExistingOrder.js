const { getDb } = require("../common/getDb");
const db2 = getDb();

const modifyExistingOrder = order => {
	const { deliveryCharge, discount, cartTotal, tax, subTotal, orderCart, printCount, id: orderId, order_status, discount_percent, paymentMethod, taxDetails } = order;

	const newItemStmt = db2.prepare(
		"INSERT INTO pos_order_items (pos_order_id,item_id,item_name,price,item_discount,discount_detail,final_price,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime', '+' || ? || ' seconds'),datetime('now', 'localtime', '+' || ? || ' seconds'))"
	);

	const updateItemStmt = db2.prepare(
		"UPDATE pos_order_items SET quantity = ?, final_price = ?,item_discount= ?, discount_detail = ?, sync = 0, updated_at = datetime('now', 'localtime') WHERE id =?"
	);

	const deleteItemStmt = db2.prepare("DELETE FROM pos_order_items WHERE id = ? AND web_id IS NULL");

	const changeItemStatusStmt = db2.prepare("UPDATE pos_order_items SET status = 0, sync = 0, updated_at = datetime('now', 'localtime')  WHERE id= ? ");
	const multipayInsertStmt = db2.prepare("INSERT INTO multipays (pos_order_id, payment_type, amount) VALUES (?,?,?)");

	try {
		db2.transaction(() => {
			const settle_amount = order_status === "cancelled" ? 0 : null;
			db2.prepare(
				"UPDATE pos_orders SET item_total = ?, payment_type = ?, total_discount = ?, discount_percent = ? , total_tax = ?, tax_details = ?, delivery_charges = ?, total = ?, print_count = ?, order_status = ?,settle_amount = ?, updated_at = datetime('now', 'localtime'), sync = 0 WHERE id= ?"
			).run([subTotal, paymentMethod, discount, discount_percent, tax, JSON.stringify(taxDetails), deliveryCharge, cartTotal, printCount, order_status, settle_amount, orderId]);

			orderCart.forEach((item, i) => {
				const {
					currentOrderItemId,
					itemQty,
					itemId,
					itemName,
					variation_id,
					variantName,
					itemTotal,
					multiItemTotal,
					toppings,
					itemTax,
					variant_display_name,
					itemNotes,
					item_discount,
					parent_tax,
					itemStatus,
					discount_detail,
				} = item;

				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
				const toppingsJson = JSON.stringify(toppings);

				if (itemStatus === "new") {
					const final_price = itemTotal - item_discount;
					const discount_details_json = JSON.stringify(discount_detail);
					newItemStmt.run([
						orderId,
						itemId,
						itemName,
						itemTotal,
						item_discount,
						discount_details_json,
						final_price,
						itemQty,
						variant_display_name,
						variation_id,
						itemNotes,
						parent_tax,
						totalItemTax,
						toppingsJson,
						i,
						i,
					]);
				} else if (itemStatus === "updated") {
					const final_price = itemTotal - item_discount;
					const discount_details_json = JSON.stringify(discount_detail);
					updateItemStmt.run([itemQty, final_price, item_discount, discount_details_json, currentOrderItemId]);
				} else if (itemStatus === "removed") {
					// deleteItemStmt.run([currentOrderItemId]);
					changeItemStatusStmt.run([currentOrderItemId]);
				}
			});

			if (paymentMethod === "multipay") {
				db2.transaction(() => {
					db2.prepare("DELETE FROM multipays WHERE pos_order_id = ?").run([orderId]);
				})();

				db2.transaction(() => {
					order.multipay.forEach(pay => {
						if (pay.amount) {
							multipayInsertStmt.run([orderId, pay.name, pay.amount]);
						}
					});
				})();
			}
		})();

		return { orderId, success: true };
	} catch (error) {
		console.log(error);
		return { orderId, success: false };
	}
};

module.exports = { modifyExistingOrder };
