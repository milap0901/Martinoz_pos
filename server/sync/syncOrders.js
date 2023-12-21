const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
const { getOrderToSync } = require("../orders/getOrderToSync");
const db2 = getDb();
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);

async function syncOrders() {
	const orders = getOrderToSync();

	if (orders.length) {
		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://martinozpizza.emergingcoders.com/api/pos/v1/sync-orders",
			headers: {
				Authorization: `Bearer ${tokenData.value}`,
				"Content-Type": "application/json",
			},
			data: {
				restaurant_uid: "zhkmmy",
				order_details: JSON.stringify(orders),
			},
		};

		// console.log(JSON.stringify(order	s))

		try {
			const response = await axios.request(config);
			const updateOrderSyncStatusStmt = db2.prepare("UPDATE pos_orders SET web_id = ? , sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ?");
			const updateItemSyncStatusStmt = db2.prepare("UPDATE pos_order_items SET web_id = ? ,sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ?");
			const deleteItemStmt = db2.prepare("DELETE FROM pos_order_items WHERE id = ? AND status = 0");

			const updatedOrder = response.data.data;
			db2.transaction(() => {
				updatedOrder.forEach(order => {
					updateOrderSyncStatusStmt.run([order.web_id, order.local_updated_at, 1, 0, order.pos_order_id]);
					order.order_items.forEach(item => {
						if (item.web_id) {
							updateItemSyncStatusStmt.run([item.web_id, item.local_updated_at, 1, 0, item.pos_order_item_id]);
						} else {
							deleteItemStmt.run([item.pos_order_item_id]);
						}
					});
				});
			})();
			console.log("order sync complete");
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = { syncOrders };
