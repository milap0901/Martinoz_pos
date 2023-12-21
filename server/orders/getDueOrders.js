const { getDb } = require("../common/getDb");
const db2 = getDb();

const getDueOrders = orderDetail => {
	const phone_number = orderDetail.phone_number;

	try {
		
		const orderPrepare = db2.prepare(
			"SELECT O.id, O.order_number, O.customer_name, O.complete_address, O.phone_number, O.order_type, O.dine_in_table_no, O.description, O.item_total, O.total_discount, O.discount_percent, O.total_tax, O.delivery_charges, O.total, O.payment_type, O.order_status,O.settle_amount,O.created_at, O.print_count,M.amount AS due_amount FROM orders AS O LEFT JOIN multipays AS M ON O.id = M.order_id  WHERE O.phone_number = ? AND O.payment_type IN ('due','multipay') AND M.payment_type ='due'"
		);

		const dueOrders = orderPrepare.all([phone_number]);

		return { dueOrders, error: null, success: true };
	} catch (error) {
		console.log(error);
		return { dueOrders: undefined, error: true, success: false };
	} finally {
		db2.close();
	}

};

module.exports = { getDueOrders };
