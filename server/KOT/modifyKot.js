const { getDb } = require("../common/getDb");
const { createKot } = require("./createKot");
const db2 = getDb();

const modifyKot = (order, orderData) => {
	const KOTId = order.id;
	const orderId = orderData.orderId;
	const userId = orderData.userId;
	let newKotTokenNo = null;

	const kotUpdateStmt = db2.prepare("UPDATE kot SET pos_order_id = ? , customer_id = ? , sync=0 , updated_at = datetime('now', 'localtime') WHERE id = ? ");
	const allDineInKotsUpdateStmt = db2.prepare(
		"UPDATE kot SET pos_order_id = ? , customer_id = ?, sync=0, updated_at = datetime('now', 'localtime') WHERE order_type='dine_in' AND table_no=? AND pos_order_id IS NULL"
	);

	const kotTokenData = db2.prepare("SELECT token_no FROM kot WHERE Id=?").get(KOTId);

	const addItemStmt = db2.prepare(
		"INSERT INTO kot_items (kot_id,item_id,item_name,quantity,variation_name,variation_id,description,tax,price,final_price,item_addon_items,tax_id,sync,created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,datetime('now', 'localtime', '+' || ? || ' seconds'), datetime('now', 'localtime', '+' || ? || ' seconds'))"
	);

	const updateItemStmt = db2.prepare("UPDATE kot_items SET quantity = ?, sync = 0 , final_price = ?, updated_at = datetime('now', 'localtime') WHERE id =? ");

	const removeItemStmt = db2.prepare("UPDATE kot_items SET status = ? , sync = 0, updated_at = datetime('now', 'localtime') WHERE id=?");
	let newKotItems = [];

	db2.transaction(() => {
		if (order.orderType === "dine_in") {
			allDineInKotsUpdateStmt.run([orderId, userId, order.tableNumber]);
		} else {
			kotUpdateStmt.run(orderId, userId, KOTId);
		}

		order.orderCart.forEach((item, i, items) => {
			const {
				currentOrderItemId,
				itemQty,
				itemId,
				itemName,
				variation_id,
				itemNotes,
				variantName,
				toppings,
				itemTax,
				itemTotal,
				itemStatus,
				multiItemTotal,
				variant_display_name,
				parent_tax,
			} = item;

			if (itemStatus === "new" && order.orderType !== "dine_in") {
				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);

				let timeOffset = 0;

				const isDuplicate = items.findIndex((item, idx) => item.itemId === itemId && item.variation_id === variation_id && idx !== i);
				if (isDuplicate !== -1) {
					timeOffset = i;
				}

				const { lastInsertRowid: KOTItemId } = addItemStmt.run([
					KOTId,
					itemId,
					itemName,
					itemQty,
					variant_display_name,
					variation_id,
					itemNotes,
					totalItemTax,
					itemTotal,
					itemTotal,
					JSON.stringify(toppings),
					parent_tax,
					timeOffset,
					timeOffset,
				]);
			} else if (itemStatus === "new" && order.orderType === "dine_in") {
				newKotItems.push(item);
			} else if (itemStatus === "updated") {
				updateItemStmt.run([itemQty, itemTotal, currentOrderItemId]);
			} else if (itemStatus === "removed") {
				removeItemStmt.run([0, currentOrderItemId]);
			}
		});
	})();

	if (order.orderType === "dine_in" && newKotItems.length) {
		const newKot = { ...order, orderCart: newKotItems };
		newKotTokenNo = createKot(newKot, userId, orderId);
	}

	return { kotTokenNo: kotTokenData.token_no, newKotTokenNo };
};

module.exports = { modifyKot };
