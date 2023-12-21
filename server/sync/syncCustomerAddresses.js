const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const db2 = getDb();

const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);

async function syncCustomerAddresses() {
	const customerAddresses = db2
		.prepare(
			"SELECT a.id, a.web_id, c.web_id AS customer_web_id, a.complete_address , a.landmark, a.created_at, a.updated_at FROM customer_addresses AS a JOIN customers AS c ON a.customer_id = c.id  WHERE a.sync = 0 AND c.web_id IS NOT NULL"
		)
		.all([]);

	if (customerAddresses.length) {
		console.log("address sync started");

		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://martinozpizza.emergingcoders.com/api/pos/v1/sync-customer-addresses",
			headers: {
				Authorization: `Bearer ${tokenData.value}`,
				"Content-Type": "application/json",
			},
			data: {
				restaurant_uid: "zhkmmy",
				customer_addresses: JSON.stringify(customerAddresses),
			},
		};

		try {
			const response = await axios.request(config);

			const updateSyncStatusStmt = db2.prepare("UPDATE customer_addresses SET web_id = ? , sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ? ");

			const updatedCustomerData = response?.data?.data;

			db2.transaction(() => {
				updatedCustomerData.forEach(customerAddress => {
					updateSyncStatusStmt.run([customerAddress.web_id, customerAddress.local_updated_at, 1, 0, customerAddress.old_id]);
				});
			})();

			console.log("address sync completed");
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = { syncCustomerAddresses };
