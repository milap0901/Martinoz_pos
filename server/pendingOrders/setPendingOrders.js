const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const db2 = getDb();
const FormData = require("form-data");
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);
const martinozUrl = "https://martinozpizza.emergingcoders.com/api/pos/v1";

const setPendingOrders = async () => {
	let isUpdated = false;
	let customerNames = []
	let data = new FormData();
	data.append("restaurant_id", "1");
	const checkOrderExistStmt = db2.prepare("SELECT id FROM pending_orders WHERE online_order_id = ?");
	const newOrderStmt = db2.prepare("INSERT INTO pending_orders (online_order_id,online_order_number,order_json,restaurant_price_id,created_at,updated_at,order_status) VALUES (?,?,?,?,?,?,?)");

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: `${martinozUrl}/get-online-orders`,
		headers: {
			Authorization: `Bearer ${tokenData.value}`,
			...data.getHeaders(),
		},
		data: data,
	};

	try {
		const res = await axios.request(config);
		// console.log(res.data.data)
		db2.transaction(() => {
			res.data.data.forEach(order => {
				const existingOrder = checkOrderExistStmt.get(order.id);
                  
				if (!existingOrder?.id) {
					isUpdated = true;
					customerNames.push(JSON.parse(order.order_json)?.customer?.customer_name)
					newOrderStmt.run([order.id, order.order_number, order.order_json, order.restaurant_price_id, order.created_at, order.updated_at, order.order_status]);
				}
			});
		})();
	} catch (error) {
		console.log(error)
	}

	return { isUpdated,customerNames };
};

module.exports = { setPendingOrders };
