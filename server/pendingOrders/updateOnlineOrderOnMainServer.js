const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const db2 = getDb();
const FormData = require("form-data");
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);
const martinozUrl = "https://martinozpizza.emergingcoders.com/api/pos/v1";

const updateOnlineOrderOnMainServer = async pendingOrderDetail => {
	const { pendingOrderId, status, onlineOrderId } = pendingOrderDetail;
	try {
	let data = new FormData();
	data.append("restaurant_id", "1");
	data.append("pending_order_id", onlineOrderId.toString());
	data.append("order_status", status);

	let config = {
		method: "post",
		maxBodyLength: Infinity,
		url: `${martinozUrl}/update-online-order-status`,
		headers: {
			Authorization: `Bearer ${tokenData.value}`,
			...data.getHeaders(),
		},
		data: data,
	};

		const response = await axios.request(config);

		if (response.data.status) {
			return { success: true, error: null };
		} else {
			return { success: false, error: null };
		}
	} catch (error) {
		console.log(error);
		return { success: false, error };
	}
};

module.exports = { updateOnlineOrderOnMainServer };
