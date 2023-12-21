const { getDb } = require("../common/getDb");

db2 = getDb();

const getMergedOrder = latestOrder => {
	const existingOrder = db2
		.prepare(
			"SELECT id, item_total, total, total_discount, discount_percent, payment_type FROM pos_orders WHERE  order_type='dine_in' AND dine_in_table_no = ? AND order_status = 'accepted' AND print_count= 0 AND settle_amount IS NULL"
		)
		.get(latestOrder.tableNumber);

	if (!existingOrder) {
		return null;
	}

	const { subTotal, discount_percent, discount, orderCart } = latestOrder;

	let newSubtotal = subTotal + existingOrder.item_total;
	let new_total_discount;
	let new_discount_percent = null;

	if (discount_percent || discount) {
		new_total_discount = discount_percent ? (newSubtotal * discount_percent) / 100 : discount;
		new_discount_percent = discount_percent;
	} else {
		new_total_discount = existingOrder.discount_percent ? (newSubtotal * existingOrder.discount_percent) / 100 : existingOrder.total_discount;
		new_discount_percent = existingOrder.discount_percent;
	}

	let updatedExistionOrderCartTotal = 0;
	let updatedLatestOrderCartTotal = 0;
	const discountFactor = new_total_discount / newSubtotal;

	const existingOrderItems = db2.prepare("SELECT price, tax, final_price, quantity FROM pos_order_items WHERE pos_order_id = ?").all([existingOrder.id]);

	existingOrderItems.forEach(item => {
		const updatedFinalPrice = item.price * (1 - discountFactor);
		const updatedTax = (updatedFinalPrice * item.tax) / item.final_price;
		updatedExistionOrderCartTotal += (updatedFinalPrice + updatedTax) * item.quantity;
	});

	orderCart.forEach(item => {
		const updatedFinalPrice = item.itemTotal * (1 - discountFactor);
		const updatedTax = item.itemTax.reduce((total, tax) => {
			return (total += (updatedFinalPrice * tax.tax_percent) / 100);
		}, 0);
		updatedLatestOrderCartTotal += (updatedFinalPrice + updatedTax) * item.itemQty;
	});

	const finalUpdatedCartTotal = updatedExistionOrderCartTotal + updatedLatestOrderCartTotal;
	let existingOrderMultipayDetail = [];

	if (existingOrder.payment_type === "multipay") {
		existingOrderMultipayDetail = db2.prepare("SELECT payment_type,amount FROM multipays WHERE pos_order_id = ?").all([existingOrder.id]);
	} else {
		existingOrderMultipayDetail.push({ payment_type: existingOrder.payment_type, amount: existingOrder.total });
	}

	return { finalUpdatedCartTotal, updatedExistionOrderCartTotal, updatedLatestOrderCartTotal, existingOrderMultipayDetail };
};

module.exports = { getMergedOrder };
