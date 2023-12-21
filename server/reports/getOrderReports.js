const { getDb } = require("../common/getDb");
const db2 = getDb();

const getOrderSummary = filters => {
	console.log(filters);
	const from = filters.from.replace("T", " ");
	const to = filters.to.replace("T", " ");

	let qry =
		"SELECT id,customer_id,bill_no,restaurant_id,customer_name,phone_number,order_type,dine_in_table_no,item_total,total_discount,total_tax,delivery_charges,total,payment_type,order_status,created_at,settle_amount,print_count,tip FROM pos_orders WHERE created_at BETWEEN ? AND ? AND settle_amount IS NOT NULL ";

	let queryParams = [from, to];

	if (filters.order_type !== "all") {
		qry += "AND order_type = ? ";
		queryParams.push(filters.order_type);
	}

	if (filters.payment_type !== "all") {
		if (filters.payment_type !== "upi") {
			qry += "AND payment_type = ?";
			queryParams.push(filters.payment_type);
		} else {
			qry += "AND payment_type LIKE '%upi%'";
		}
	}

	const filterdOrders = db2.prepare(qry).all(queryParams);

	const salesSummaryData = filterdOrders.reduce(
		(data, order) => {
			data.totalSettleAmount.total += +order.settle_amount;
			data.totalMyAmount.total += +order.item_total;
			data.totalTax += +order.total_tax;
			data.totalTip += +order.tip;
			data.orderCount.total += 1;

			if (order.print_count === 0 && order.order_status !== "cancelled") {
				data.totalSettleAmount.saved += +order.settle_amount;
				data.totalMyAmount.saved += +order.item_total;
				data.orderCount.saved += 1;
			} else if (order.order_status === "cancelled") {
				data.totalSettleAmount.cancelled += +order.settle_amount;
				data.totalMyAmount.cancelled += +order.item_total;
				data.orderCount.cancelled += 1;
			} else {
				data.totalSettleAmount.printed += +order.settle_amount;
				data.totalMyAmount.printed += +order.item_total;
				data.orderCount.printed += 1;
			}

			if (order.payment_type === "cash") {
				data.totalCash += +order.settle_amount;
			} else if (order.payment_type === "card") {
				data.totalCard += +order.settle_amount;
			} else if (order.payment_type === "due") {
				data.totalDue += +order.settle_amount;
			} else if (order.payment_type.includes("upi")) {
				data.totalUpi += +order.settle_amount;
			} else if (order.payment_type === "multipay") {
				const payments = db2.prepare("SELECT payment_type,amount FROM multipays WHERE pos_order_id = ?").all(order.id);
				payments.forEach(payment => {
					if (payment.payment_type === "cash") {
						data.totalCash += +payment.amount;
					} else if (payment.payment_type === "card") {
						data.totalCard += +payment.amount;
					} else if (payment.payment_type === "due") {
						data.totalDue += +payment.amount;
					} else if (payment.payment_type.includes("upi")) {
						data.totalUpi += +payment.amount;
					}
				});
				data.totalMultiPay += +order.settle_amount;
			}
			return data;
		},
		{
			totalSettleAmount: {
				total: 0,
				saved: 0,
				printed: 0,
				cancelled: 0,
			},
			totalMyAmount: {
				total: 0,
				saved: 0,
				printed: 0,
				cancelled: 0,
			},
			orderCount: {
				total: 0,
				saved: 0,
				printed: 0,
				cancelled: 0,
			},
			totalCash: 0,
			totalCard: 0,
			totalDue: 0,
			totalUpi: 0,
			totalMultiPay: 0,
			totalTip: 0,
			totalTax: 0,
		}
	);

	const duration = { from, to };

	return { filterdOrders, salesSummaryData, duration };
};

module.exports = { getOrderSummary };
