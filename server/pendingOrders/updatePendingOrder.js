const { getDb } = require("../common/getDb");
const db2 = getDb();
const updatePendingOrder = pendingOrderId => {
	try {
		db2.transaction(() => {
			db2.prepare("DELETE FROM pending_orders WHERE id = ?").run([pendingOrderId]);
		})();
	} catch (error) {
		console.log("something went wrong");
	}
};

module.exports = { updatePendingOrder };
