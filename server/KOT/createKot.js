const { dbAll, dbRun } = require("../common/dbExecute");
// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});

const { getDb } = require("../common/getDb");
const db2 = getDb();

const createKot = (order, userId, orderId) => {
	let restaurantId = 1;
	let tokenNo;
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

	// create token comparing date of last date and current kot date , reset token no if the date is changed
	db2.transaction(() => {
		const latestEntry = db2.prepare("SELECT created_at, token_no FROM kot ORDER BY ID DESC LIMIT 1").get([]);

		const currentDate = new Date().getDate();
		const lastKOTDate = latestEntry ? new Date(latestEntry.created_at).getDate() : currentDate;

		tokenNo = currentDate !== lastKOTDate || !latestEntry ? 1 : latestEntry.token_no + 1;

		const { lastInsertRowid: KOTId } = db2
			.prepare(
				"INSERT INTO kot (pos_order_id,restaurant_id,token_no,order_type,customer_id,customer_name,phone_number,address,landmark,table_id,table_no,print_count,kot_status,description,sync,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,0,datetime('now', 'localtime'),datetime('now', 'localtime'))"
			)
			.run([orderId, restaurantId, tokenNo, orderType, userId, customerName, customerContact, customerAdd, customerLocality, tableNumber, tableNumber, 1, "accepted", orderComment]);

		db2.transaction(() => {
			const prepareItem = db2.prepare(
				"INSERT INTO kot_items (kot_id,item_id,item_name,quantity,variation_name,variation_id,description,tax,price,final_price,item_addon_items,tax_id,sync, created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,0,datetime('now', 'localtime', '+' || ? || ' seconds'), datetime('now', 'localtime', '+' || ? || ' seconds'))"
			);

			// const prepareToppings = db2.prepare("INSERT INTO KOT_item_addongroupitems (KOT_item_id,addongroupitem_id,name,quantity) VALUES (?,?,?,?)");

			orderCart.forEach((item, i, items) => {
				const { itemQty, itemId, itemName, variation_id, itemNotes, variantName, toppings, itemTax, itemTotal, multiItemTotal, variant_display_name, parent_tax } = item;

				const totalItemTax = itemTax.reduce((total, tax) => (total += tax.tax), 0);
				let timeOffset = 0;

				const isDuplicate = items.findIndex((item, idx) => item.itemId === itemId && item.variation_id === variation_id && idx !== i);
				
				if (isDuplicate !== -1) {
					timeOffset = i;
				}

				const { lastInsertRowid: KOTItemId } = prepareItem.run([
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
			});
		})();
	})();

	return tokenNo;
};

module.exports = { createKot };
