const { default: axios } = require("axios");
const { getDb } = require("../common/getDb");
// const { getOrderToSync } = require("../orders/getOrderToSync");
const { getKotToSync } = require("../KOT/getKotTosync");
const db2 = getDb();
const tokenData = db2.prepare("SELECT value FROM startup_config WHERE name = ?").get(["token"]);

async function syncKots() {
	const kots = getKotToSync();

	if (kots.length) {
		const config = {
			method: "post",
			maxBodyLength: Infinity,
			url: "https://martinozpizza.emergingcoders.com/api/pos/v1/sync-kots",
			headers: {
				Authorization: `Bearer ${tokenData.value}`,
				"Content-Type": "application/json",
			},
			data: {
				restaurant_uid: "zhkmmy",
				kot_details: JSON.stringify(kots),
			},
		};

		try {
			const response = await axios.request(config);

			const updateKotSyncStatusStmt = db2.prepare("UPDATE kot SET web_id = ? , sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ?");
			const updateKotItemSyncStatusStmt = db2.prepare("UPDATE kot_items SET web_id = ? ,sync = CASE WHEN updated_at = ? THEN ? ELSE ? END WHERE id = ?");
			// const deleteItemStmt = db2.prepare("DELETE FROM pos_order_items WHERE id = ? AND status = 0");

			const updatedKots = response.data.data;
			db2.transaction(() => {
				updatedKots.forEach(kot => {
					updateKotSyncStatusStmt.run([kot.web_id, kot.local_updated_at, 1, 0, kot.kot_id]);
					kot.kot_items.forEach(item => {
						updateKotItemSyncStatusStmt.run([item.web_id, item.local_updated_at, 1, 0, item.kot_item_id]);
					});
				});
			})();
			console.log("kot sync complete");
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = { syncKots };
