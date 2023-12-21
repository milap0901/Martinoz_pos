const { getDb } = require("../common/getDb");
const db2 = getDb();

const checkAndUpdateOrder = order => {
	let orderId = "";
	let customerId = null
	const matchOrder = db2
		.prepare(
			"SELECT id , customer_id, item_total,total_discount,discount_percent,payment_type,tax_details FROM pos_orders WHERE  order_type='dine_in' AND dine_in_table_no=? AND order_status = 'accepted' AND print_count= 0 AND settle_amount IS NULL"
		)
		.get([order.tableNumber]);

	if (matchOrder?.id && order.orderType === "dine_in") {
		const { orderCart, subTotal, discount_percent, discount, tax, printCount, paymentMethod, cartTotal } = order;
		const matchOrderId = matchOrder.id;
		orderId = matchOrder.id;
		customerId = matchOrder.customer_id

		const newSubtotal = subTotal + matchOrder.item_total;
		let new_total_discount;
		let new_discount_percent = null;

		if (discount_percent || discount) {
			new_total_discount = discount_percent ? (newSubtotal * discount_percent) / 100 : discount;
			new_discount_percent = discount_percent;
		} else {
			new_total_discount = matchOrder.discount_percent ? (newSubtotal * matchOrder.discount_percent) / 100 : matchOrder.total_discount;
			new_discount_percent = matchOrder.discount_percent;
		}
		const discountFactor = new_total_discount / newSubtotal;

		let updateQuery;
		let updateParams = [];

		if (discountFactor) {
			updateQuery = `UPDATE pos_order_items SET final_price = price * (1 - ?), item_discount = price * ?, tax = price * (1 - ?) * tax / final_price, sync = 0, updated_at = datetime('now', 'localtime') , discount_detail = json('[{"id":null, "type":"special_discount", "name":"pos_discount", "discount": '|| (price * ?) || '}]') WHERE pos_order_id = ?`;
			updateParams = [discountFactor, discountFactor, discountFactor, discountFactor, matchOrderId];
		} else {
			updateQuery =
				"UPDATE pos_order_items SET final_price = price * (1 - ?), item_discount = price * ?, tax = price * (1 - ?) * tax / final_price, discount_detail = '[]', sync = 0, updated_at = datetime('now', 'localtime') WHERE pos_order_id = ?";
			updateParams = [discountFactor, discountFactor, discountFactor, matchOrderId];
		}

		db2.transaction(() => {
			db2.prepare(updateQuery).run(updateParams);
            
			
			orderCart.forEach((item,i) => {
				const {
					itemQty,
					itemId,
					itemName,
					variation_id,
					variantName,
					itemTotal,
					multiItemTotal,
					toppings,
					itemTax,
					item_discount,
					variant_display_name,
					itemNotes,
					parent_tax,
					discount_detail,
				} = item;

				const toppingsJson = JSON.stringify(toppings);
				const new_item_discount = itemTotal * discountFactor;
				const new_discont_detail = new_item_discount ? [{ id: null, type: "special_discount", name: "pos_discount", discount: new_item_discount }] : [];

				const discount_detail_json = JSON.stringify(new_discont_detail);
				const final_price = itemTotal - new_item_discount;

				const totalItemTax = itemTax.reduce((total, tax) => {
					return (total += (final_price * tax.tax_percent) / 100);
				}, 0);

				const { lastInsertRowid: orderItemId } = db2
					.prepare(
						"INSERT INTO pos_order_items (pos_order_id,item_id,item_name,price,final_price, item_discount,quantity,variation_name,variation_id,description,tax_id,tax,item_addon_items,discount_detail,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,datetime('now', 'localtime', '+' || ? || ' seconds'),datetime('now', 'localtime', '+' || ? || ' seconds'))"
					)
					.run([
						matchOrderId,
						itemId,
						itemName,
						itemTotal,
						final_price,
						new_item_discount,
						itemQty,
						variant_display_name,
						variation_id,
						itemNotes,
						parent_tax,
						totalItemTax,
						toppingsJson,
						discount_detail_json,
						i,
						i
					]);

					
			});
		})();

		let updatedTaxDetails = [];
		let updatedTotalTax = 0;
		// const orderData = db2.prepare("SELECT SUM(tax * quantity) AS total_tax FROM pos_order_items WHERE pos_order_id = ?").all([matchOrderId]);
		const orderItemData = db2.prepare("SELECT tax,quantity,tax_id,final_price FROM pos_order_items WHERE pos_order_id = ?").all([matchOrderId]);
		const parentTaxStmt = db2.prepare("SELECT child_ids FROM taxes where id=?");
		const taxesStmt = db2.prepare("SELECT * FROM taxes where id = ? ");

		orderItemData.forEach(item => {
			const childTaxesString = item.tax_id ? parentTaxStmt.get(item.tax_id) : { child_ids: "" };

			const taxesIdArray = childTaxesString.child_ids.length ? childTaxesString.child_ids.split(",") : [];

			taxesIdArray.forEach(tax => {
				const taxData = taxesStmt.get(tax);

				updatedTotalTax += (taxData.tax * item.final_price * item.quantity) / 100;
				const existingTaxIndex = updatedTaxDetails.findIndex(taxDetails => taxDetails.id === taxData.id);

				if (existingTaxIndex !== -1) {
					updatedTaxDetails[existingTaxIndex].tax += (taxData.tax * item.final_price * item.quantity) / 100;
				} else {
					updatedTaxDetails.push({ id: taxData.id, name: taxData.name, tax_percent: taxData.tax, tax: (taxData.tax * item.final_price * item.quantity) / 100 });
				}
			});
		});

		// console.log(updatedTaxDetails)
		// console.log(updatedTotalTax)

		// const totalOrderTax = orderItemData.reduce((acc, item) => (acc += item.tax * item.quantity), 0);
		const updatedPaymentType = matchOrder.payment_type === "multipay" ? "multipay" : order.paymentMethod;

		db2.transaction(() => {
			db2.prepare(
				"UPDATE pos_orders SET item_total = ?, total_discount = ?, total_tax = ? , total = ?, discount_percent = ? , print_count = ?, payment_type = ?, tax_details = ?, sync = 0, updated_at = datetime('now', 'localtime') WHERE id = ?"
			).run([
				newSubtotal,
				new_total_discount,
				updatedTotalTax,
				newSubtotal - new_total_discount + updatedTotalTax,
				new_discount_percent,
				printCount,
				updatedPaymentType,
				JSON.stringify(updatedTaxDetails),
				matchOrderId,
			]);
		})();

		const multipayInsertStmt = db2.prepare("INSERT INTO multipays (pos_order_id, payment_type, amount) VALUES (?,?,?)");

		db2.transaction(() => {
			if (paymentMethod === "multipay") {
				db2.transaction(() => {
					db2.prepare("DELETE FROM multipays WHERE pos_order_id = ?").run([matchOrderId]);
				})();

				db2.transaction(() => {
					order.multipay.forEach(pay => {
						if (pay.amount) {
							multipayInsertStmt.run([matchOrderId, pay.name, pay.amount]);
						}
					});
				})();
			} else {
				if (matchOrder.payment_type === "multipay") {
					const matchMultipays = db2.prepare("SELECT payment_type FROM multipays WHERE pos_order_id = ?").all(matchOrderId);
					const existingPaymentIndex = matchMultipays.findIndex(pay => pay.payment_type === paymentMethod);
					if (existingPaymentIndex === -1) {
						multipayInsertStmt.run([matchOrderId, paymentMethod, cartTotal]);
					} else {
						db2.prepare("UPDATE multipays SET amount = amount + ? WHERE pos_order_id = ? AND payment_type = ?").run([cartTotal, matchOrderId, paymentMethod]);
					}
				}
			}
		})();

		return {orderId,customerId};
	} else {
		return {orderId,customerId};
	}
};

module.exports = { checkAndUpdateOrder };
