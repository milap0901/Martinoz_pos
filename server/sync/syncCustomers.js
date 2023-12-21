const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const db2 = getDb();
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);

async function syncCustomers() {

	const customers = db2.prepare("SELECT id,web_id,name,due_total,status,number,created_at,updated_at FROM customers WHERE sync = 0").all([]);

	if (customers.length) {
		console.log("customer sync started")
		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://martinozpizza.emergingcoders.com/api/pos/v1/sync-customers",
			headers: {
				Authorization: `Bearer ${tokenData.value}`,
				"Content-Type": "application/json",
			},
			data: {
				restaurant_uid: "zhkmmy",
				customers: JSON.stringify(customers),
			},
		};

		try {
			const response = await axios.request(config);

			const updateSyncStatusStmt = db2.prepare("UPDATE customers SET web_id = ? , sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ? ");

			const updatedCustomerData = response.data.data;
			db2.transaction(() => {
				updatedCustomerData.forEach(customer => {
					updateSyncStatusStmt.run([customer.web_id, customer.local_updated_at, 1, 0, customer.old_id]);
				});
			})();
			

		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = { syncCustomers };
