const { getDb } = require("../common/getDb");
const db2 = getDb();

const getPendingOrder = orderDetail => {
	const { pendingOrderId } = orderDetail;

	let pendingOrder = db2.prepare("SELECT * FROM pending_orders WHERE id = ?").get(pendingOrderId);

	pendingOrder.order_json = JSON.parse(pendingOrder.order_json);

	return pendingOrder;
};

module.exports = { getPendingOrder };
