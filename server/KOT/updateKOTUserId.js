// const Database = require("better-sqlite3");
// const db2 = new Database("restaurant.sqlite", {});
const { getDb } = require("../common/getDb");
const db2 = getDb();

const updateKOTUserId = (orderId, userId, tableNumber) => {

	console.log(userId , "kot ipdate")
	db2.prepare("UPDATE kot SET pos_order_id=?, customer_id= ?, sync = 0, updated_at = datetime('now', 'localtime') WHERE order_type='dine_in' AND table_no= ? AND pos_order_id IS NULL").run([orderId, userId, tableNumber]);
};

module.exports = { updateKOTUserId };


