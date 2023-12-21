const { getDb } = require("../common/getDb");
const db2 = getDb();

const getMergedOrderAndKotData = latestOrder => {
	const liveKOTs = db2.prepare("SELECT id FROM kot WHERE order_type='dine_in' AND table_no=? AND pos_order_id IS NULL AND kot_status != 'cancelled'").all([latestOrder.tableNumber]);

	if (!liveKOTs?.length) {
		return null;
	}

	const { kotIds, questionMarks } = liveKOTs.reduce(
		(acc, kot) => {
			acc.kotIds.push(kot.id);
			acc.questionMarks.push("?");
			return acc;
		},
		{ kotIds: [], questionMarks: [] }
	);

	const kotItemsDetail = db2.prepare(`SELECT price,tax,quantity,final_price FROM kot_items WHERE kot_id IN (${questionMarks.join(",")})`).all(kotIds);

	const kotSubTotal = kotItemsDetail.reduce((total, item) => (total += item.price * item.quantity), 0);
	const newSubtotal = latestOrder.subTotal + kotSubTotal;

	const new_total_discount = latestOrder.discount_percent ? (newSubtotal * latestOrder.discount_percent) / 100 : latestOrder.discount;
	const discountFactor = new_total_discount / newSubtotal;

	let updatedKotCartTotal = 0;
	let updatedLatestOrderCartTotal = 0;

	kotItemsDetail.forEach(item => {
		const updatedFinalPrice = item.price * (1 - discountFactor);
		const updatedTax = (updatedFinalPrice * item.tax) / item.final_price;
		updatedKotCartTotal += (updatedFinalPrice + updatedTax) * item.quantity;
	});

	latestOrder.orderCart.forEach(item => {
		const updatedFinalPrice = item.itemTotal * (1 - discountFactor);
		const updatedTax = item.itemTax.reduce((total, tax) => {
			return (total += (updatedFinalPrice * tax.tax_percent) / 100);
		}, 0);
		updatedLatestOrderCartTotal += (updatedFinalPrice + updatedTax) * item.itemQty;
	});

	// console.log(updatedKotCartTotal,updatedLatestOrderCartTotal)

	const finalUpdatedCartTotal = updatedKotCartTotal + updatedLatestOrderCartTotal;

	return { finalUpdatedCartTotal, updatedExistionOrderCartTotal: updatedKotCartTotal, updatedLatestOrderCartTotal, existingOrderMultipayDetail: [] };
};

module.exports = { getMergedOrderAndKotData };
